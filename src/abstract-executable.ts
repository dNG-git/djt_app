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

import { Exception } from './exception';

/**
 * "AbstractExecutable" provides a mechanism to execute an loaded module
 * calling a standardized entry point.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export abstract class AbstractExecutable {
    /**
     * Executes the app with the given context.
     *
     * @param context App execution context
     *
     * @since v1.0.0
     */
    public static execute(context: ExecutionContext) {
        if (context instanceof HTMLElement) {
            context = { domElement: context as HTMLElement };
        }

        this._execute(context as ExecutionContextObject);
    }

    /**
     * Called internally to execute the app with the given context.
     *
     * @param _ App execution context
     *
     * @since v1.0.0
     */
    protected static _execute(_?: ExecutionContextObject) {
        throw new Exception('Not implemented', 'NOT_IMPLEMENTED');
    }
}

/**
 * Type definition for "AbstractExecutable.execute()"
 *
 * @since v1.0.0
 */
export type ExecutionContext = HTMLElement | ExecutionContextObject;

/**
 * Interface for "AbstractExecutable.execute()" context object.
 *
 * @since v1.0.0
 */
export interface ExecutionContextObject {
    domElement?: HTMLElement;
    // tslint:disable-next-line:no-any
    caller?: any;
}
