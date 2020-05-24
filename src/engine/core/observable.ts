import { Signal } from "./signal";

/**
 * A wrapper for a basic field value which can be observed for change.
 */
export class Observable<T> {

    /**
     * The raw internal value.
     */
    private _value!: T;

    /**
     * The signal emitted from when the internal value changes.
     */
    private _onValueChanged: Signal;

    /**
     * Constructs an observable with the given initial value.
     * @param initialValue The initial value to set the observable to.
     */
    public constructor(initialValue?: T) {
        this._onValueChanged = new Signal();
        if (initialValue !== undefined) {
            this.setValue(initialValue);
        }
    }

    /**
     * Retrieves the current value of this observable.
     */
    public getValue(): T {
        return this._value;
    }

    /**
     * Sets the new internal value, informing observers of the value changed.
     * @param newValue The new value of this observable.
     */
    public setValue(newValue: T): void {
        this._value = newValue;
        this._onValueChanged.emit(this._value);
    }


    /**
     * Wrapper for subscribing to the observable so that subscribers can immediately be notified
     * of the current value of the observable.
     * @param listener The object that will be listening to this observable.
     * @param callback The callback to call when the observed value changes.
     */
    public subscribe(listener: any, callback: Function): void {
        this._onValueChanged.subscribe(listener, callback);
        callback(this._value);
    }

    /**
     * Wrapper for unsubscribing to the private observable.
     * @param listener The object that will be listening to this observable.
     */
    public unsubscribe(listener: any): void {
        this._onValueChanged.unsubscribe(listener);
    }
}