import { ITickable } from "../../interfaces/ITickable";
import { Actor } from "../../core/actor";

/**
 * Represents a component which can be attached to an actor to perform operations against it or its display components.
 * They hold a reference to their owning actor and effectively control the behavior of that actor.
 */
export abstract class BehavioralComponent implements ITickable {

    /**
     * The actor which this component acts upon.
     */
    public readonly actor: Actor;

    /**
     * Whether or not this behavioral component is active, allowing it to tick.
     */
    public isActive: boolean;

    /**
     * Contructs a new behavioral component.
     * @param theActor 
     */
    public constructor(theActor: Actor) {
        this.actor = theActor;
        this.isActive = true;
    }

    /**
     * Performs the update routines of this behavioral component, operating on its targets within
     * the associated owning actor.
     * @param deltaTime The time passed in seconds since the last tick.
     */
    public abstract update(deltaTime: number): void;
}