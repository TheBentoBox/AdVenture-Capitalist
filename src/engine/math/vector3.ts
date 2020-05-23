import { Signal } from "../core/signal";
import { IDestroyable } from "../interfaces/IDestroyable";

export class Vector3 implements IDestroyable {
    private _x: number;
    private _y: number;
    private _z: number;

    public onComponentChanged: Signal;

    public constructor(x: number, y: number, z: number) {
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
}
