import { Platform } from '../react';

import {
    MobileBrowserPage
} from '../../unsupported-browser';

/**
 * Array of rules defining whether we should intercept component to render
 * or not.
 *
 * @type {Array<Function>}
 * @param {Object} state - Redux state object.
 * @returns {ReactElement|void}
 */
const RULES = [

    /**
     * This rule describes case when user opens application using mobile
     * browser. In order to promote the app, we choose to suggest the mobile
     * app even if the browser supports the app (e.g. Google Chrome with
     * WebRTC support on Android).
     *
     * @param {Object} state - Object containing Redux state.
     * @returns {MobileBrowserPage|void} If the rule is satisfied then
     * we should intercept existing component by MobileBrowserPage.
     */
    state => {
        const OS = Platform.OS;
        const { mobileBrowserPageIsShown }
        = state['features/unsupported-browser'];

        if ((OS === 'android' || OS === 'ios') && !mobileBrowserPageIsShown) {
            return MobileBrowserPage;
        }
    }
];

/**
 * Utility method that responsible for intercepting of route components based on
 * the set of defined rules.
 *
 * @param {Object|Function} stateOrGetState - Either Redux state object or
 * getState() function.
 * @param {ReactElement} currentComponent - Current route component to render.
 * @returns {ReactElement} If any of rules is satisfied returns intercepted
 * component.
 */
export function interceptComponent(stateOrGetState, currentComponent) {
    let result;
    const state
        = typeof stateOrGetState === 'function'
        ? stateOrGetState()
        : stateOrGetState;

    for (const rule of RULES) {
        result = rule(state);

        if (result) {
            break;
        }
    }

    return result || currentComponent;
}
