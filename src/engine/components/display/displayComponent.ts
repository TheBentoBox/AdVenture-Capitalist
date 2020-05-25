import { Renderable, RenderableData } from "../../core/renderable";
import { AssetLoader } from "../../core/assetLoader";

/**
 * The data that can be passed into a renderable object upon creation.
 */
export interface DisplayComponentData extends RenderableData { assetName?: string };

/**
 * The base class for display components which can be attached to a {@link Actor}.
 * Subclasses should override {@link DisplayComponent.load} to specify their load behavior.
 */
export abstract class DisplayComponent<T extends PIXI.Container = PIXI.Container, U extends DisplayComponentData = DisplayComponentData> extends Renderable<U> {

    /**
     * The name of this display component.
     */
    public readonly name: string;

    /**
     * The asset data associated with this diplay component.
     */
    protected _internalAssetData!: T;

    /**
     * Constructs a new display component using the provided object data.
     * @param objectData The data describing this object.
     */
    public constructor(objectData: U) {
        super(objectData);
        this.name = objectData.name;
    }

    /**
     * Unloads resources held by this renderable.
     */
    public destroy(): void {
        super.destroy();
        delete this._internalAssetData;
    }

    /**
     * Loads this display object. The default behavior is to try to retrieve the asset with our
     * assetName from the main asset loader, but subclasses should override as necessary.
     */
    public load(): void {
        super.load();
        if (this._objectData.assetName !== undefined) {
            this._internalAssetData = AssetLoader.getAsset<T>(this._objectData.assetName);
            this.container.addChild(this._internalAssetData);
        }
    }

    /**
     * Modifies the mask of this display component.
     */
    public get mask(): PIXI.Container | PIXI.MaskData {
        return this._internalAssetData.mask;
    }
    public set mask(mask: PIXI.Container | PIXI.MaskData) {
        if (mask === null || mask === undefined) {
            if (this._internalAssetData.mask instanceof PIXI.Container) {
                this.container.removeChild(this._internalAssetData.mask);
            }
        } else if (mask instanceof PIXI.Container) {
            this.container.addChild(mask);
        }
        this._internalAssetData.mask = mask;
    }

    /**
     * Allows dynamically updating the asset this sprite will use.
     * @param newAssetName The name of the new asset to display.
     */
    public setAssetName(newAssetName: string): void {
        this.container.removeChild(this._internalAssetData);
        this._internalAssetData = AssetLoader.getAsset<T>(newAssetName);
        this.container.addChild(this._internalAssetData);
    }
}