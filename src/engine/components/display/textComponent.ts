import { DisplayComponent } from "./displayComponent";

/**
 * Represents a base text element.
 */
export class TextComponent extends DisplayComponent<PIXI.Text> {

    /**
     * Loads the text element.
     */
    public load(): void {
        this._internalAssetData = new PIXI.Text(this._assetName);
        this.container.addChild(this._internalAssetData);
    }
}