import { ControllerComponent } from "../../engine/components/controller/controllerComponent";
import { VentureBusiness } from "../gameActors/ventureBusiness";
import { formatTime } from "../utilities";
import { GameEvent } from "../gameEvents";
import { InteractionType } from "../../engine/enums/interactionEvents";
import { AdVentureCapitalist } from "../adVentureCapitalist";
import { PurchaseMode } from "../gameActors/ventureBank";
import { Button } from "../../engine/actors/ui/button";

/**
 * Controls running a singular business.
 */
export class BusinessController extends ControllerComponent<VentureBusiness> {

    /**
     * The button created by the bank which allows for purchasing of this business's manager.
     */
    private _managerButton: Button;

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
        this._managerButton = AdVentureCapitalist.getInstance().bank.managerButtons[business.name];
        business.timerTextComponent.setText(formatTime(this.actor.baseCycleDuration));

        business.iconComponent.container.interactive = true;
        business.iconComponent.container.addListener(InteractionType.MOUSE_CLICK, this.onBusinessClicked.bind(this));

        business.progressBar.container.interactive = true;
        business.progressBar.container.addListener(InteractionType.MOUSE_CLICK, this.onBusinessClicked.bind(this));

        business.buyButton.amountLabel.attachTo(AdVentureCapitalist.getInstance().bank.purchaseMode);
        business.buyButton.onClick.subscribe(this, this.onBusinessBuy.bind(this));
        this._managerButton.onClick.subscribe(this, this.onManagerBuy.bind(this));
        AdVentureCapitalist.getInstance().bank.purchaseMode.subscribe(this, this.updateBuyButtonPriceLabel.bind(this));
        AdVentureCapitalist.getInstance().bank.balance.subscribe(this, this.updateBuyButtonEnabledStates.bind(this));
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
        GameEvent.ON_CYCLE_COMPLETE.emit(this.actor);
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
        const purchaseMode: PurchaseMode = AdVentureCapitalist.getInstance().bank.purchaseMode.getValue();
        const unitCost = this.actor.getNextNextNthUnitsCost();
        const balance = AdVentureCapitalist.getInstance().bank.balance;

        this.actor.amountOwned.adjust(purchaseMode);
        balance.adjust(-unitCost);

        this.updateBuyButtonPriceLabel(purchaseMode);
        this.updateBuyButtonEnabledStates();
    }

    /**
     * Triggered when the manager button for this business is clicked while enabled.
     */
    private onManagerBuy(): void {
        this.hasManager = true;
        this._managerButton.isEnabled = false;
        this._managerButton.container.alpha = 0;
        AdVentureCapitalist.getInstance().bank.balance.adjust(-this.actor.managerCost);

        // The manager could potentially be purchased while a cycle wasn't running.
        // That being the case, ensure the controller is enabled at this point.
        this.isActive = true;
    }

    /**
     * Updates the label on the buy button with the cost of the next X units based on the global purchase mode.
     * @param purchaseMode The current global purchase mode.
     */
    private updateBuyButtonPriceLabel(purchaseMode: PurchaseMode): void {
        this.actor.buyButton.priceLabel.setText(String(this.actor.getNextNextNthUnitsCost(purchaseMode)));
    }

    /**
     * Updates the state of the business's buy button as well as its associated manager button.
     * The manager button cannot become enabled if it has already been purchased.
     */
    private updateBuyButtonEnabledStates(): void {
        const currentBalance = AdVentureCapitalist.getInstance().bank.balance.getValue();
        this.actor.buyButton.isEnabled = (this.actor.getNextNextNthUnitsCost() <= currentBalance);
        this._managerButton.isEnabled = (!this.hasManager && this.actor.managerCost <= currentBalance);
    }
}