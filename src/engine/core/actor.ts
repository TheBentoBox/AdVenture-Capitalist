import { ITickable } from "../interfaces/ITickable";
import { ControllerComponent } from "../components/controller/controllerComponent";
import { Renderable, RenderableData } from "./renderable";
import { Dictionary } from "./types";
import { DisplayComponent } from "../components/display/displayComponent";
import { ISaveable } from "../interfaces/ISaveable";

/**
 * The data that can be passed into an actor upon instantiation.
 *
 * Currently this is empty but it should exist in case of any actor-specific
 * properties in the future so we don't have to go around retyping stuff.
 */
// tslint:disable-next-line:no-empty-interface
export interface ActorData extends RenderableData { }

/**
 * An actor which can be attached within a level's tree for drawing.
 */
export class Actor<T extends ActorData = ActorData> extends Renderable<T> implements ITickable, ISaveable {

    /**
     * The name of this actor.
     */
    public readonly name: string;

    /**
     * Whether or not this actor is currently active and should receive updates.
     */
    public isActive: boolean = true;

    /**
     * The children of this actor. Children will be recursively updated and rendered in the order they were added.
     */
    public readonly children: Dictionary<Actor> = {};

    /**
     * The controller components which operate on this actor's display components.
     */
    public readonly controllerComponents: Dictionary<ControllerComponent> = {};

    /**
     * The display components representing the visual state of this object.
     */
    public readonly displayComponents: Dictionary<Renderable> = {};

    /**
     * Instantiates a new actor with no children or components attached.
     * @param actorData The data this actor should be configured with.
     */
    public constructor(actorData: T = {} as T) {
        super(actorData);
        this.name = actorData.name;
    }

    /**
     * Loads this actor, calling upon all of its components to load as well.
     */
    public load(): void {
        super.load();
        for (const componentName of Object.keys(this.displayComponents)) {
            this.displayComponents[componentName].load();
        }
        for (const childName of Object.keys(this.children)) {
            this.children[childName].load();
        }
    }

    /**
     * Actors don't save or restore anything by default. This should be overridden by subclasses that
     * wish to have save/restore behavior.
     */
    public save(): void {
        for (const componentName of Object.keys(this.controllerComponents)) {
            this.controllerComponents[componentName].save();
        }
        for (const childName of Object.keys(this.children)) {
            this.children[childName].save();
        }
    }

    /**
     * Actors don't save or restore anything by default. This should be overridden by subclasses that
     * wish to have save/restore behavior.
     */
    public restore(): void {
        for (const componentName of Object.keys(this.controllerComponents)) {
            this.controllerComponents[componentName].restore();
        }
        for (const childName of Object.keys(this.children)) {
            this.children[childName].restore();
        }
    }

    /**
     * Adds a new controller component to this actor.
     * @param theComponent The component to be added.
     * @returns True if the component was added successfully. Failure to add generally indicates
     *  that the component is already attached to this actor.
     */
    public addControllerComponent(theComponent: ControllerComponent): boolean {
        if (this.controllerComponents[theComponent.name] !== undefined) {
            return false;
        }

        this.controllerComponents[theComponent.name] = theComponent;
        return true;
    }

    /**
     * Gets a controller component by name from this actor.
     * @param name The name of the controller component to retrieve.
     * @returns The controller component, or undefined if it wasn't found.
     */
    public getControllerComponent<U extends ControllerComponent>(name: string): ControllerComponent {
        return this.controllerComponents[name] as U;
    }

    /**
     * Removes a controller component from this actor.
     * @param theComponent The component to be removed.
     * @returns True if the component was removed successfully. Failure to remove generally indicates
     *  that the component was not attached to this actor.
     */
    public removeControllerComponent(theComponent: ControllerComponent): boolean {
        if (this.controllerComponents[theComponent.name] === undefined) {
            return false;
        }

        delete this.controllerComponents[theComponent.name];
        return true;
    }

    /**
     * Adds a new display component to this actor.
     * @param theComponent The component to be added.
     * @returns True if the component was added successfully. Failure to add generally indicates
     *  that the component is already attached to this actor.
     */
    public addDisplayComponent(theComponent: DisplayComponent): boolean {
        if (this.displayComponents[theComponent.name] !== undefined) {
            return false;
        }

        this.container.addChild(theComponent.container);
        this.displayComponents[theComponent.name] = theComponent;
        return true;
    }

    /**
     * Gets a display component by name from this actor.
     * @param name The name of the display component to retrieve.
     * @returns The display component, or undefined if it wasn't found.
     */
    public getDisplayComponent<U extends DisplayComponent>(name: string): DisplayComponent {
        return this.displayComponents[name] as U;
    }

    /**
     * Removes a display component from this actor.
     * @param theComponent The component to be removed.
     * @returns True if the component was removed successfully. Failure to remove generally indicates
     *  that the component was not attached to this actor.
     */
    public removeDisplayComponent(theComponent: DisplayComponent): boolean {
        if (this.displayComponents[theComponent.name] === undefined) {
            return false;
        }

        this.container.removeChild(theComponent.container);
        delete this.displayComponents[theComponent.name];
        return true;
    }

    /**
     * Adds a new child to this actor.
     * @param theChild The child to be added.
     * @returns True if the child was added successfully. Failure to add generally indicates
     *  that the child is already attached to this actor.
     */
    public addChild(theChild: Actor): boolean {
        if (this.children[theChild.name] !== undefined) {
            return false;
        }

        this.container.addChild(theChild.container);
        this.children[theChild.name] = theChild;
        return true;
    }

    /**
     * Gets a child by name from this actor.
     * @param name The name of the child to retrieve.
     * @returns The child, or undefined if it wasn't found.
     */
    public getChild<U extends Actor>(name: string): Actor {
        return this.children[name] as U;
    }

    /**
     * Removes a child from this actor.
     * @param theChild The child to be removed.
     * @returns True if the child was removed successfully. Failure to remove generally indicates
     *  that the child was not attached to this actor.
     */
    public removeChild(theChild: Actor): boolean {
        if (this.children[theChild.name] === undefined) {
            return false;
        }

        this.container.removeChild(theChild.container);
        delete this.children[theChild.name];
        return true;
    }

    /**
     * Updates all controller components and children attached to this actor.
     * @param deltaTime The amount of time that has passed in seconds since the last update tick.
     */
    public update(deltaTime: number): void {
        for (const componentName of Object.keys(this.controllerComponents)) {
            const component = this.controllerComponents[componentName];
            if (!component.isActive) {
                continue;
            }

            component.update(deltaTime);
        }

        for (const childName of Object.keys(this.children)) {
            const child = this.children[childName];
            if (!child.isActive) {
                continue;
            }

            child.update(deltaTime);
        }
    }
}