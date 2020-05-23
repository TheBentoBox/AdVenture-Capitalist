/**
 * Represents an objects which is tickable, meaning it can receive updates as part of the engine update cycle.
 */
export interface ITickable {

    /**
     * Represents whether or not this tickable is currently active, allowing it to receive updates.
     */
    isActive: boolean;

    /**
     * Called each update for all registered tickables.
     * @param deltaTime The amount of time that has passed in seconds since the last update tick.
     */
    update(deltaTime: number): void;
}