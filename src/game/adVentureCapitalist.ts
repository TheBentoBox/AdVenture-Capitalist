import { Game } from "../engine/core/game";
import { Engine } from "../engine/core/engine";
import { Level } from "../engine/core/level";
import { AssetLoader } from "../engine/core/assetLoader";
import { SpriteComponent } from "../engine/components/display/spriteComponent";

/**
 * A recreation of the popular AdVenture Capitalist web game.
 */
export class AdVentureCapitalist extends Game {

    private _level: Level;

    public constructor(gameData: any) {
        super(gameData);
        this._level = new Level("GameArea", true);

        for (let i = 0; i < gameData.buyables.length; ++i) {
            const buyable = gameData.buyables[i];
            const spriteComponent = new SpriteComponent(buyable.image);
            spriteComponent.transform.position.x = 250;
            spriteComponent.transform.position.y = 250 + (i * 100);
            this._level.root.addDisplayComponent(spriteComponent);
        }
    }

    /**
     * Performs update routines on the game.
     * @param deltaTime The time in seconds since the last update tick.
     */
    public update(deltaTime: number): void {
    }
}