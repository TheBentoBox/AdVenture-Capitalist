import { EngineState } from "../enums/engineState";
import { PIXIRenderer } from "./pixiRenderer";
import { Game } from "./game";
import { Dictionary } from "./types";
import { AssetLoader } from "./assetLoader";
import { IRenderer } from "../interfaces/IRenderer";
import { LocalStrorageHandler } from "./localStorageHandler";

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
     * How frequently the game should save automatically, in seconds.
     * If set to 0 in gameConfig.autoSaveInterval, auto-saving will be disabled.
     */
    private static _autoSaveInterval: number;

    /**
     * How long it has been since the last automatic save, in seconds.
     */
    private static _timeSinceLastAutoSave: number = 0;

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
     * The main local storage handler, instantiated when the game config loads using its gameName field as the key prefix.
     * Other local storage handlers can be instantiated freely to manipulate fields with a different key prefix.
     */
    private static _localStorage: LocalStrorageHandler;

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
     * The main local storage handler, instantiated when the game config loads using its gameName field as the key prefix.
     * Other local storage handlers can be instantiated freely to manipulate fields with a different key prefix.
     * @returns The main local storage handler.
     */
    public static get localStorage(): LocalStrorageHandler {
        return Engine._localStorage;
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

        // Save the game if enough time has passed for an auto-save.
        Engine._timeSinceLastAutoSave += deltaTime;
        if (Engine._autoSaveInterval > 0 && Engine._timeSinceLastAutoSave >= Engine._autoSaveInterval) {
            Engine._game.saveGame();
            Engine._timeSinceLastAutoSave -= Engine._autoSaveInterval;
        }

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

        // Create the local storage handler with the game name as the key prefix, if one was provided.
        Engine._localStorage = new LocalStrorageHandler(`${gameConfig.gameName}:` ?? "");

        // Allow for a configurable auto-save interval, but default to every 60 seconds.
        Engine._autoSaveInterval = (gameConfig.autoSaveInterval ?? 60);

        // Now that we have the core game config, enter the loading stage and load the stage and configured required assets.
        Engine._renderer = new PIXIRenderer([], gameConfig.renderer);
        Engine._state = EngineState.LOADING;
        AssetLoader.onAssetGroupLoaded.subscribe(Engine, Engine.startGame);
        AssetLoader.loadAssets(gameConfig.assets);
    }

    /**
     * Starts the actual game. This is only called once all necessary game assets are done loading.
     */
    private static startGame(): void {

        // Stand up the game which was passed into the engine start call.
        Engine._game = new Engine._gameType(Engine._gameConfig.gameData);

        // Now that the game is created, listen for the unload event to save the game.
        window.addEventListener("beforeunload", Engine.onBeforeUnload);

        // Load all levels.
        for (const level of Engine._renderer.levels) {
            level.root.load();
        }

        // Post-load, try to restore the game state from where it was left off.
        Engine._game.restoreGame();

        // Begin the update cycle.
        Engine._state = EngineState.RUNNING;
        Engine._lastUpdateTime = Date.now();
        Engine.tick();
    }

    /**
     * Called when the tab is being closed to trigger a game save.
     */
    private static onBeforeUnload(): void {
        Engine._game.saveGame();
    }
}