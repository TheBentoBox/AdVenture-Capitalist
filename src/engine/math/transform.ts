import { Vector3, VectorData } from "./vector3";
import { IDestroyable } from "../interfaces/IDestroyable";
import { IConfigurable } from "../interfaces/IConfigurable";

export interface TransformData {
    position?: VectorData,
    scale?: VectorData,
    rotation?: VectorData
}

/**
 * A transform representing an object's location in 3D space. This is primarily used as an adapter level
 * between the internal PIXI container transforms to allow for the insertion of engine-level events.
 * 
 * The engine currently only renders in 2D but treating transforms as 3D is the most future-proof
 * approach and allows for rotations around the otherwise-unused z-axis.
 */
export class Transform implements IDestroyable, IConfigurable<TransformData> {

    /**
     * The position of this transform.
     */
    public readonly position: Vector3;

    /**
     * The scale of this transform.
     */
    public readonly scale: Vector3;

    /**
     * The rotation of this transform.
     */
    public readonly rotation: Vector3;

    /**
     * Stands up a new transform with the given properties.
     * @param thePosition (Optional) The initial position of this transform. Defaults to 0 for all components.
     * @param theScale (Optional) The initial position of this transform. Defaults to 1 for all components.
     * @param theRotation (Optional) The initial position of this transform. Defaults to 0 for all components.
     */
    public constructor(thePosition: Vector3 = Vector3.zero(), theScale: Vector3 = Vector3.one(), theRotation: Vector3 = Vector3.zero()) {
        this.position = thePosition;
        this.scale = theScale;
        this.rotation = theRotation;
    }

    /**
     * Unloads resources held by this transform.
     */
    public destroy(): void {
        this.position.destroy();
        this.scale.destroy();
        this.rotation.destroy();
    }

    /**
     * Configures the transform from the given data.
     * @param transformData The data to configure this transform from.
     * @returns This transform after having its values updated.
     */
    public configure(transformData: TransformData): Transform {
        if (transformData.position !== undefined) {
            this.position.configure(transformData.position);
        }
        if (transformData.scale !== undefined) {
            this.scale.configure(transformData.scale);
        }
        if (transformData.rotation !== undefined) {
            this.rotation.configure(transformData.rotation);
        }
        return this;
    }
}