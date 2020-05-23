import { Engine } from "./engine";
import { IRenderer } from "../interfaces/IRenderer";
import { ILevel } from "../interfaces/ILevel";

export class PIXIRenderer implements IRenderer {

    /**
     * The internal core PIXI application.
     */
    private _pixiApp: PIXI.Application;

    /**
     * The main PIXI container associated with this renderer.
     */
    public readonly container: PIXI.Container;

    /**
     * The levels currently attached to this renderer.
     */
    public readonly levels: ILevel[];

    /**
     * Whether or not this renderer is currently active.
     */
    public isActive: boolean = true;

    /**
     * Stands up a new canvas renderer.
     * @param levels The levels associated with this renderer.
     */
    public constructor(levels: ILevel[]) {

        // Stand up the PIXI application associated with this renderer.
        this._pixiApp = new PIXI.Application();

        Engine.displayContainer.appendChild(this._pixiApp.view);
        this._pixiApp.resizeTo = Engine.displayContainer;

        // Assign the main container of the renderer as the core PIXI app stage.
        // All levels will have their root actor's container attached to the stage.
        this.container = this._pixiApp.stage;

        // Now that the container is ready, we can create all of the levels.
        this.levels = [];
        for (const level of levels) {
            this.addLevel(level);
        }
    }

    /**
     * Performs rendering operations each ticks.
     * @param deltaTime The amount of time that has passed in seconds since the last update tick.
     */
    public update(deltaTime: number): void {
        for (const level of this.levels) {
            if (!level.root.isActive) {
                continue;
            }

            level.root.update(deltaTime);
        }

        this.draw();
    }

    /**
     * Adds a level to this renderer.
     * @param theLevel The level to be added.
     */
    public addLevel(theLevel: ILevel): void {
        this.levels.push(theLevel);
        this.container.addChild(theLevel.root.container);
    }

    /**
     * Removes a level from this renderer.
     * @param theLevel The level to be removed.
     * @returns True if the level was removed successfully. Failure to remove likely means the level wasn't
     *  attached to this renderer.
     */
    public removeLevel(theLevel: ILevel): boolean {
        const levelIndex = this.levels.indexOf(theLevel);
        if (levelIndex >= 0) {
            return false;
        }

        this.levels.splice(levelIndex, 1);
        this.container.removeChild(theLevel.root.container);
        return true;
    }

    /**
     * Draws the scene within the canvas.
     */
    public draw(): void {
        //this._pixiApp.renderer.render
    }
}