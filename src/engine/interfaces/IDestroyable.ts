/**
 * The interface for any object which can be destroyed to clean up its references and resources.
 */
export interface IDestroyable {

    /**
     * Cleans up resources associated with this object.
     */
    destroy(): void;
}