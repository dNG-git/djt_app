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

import { AbstractApp } from './abstract-app';

/**
 * "AbstractHtmlApp" provides a generic structure for state aware plain
 * (X)HTML5 based applications.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export abstract class AbstractHtmlApp extends AbstractApp {
    /**
     * Root (X)HTML5 node for manipulation
     */
    protected appRootElement: HTMLElement;

    /**
     * Constructor (AbstractHtmlApp)
     *
     * @param appRootElement Root element used for app execution
     *
     * @since v1.0.0
     */
    constructor(appRootElement?: HTMLElement) {
        super();

        this.appRootElement = appRootElement;
    }
}
