import { Signal } from "../engine/core/signal";
import { VentureBusiness } from "./gameActors/ventureBusiness";

/**
 * Core publicly accessible signals which represent important game events.
 */
export class GameEvent {

    /**
     * Emitted from whenever a business completes one of its business cycles.
     * The emitted value is the business which completed its cycle.
     */
    public static readonly CYCLE_COMPLETE = new Signal<(business: VentureBusiness) => void>();

    /**
     * Emitted from whenever the main bank's balance is adjusted.
     * The emitted values are the amount the balance was adjusted by and the resulting new balance.
     */
    public static readonly BALANCE_ADJUSTED = new Signal<(amount: number, newBalance: number) => void>();
}