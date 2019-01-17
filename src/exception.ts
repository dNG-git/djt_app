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

/**
 * "Exception" extends the built-in "Error" to support additional error
 * related information.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class Exception extends Error {
    /**
     * Internal exception code used for easier handling
     */
    public code = 'UNDEFINED';

    /**
     * Constructor (Exception)
     *
     * @param message Exception message
     * @param code Internal exception code
     *
     * @since v1.0.0
     */
    constructor(message: string, code?: string) {
        super(message);

        this.code = code;
    }
}
