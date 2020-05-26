import { Game } from "../engine/core/game";
import { Level } from "../engine/core/level";
import { VentureBusiness } from "./gameActors/ventureBusiness";
import { VentureBank } from "./gameActors/ventureBank";
import { Engine } from "../engine/core/engine";

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
     * Saves the game's state. Most of the saving is handled by the custom game actors (bank, businesses, etc.),
     * so all this class saves itself is the last time played for simulating time passed on restore.
     */
    public saveGame(): void {
        Engine.localStorage.setValue("LastPlayed", Date.now());
        this._gameArea.root.save();
    }

    /**
     * Restores all objects in this game's level. The bank and business actors should be attached to the level already
     * by the time this is called, which means they're initialized and ready to be restored.
     */
    public restoreGame(): void {
        this._gameArea.root.restore();
    }

    /**
     * Gets the running game instance.
     */
    public static getInstance(): AdVentureCapitalist {
        return AdVentureCapitalist._instance;
    }

    /**
     * Gets the game bank from within the game level.
     */
    public get bank(): VentureBank {
        return this._gameArea.root.children[MainGameActors.BANK] as VentureBank;
    }

    /**
     * Creates the main game area where the buyable objects are displayed.
     */
    private createGameArea(): void {
        this._gameArea = new Level("GameArea", true);

        // Create the bank that will manage the balance.
        const bank = new VentureBank({ name: "mainBank", baseManagerButtonData: this._gameData.baseManagerButtonData, businesses: this._gameData.businesses });
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