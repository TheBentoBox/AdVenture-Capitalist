import { ITickable } from "../interfaces/ITickable";

export abstract class Game implements ITickable {

    /**
     * The loaded game data which should be used to confgiure and run this game.
     */
    protected _gameData: any;

    /**
     * Whether or not the game is currently active.
     */
    public isActive: boolean;

    /**
     * Stands up a new game instance using the loaded game data.
     * @param gameData The gameData from the game config as loaded by the engine.
     */
    public constructor(gameData: any) {
        this._gameData = gameData;
        this.isActive = true;
    }

    /**
     * Performs update routines on the operating game class.
     * @param deltaTime The time that has passed since the last tick
     */
    public abstract update(deltaTime: number): void;
}