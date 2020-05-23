export abstract class Game {

    /**
     * The loaded game data which should be used to confgiure and run this game.
     */
    protected _gameData: any;

    /**
     * Stands up a new game instance using the loaded game data.
     * @param gameData The gameData from the game config as loaded by the engine.
     */
    public constructor(gameData: any) {
        this._gameData = gameData;
        this.onGameLoad(gameData);
    }

    /**
     * Called when the game is instantiated by the engine.
     * @param gameData The configured game data for this game. What this should contain
     *  is up to each extending game class.
     */
    public abstract onGameLoad(gameData: any): void;
}