export enum NoCodesActionType {
    /**
     * Unspecified action type
     */
    UNKNOWN = 'unknown',

    /**
     * URL action that opens the URL using SafariViewController
     */
    URL = 'url',

    /**
     * Deeplink action that opens if Application can open specified deeplink
     */
    DEEPLINK = 'deeplink',

    /**
     * Navigation to another NoCodes screen
     */
    NAVIGATION = 'navigation',

    /**
     * Purchase the product
     */
    PURCHASE = 'purchase',

    /**
     * Restore all purchases
     */
    RESTORE = 'restore',

    /**
     * Close current screen
     */
    CLOSE = 'close',

    /**
     * Close all NoCodes screens
     */
    CLOSE_ALL = 'closeAll',

    /**
     * Internal action for store products loading
     */
    LOAD_PRODUCTS = 'loadProducts',

    /**
     * Internal action that indicates that the screen is ready to be shown
     */
    SHOW_SCREEN = 'showScreen'
}

/**
 * Action performed in the NoCodes
 */
export interface NoCodesAction {
    /**
     * Type of the action
     */
    type: NoCodesActionType;

    /**
     * Parameters for the action
     */
    parameters?: Record<string, any>;
} 