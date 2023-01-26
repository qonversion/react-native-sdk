import {ScreenPresentationStyle} from './enums';

export class ScreenPresentationConfig {
  /**
   * Describes how screens will be displayed.
   * For mode details see the enum description.
   */
  presentationStyle: ScreenPresentationStyle;

  /**
   * iOS only. Ignored on Android.
   *
   * Describes whether should transaction be animated or not.
   * Default value is true.
   */
  animate: boolean;

  constructor(presentationStyle: ScreenPresentationStyle, animate?: boolean) {
    this.presentationStyle = presentationStyle;
    this.animate = animate === undefined ? true : animate;
  }
}
