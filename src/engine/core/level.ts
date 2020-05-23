import { Actor } from "./actor";
import { IRenderer } from "../interfaces/IRenderer";
import { Engine } from "./engine";

/**
 * Represents a game level. These could represent real separate "levels" or be separated purely for organization purposes.
 * Levels must be associated with a renderer to be drawn.
 */
export class Level {

    /**
     * The name of this level. Used for identification purposes.
     */
    public readonly name: string;

    /**
     * The root actor which all actors and components in this level are attached to.
     */
    public readonly root: Actor;

    /**
     * Stands up a new level. This must be added to the core renderer with {@link Engine.renderer.addLevel} once you are
     * ready for it to be rendered, unless is true in which case it will add itself to the engine's renderer automatically.
     * @param name The name of this level.
     * @param autoRegister Optional. If true, the level will
     */
    public constructor(name: string, autoRegister: boolean = false) {
        this.name = name;
        this.root = new Actor();

        if (autoRegister) {
            Engine.renderer.addLevel(this);
        }
    }
}