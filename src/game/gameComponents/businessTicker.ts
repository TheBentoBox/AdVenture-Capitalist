import { TickingComponent } from "../../engine/components/ticking/tickingComponent";
import { VentureBusiness } from "../gameActors/ventureBusiness";

/**
 * Controls running a singular business.
 */
export class BusinessTicker extends TickingComponent<VentureBusiness> {

    /**
     * Whether or not this business has a "manager" associated with it.
     * If so, ticking will automatically begin again when a cycle completes.
     */
    public hasManager: boolean = false;

    /**
     * Constructs a new business ticker which operates on the target business.
     * @param business The business which this ticker should manager.
     */
    public constructor(business: VentureBusiness) {
        super(business);
        this.isActive = false;

        business.container.interactive = true;
        business.container.addListener("click", this.onBusinessClicked.bind(this));
    }

    /**
     * Performs updates, progressing the business's cycle.
     * @param deltaTime The amount of time that has passed in seconds since the last update cycle.
     */
    public update(deltaTime: number): void {
        this.actor.timeInCycle.setValue(this.actor.timeInCycle.getValue() + deltaTime);

        if (this.actor.progress < 1) {
            return;
        }

        this.actor.onCycleComplete.emit(this.actor);
        console.log("Business completed a cycle:", this.actor);
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