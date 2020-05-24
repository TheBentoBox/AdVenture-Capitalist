import { ITickable } from "../../interfaces/ITickable";
import { Actor } from "../../core/actor";

/**
 * Represents a component which can be attached to an actor to perform operations against it or its display components.
 * They hold a reference to their owning actor and effectively control the behavior of that actor.
 */
export abstract class TickingComponent<T extends Actor> implements ITickable {

    /**
     * The actor which this component acts upon.
     */
    public readonly actor: T;

    /**
     * Whether or not this ticking component is active, allowing it to tick.
     */
    public isActive: boolean;

    /**
     * Contructs a new ticking component.
     * @param theActor 
     */
    public constructor(theActor: T) {
        this.actor = theActor;
        this.isActive = true;
    }

    /**
     * Performs the update routines of this ticking component, operating on its targets within
     * the associated owning actor.
     * @param deltaTime The time passed in seconds since the last tick.
     */
    public abstract update(deltaTime: number): void;
}