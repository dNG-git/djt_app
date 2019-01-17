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

import { Exception } from '../exception';

/**
 * "Implementation" provides an simple mechanism to store singletons and
 * other values in memory.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class Implementation {
    /**
     * Static object to store singletons and other object instances.
     */
    // tslint:disable-next-line:no-any
    protected static _instances: any = { };

    /**
     * Drop all instances stored in memory.
     *
     * @return Instance stored
     * @since  v1.0.0
     */
    public static clear() {
        this._instances.clear();
    }

    /**
     * Returns the instance for the given key.
     *
     * @param key Key used for identification
     *
     * @return Instance stored
     * @since  v1.0.0
     */
    public static get(key: string) {
        if (!this.isSet(key)) {
            throw new Exception(`The key '${key}' given is invalid`, 'KEY_INVALID');
        }

        return this._instances[key];
    }

    /**
     * Returns the keys for the memory instances known.
     *
     * @return Array of keys
     * @since  v1.0.0
     */
    public static getKeys() {
        return Object.keys(this._instances);
    }

    /**
     * Returns true if the store is empty.
     *
     * @return True if empty
     * @since  v1.0.0
     */
    public static isEmpty() {
        return (Object.keys(this._instances).length == 0);
    }

    /**
     * Returns true if the given key is known.
     *
     * @param key Key used for identification
     *
     * @return True if given key is set
     * @since  v1.0.0
     */
    public static isSet(key: string) {
        return (key in this._instances);
    }

    /**
     * Sets the instance for the given key.
     *
     * @param key Key used for identification
     * @param {instance} Instance to be stored
     *
     * @since  v1.0.0
     */
    // tslint:disable-next-line:no-any
    public static set(key: string, instance: any) {
        if (instance === null || instance === undefined) {
            this.unset(key);
        } else {
            this._instances[key] = instance;
        }
    }

    /**
     * Removes the instance identified by the given key.
     *
     * @param key Key used for identification
     *
     * @since  v1.0.0
     */
    public static unset(key: string) {
        if (key in this._instances) {
            delete(this._instances[key]);
        }
    }
}
