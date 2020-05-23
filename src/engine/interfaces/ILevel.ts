import { Actor } from "../core/actor";
import { IRenderer } from "./IRenderer";

/**
 * Represents a game level. These could represent real separate "levels" or be separated purely for organization purposes.
 * Levels must be associated with a renderer to be drawn.
 */
export interface ILevel {

    /**
     * The name of this level. Used for identification purposes.
     */
    readonly name: string;

    /**
     * The root actor which all actors and components in this level are attached to.
     */
    readonly root: Actor;

    /**
     * The renderer which controls drawing this level.
     */
    readonly renderer: IRenderer;
}