import { ControllerComponent } from "../../engine/components/controller/controllerComponent";
import { VentureBusiness } from "../gameActors/ventureBusiness";
import { formatTime } from "../utilities";
import { GameEvent } from "../gameEvents";
import { Container } from "pixi.js";
import { InteractionType } from "../../engine/enums/interactionEvents";
import { AdVentureCapitalist } from "../adVentureCapitalist";
import { PurchaseMode } from "../gameActors/ventureBank";

/**
 * Controls running a singular business.
 */
export class BusinessController extends ControllerComponent<VentureBusiness> {

    /**
     * The mask attached to the owning business's progress bar.
     * This is scale to simulate the progress bar animation.
     */
    private _progressBarMask!: PIXI.Container;

    /**
     * Whether or not this business has a "manager" associated with it.
     * If so, a new business cycle will automatically begin again when a cycle completes.
     */
    public hasManager: boolean = false;

    /**
     * Constructs a new business controller which operates on the target business.
     * @param name The name of this business controller.
     * @param business The business which this controller should manager.
     * @param cycleTimerComponent The text component which should display the 
     */
    public constructor(name: string, business: VentureBusiness) {
        super(name, business);
        this.isActive = false;
        business.timerTextComponent.setText(formatTime(this.actor.baseCycleDuration));

        business.iconComponent.container.interactive = true;
        business.iconComponent.container.addListener(InteractionType.MOUSE_CLICK, this.onBusinessClicked.bind(this));

        business.progressBar.container.interactive = true;
        business.progressBar.container.addListener(InteractionType.MOUSE_CLICK, this.onBusinessClicked.bind(this));

        business.buyButton.onClick.subscribe(this, this.onBusinessBuy.bind(this));
        AdVentureCapitalist.instance.bank.purchaseMode.subscribe(this, this.updateBuyButtonPriceLabel.bind(this));
        AdVentureCapitalist.instance.bank.balance.subscribe(this, this.updateBuyButtonEnabledState.bind(this));
    }

    /**
     * Performs updates, progressing the business's cycle.
     * @param deltaTime The amount of time that has passed in seconds since the last update cycle.
     */
    public update(deltaTime: number): void {
        if (this._progressBarMask === undefined) {
            this._progressBarMask = (this.actor.progressBar.mask as PIXI.Container);
        }

        // Progress its passed time and update the display timer.
        this.actor.timeInCycle.setValue(this.actor.timeInCycle.getValue() + deltaTime);
        this.actor.timerTextComponent.setText(formatTime(this.actor.baseCycleDuration - this.actor.timeInCycle.getValue()));

        // Adjust the progress bar.
        const progress = (this.actor.timeInCycle.getValue() / this.actor.baseCycleDuration);
        this._progressBarMask.scale.x = progress;

        // Bail out if it hasn't completed the cycle yet.
        if (this.actor.timeInCycle.getValue() < this.actor.baseCycleDuration) {
            return;
        }

        // Cycle complete, inform the rest of the game and reset.
        GameEvent.CYCLE_COMPLETE.emit(this.actor);
        this.actor.timerTextComponent.setText(formatTime(this.actor.baseCycleDuration));
        this.actor.timeInCycle.setValue(0);
        this._progressBarMask.scale.x = 0;

        // If there is no manager associated with this controller, it should automatically
        // deactivate once the business completes its cycle.
        if (!this.hasManager) {
            this.isActive = false;
        }
    }

    /**
     * Callback for when this controller's business is interacted with.
     * This ensures that the controller is running if the user interacted with the business.
     */
    private onBusinessClicked(): void {
        if (this.actor.amountOwned.getValue() > 0) {
            this.isActive = true;
        }
    }

    /**
     * Callback for when the user attempts to buy more units of this controller's business.
     */
    private onBusinessBuy(): void {
        const purchaseMode: PurchaseMode = AdVentureCapitalist.instance.bank.purchaseMode.getValue();
        const unitCost = this.actor.getNextNextNthUnitsCost();
        const balance = AdVentureCapitalist.instance.bank.balance;

        if (unitCost <= balance.getValue()) {
            this.actor.amountOwned.adjust(1);
            balance.adjust(-unitCost);
        }

        this.updateBuyButtonPriceLabel(purchaseMode);
        this.updateBuyButtonEnabledState();
    }

    private updateBuyButtonPriceLabel(purchaseMode: PurchaseMode): void {
        this.actor.buyButton.priceLabel.setText(String(this.actor.getNextNextNthUnitsCost(purchaseMode)));
    }

    private updateBuyButtonEnabledState(): void {
        this.actor.buyButton.isEnabled = (this.actor.getNextNextNthUnitsCost() <= AdVentureCapitalist.instance.bank.balance.getValue());
    }
}