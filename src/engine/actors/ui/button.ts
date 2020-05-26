import { Actor } from "../../core/actor";
import { TextComponent, TextComponentData } from "../../components/display/textComponent";
import { SpriteComponent } from "../../components/display/spriteComponent";
import { DisplayComponentData } from "../../components/display/displayComponent";
import { RenderableData } from "../../core/renderable";
import { Signal } from "../../core/signal";
import { InteractionType } from "../../enums/interactionEvents";

/**
 * The data required to instantiate a button.
 */
export interface ButtonData extends RenderableData {

    /**
     * The display component to use as the button background.
     */
    background: DisplayComponentData;

    /**
     * The labels to attach to this button component.
     */
    labels: TextComponentData[];
}

/**
 * Represents a button. Buttons are inherently interactive, support a disabled state, and have signals that can be
 * subscribed to as a callback for numerous interaction events.
 */
export class Button extends Actor<ButtonData> {

    /**
     * Whether or not this button is currently enabled.
     */
    protected _isEnabled: boolean = true;

    /**
     * A signal that is emitted from when this button is clicked on.
     */
    public readonly onClick: Signal<(button: Button) => void>;

    /**
     * A signal that is emitted from when pressing down on this button.
     */
    public readonly onDown: Signal<(button: Button) => void>;

    /**
     * A signal that is emitted from when a mouse up occurs on this button.
     */
    public readonly onUp: Signal<(button: Button) => void>;

    /**
     * A signal that is emitted from when this button is hovered over.
     */
    public readonly onOver: Signal<(button: Button) => void>;

    /**
     * A signal that is emitted from when the cursor moves off of this button.
     */
    public readonly onOut: Signal<(button: Button) => void>;

    /**
     * Creates a new button.
     * @param buttonData The data associated with this button.
     */
    public constructor(buttonData: ButtonData) {
        super(buttonData);
        this.onClick = new Signal();
        this.onDown = new Signal();
        this.onUp = new Signal();
        this.onOver = new Signal();
        this.onOut = new Signal();

        this.container.interactive = true;
        this.container.addListener(InteractionType.MOUSE_CLICK, this.emitInteractionEvent.bind(this, this.onClick));
        this.container.addListener(InteractionType.MOUSE_DOWN, this.emitInteractionEvent.bind(this, this.onDown));
        this.container.addListener(InteractionType.MOUSE_UP, this.emitInteractionEvent.bind(this, this.onUp));
        this.container.addListener(InteractionType.MOUSE_OVER, this.emitInteractionEvent.bind(this, this.onOver));
        this.container.addListener(InteractionType.MOUSE_OUT, this.emitInteractionEvent.bind(this, this.onOut));

        this.addDisplayComponent(new SpriteComponent(this._objectData.background));

        for (const labelData of this._objectData.labels) {
            this.addDisplayComponent(new TextComponent(labelData));

        }
    }

    /**
     * Toggles whether or not this button is currently enabled.
     */
    public get isEnabled(): boolean {
        return this._isEnabled;
    }
    public set isEnabled(value: boolean) {
        this._isEnabled = value;

        // Make the button grayscale while disabled.
        // TODO Make this configurable.
        if (value) {
            this.container.filters = [];
        } else {
            const desaturateFilter = new PIXI.filters.ColorMatrixFilter();
            desaturateFilter.desaturate();
            this.container.filters = [desaturateFilter];
        }
    }

    /**
     * Emits from the given signal if the button is currently enabled.
     * @param signal The signal to emit from.
     */
    private emitInteractionEvent(signal: Signal<(button: Button) => void>): void {
        if (this._isEnabled) {
            signal.emit(this);
        }
    }
}