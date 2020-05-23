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
    }
}