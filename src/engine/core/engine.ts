import { EngineState } from "../enums/engineState";
import { PIXIRenderer } from "./pixiRenderer";
import { Game } from "./game";
import { Dictionary } from "./types";

/**
 * Represents the data shape of the constructor for a class extending {@link Game}.
 */
type GameConstructor = new (gameData: any) => Game;

/**
 * The core engine class which handles the main game update routines and triggers other handlers.
 */
export class Engine {

    /**
     * The path to the core game config which the engine must load to progress.
     */
    private static readonly _gameConfigPath = "assets/gameConfig.json";

    /**
     * The registered game type that the engine will instantiate.
     * Game classes should register themselves via {@link Engine.registerGame}
     */
    private static _gameType: GameConstructor;

    /**
     * The instantiated game class which will run the actual game.
     */
    private static _game: Game;

    /**
     * The DOM element which engine-created DOM elements should attach themselves to.
     */
    private static _displayContainer: HTMLElement;
    private static _renderer: PIXIRenderer;
    private static _lastUpdateTime: number;
    private static _targetFrameRate: number = 60;

    /**
     * The current engine state.
     */
    private static _state: EngineState = EngineState.IDLE;

    /**
     * The engine is started via {@link Engine.start}.
     */
    private constructor() { }

    /**
     * Gets the display container the engine-created DOM elements should attach themselves to.
     * @returns The display container.
     */
    public static get displayContainer(): HTMLElement {
        return Engine._displayContainer;
    }

    /**
     * Registers the game that will be instantiated when the engine is ready.
     * @param theGame 
     */
    public static registerGame(theGame: GameConstructor): void {
        this._gameType = theGame;
    }

    /**
     * Starts the main engine tick loop.
     */
    public static start(): void {
        if (Engine._state !== EngineState.IDLE) {
            throw new Error("Something tried to start the Engine while it was already running. This should not happen, and likely indicates a critical issue.")
        }

        Engine._state = EngineState.STARTUP;

        // Retrieve the game container DOM element. This is required for the game to run.
        const displayContainer = document.getElementById("gameContainer");
        if (displayContainer === null) {
            throw new Error("Failed to retrieve element with ID gameContainer from the DOM. This is required for the engine to build itself within.")
        }

        Engine._lastUpdateTime = Date.now() - (1000 / Engine._targetFrameRate);
        Engine._displayContainer = displayContainer;
        Engine._renderer = new PIXIRenderer([]);

        // Load the core game config.
        // If this fails to load, the game will not run.
        PIXI.Loader.shared.add([Engine._gameConfigPath, "test"]).load(Engine.onGameConfigLoaded.bind(this));
    }

    /**
     * The main tick loop, updating all registered tickers and requesting the next tick from the browser.
     */
    private static tick(): void {
        const deltaTime = (Date.now() - Engine._lastUpdateTime) / 60;

        Engine._renderer.update(deltaTime);

        Engine._lastUpdateTime = Date.now();
        requestAnimationFrame(Engine.tick);
    }

    /**
     * Callback for when the core game config has been loaded by the engine. This stands up the
     * registered game class.
     * @param loader The loader wh
     * @param resources 
     */
    private static onGameConfigLoaded(loader: PIXI.Loader, resources: Dictionary<any>): void {
        Engine._game = new Engine._gameType(resources[Engine._gameConfigPath].data);
    }
}