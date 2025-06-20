import NoCodesAction from './NoCodesAction';
import NoCodesError from './NoCodesError';

export interface NoCodesListener {
    /**
     * Called when No-Codes screen is shown
     * @param id screen identifier
     */
    onScreenShown: (id: string) => void;

    /**
     * Called when No-Codes starts executing action
     * @param action No-Codes action
     */
    onActionStartedExecuting: (action: NoCodesAction) => void;

    /**
     * Called when No-Codes fails to execute action
     * @param action No-Codes action
     */
    onActionFailedToExecute: (action: NoCodesAction) => void;

    /**
     * Called when No-Codes finishes executing action
     * @param action No-Codes action
     */
    onActionFinishedExecuting: (action: NoCodesAction) => void;

    /**
     * Called when No-Codes flow is finished
     */
    onFinished: () => void;

    /**
     * Called when No-Codes fails to load screen
     * @param error error that occurred
     */
    onScreenFailedToLoad: (error: NoCodesError) => void;
}
