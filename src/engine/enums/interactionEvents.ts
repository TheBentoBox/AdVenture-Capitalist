/**
 * Represents various possible JavaScript interaction events.
 */
export enum InteractionType {

    /**
     * When the mouse moves over an element's hit area.
     */
    MOUSE_OVER = "mouseover",

    /**
     * When the mouse out of an element's hit area.
     */
    MOUSE_OUT = "mouseout",

    /**
     * When the mouse initially presses down on an element.
     */
    MOUSE_DOWN = "mousedown",

    /**
     * When the mouse is released after having been pressed down on an element.
     */
    MOUSE_UP = "mouseup",

    /**
     * When the mouse performs a full click on the element.
     */
    MOUSE_CLICK = "click",
}