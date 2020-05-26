import { Signal } from "../engine/core/signal";
import { VentureBusiness, VentureBusinessData } from "./gameActors/ventureBusiness";

/**
 * Core publicly accessible signals which represent important game events.
 */
export class GameEvent {

    /**
     * Emitted from whenever a business completes one of its business cycles.
     * The emitted value is the business which completed its cycle.
     */
    public static readonly ON_CYCLE_COMPLETE = new Signal<(business: VentureBusiness) => void>();

    /**
     * Emitted from by the bank whenever a manager is purchased.
     */
    public static readonly ON_PURCHASE_MANAGER = new Signal<(businessData: VentureBusinessData) => void>();
}