import { ITickable } from "../interfaces/ITickable";
import { TickingComponent } from "../components/ticking/tickingComponent";
import { Renderable } from "./renderable";
import { Dictionary } from "./types";
import { DisplayComponent } from "../components/display/displayComponent";

/**
 * An actor which can be attached within a level's tree for drawing.
 */
export class Actor extends Renderable implements ITickable {

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
    public readonly children: Dictionary<Actor>;

    /**
     * The ticking components which operate on this actor's display components.
     */
    public readonly tickingComponents: Dictionary<TickingComponent>;

    /**
     * The display components representing the visual state of this object.
     */
    public readonly displayComponents: Dictionary<Renderable>;

    /**
     * Instantiates a new actor with no children or components attached.
     * @param name The name of this actor.
     */
    public constructor(name: string) {
        super();

        this.name = name;
        this.children = {};
        this.tickingComponents = {};
        this.displayComponents = {};
    }

    /**
     * Adds a new ticking component to this actor.
     * @param theComponent The component to be added.
     * @returns True if the component was added successfully. Failure to add generally indicates
     *  that the component is already attached to this actor.
     */
    public addTickingComponent(theComponent: TickingComponent): boolean {
        if (this.tickingComponents[theComponent.name] !== undefined) {
            return false;
        }

        this.tickingComponents[theComponent.name] = theComponent;
        return true;
    }

    /**
     * Removes a ticking component from this actor.
     * @param theComponent The component to be removed.
     * @returns True if the component was removed successfully. Failure to remove generally indicates
     *  that the component was not attached to this actor.
     */
    public removeTickingComponent(theComponent: TickingComponent): boolean {
        if (this.tickingComponents[theComponent.name] === undefined) {
            return false;
        }

        delete this.tickingComponents[theComponent.name];
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
     * Updates all ticking components and children attached to this actor.
     * @param deltaTime The amount of time that has passed in seconds since the last update tick.
     */
    public update(deltaTime: number): void {
        let component, child;

        for (const componentName of Object.keys(this.tickingComponents)) {
            component = this.tickingComponents[componentName];
            if (!component.isActive) {
                continue;
            }

            component.update(deltaTime);
        }

        for (const childName of Object.keys(this.children)) {
            child = this.children[childName];
            if (!child.isActive) {
                continue;
            }

            child.update(deltaTime);
        }
    }
}