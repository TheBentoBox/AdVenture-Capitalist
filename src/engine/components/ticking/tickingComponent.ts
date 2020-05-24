import { ITickable } from "../../interfaces/ITickable";
import { Actor } from "../../core/actor";

/**
 * Represents a component which can be attached to an actor to perform operations against it or its display components.
 * They hold a reference to their owning actor and effectively control the behavior of that actor.
 */
export abstract class TickingComponent<T extends Actor = Actor> implements ITickable {

    /**
     * The name of this ticking component.
     */
    public readonly name: string;

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
     * @param name The name of this ticking component.
     * @param theActor The actor which this ticking component operates on.
     */
    public constructor(name: string, theActor: T) {
        this.name = name;
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