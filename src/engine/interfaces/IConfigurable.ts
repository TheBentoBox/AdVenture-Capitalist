/**
 * Represents an object which is configurable via a data type. The standard pattern for Class is to
 * create a ClassData type defining its config schema to pass in as the generic value.
 */
export interface IConfigurable<T> {

    /**
     * Configures this object from the given data.
     * @param data The data to configure from.
     * @returns The object after it has been configured.
     */
    configure(data: T): IConfigurable<T>;
}