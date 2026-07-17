import { NoCodesScreenVariableKind } from './enums';

/**
 * A typed default variable of a No-Codes screen, configured in the builder and delivered
 * at screen load so it can be read by key. The value keeps its authored type
 * (boolean / string / number) rather than being coerced to a string.
 */
export class NoCodesScreenVariable {
  /**
   * What the variable represents — see {@link NoCodesScreenVariableKind}.
   */
  kind: NoCodesScreenVariableKind;

  /**
   * Variable name it is addressed by (`variable.<key>` in the builder for custom
   * variables, the slot name for product slots). May contain spaces.
   */
  key: string;

  /**
   * Authored value type: `"boolean"`, `"string"` or `"number"`.
   */
  type: string;

  /**
   * The configured default value, preserving its native type.
   * Null when no default value was authored.
   */
  value: boolean | string | number | null;

  /**
   * The value rendered as a plain string regardless of its native type: `"true"`/`"false"`
   * for booleans, the string itself, a number without a trailing `.0` when integral,
   * or an empty string when no value was authored.
   */
  stringValue: string;

  constructor(
    kind: NoCodesScreenVariableKind,
    key: string,
    type: string,
    value: boolean | string | number | null,
    stringValue: string
  ) {
    this.kind = kind;
    this.key = key;
    this.type = type;
    this.value = value;
    this.stringValue = stringValue;
  }
}

/**
 * A loaded No-Codes screen returned from {@link NoCodesApi.loadScreen}.
 *
 * Exposes the screen identifiers and the typed default variables configured in the builder —
 * the screen content stays internal, as rendering remains the SDK's job via
 * {@link NoCodesApi.showScreen}.
 */
class NoCodesScreen {
  /**
   * Identifier of the screen.
   */
  id: string;

  /**
   * The context key of the screen set in the No-Codes builder.
   */
  contextKey: string;

  /**
   * The Qonversion product id selected by default when the screen opens (the builder's
   * Default Product), or undefined when none is configured.
   */
  defaultSelectedProductId: string | undefined;

  /**
   * Typed default variables of the screen configured in the builder: authored custom
   * variables and product slots. Read them by {@link NoCodesScreenVariable.key} (may be empty).
   */
  defaultVariables: NoCodesScreenVariable[];

  constructor(
    id: string,
    contextKey: string,
    defaultSelectedProductId: string | undefined,
    defaultVariables: NoCodesScreenVariable[]
  ) {
    this.id = id;
    this.contextKey = contextKey;
    this.defaultSelectedProductId = defaultSelectedProductId;
    this.defaultVariables = defaultVariables;
  }

  /**
   * Returns the default variable configured under the given key, or undefined when the screen
   * has no variable with that exact (case-sensitive) key.
   *
   * Keys are only unique within a kind — a custom variable and a product slot may share a
   * name — so pass `kind` to disambiguate; without it the first match in payload order
   * (custom variables, then product slots, then the selected product) is returned.
   *
   * For the default selected product prefer {@link defaultSelectedProductId} — it needs no key.
   */
  defaultVariable(
    key: string,
    kind?: NoCodesScreenVariableKind
  ): NoCodesScreenVariable | undefined {
    return this.defaultVariables.find(
      (variable) =>
        variable.key === key && (kind === undefined || variable.kind === kind)
    );
  }
}

export default NoCodesScreen;
