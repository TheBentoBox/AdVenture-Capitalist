/**
 * Represents an object which can potentially have data about it saved and restored.
 * This traditionally utilizes local storage via {@link Engine.localStorage}.
 * 
 * The engine currently does not make attempts to trigger these automatically on any
 * specific object. It instead calls saveGame() and restoreGame() on the loaded game,
 * and it is the game's responsibility to call save and restore on the appropriate objects.
 */
export interface ISaveable {

    /**
     * Called when the object's data should be saved.
     */
    save(): void;

    /**
     * Called when the object's data should be restored.
     */
    restore(): void;
}