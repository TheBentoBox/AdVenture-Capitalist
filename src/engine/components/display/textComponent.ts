import { DisplayComponent } from "./displayComponent";
import { Observable } from "../../core/observable";
import { Dictionary } from "../../core/types";

/**
 * The data shape that gets passed into the display component constructor for configuration purposes.
 */
type TextComponentData = { text: string, format?: string, style?: any }

/**
 * Represents a base text element.
 */
export class TextComponent extends DisplayComponent<PIXI.Text, TextComponentData> {

    /**
     * The observable this text component is attached to. It will update its value automatically to match the
     * observable's value whenever it changes.
     */
    private _attachedObservable?: Observable<number> | Observable<string>;

    /**
     * Loads the text element.
     */
    public load(): void {
        this._internalAssetData = new PIXI.Text(this._assetData.text, this._assetData.style);
        this.container.addChild(this._internalAssetData);
    }

    /**
     * Updates the text this component is displaying.
     * @param newText The new text value to display.
     */
    public setText(newText: string): void {
        this._internalAssetData.text = newText;
    }

    /**
     * Attaches this text component to the given observable, causing it to live update to match the observable's value.
     * @param observable The observable to attach to.
     */
    public attachTo(observable: Observable<number> | Observable<string>): void {
        this.detatch();

        observable.subscribe(this, (newValue: number | string) => this.setText(String(newValue)));
        this._attachedObservable = observable;
    }

    /**
     * Detaches this text from its current observable.
     */
    public detatch(): void {
        if (this._attachedObservable !== undefined) {
            this._attachedObservable.unsubscribe(this);
            this._attachedObservable = undefined;
        }
    }
}