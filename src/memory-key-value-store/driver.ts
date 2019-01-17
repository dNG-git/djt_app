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

import { Implementation } from './implementation';

/**
 * "Driver" implements a localForage driver to store data in memory.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class Driver {
    /**
     * Name of the localForage driver
     */
    public _driver: string;

    /**
     * Constructor (Driver)
     *
     * @since v1.0.0
     */
    constructor() {
        this._driver = 'MemoryKeyValueStore';
    }

    /**
     * Initializes the storage
     *
     * @param _: Storage options
     *
     * @since v1.0.0
     */
    public _initStorage(_?: unknown) {
        if (!Implementation.isEmpty()) {
            Implementation.clear();
        }
    }

    /**
     * localforage.github.io: Removes every key from the database, returning it to
     * a blank slate.
     *
     * @since v1.0.0
     */
    public async clear() {
        Implementation.clear();
    }

    /**
     * localforage.github.io: Gets an item from the storage library and supplies
     * the result to a callback.
     *
     * @param key Key used for identification
     *
     * @return Item value; null if not defined
     * @since  v1.0.0
     */
    public async getItem(key: string) {
        return Implementation.get(key);
    }

    /**
     * localforage.github.io: Iterate over all value/key pairs in datastore.
     *
     * @param iteratorCallback Callback
     *
     * @return Callback return value
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public async iterate(iteratorCallback: any): Promise<any> {
        const keys = Implementation.getKeys();
        let returnValue;

        for (let i = 0; i < keys.length; i++) {
            returnValue = iteratorCallback(keys[i], Implementation.get(keys[i]), i);

            if (returnValue !== undefined) {
                break;
            }
        }

        return returnValue;
    }

    /**
     * localforage.github.io: Get the name of a key based on its ID.
     *
     * @param n Position ("ID")
     *
     * @return Key name
     * @since  v1.0.0
     */
    public async key(n: number) {
        return Implementation.getKeys()[n];
    }

    /**
     * localforage.github.io: Get the list of all keys in the datastore.
     *
     * @return Array of keys
     * @since  v1.0.0
     */
    public async keys() {
        return Implementation.getKeys();
    }

    /**
     * localforage.github.io: Gets the number of keys in the offline store (i.e.
     * its "length").
     *
     * @return Number of keys
     * @since  v1.0.0
     */
    public async length() {
        return Implementation.getKeys().length;
    }

    /**
     * localforage.github.io: Removes the value of a key from the offline store.
     *
     * @param key Key used for identification
     *
     * @since v1.0.0
     */
    public async removeItem(key: string) {
        Implementation.unset(key);
    }

    /**
     * localforage.github.io: Saves data to an offline store.
     *
     * @param key Key used for identification
     * @param value Item value
     *
     * @return Item value stored
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public async setItem(key: string, value: any) {
        Implementation.set(key, value);
        return value;
    }
}
