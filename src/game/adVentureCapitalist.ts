import { Game } from "../engine/core/game";
import { Level } from "../engine/core/level";
import { VentureBusiness } from "./gameActors/ventureBusiness";
import { TextComponent } from "../engine/components/display/textComponent";

/**
 * A recreation of the popular AdVenture Capitalist web game.
 */
export class AdVentureCapitalist extends Game {

    private _balance: number;

    /**
     * The game area level where buyable objects are displayed.
     */
    private _gameArea!: Level;

    /**
     * The currency formatted which the game will used to display currencies.
     */
    public static currencyFormatter: Intl.NumberFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

    /**
     * Creates a new AdVenture Capitalist game.
     * @param gameData The data loaded from the game config associated with this game.
     */
    public constructor(gameData: any) {
        super(gameData);
        this._balance = 0;
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
        this._gameArea.root.addDisplayComponent(new TextComponent("currentBalance", { text: "$0.00", style: { fontSize: "24pt" } }))

        // Create the business objects for each configured business.
        for (let i = 0; i < this._gameData.businesses.length; ++i) {
            const business = this._gameData.businesses[i];

            // Create the actor which will represent this buyable object.
            const businessInstance = new VentureBusiness(business.name, business.image, business.baseCost, business.baseProfit, business.baseCycleDuration);
            businessInstance.transform.position.x = 100;
            businessInstance.transform.position.y = 100 + (i * 130);

            businessInstance.onCycleComplete.subscribe(this, this.onBusinessCycleComplete.bind(this));

            // Add it to the game area level.
            this._gameArea.root.addChild(businessInstance);
        }
    }

    private onBusinessCycleComplete(business: VentureBusiness): void {
        this._balance += (business.baseProfit * business.amountOwned.getValue());
        (this._gameArea.root.displayComponents["currentBalance"] as TextComponent).setText(AdVentureCapitalist.currencyFormatter.format(this._balance));
    }
}