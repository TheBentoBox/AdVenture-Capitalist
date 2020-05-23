import { Renderable } from "../../core/renderable";
import { AssetLoader } from "../../core/assetLoader";

/**
 * The base class for display components which can be attached to a {@link Actor}.
 * Subclasses should override {@link DisplayComponent.load} to specify their load behavior.
 */
export abstract class DisplayComponent<T extends PIXI.Container> extends Renderable {

    /**
     * The name of the asset associated with this display component.
     */
    protected _assetName: string;

    /**
     * The asset data associated with this diplay component.
     */
    protected _internalAssetData!: T;

    /**
     * Constructs a new sprite component which will display the specified asset.
     * @param assetName The name of the sprite asset to be displayed.
     */
    public constructor(assetName: string) {
        super();
        this._assetName = assetName;
        this.load();
    }

    /**
     * Loads this display object. The default behavior is to try to retrieve the asset with our
     * assetName from the main asset loader, but subclasses should override as necessary.
     */
    public load(): void {
        this._internalAssetData = AssetLoader.getAsset<T>(this._assetName);
        this.container.addChild(this._internalAssetData);
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