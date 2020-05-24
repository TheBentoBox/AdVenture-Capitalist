import { EngineState } from "../enums/engineState";
import { PIXIRenderer } from "./pixiRenderer";
import { Game } from "./game";
import { Dictionary } from "./types";
import { AssetLoader } from "./assetLoader";
import { IRenderer } from "../interfaces/IRenderer";

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
     * The loaded game config.
     */
    private static _gameConfig: any;

    /**
     * The DOM element which engine-created DOM elements should attach themselves to.
     */
    private static _displayContainer: HTMLElement;

    /**
     * The renderer which will be utilized to draw the scene.
     */
    private static _renderer: PIXIRenderer;

    /**
     * The time at which the most recent update tick occurred. Used to calculate delta time.
     * This may not be set if the game hasn't started yet.
     */
    private static _lastUpdateTime: number;

    /**
     * The current engine state.
     */
    private static _state: EngineState = EngineState.IDLE;

    /**
     * The engine is started via {@link Engine.start} by passing in a valid {@link Game} subclass.
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
     * Gets the main renderer that the engine is utilizing.
     * @returns The engine's main renderer.
     */
    public static get renderer(): IRenderer {
        return Engine._renderer;
    }

    /**
     * Begins the engine startup process.
     * @param theGame The game class which should be instantiated when the game config is ready.
     */
    public static start(theGame: GameConstructor): void {
        if (Engine._state !== EngineState.IDLE) {
            throw new Error("Something tried to start the Engine while it was already running. This should not happen, and likely indicates a critical issue.")
        }

        Engine._gameType = theGame;
        Engine._state = EngineState.STARTUP;

        // Retrieve the game container DOM element. This is required for the game to run.
        const displayContainer = document.getElementById("gameContainer");
        if (displayContainer === null) {
            throw new Error("Failed to retrieve element with ID gameContainer from the DOM. This is required for the engine to build itself within.")
        }

        Engine._displayContainer = displayContainer;

        // Load the core game config.
        // If this fails to load, the game will not run.
        PIXI.Loader.shared.add([Engine._gameConfigPath]).load(Engine.onGameConfigLoaded.bind(this));
    }

    /**
     * The main tick loop, updating all registered tickers and requesting the next tick from the browser.
     */
    private static tick(): void {
        const deltaTime = (Date.now() - Engine._lastUpdateTime) / 1000;

        Engine._game.update(deltaTime);
        Engine._renderer.update(deltaTime);

        Engine._lastUpdateTime = Date.now();
        requestAnimationFrame(Engine.tick);
    }

    /**
     * Callback for when the core game config has been loaded by the engine. This stands up the
     * registered game class if it has been registered yet.
     * @param loader The loader which handled loading the game config.
     * @param loadedResources The raw loaded resources.
     */
    private static onGameConfigLoaded(loader: PIXI.Loader, loadedResources: Dictionary<any>): void {
        const gameConfig = loadedResources[Engine._gameConfigPath].data;
        Engine._gameConfig = gameConfig;
        Engine._renderer = new PIXIRenderer([], gameConfig.renderer);

        // Now that we have the core game config, enter the loading stage and load the configured required assets.
        Engine._state = EngineState.LOADING;
        AssetLoader.onAssetGroupLoaded.subscribe(Engine, Engine.startGame);
        AssetLoader.loadAssets(gameConfig.assets);
    }

    /**
     * Starts the actual game. This is only called once all necessary game assets are done loading.
     */
    private static startGame() {

        // Stand up the game which was passed into the engine start call.
        Engine._game = new Engine._gameType(Engine._gameConfig.gameData);

        // Begin the update cycle.
        Engine._state = EngineState.RUNNING;
        Engine._lastUpdateTime = Date.now();
        Engine.tick();
    }
}