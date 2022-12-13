import ActionResult from "./ActionResult";

export interface AutomationsDelegate {

  /**
   * Called when Automations' screen is shown.
   * @param screenId shown screen id.
   */
  automationsDidShowScreen(screenId: string): void;

  /**
   * Called when Automations flow starts executing an action.
   * @param actionResult action that is being executed.
   */
  automationsDidStartExecuting(actionResult: ActionResult): void;

  /**
   * Called when Automations flow fails executing an action.
   * @param actionResult failed action.
   */
  automationsDidFailExecuting(actionResult: ActionResult): void;

  /**
   * Called when Automations flow finishes executing an action.
   * @param actionResult executed action.
   *                     For instance, if the user made a purchase then action.type = ActionResultType.purchase.
   *                     You can use the {@link QonversionApi.checkEntitlements} method to get available permissions.
   */
  automationsDidFinishExecuting(actionResult: ActionResult): void;

  /**
   * Called when Automations flow is finished and the Automations screen is closed
   */
  automationsFinished(): void;
}
