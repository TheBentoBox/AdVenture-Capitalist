import { DisplayComponent } from "./displayComponent";
import { Observable } from "../../core/observable";

/**
 * The data shape that gets passed into the display component constructor for configuration purposes.
 */
type TextComponentData = { text: string | Observable<number> | Observable<string>, format?: TextFormatMode, style?: any }

/**
 * Represents the ways in which a text component's text can be formatted.
 */
export enum TextFormatMode {

    /**
     * (Default) The text is treated as raw text and no formatting is applied.
     */
    TEXT = "text",

    /**
     * The text will be formatted as a currency. This currently only supports USD.
     */
    CURRENCY = "currency"
}

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
     * The currency formatter which text component used when their text format is set to {@link TextFormatMode.CURRENCY}.
     */
    public static currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

    /**
     * Loads the text element.
     */
    public load(): void {

        // Default the format mode to text.
        if (this._assetData.format === undefined) {
            this._assetData.format = TextFormatMode.TEXT;
        }

        // Default the starting text to an empty string if the text was set to watch an observable.
        const isObservable = (this._assetData.text instanceof Observable);
        let startingText: string = (isObservable ? "" : String(this._assetData.text));
        this._internalAssetData = new PIXI.Text(startingText, this._assetData.style);

        // Attach to the configured observable if applicable.
        if (isObservable) {
            this.attachTo(this._assetData.text as (Observable<string> | Observable<number>));
        }

        this.container.addChild(this._internalAssetData);
    }

    /**
     * Updates the text this component is displaying.
     * @param newText The new text value to display.
     */
    public setText(newText: string | number): void {
        switch (this._assetData.format) {
            case TextFormatMode.CURRENCY:
                newText = TextComponent.currencyFormatter.format(Number(newText));
                break;
            default:
                newText = String(newText);
                break;
        }

        this._internalAssetData.text = String(newText);
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