import { DisplayComponent, DisplayComponentData } from "./displayComponent";
import { Observable } from "../../core/observable";
import { Signal } from "../../core/signal";

/**
 * The data shape that gets passed into the display component constructor for configuration purposes.
 */
export interface TextComponentData extends DisplayComponentData {
    text: string | Observable<number> | Observable<string>,
    format?: TextFormatMode,
    style?: Partial<PIXI.TextStyle>
}

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
     * Emitted from when the text value of this component changes.
     */
    public onTextChanged: Signal = new Signal<(component?: TextComponent) => void>();

    /**
     * Constructs a new text component using the provided object data.
     * @param objectData The data describing this object.
     */
    public constructor(objectData: TextComponentData) {
        super(objectData);

        // Default the format mode to text.
        if (this._objectData.format === undefined) {
            this._objectData.format = TextFormatMode.TEXT;
        }

        // Default the starting text to an empty string if the text was set to watch an observable.
        const isObservable = (this._objectData.text instanceof Observable);
        let startingText: string = (isObservable ? "" : String(this._objectData.text));
        this._internalAssetData = new PIXI.Text(startingText, this._objectData.style);

        // Attach to the configured observable if applicable.
        if (isObservable) {
            this.attachTo(this._objectData.text as (Observable<string> | Observable<number>));
        }
    }

    /**
     * Loads the text element.
     */
    public load(): void {
        super.load();
        this.container.addChild(this._internalAssetData);
    }

    /**
     * Updates the text this component is displaying.
     * @param newText The new text value to display.
     */
    public setText(newText: string | number): void {
        switch (this._objectData.format) {
            case TextFormatMode.CURRENCY:
                newText = TextComponent.currencyFormatter.format(Number(newText));
                break;
            default:
                newText = String(newText);
                break;
        }

        this._internalAssetData.text = String(newText);

        if (this.onTextChanged === undefined) {
            this.onTextChanged = new Signal<(component?: TextComponent) => void>();
        }
        this.onTextChanged.emit(this);
    }

    /**
     * Updates the text style for this component.
     * @param newText The new text style settings to use.
     */
    public setStyle(newStyle: PIXI.TextStyle): void {
        this._internalAssetData.style = newStyle;
    }

    /**
     * Attaches this text component to the given observable, causing it to live update to match the observable's value.
     * @param observable The observable to attach to.
     */
    public attachTo(observable: Observable<number> | Observable<string>): void {
        this.detatch();

        observable.subscribe(this, this.setText.bind(this));
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