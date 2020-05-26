import { ITickable } from "../../interfaces/ITickable";
import { Actor } from "../../core/actor";
import { ISaveable } from "../../interfaces/ISaveable";

/**
 * Represents a component which can be attached to an actor to perform operations against it or its display components.
 * They hold a reference to their owning actor and effectively control the behavior of that actor.
 */
export abstract class ControllerComponent<T extends Actor = Actor> implements ITickable, ISaveable {

    /**
     * The name of this component.
     */
    public readonly name: string;

    /**
     * The actor which this component acts upon.
     */
    public readonly actor: T;

    /**
     * Whether or not this component is active, allowing it to tick.
     */
    public isActive: boolean;

    /**
     * Contructs a new controller component.
     * @param name The name of this component.
     * @param theActor The actor which this component operates on.
     */
    public constructor(name: string, theActor: T) {
        this.name = name;
        this.actor = theActor;
        this.isActive = true;
    }

    /**
     * Performs the update routines of this controller component.
     * @param deltaTime The time passed in seconds since the last tick.
     */
    public abstract update(deltaTime: number): void;

    /**
     * Controller components don't save or restore anything by default. This should be overridden by subclasses that
     * wish to have save/restore behavior.
     */
    public save(): void { }

    /**
     * Controller components don't save or restore anything by default. This should be overridden by subclasses that
     * wish to have save/restore behavior.
     */
    public restore(): void { }
}