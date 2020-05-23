import { Engine } from "./engine";
import { IRenderer } from "../interfaces/IRenderer";
import { Level } from "./level";
import { AssetLoader } from "./assetLoader";

export class PIXIRenderer implements IRenderer {

    /**
     * The internal core PIXI application.
     */
    private _pixiApp: PIXI.Application;

    /**
     * The PIXI renderer that will be used to render the stage.
     */
    private _pixiRenderer: PIXI.Renderer;

    /**
     * The main PIXI container associated with this renderer.
     */
    public readonly container: PIXI.Container;

    /**
     * The levels currently attached to this renderer.
     */
    public readonly levels: Level[];

    /**
     * Whether or not this renderer is currently active.
     */
    public isActive: boolean = true;

    /**
     * Stands up a new canvas renderer.
     * @param levels The levels associated with this renderer.
     */
    public constructor(levels: Level[]) {

        // Stand up the PIXI application associated with this renderer.
        this._pixiApp = new PIXI.Application();
        this._pixiRenderer = PIXI.autoDetectRenderer();

        this._pixiApp.renderer.backgroundColor = 0xFFFFAA;
        this._pixiApp.renderer.autoDensity = true;
        this._pixiApp.renderer.resize(window.innerWidth, window.innerHeight);

        Engine.displayContainer.appendChild(this._pixiApp.view);
        this._pixiApp.resizeTo = Engine.displayContainer;

        // Assign the main container of the renderer as the core PIXI app stage.
        // All levels will have their root actor's container attached to the stage.
        this.container = new PIXI.Container();
        this._pixiApp.stage.addChild(this.container);

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
    public addLevel(theLevel: Level): void {
        this.levels.push(theLevel);
        this.container.addChild(theLevel.root.container);
    }

    /**
     * Removes a level from this renderer.
     * @param theLevel The level to be removed.
     * @returns True if the level was removed successfully. Failure to remove likely means the level wasn't
     *  attached to this renderer.
     */
    public removeLevel(theLevel: Level): boolean {
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
        // this._pixiRenderer.render(this._pixiApp.stage);
        this._pixiRenderer.render(this.container);
    }
}