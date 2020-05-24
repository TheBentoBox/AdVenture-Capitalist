import { ControllerComponent } from "../../engine/components/controller/controllerComponent";
import { VentureBusiness } from "../gameActors/ventureBusiness";
import { TextComponent } from "../../engine/components/display/textComponent";
import { formatTime } from "../utilities";

/**
 * Controls running a singular business.
 */
export class BusinessController extends ControllerComponent<VentureBusiness> {

    /**
     * Whether or not this business has a "manager" associated with it.
     * If so, a new business cycle will automatically begin again when a cycle completes.
     */
    public hasManager: boolean = false;

    /**
     * Constructs a new business ticker which operates on the target business.
     * @param name The name of this business ticker.
     * @param business The business which this ticker should manager.
     * @param cycleTimerComponent The text component which should display the 
     */
    public constructor(name: string, business: VentureBusiness) {
        super(name, business);
        this.isActive = false;
        business.timerTextComponent.setText(formatTime(0));

        business.container.interactive = true;
        business.container.addListener("click", this.onBusinessClicked.bind(this));
    }

    /**
     * Performs updates, progressing the business's cycle.
     * @param deltaTime The amount of time that has passed in seconds since the last update cycle.
     */
    public update(deltaTime: number): void {
        this.actor.timeInCycle.setValue(this.actor.timeInCycle.getValue() + deltaTime);
        this.actor.timerTextComponent.setText(formatTime(this.actor.baseCycleDuration - this.actor.timeInCycle.getValue()));

        if (this.actor.timeInCycle.getValue() < this.actor.baseCycleDuration) {
            return;
        }

        console.log("Business completed a cycle:", this.actor);
        this.actor.onCycleComplete.emit(this.actor);
        this.actor.timeInCycle.setValue(0);

        // If there is no manager associated with this ticker, it should automatically
        // deactivate once the business completes its cycle.
        if (!this.hasManager) {
            this.isActive = false;
        }
    }

    /**
     * Callback for when this ticker's business is interacted with.
     * This ensures that the ticker is running if the user interacted with the business.
     */
    private onBusinessClicked(): void {
        this.isActive = true;
    }
}