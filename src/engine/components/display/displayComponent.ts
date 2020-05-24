import { Renderable } from "../../core/renderable";
import { AssetLoader } from "../../core/assetLoader";
import { Dictionary } from "../../core/types";

/**
 * The data shape that gets passed into the display component constructor for configuration purposes.
 */
type DisplayComponentData = { assetName: string }


/**
 * The base class for display components which can be attached to a {@link Actor}.
 * Subclasses should override {@link DisplayComponent.load} to specify their load behavior.
 */
export abstract class DisplayComponent<T extends PIXI.Container = PIXI.Container, U extends Dictionary<any> = Partial<DisplayComponentData> & any> extends Renderable {

    /**
     * The name of this display component.
     */
    public readonly name: string;

    /**
     * The asset data associated with this asset.
     */
    protected _assetData: U;

    /**
     * The asset data associated with this diplay component.
     */
    protected _internalAssetData!: T;

    /**
     * Constructs a new display component using the provided asset data.
     * @param name The name of this display component.
     * @param assetData The data describing this asset.
     */
    public constructor(name: string, assetData: U) {
        super();
        this.name = name;
        this._assetData = assetData;
        this.load();
    }

    /**
     * Loads this display object. The default behavior is to try to retrieve the asset with our
     * assetName from the main asset loader, but subclasses should override as necessary.
     */
    public load(): void {
        if ((this._assetData as unknown as DisplayComponentData).assetName !== undefined) {
            this._internalAssetData = AssetLoader.getAsset<T>((this._assetData as unknown as DisplayComponentData).assetName);
            this.container.addChild(this._internalAssetData);
        }
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