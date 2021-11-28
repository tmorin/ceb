/**
 * A resource which can be removed.
 */
export interface Removable {
    /**
     * Release all stateful stuff.
     */
    remove(): void;
}

/**
 * A resource which can be disposed.
 */
export interface Disposable {
    /**
     * Release all stateful stuff.
     */
    dispose(): Promise<void>;
}
