import { Game } from "../engine/core/game";
import { Level } from "../engine/core/level";
import { VentureBusiness } from "./gameActors/ventureBusiness";
import { VentureBank } from "./gameActors/ventureBank";

/**
 * For internal use within the game class.
 * The names of the main game actors which the game creates on start.
 */
enum MainGameActors {
    BANK = "mainBank"
}

/**
 * A recreation of the popular AdVenture Capitalist web game.
 * This game class follows the singleton pattern.
 */
export class AdVentureCapitalist extends Game {

    /**
     * Gets the main instance of this game.
     */
    private static _instance: AdVentureCapitalist;

    /**
     * The game area level where buyable objects are displayed.
     */
    private _gameArea!: Level;

    /**
     * Creates a new AdVenture Capitalist game.
     * @param gameData The data loaded from the game config associated with this game.
     */
    public constructor(gameData: any) {
        if (AdVentureCapitalist._instance !== undefined) {
            throw new Error("Attempted to create an instance of the game class when one already was made")
        }
        super(gameData);
        AdVentureCapitalist._instance = this;

        this.createGameArea();
    }

    /**
     * Gets the running game instance.
     */
    public static get instance(): AdVentureCapitalist {
        return AdVentureCapitalist._instance;
    }

    /**
     * Gets the game bank from within the game level.
     */
    public get bank(): VentureBank {
        return this._gameArea.root.children[MainGameActors.BANK] as VentureBank;
    }

    /**
     * Performs update routines on the game.
     * @param deltaTime The time in seconds since the last update tick.
     */
    public update(deltaTime: number): void { }

    /**
     * Creates the main game area where the buyable objects are displayed.
     */
    private createGameArea(): void {
        this._gameArea = new Level("GameArea", true);

        // Create the bank that will manage the balance.
        const bank = new VentureBank({ name: "mainBank" });
        this._gameArea.root.addChild(bank);

        const baseBusinessData = this._gameData.baseBusinessData ?? {};

        // Create the business objects for each configured business.
        for (let i = 0; i < this._gameData.businesses.length; ++i) {
            const business = this._gameData.businesses[i];

            // Create the actor which will represent this buyable object.
            const businessInstance = new VentureBusiness({ ...baseBusinessData, ...business });
            businessInstance.transform.position.x = 450 + (Math.floor(i / 5) * 450);
            businessInstance.transform.position.y = 50 + ((i % 5) * 175);

            businessInstance.transform.scale.x = 0.85;
            businessInstance.transform.scale.y = 0.85;

            // Add it to the game area level.
            this._gameArea.root.addChild(businessInstance);
        }
    }
}