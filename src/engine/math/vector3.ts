import { Signal } from "../core/signal";
import { IDestroyable } from "../interfaces/IDestroyable";
import { IConfigurable } from "../interfaces/IConfigurable";

export interface VectorData {
    x?: number,
    y?: number,
    z?: number,
}

/**
 * A basic vector implementation which can be subscribed to for changes via {@link Signal}.
 */
export class Vector3 implements IDestroyable, IConfigurable<VectorData> {
    private _x: number;
    private _y: number;
    private _z: number;

    /**
     * The signal which is emitted from when any of the vector's component values change.
     */
    public onComponentChanged: Signal;

    /**
     * Constructs a new vector.
     * @param x The initial x component of the vector. Defaults to 0.
     * @param y The initial y component of the vector. Defaults to x, or 0 if x isn't provided.
     * @param z The initial z component of the vector. Defaults to 0.
     */
    public constructor(x: number = 0, y: number = x, z: number = 0) {
        this._x = x;
        this._y = y;
        this._z = z;

        this.onComponentChanged = new Signal();
    }

    /**
     * Clears out references held by this vector.
     */
    public destroy(): void {
        this.onComponentChanged.destroy();
    }

    /**
     * Returns a vector with 0 for all component values.
     */
    public static zero(): Vector3 {
        return new Vector3(0, 0, 0);
    }

    /**
     * Returns a vector with 1 for all component values.
     */
    public static one(): Vector3 {
        return new Vector3(1, 1, 1);
    }

    /**
     * Gets and sets the x component value of this vector.
     */
    public get x(): number {
        return this._x;
    }
    public set x(newX: number) {
        this._x = newX;
        this.onComponentChanged.emit();
    }

    /**
     * Gets and sets the y component value of this vector.
     */
    public get y(): number {
        return this._y;
    }
    public set y(newY: number) {
        this._y = newY;
        this.onComponentChanged.emit();
    }

    /**
     * Gets and sets the z component value of this vector.
     */
    public get z(): number {
        return this._z;
    }
    public set z(newZ: number) {
        this._z = newZ;
        this.onComponentChanged.emit();
    }

    /**
     * Sets the values of the vector. If only x is provided, the y component will be set to the same value.
     * @param x The new x component value. If this is the only provided param, this will also be the new
     *  y component value.
     * @param y (Optional) The new y component value.
     * @param z (Optional) The new z component value.
     * @returns This vector after having its component values updated.
     */
    public set(x: number, y: number = x, z?: number): Vector3 {
        this._x = x;
        this._y = y;
        if (z !== undefined) {
            this._z = z;
        }
        this.onComponentChanged.emit();
        return this;
    }

    /**
     * Configures this vector from the given vector data.
     * @param vectorData The vector data to configure this vector from.
     * @returns This vector after having its component values updated.
     */
    public configure(vectorData: VectorData): Vector3 {
        if (vectorData.x !== undefined) {
            this._x = vectorData.x;
        }
        if (vectorData.y !== undefined) {
            this._y = vectorData.y;
        }
        if (vectorData.z !== undefined) {
            this._z = vectorData.z;
        }
        this.onComponentChanged.emit();
        return this;
    }
}
