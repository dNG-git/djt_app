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
 * "WorkerController" provides access to and execution of worker instances.
 *
 * @author    direct Netware Group
 * @copyright (C) direct Netware Group - All rights reserved
 * @package   djt-app
 * @since     v1.0.0
 * @license   https://www.direct-netware.de/redirect?licenses;mpl2
 *            Mozilla Public License, v. 2.0
 */
export class WorkerController {
    /**
     * Worker implementation type
     */
    protected implementation: WorkerImplementation;
    /**
     * Worker implementation instance
     */
    // tslint:disable-next-line:no-any
    protected implementationInstance: any;
    /**
     * ServiceWorker setup promise
     */
    protected implementationSetupPromise: Promise<WorkerController>;

    /**
     * Constructor (WorkerController)
     *
     * @param url Worker URL
     * @param scopeOrName Worker scope (and name otherwise)
     * @param workersAccepted Array of worker types supported
     * @param setupTimeout Timeout for the worker setup to finish
     *
     * @since v1.0.0
     */
    // tslint:disable:no-any
    constructor(url: string, scopeOrName?: string, workersAccepted?: WorkerImplementation[], setupTimeout?: number) {
        if (!workersAccepted || workersAccepted.length == 0) {
            workersAccepted = [
                WorkerImplementation.SERVICE_WORKER,
                WorkerImplementation.SHARED_WORKER,
                WorkerImplementation.WORKER
            ];
        }

        if ((!setupTimeout) || setupTimeout < 0) {
            setupTimeout = 120;
        }

        const isServiceWorkerSupported = (
            workersAccepted.includes(WorkerImplementation.SERVICE_WORKER)
            && 'serviceWorker' in self.navigator
        );

        const isSharedWorkerSupported = (
            workersAccepted.includes(WorkerImplementation.SHARED_WORKER)
            && 'SharedWorker' in self
        );

        const isWorkerSupported = (workersAccepted.includes(WorkerImplementation.WORKER) && 'Worker' in self);

        let implementationClass;

        if (isServiceWorkerSupported) {
            this.implementation = WorkerImplementation.SERVICE_WORKER;
        } else if (isSharedWorkerSupported) {
            implementationClass = (self as any).SharedWorker;
            this.implementation = WorkerImplementation.SHARED_WORKER;
        } else if (isWorkerSupported) {
            implementationClass = (self as any).Worker;
            this.implementation = WorkerImplementation.WORKER;
        } else {
            throw new Exception('No supported worker implementation available', 'WORKER_NOT_SUPPORTED');
        }

        let implementationInstance: any;
        const options: any = { };

        if (this.implementation == WorkerImplementation.SERVICE_WORKER) {
            if (scopeOrName) {
                options['scope'] = scopeOrName;
            }

            this.implementationSetupPromise = new Promise(
                async (resolve: (value?: any) => void, reject: (reason?: any) => void) => {
                    const setupTimeoutId = self.setTimeout(
                        () => { reject(new Exception('Timeout occurred', 'WORKER_SETUP_TIMEOUT')); },
                        setupTimeout * 1000
                    );

                    const onServiceWorkerStateChanged = (event: Event) => {
                        let failedDetails: string;
                        let isResolved = false;
                        const serviceWorker: any = event.target;

                        try {
                            this.onServiceWorkerStateChanged(event);

                            if (serviceWorker.state == 'activated') {
                                this.implementationInstance = self.navigator.serviceWorker.controller;

                                isResolved = true;
                            } else if (serviceWorker.state == 'redundant') {
                                failedDetails = 'Service worker is considered redundant';
                            }
                        } catch (exception) {
                            failedDetails = exception.message;
                        }

                        if (isResolved || failedDetails) {
                            self.clearTimeout(setupTimeoutId);
                        }

                        if (isResolved) {
                            resolve(this);
                        } else if (failedDetails) {
                            reject(new Exception(failedDetails, 'WORKER_SETUP_FAILED'));
                        }
                    };

                    const onServiceWorkerUpdateFound = (event: Event) => {
                        let failedDetails: string;

                        try {
                            this.onServiceWorkerUpdateFound(event);
                        } catch (exception) {
                            failedDetails = exception.message;
                        }

                        self.clearTimeout(setupTimeoutId);

                        if (failedDetails) {
                            reject(new Exception(failedDetails, 'WORKER_UPDATE_FAILED'));
                        } else {
                            resolve(this);
                        }
                    };

                    try {
                        const workerContainer = await self.navigator.serviceWorker.register(url, options);

                        if (workerContainer.active) {
                            implementationInstance = workerContainer.active;
                        } else if (workerContainer.installing) {
                            implementationInstance = workerContainer.installing;
                        } else if (workerContainer.waiting) {
                            implementationInstance = workerContainer.waiting;
                        }

                        if (implementationInstance) {
                            implementationInstance.onstatechange = onServiceWorkerStateChanged;
                            workerContainer.onupdatefound = onServiceWorkerUpdateFound;
                        } else {
                            throw new Exception('Service worker registration failed', 'WORKER_REGISTRATION_FAILED');
                        }
                    } catch (exception) {
                        reject(exception);
                    }
                }
            );
        } else {
            options['credentials'] = 'include';

            if (scopeOrName) {
                options['name'] = scopeOrName;
            }

            implementationInstance = new implementationClass(url, options);

            switch (this.implementation) {
                case WorkerImplementation.SHARED_WORKER:
                    this.implementationInstance = implementationInstance.port;
                    this.implementationInstance.start();

                    this.implementationSetupPromise = Promise.resolve(this);

                    break;
                case WorkerImplementation.WORKER:
                    this.implementationInstance = implementationInstance;

                    this.implementationSetupPromise = Promise.resolve(this);

                    break;
            }
        }
    }
    // tslint:enable:no-any

    /**
     * developer.mozilla.org: The "postMessage" method safely enables cross-origin
     * communication.
     *
     * @since v1.0.0
     */
    public async postMessage(...params: Array<unknown>) {
        await this.implementationSetupPromise;
        this.implementationInstance.postMessage(...params);
    }

    /**
     * developer.mozilla.org: An EventListener property called whenever an event of
     * type "statechange" is fired
     *
     * @param _ Event
     *
     * @since v1.0.0
     */
    public onServiceWorkerStateChanged(_: Event) { /* no-op */ }

    /**
     * developer.mozilla.org: An EventListener property called whenever an event of
     * type "updatefound" is fired; it is fired any time the
     * "ServiceWorkerRegistration.installing" property acquires a new service
     * worker.
     *
     * @param _ Event
     *
     * @since v1.0.0
     */
    public onServiceWorkerUpdateFound(_: Event) { /* no-op */ }

    /**
     * Returns the Promise resolving after a worker instance has been initialized.
     *
     * @return Promise of an initialized worker instance
     * @since  v1.0.0
     */
    public get instance() {
        return this.implementationSetupPromise.then((value: WorkerController) => {
            return value.implementationInstance;
        });
    }

    /**
     * Returns the ServiceWorker setup promise used for this controller instance.
     *
     * @return ServiceWorker setup promise
     * @since  v1.0.0
     */
    public get setupPromise() {
        return this.implementationSetupPromise;
    }
}

/**
 * Enum of worker instance implementations supported
 *
 * @since v1.0.0
 */
export enum WorkerImplementation {
    SERVICE_WORKER,
    SHARED_WORKER,
    WORKER
}
