import { Renderable } from "../../core/renderable";
import { AssetLoader } from "../../core/assetLoader";

/**
 * Creates a new sprite component using the specified asset.
 */
export class SpriteComponent extends Renderable {

    /**
     * Constructs a new sprite component which will display the specified asset.
     * @param assetName The name of the sprite asset to be displayed.
     */
    public constructor(assetName: string) {
        super();
        this._internalAssetData = AssetLoader.getAsset<PIXI.Sprite>(assetName);
        this.container.addChild(this._internalAssetData);
    }

    /**
     * Allows dynamically updating the asset this sprite will use.
     * @param newAssetName The name of the new asset to display.
     */
    public setAssetName(newAssetName: string): void {
        this.container.removeChild(this._internalAssetData);
        this._internalAssetData = AssetLoader.getAsset<PIXI.Sprite>(newAssetName);
        this.container.addChild(this._internalAssetData);
    }
}