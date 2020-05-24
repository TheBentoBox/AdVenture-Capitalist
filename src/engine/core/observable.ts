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
     * Indicates whether the value of this observable is numeric. If false, .adjust()
     * calls on the observable will throw an error.
     */
    public readonly isNumeric: boolean;

    /**
     * Constructs an observable with the given initial value.
     * @param initialValue The initial value to set the observable to.
     */
    public constructor(initialValue?: T) {
        this._onValueChanged = new Signal();
        this.isNumeric = (typeof initialValue === "number");

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
     * Sets the value of this observable, informing subscribers of the value changed.
     * @param newValue The new value of this observable.
     */
    public setValue(newValue: T): void {
        this._value = newValue;
        this._onValueChanged.emit(this._value);
    }

    /**
     * Adjusts this observable's value. This will error if the observable's value isn't numeric.
     * @param amount The amount to add to the observable's value.
     */
    public adjust(amount: number): void {
        if (!this.isNumeric) {
            throw new Error("Tried to add to a non-numeric observable.");
        }
        this.setValue((Number(this._value) + amount) as unknown as T);
    }

    /**
     * Subscribes to changes to this observable's value. The callback will immediately be called once
     * with the current value of the observable.
     * @param listener The object that will be listening to this observable.
     * @param callback The callback to call when the observed value changes.
     */
    public subscribe(listener: any, callback: Function): void {
        this._onValueChanged.subscribe(listener, callback);
        callback(this._value);
    }

    /**
     * Unsubscribes the object from changes to this observable's value.
     * @param listener The object that should stop listening to this observable.
     */
    public unsubscribe(listener: any): void {
        this._onValueChanged.unsubscribe(listener);
    }
}