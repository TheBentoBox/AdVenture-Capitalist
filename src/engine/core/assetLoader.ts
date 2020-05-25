import { Dictionary } from "./types";
import { AssetType } from "../enums/assetType";
import { Signal } from "./signal";

/**
 * Static utility class for handling asset loads.
 */
export class AssetLoader {

    /**
     * The asset map retrieved from the game config, mapping asset paths to their asset type.
     */
    private static _assetMap: Dictionary<AssetType>;

    /**
     * The store of loaded assets, mapped with the name as the key to the parsed asset data.
     */
    private static _assetStore: Dictionary<any> = {};

    /**
     * A publicly accessible signal which is emitted from when a group of assets requested for load finish loading.
     */
    public static readonly onAssetGroupLoaded: Signal = new Signal();

    /**
     * Requests the loader to load a group of assets.
     * @param assetMap A mapping of paths to assets to their asset type, which determines how their data is parsed.
     */
    public static loadAssets(assetMap: Dictionary<AssetType>): void {
        AssetLoader._assetMap = assetMap;

        for (const key of Object.keys(assetMap)) {
            PIXI.Loader.shared.add(AssetLoader.getFileName(key), key);
        }

        PIXI.Loader.shared.load(AssetLoader.onAssetsLoaded);
    }

    /**
     * Retrieves an asset by key from the store of loaded assets.
     * @param assetKey The name of the asset to retrieve from the loaded asset store.
     */
    public static getAsset<T extends PIXI.Container>(assetKey: string): T {
        let asset: T = this._assetStore[AssetLoader.getFileName(assetKey)] as T;
        if (asset instanceof PIXI.Sprite) {
            asset = (PIXI.Sprite.from(asset.texture) as unknown) as T;
        }
        return asset;
    }

    /**
     * Callback for when the requested assets have all beend loaded by PIXI.
     * @param loader The loader which was responsbile for loading these assets.
     * @param loadedResources The raw loaded resources.
     */
    private static onAssetsLoaded(loader: PIXI.Loader, loadedResources: any): void {
        for (const assetKey of Object.keys(loadedResources)) {
            const assetData = loadedResources[assetKey];
            const fileName = AssetLoader.getFileName(assetData.url);

            // Parse the asset based on its configured asset type.
            switch (AssetLoader._assetMap[assetData.url]) {
                case AssetType.SPRITE:
                    AssetLoader._assetStore[fileName] = new PIXI.Sprite(assetData.texture);
                    break;
            }
        }

        AssetLoader.onAssetGroupLoaded.emit();
    }

    /**
     * Returns everything after the final slash in the given string.
     * @param assetUrl The URL whose final file name should be retrieved.
     * @returns Everything after the final slash in the given string.
     */
    private static getFileName(assetUrl: string): string {
        return assetUrl.slice(assetUrl.lastIndexOf("/") + 1);
    }
}