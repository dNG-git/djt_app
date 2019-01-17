/**
 * direct JavaScript Toolbox
 * All-in-one toolbox to provide more reusable JavaScript features
 *
 * (C) direct Netware Group - All rights reserved
 * https://www.direct-netware.de/redirect?djt;app
 *
 * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/.
 *
 * https://www.direct-netware.de/redirect?licenses;mpl2
 *
 * @license Mozilla Public License, v. 2.0
 */

import localforage from 'localforage';

import { AbstractExecutable } from './abstract-executable';
import { Exception } from './exception';
import { Driver as MemoryKeyValueStoreDriver } from './memory-key-value-store/driver';

/**
 * "AbstractApp" provides a generic structure for state aware applications.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export abstract class AbstractApp implements AbstractExecutable {
    /**
     * Storage implementation instance used in this app.
     *
     * @since v1.0.0
     */
    // tslint:disable-next-line:no-any
    protected _storage: any;

    /**
     * Initializes the storage instance used for this app.
     *
     * @since v1.0.0
     */
    protected initializeStorage() {
        if (this._storage === undefined) {
            localforage.defineDriver(new MemoryKeyValueStoreDriver());
        }

        this._storage = localforage.createInstance({ driver: [
            localforage.INDEXEDDB,
            localforage.LOCALSTORAGE,
            'MemoryKeyValueStore'
        ] });
    }

    /**
     * Returns the corresponding class of the calling instance.
     *
     * @return Class object
     * @since  v1.0.0
     */
    protected get instanceClass() {
        return Object.getPrototypeOf(this).constructor;
    }

    /**
     * Returns the storage implementation instance used in this app.
     *
     * @return Storage instance
     * @since  v1.0.0
     */
    public get storage() {
        if (!this._storage) {
            this.initializeStorage();
        }

        return this._storage;
    }

    /**
     * Sets the storage implementation instance used in this app.
     *
     * @param storageInstance Storage instance
     *
     * @since v1.0.0
     */
    public set storage(storageInstance) {
        this._storage = storageInstance;
    }

    /**
     * Returns the app instance in use.
     *
     * @return App instance
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static getInstance(): any {
        throw new Exception('Not implemented', 'NOT_IMPLEMENTED');
    }
}
