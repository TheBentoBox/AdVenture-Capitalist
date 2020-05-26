import { ControllerComponent } from "../../engine/components/controller/controllerComponent";
import { VentureBusiness } from "../gameActors/ventureBusiness";
import { formatTime } from "../utilities";
import { GameEvent } from "../gameEvents";
import { InteractionType } from "../../engine/enums/interactionEvents";
import { AdVentureCapitalist } from "../adVentureCapitalist";
import { PurchaseMode } from "../gameActors/ventureBank";
import { Button } from "../../engine/actors/ui/button";
import { Engine } from "../../engine/core/engine";

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
        this._managerButton.onClick.subscribe(this, this.onManagerBuy.bind(this, true));
        AdVentureCapitalist.getInstance().bank.purchaseMode.subscribe(this, this.updateBuyButtonPriceLabel.bind(this));
        AdVentureCapitalist.getInstance().bank.balance.subscribe(this, this.updateBuyButtonEnabledStates.bind(this));
    }

    /**
     * Saves this business controller's data in the local storage.
     */
    public save(): void {
        super.save();
        Engine.localStorage.setValue(`${this.name}:hasManager`, this.hasManager);
    }

    /**
     * Restores this business controller's data from the local storage.
     */
    public restore(): void {
        super.restore();
        this.hasManager = Engine.localStorage.getBoolean(`${this.name}:hasManager`, false);

        // If this unit's manager has been bought, resimulate it being purchased.
        if (this.hasManager) {
            this.onManagerBuy(false);
        }

        // Treat the business as having been running if we have a manager or it was partway through a cycle.
        // If it was partway through a cycle it was running regardless of if it had a manager.
        const wasRunning = (this.hasManager || this.actor.timeInCycle.getValue() > 0);

        // Simulate the time that has passed since the last play.
        const lastPlayTime: number = Engine.localStorage.getNumber("LastPlayed");
        if (lastPlayTime !== undefined && this.actor.amountOwned.getValue() > 0 && wasRunning) {

            // Determine how far past the end of the cycle the actor would have "overshot".
            const timePassedInSeconds = ((Date.now() - lastPlayTime) / 1000);
            let fullCycleTime = (this.actor.timeInCycle.getValue() + timePassedInSeconds);

            // Count the number of cycles the business could've run in that time, and
            // how far into the final cycle (the one we're resuming into) it would've made it.
            let cyclesCompleted = Math.floor(fullCycleTime / this.actor.baseCycleDuration);
            let remainingCycleTime = (fullCycleTime % this.actor.baseCycleDuration);

            // If this controller had a manager, the business was "running" the whole time,
            // but if it didn't it could've only run one cycle max, so respect that.
            if (!this.hasManager) {
                cyclesCompleted = Math.min(cyclesCompleted, 1);

                // If we completed any cycles without a manager, we should reset to 0 time rather
                // than restoring partway into another cycle.
                if (cyclesCompleted > 0) {
                    remainingCycleTime = 0;
                }
            }

            // If any cycles were completed offline, reward them as balance.
            if (cyclesCompleted > 0) {
                AdVentureCapitalist.getInstance().bank.balance.adjust(cyclesCompleted * this.actor.profit);
            }
            this.actor.timeInCycle.setValue(remainingCycleTime);
        } else {
            this.actor.timeInCycle.setValue(0);
        }

        // If post-time warp the actor is partway through a cycle, activate the controller to let it run through.
        if (this.actor.timeInCycle.getValue() > 0) {
            this.isActive = true;
        }

        this.updateBuyButtonEnabledStates();
        this.updateBuyButtonPriceLabel(AdVentureCapitalist.getInstance().bank.purchaseMode.getValue());
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
        this._progressBarMask.scale.x = 0;

        // If there is no manager associated with this controller, it should automatically
        // deactivate once the business completes its cycle.
        if (!this.hasManager) {
            this.actor.timeInCycle.setValue(0);
            this.isActive = false;
        } else {
            this.actor.timeInCycle.adjust(-this.actor.baseCycleDuration);
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
     * @param adjustBalance (Optional) Whether the balance should be adjusted. Not true in refresh cases.
     */
    private onManagerBuy(adjustBalance: boolean = true): void {
        this.hasManager = true;
        this._managerButton.isEnabled = false;
        this._managerButton.container.alpha = 0;

        if (adjustBalance) {
            AdVentureCapitalist.getInstance().bank.balance.adjust(-this.actor.managerCost);
        }

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
     */
    private updateBuyButtonEnabledStates(): void {
        const currentBalance = AdVentureCapitalist.getInstance().bank.balance.getValue();
        this.actor.buyButton.isEnabled = (this.actor.getNextNextNthUnitsCost() <= currentBalance);

        // The manager button cannot become enabled if it has already been purchased or no units are bought.
        this._managerButton.isEnabled = (
            !this.hasManager &&
            this.actor.managerCost <= currentBalance &&
            this.actor.amountOwned.getValue() > 0
        );
    }
}