import { Actor, ActorData } from "../../engine/core/actor";
import { Observable } from "../../engine/core/observable";
import { TextComponent, TextFormatMode } from "../../engine/components/display/textComponent";
import { GameEvent } from "../gameEvents";
import { VentureBusiness } from "./ventureBusiness";

/**
 * The various purchase modes for business in the venture bank.
 */
export enum PurchaseMode {
    ONE = 1,
    TEN = 10,
    HUNDRED = 100,
    MAX = -1,
}

/**
 * A "bank" actor used to store currency and control purchasing with various display states.
 */
export class VentureBank extends Actor {

    /**
     * The internal balance.
     */
    public readonly balance: Observable<number>;

    /**
     * The current purchase mode of the game. Used to modify how many units of a business are purchased at once.
     */
    public readonly purchaseMode: Observable<PurchaseMode>;

    /**
     * The current global profit multiplier.
     */
    public readonly globalProfitMultiplier: Observable<number>;

    /**
     * Instantiates a new bank with the given name.
     * @param actorData The data associated with this bank.
     */
    public constructor(actorData: ActorData) {
        super(actorData);
        this.purchaseMode = new Observable<PurchaseMode>(PurchaseMode.ONE);
        this.globalProfitMultiplier = new Observable<number>(1);
        this.balance = new Observable<number>(0);

        // Create the text component that will display the balance.
        const balanceText = new TextComponent({ name: "balanceText", text: this.balance, format: TextFormatMode.CURRENCY });
        balanceText.setStyle(new PIXI.TextStyle({
            fill: 0xFFFFFF,
            fontSize: "72px",
            stroke: 0x888888,
            strokeThickness: 7
        }));
        balanceText.transform.position.set(25);
        this.addDisplayComponent(balanceText);

        // Trigger an initial balance update and register business cycle completions to balance updates.
        this.balance.adjust(0);
        GameEvent.CYCLE_COMPLETE.subscribe(this, (business: VentureBusiness) => { this.balance.adjust(business.profit); });
    }
}