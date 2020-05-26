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
}