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
    background: DisplayComponentData;
    labels: TextComponentData[];
}

/**
 * Represents a button. Buttons are inherently interactive, support a disabled state, and 
 */
export class Button extends Actor<ButtonData> {

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
        this.container.addListener(InteractionType.MOUSE_CLICK, this.onClick.emit.bind(this.onClick, this));
        this.container.addListener(InteractionType.MOUSE_DOWN, this.onDown.emit.bind(this.onDown, this));
        this.container.addListener(InteractionType.MOUSE_UP, this.onUp.emit.bind(this.onUp, this));
        this.container.addListener(InteractionType.MOUSE_OVER, this.onOver.emit.bind(this.onOver, this));
        this.container.addListener(InteractionType.MOUSE_OUT, this.onOut.emit.bind(this.onOut, this));

        this.addDisplayComponent(new SpriteComponent(this._objectData.background));

        for (let i = 0; i < this._objectData.labels.length; ++i) {
            this.addDisplayComponent(new TextComponent(this._objectData.labels[i]));
        }
    }
}