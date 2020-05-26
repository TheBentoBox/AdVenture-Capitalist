/**
 * Utility class for saving data in the local storage.
 * The handler must be passed a prefix on instantiation that it prefixes all keys with when saving/loading.
 */
export class LocalStrorageHandler {

    /**
     * The string to prepend to each key when saving/retrieving them in local storage.
     */
    protected _keyPrefix: string;

    /**
     * Creates a new local storage handler.
     * The string to prepend to each key when saving/retrieving them in local storage.
     * @param keyPrefix The string to prepend to each key when saving/retrieving them in local storage.
     */
    public constructor(keyPrefix: string) {
        this._keyPrefix = keyPrefix;
    }

    /**
     * Sets the value at the given key in local storage.
     * @param key The key of the item to save. This will be prepended by this handler's key prefix.
     * @param value The value to save under the given key.
     */
    public setValue(key: string, value: any): void {
        localStorage.setItem(`${this._keyPrefix}${key}`, String(value));
    }

    /**
     * Gets the value at the given key in local storage.
     * @param key The key of the item to get.
     * @param defaultValue (Optional) The default value to return if the key returns nothing.
     * @returns The value for the given local storage key, or defaultValue if it wasn't present.
     */
    public getValue(key: string, defaultValue?: any): string | undefined {
        const value = localStorage.getItem(`${this._keyPrefix}${key}`);

        // Treat "NaN" values as falsy since they'll save as strings.
        if (value === null || value === undefined || value === "NaN") {
            return defaultValue;
        } else {
            return value;
        }
    }

    /**
     * Gets the value at the given key in local storage, and parses it as a number before returning it.
     * @param key The key of the item to get.
     * @param defaultValue (Optional) The default value to return if the key returns nothing.
     * @returns The value for the given local storage key, or defaultValue if it wasn't present.
     */
    public getNumber(key: string, defaultValue?: any): number {
        return Number(this.getValue(key, defaultValue));
    }

    /**
     * Gets the value at the given key in local storage, and parses it as a boolean before returning it.
     * @param key The key of the item to get.
     * @param defaultValue (Optional) The default value to return if the key returns nothing.
     * @returns The value for the given local storage key, or defaultValue if it wasn't present.
     */
    public getBoolean(key: string, defaultValue?: any): boolean {
        const value = this.getValue(key, defaultValue);

        // So something cool about JavaScript is that Boolean("false") returns true. Since the string isn't
        // empty it's truthy so it comes back as true. Since we save bools in local storage, work around that.
        if (value === "false") {
            return false;
        } else {
            return Boolean(value);
        }
    }

    /**
     * Deletes the value at the given key in local storage.
     * @param key The key of the item to delete.
     */
    public deleteValue(key: string): void {
        localStorage.removeItem(`${this._keyPrefix}${key}`);
    }
}