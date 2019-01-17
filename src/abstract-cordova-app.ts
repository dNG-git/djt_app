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

import PromisedRequire from 'djt-promised-require';
import { AbstractHtmlApp } from './abstract-html-app';

/**
 * "AbstractCordovaApp" provides a generic structure for state aware
 * Cordova based applications.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export abstract class AbstractCordovaApp extends AbstractHtmlApp {
    /**
     * Constructor (AbstractCordovaApp)
     *
     * @param appRootElement Root element used for app execution
     *
     * @since v1.0.0
     */
    constructor(appRootElement?: HTMLElement) {
        super(appRootElement);

        this.onDeviceReady = this.onDeviceReady.bind(this);
    }

    /**
     * Called to initialize Cordova.
     *
     * @return Promise for initializing Cordova
     * @since  v1.0.0
     */
    public initialize() {
        self.document.addEventListener('deviceready', this.onDeviceReady);

        return PromisedRequire.require('cordova');
    }

    /**
     * Called for Cordova event "deviceready".
     *
     * @since v1.0.0
     */
    public abstract onDeviceReady(): void;
}
