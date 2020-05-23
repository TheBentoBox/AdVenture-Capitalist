import { ITickable } from "./ITickable";
import { Level } from "../core/level";

/**
 * The interface for any renderer.
 */
export interface IRenderer extends ITickable {

    /**
     * The levels associated with this renderer. They are drawn in order by index.
     */
    readonly levels: Level[];

    /**
     * Adds a level to this renderer.
     * @param theLevel The level to be added.
     */
    addLevel(theLevel: Level): void;

    /**
     * Removes a level from this renderer.
     * @param theLevel The level to be removed.
     * @returns True if the level was successfully removed. Failure to remove likely means the level
     *  was not attached to this renderer.
     */
    removeLevel(theLevel: Level): boolean;
}