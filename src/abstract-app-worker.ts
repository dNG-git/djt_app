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
import { WorkerImplementation } from './worker-controller';

/**
 * "AbstractAppWorker" provides a generic structure and is self-registering
 * for events of supported worker implementations once initialized.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export abstract class AbstractAppWorker extends AbstractApp {
    /**
     * Cache ID / version used by the worker
     */
    protected static readonly CACHE_ID = 'v0';

    /**
     * Cache used by the worker
     */
    protected cache: Cache;
    /**
     * Worker implementation type
     */
    protected implementation: WorkerImplementation;

    /**
     * Constructor (AbstractAppWorker)
     *
     * @since v1.0.0
     */
    constructor() {
        super();

        // tslint:disable-next-line:no-any
        const _self: any = self;

        _self.onerror = this.onError.bind(this);

        if ('registration' in _self) {
            this.implementation = WorkerImplementation.SERVICE_WORKER;

            _self.onactivate = this.onActivate.bind(this);
            _self.onfetch = this.onFetch.bind(this);
            _self.oninstall = this.onInstall.bind(this);
            _self.onpush = this.onPush.bind(this);
        } else if ('port' in self) {
            this.implementation = WorkerImplementation.SHARED_WORKER;

            _self.port.onmessage = this.onMessage.bind(this);
            _self.port.onmessageerror = this.onMessageError.bind(this);

            _self.port.start();
        } else {
            this.implementation = WorkerImplementation.WORKER;
        }

        if (this.implementation != WorkerImplementation.SHARED_WORKER) {
            _self.onmessage = this.onMessage.bind(this);
            _self.onmessageerror = this.onMessageError.bind(this);
        }
    }

    /**
     * developer.mozilla.org: The "onactivate" property of the
     * "ServiceWorkerGlobalScope" interface is an event handler fired whenever an
     * activate event occurs (when the service worker activates).
     *
     * @param _ Event
     *
     * @since v1.0.0
     */
    public async onActivate(_: unknown) {
        if (this.implementation == WorkerImplementation.SERVICE_WORKER) {
            if (this.instanceClass.CACHE_ID.match(/^v\d+$/)) {
                const cacheIdVersionNumber = parseInt(this.instanceClass.CACHE_ID.substr(1), 10);

                if (!isNaN(cacheIdVersionNumber)) {
                    for (let i = 0; i < cacheIdVersionNumber; i++) {
                        if (self.caches.has(String(i))) {
                            await self.caches.delete(String(i));
                        }
                    }
                }
            }

            this.cache = await self.caches.open(this.instanceClass.CACHE_ID);
        }
    }

    /**
     * developer.mozilla.org: The "onerror" property of the
     * "ServiceWorkerContainer" interface is an event handler fired whenever an
     * error event occurs in the associated service workers.
     *
     * @param _ Error event
     *
     * @since v1.0.0
     */
    public abstract async onError(_: ErrorEvent): Promise<void>;

    /**
     * developer.mozilla.org: The "onfetch" property of the
     * "ServiceWorkerGlobalScope" interface is an event handler fired whenever a
     * fetch event occurs (usually when the ServiceWorkerGlobalScope.fetch method
     * is called).
     *
     * @param event Event
     *
     * @since v1.0.0
     */
    // tslint:disable-next-line:no-any
    public async onFetch(event: any) {
        const cachedResponse = await caches.match(event.request);
        event.respondWith(cachedResponse ? cachedResponse : fetch(event.request));
    }

    /**
     * developer.mozilla.org: The "oninstall" property of the
     * "ServiceWorkerGlobalScope" interface is an event handler fired whenever an
     * install event occurs (when the service worker installs).
     *
     * @param _ Event
     *
     * @since v1.0.0
     */
    // tslint:disable-next-line:no-any
    public async onInstall(_: any) { /* no-op */ }

    /**
     * developer.mozilla.org: The "onmessage" property of the "Worker" interface
     * represents an EventHandler, that is a function to be called when the message
     * event occurs.
     *
     * @param event Message event
     *
     * @since v1.0.0
     */
    public abstract async onMessage(event: MessageEvent): Promise<void>;

    /**
     * developer.mozilla.org: The "onmessageerror" event handler of the "Worker"
     * interface is an EventListener, called whenever an "MessageEvent" of type
     * "messageerror" is fired on the "Worker" instance.
     *
     * @param event Message event
     *
     * @since v1.0.0
     */
    public async onMessageError(event: MessageEvent) {
        await this.onError(new ErrorEvent(event.data));
    }

    /**
     * developer.mozilla.org: The "onpush" event of the "ServiceWorkerGlobalScope"
     * interface is fired whenever a push message is received by a service worker
     * via a push server.
     *
     * @param _ Push event
     *
     * @since v1.0.0
     */
    // tslint:disable-next-line:no-any
    public async onPush(_: any) { /* no-op */ }
}
