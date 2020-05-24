import { Game } from "../engine/core/game";
import { Level } from "../engine/core/level";
import { SpriteComponent } from "../engine/components/display/spriteComponent";
import { Actor } from "../engine/core/actor";
import { TextComponent } from "../engine/components/display/textComponent";
import { VentureBusiness } from "./gameActors/ventureBusiness";

/**
 * A recreation of the popular AdVenture Capitalist web game.
 */
export class AdVentureCapitalist extends Game {

    /**
     * The game area level where buyable objects are displayed.
     */
    private _gameArea!: Level;

    /**
     * Creates a new AdVenture Capitalist game.
     * @param gameData The data loaded from the game config associated with this game.
     */
    public constructor(gameData: any) {
        super(gameData);
        this.createGameArea();
    }

    /**
     * Performs update routines on the game.
     * @param deltaTime The time in seconds since the last update tick.
     */
    public update(deltaTime: number): void {
    }

    /**
     * Creates the main game area where the buyable objects are displayed.
     */
    private createGameArea(): void {
        this._gameArea = new Level("GameArea", true);

        // Create the buyable objects for each 
        for (let i = 0; i < this._gameData.buyables.length; ++i) {
            const buyable = this._gameData.buyables[i];

            // Create the actor which will represent this buyable object.
            const business = new VentureBusiness(buyable.image, buyable.baseCost, buyable.baseCycleDuration);
            business.transform.position.x = 100;
            business.transform.position.y = 100 + (i * 130);

            // Add it to the game area level.
            this._gameArea.root.addChild(business);
        }
    }
}