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
  animated: boolean;

  constructor(presentationStyle: ScreenPresentationStyle, animated?: boolean) {
    this.presentationStyle = presentationStyle;
    this.animated = animated === undefined ? true : animated;
  }
}
