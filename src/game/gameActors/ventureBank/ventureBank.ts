import { Actor } from "../../../engine/core/actor";
import { Observable } from "../../../engine/core/observable";
import { TextComponent, TextFormatMode } from "../../../engine/components/display/textComponent";
import { GameEvent } from "../../gameEvents";
import { VentureBusiness } from "../ventureBusiness";

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
    private _balance: Observable<number>;

    /**
     * The current purchase mode of the game. Used to modify how many units of a business are purchased at once.
     */
    public purchaseMode: PurchaseMode;

    /**
     * The current global profit multiplier.
     */
    public globalProfitMultiplier: number;

    /**
     * Instantiates a new bank with the given name.
     * @param name The bank to create.
     */
    public constructor(name: string) {
        super(name);
        this.globalProfitMultiplier = 1;
        this.purchaseMode = PurchaseMode.ONE;
        this._balance = new Observable<number>(0);

        // Create the text component that will display the balance.
        const balanceText = new TextComponent("balanceText", { text: this._balance, format: TextFormatMode.CURRENCY });
        this.addDisplayComponent(balanceText);

        // Trigger an initial balance update and register business cycle completions to balance updates.
        this.adjustBalance(0);
        GameEvent.CYCLE_COMPLETE.subscribe(this, (business: VentureBusiness) => { this.adjustBalance(business.profit); });
    }

    /**
     * Adjust the internal balance by the given amount and emits the change as a game event.
     * @param amount The amount to adjust the balance by.  
     */
    public adjustBalance(amount: number): void {
        this._balance.adjust(amount);
        GameEvent.BALANCE_ADJUSTED.emit(amount, this._balance);
    }
}