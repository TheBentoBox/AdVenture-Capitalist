import { Transform, TransformData } from "../math/transform";
import { IDestroyable } from "../interfaces/IDestroyable";

/**
 * The data that can be passed into a renderable object upon creation.
 */
export interface RenderableData { name: string, transform?: TransformData };

/**
 * The base class for an object which can be rendered.
 */
export abstract class Renderable<T extends RenderableData = RenderableData> implements IDestroyable {

    /**
     * The asset data associated with this asset.
     */
    protected readonly _objectData: T;

    /**
     * The container within to which this object's renderable objects are attached.
     */
    public readonly container: PIXI.Container;

    /**
     * The transform within its owning container used to render this object.
     */
    public readonly transform: Transform;

    /**
     * Stands up a new renderable.
     * @param renderableData The settings associated with this renderable.
     */
    public constructor(renderableData: T) {
        this._objectData = renderableData;
        this.container = new PIXI.Container();
        this.transform = new Transform();

        this.transform.position.onComponentChanged.subscribe(this, this.onPositionChanged.bind(this));
        this.transform.scale.onComponentChanged.subscribe(this, this.onScaleChanged.bind(this));
        this.transform.rotation.onComponentChanged.subscribe(this, this.onRotationChanged.bind(this));
    }

    /**
     * Loads this renderable.
     */
    public load(): void {
        if (this._objectData.transform !== undefined) {
            this.transform.configure(this._objectData.transform);
        }
    }

    /**
     * Unloads resources held by this renderable.
     */
    public destroy(): void {
        this.container.destroy();
        this.transform.destroy();
    }

    /**
     * Subscription callback for when our transform's position changes to update the internal one.
     */
    private onPositionChanged(): void {
        this.container.transform.position.x = this.transform.position.x;
        this.container.transform.position.y = this.transform.position.y;
    }

    /**
     * Subscription callback for when our transform's scale changes to update the internal one.
     */
    private onScaleChanged(): void {
        this.container.transform.scale.x = this.transform.scale.x;
        this.container.transform.scale.y = this.transform.scale.y;
    }

    /**
     * Subscription callback for when our transform's rotation changes to update the internal one.
     */
    private onRotationChanged(): void {
        this.container.transform.rotation = this.transform.rotation.z;
    }
}