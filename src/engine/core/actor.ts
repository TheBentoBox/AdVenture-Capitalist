import { ITickable } from "../interfaces/ITickable";
import { BehavioralComponent } from "./behavioralComponent";
import { Transform } from "../math/transform";
import { Renderable } from "./renderable";

/**
 * An actor which can be attached within a level's tree for drawing.
 */
export class Actor extends Renderable implements ITickable {

    /**
     * Whether or not this actor is currently active and should receive updates.
     */
    public isActive: boolean = true;

    /**
     * The children of this actor.
     * Children will be recursively updated and rendered in order by index.
     */
    public readonly children: Actor[];

    /**
     * The behavioral components which operate on this actor's display components.
     */
    public readonly behavioralComponents: BehavioralComponent[];

    /**
     * The display components representing the visual state of this object.
     * These perform no update routines and should be controlled by behavioral components.
     */
    public readonly displayComponents: Renderable[];

    /**
     * Instantiates a new actor with no children or components attached.
     */
    public constructor() {
        super();

        this.children = [];
        this.behavioralComponents = [];
        this.displayComponents = [];
    }

    /**
     * Adds a new behavioral component to this actor.
     * @param theComponent The component to be added.
     * @returns True if the component was added successfully. Failure to add generally indicates
     *  that the component is already attached to this actor.
     */
    public addBehavioralComponent(theComponent: BehavioralComponent): boolean {
        const componentIndex = this.behavioralComponents.indexOf(theComponent);
        if (componentIndex >= 0) {
            return false;
        }

        this.behavioralComponents.push(theComponent);
        return true;
    }

    /**
     * Removes a behavioral component from this actor.
     * @param theComponent The component to be removed.
     * @returns True if the component was removed successfully. Failure to remove generally indicates
     *  that the component was not attached to this actor.
     */
    public removeBehavioralComponent(theComponent: BehavioralComponent): boolean {
        const componentIndex = this.behavioralComponents.indexOf(theComponent);
        if (componentIndex >= 0) {
            return false;
        }

        this.behavioralComponents.splice(componentIndex, 1);
        return true;
    }

    /**
     * Adds a new display component to this actor.
     * @param theComponent The component to be added.
     * @returns True if the component was added successfully. Failure to add generally indicates
     *  that the component is already attached to this actor.
     */
    public addDisplayComponent(theComponent: Renderable): boolean {
        const componentIndex = this.displayComponents.indexOf(theComponent);
        if (componentIndex >= 0) {
            return false;
        }

        this.displayComponents.push(theComponent);
        this.container.addChild(theComponent.container);
        return true;
    }

    /**
     * Removes a display component from this actor.
     * @param theComponent The component to be removed.
     * @returns True if the component was removed successfully. Failure to remove generally indicates
     *  that the component was not attached to this actor.
     */
    public removeDisplayComponent(theComponent: Renderable): boolean {
        const componentIndex = this.displayComponents.indexOf(theComponent);
        if (componentIndex >= 0) {
            return false;
        }

        this.displayComponents.splice(componentIndex, 1);
        return true;
    }

    /**
     * Adds a new child to this actor.
     * @param theChild The child to be added.
     * @returns True if the child was added successfully. Failure to add generally indicates
     *  that the child is already attached to this actor.
     */
    public addChild(theChild: Actor): boolean {
        const childIndex = this.children.indexOf(theChild);
        if (childIndex >= 0) {
            return false;
        }

        this.children.push(theChild);
        this.container.addChild(theChild.container);
        return true;
    }

    /**
     * Removes a child from this actor.
     * @param theChild The child to be removed.
     * @returns True if the child was removed successfully. Failure to remove generally indicates
     *  that the child was not attached to this actor.
     */
    public removeChild(theChild: Actor): boolean {
        const childIndex = this.children.indexOf(theChild);
        if (childIndex >= 0) {
            return false;
        }

        this.children.splice(childIndex, 1);
        this.container.removeChild(theChild.container);
        return true;
    }

    /**
     * Updates all behavioral components attached to this actor.
     * @param deltaTime The amount of time that has passed in seconds since the last update tick.
     */
    public update(deltaTime: number): void {
        for (const behavioralComponent of this.behavioralComponents) {
            if (!behavioralComponent.isActive) {
                continue;
            }

            behavioralComponent.update(deltaTime);
        }
    }
}