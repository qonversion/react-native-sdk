import {NoCodesAction, NoCodesActionType} from './NoCodesAction';

export interface NoCodesListener {
    /**
     * Called when NoCodes screen is shown
     * @param id screen identifier
     */
    noCodesHasShownScreen: (id: string) => void;

    /**
     * Called when NoCodes starts executing action
     * @param action NoCodes action
     */
    noCodesStartsExecuting: (action: NoCodesAction) => void;

    /**
     * Called when NoCodes fails to execute action
     * @param action NoCodes action
     * @param error error that occurred
     */
    noCodesFailedToExecute: (action: NoCodesAction, error: string) => void;

    /**
     * Called when NoCodes finishes executing action
     * @param action NoCodes action
     */
    noCodesFinishedExecuting: (action: NoCodesAction) => void;

    /**
     * Called when NoCodes flow is finished
     */
    noCodesFinished: () => void;

    /**
     * Called when NoCodes fails to load screen
     * @param error error that occurred
     */
    noCodesFailedToLoadScreen: (error: string) => void;
}

export const mapNoCodesAction = (type: string, value?: Record<string, any>): NoCodesAction => {
    return {
        type: type as NoCodesActionType,
        parameters: value
    };
};
