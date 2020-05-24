import { IDestroyable } from "../interfaces/IDestroyable";

type SignalListenerEntry<T> = { listener: any, callback: T };

/**
 * Represents a basic signal which can be used to subscribe to events associated with an object.
 */
export class Signal<T = Function> implements IDestroyable {

    /**
     * The entries, each representing a single subscription to this signal.
     */
    private _listenerEntries: SignalListenerEntry<T>[] | undefined;

    /**
     * Stands up a new signal. The array of entries isn't instantiated until it is needed.
     */
    public constructor() { }

    /**
     * Clears out entry references held by this signal.
     */
    public destroy(): void {
        if (this._listenerEntries !== undefined) {
            this._listenerEntries.length = 0;
            this._listenerEntries = undefined;
        }
    }

    /**
     * Subscribes a new listener to this signal.
     * @param listener The object that will be listening to this signal's emission.
     * @param callback The callback function to run on emit.
     */
    public subscribe(listener: any, callback: T): void {
        if (this._listenerEntries === undefined) {
            this._listenerEntries = [];
        }

        this._listenerEntries.push({ listener, callback });
    }

    /**
     * Removes all callback subscriptions associated with the given listener.
     * @param listener The listener whose subscriptions should be removed.
     */
    public unsubscribe(listener: any): void {
        if (this._listenerEntries === undefined) {
            return;
        }

        for (let i = (this._listenerEntries.length - 1); i >= 0; --i) {
            if (this._listenerEntries[i].listener !== listener) {
                continue;
            }
            this._listenerEntries.splice(i, 1);
        }

        // If removing this listener's subscriptions resulted in an empty entry list,
        // delete the array reference entirely.
        if (this._listenerEntries.length === 0) {
            this._listenerEntries = undefined;
        }
    }

    /**
     * Calls all callbacks subscribed to this signal with the passed value as the argument.
     * @param value The value to pass to the callbacks.
     */
    public emit(value?: any): void {
        if (this._listenerEntries === undefined) {
            return;
        }

        for (const entry of this._listenerEntries) {
            ((entry.callback as unknown) as Function)(value);
        }
    }
}