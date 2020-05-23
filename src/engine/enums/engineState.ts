export enum EngineState {

    /**
     * The engine is currently idle, performing no tick routines. This is the state before the game starts.
     */
    IDLE,

    /**
     * The engine is starting up, creating managers and determining what will be required for the loading stage.
     */
    STARTUP,

    /**
     * The engine is loading, loading and preparing the required assets.
     */
    LOADING,

    /**
     * The engine is currently running, performing the standard game tick loop in full.
     */
    RUNNING,
}