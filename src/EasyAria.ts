import {
  AriaAttributes,
  AriaRoles,
  BooleanOnlyAttributes,
  BooleanSupportedAttributes,
  IDREFAttributes,
  IDREFListAttributes,
} from './types';

/** Values supported by `.set()` for IDREF attributes. */
type IDREFAttributeValue = string | Element | null;
/** Values supported by `.set()` for IDREFList attributes. */
type IDREFListAttributeValue =
  | IDREFAttributeValue
  | Element[]
  | NodeListOf<Element>;

/**
 * A utility class which wraps an HTML Element and exposes methods
 * for manipulating ARIA attributes in a type-safe way.
 */
class EasyAria {
  /** HTML Element wrapped by `EasyAria` object. */
  readonly el: Element;

  constructor(el: Element) {
    this.el = el;
  }

  /** Counter for generating new IDs. */
  static #idCounter = 1;

  /** Generates a unique ID. */
  static #generateId(): string {
    return `easy-aria-id-${this.#idCounter++}`;
  }

  /**
   * Returns the ID of a given Element. If no ID exists,
   * assigns a newly generated ID and returns it.
   */
  static #getId(el: Element): string {
    // Not element, return empty string.
    if (!(el instanceof Element)) return '';

    if (!el.id) {
      // No ID, generate one and assign.
      el.id = EasyAria.#generateId();
    }

    return el.id;
  }

  /**
   * Sets the given `aria-*` attribute on the wrapped Element
   * from the un-prefixed version.
   */
  #setAttr(attribute: keyof AriaAttributes, value: string) {
    this.el.setAttribute(`aria-${attribute}`, value);
  }

  /**
   * @returns The *explicit* role defined on the wrapped Element.
   */
  getRole(): AriaRoles | null {
    return this.el.getAttribute('role');
  }

  /**
   * Sets the `role` attribute on the wrapped Element to the given value.
   *
   * @param role The value to be assigned to the `role` attribute.
   */
  setRole(role: AriaRoles): EasyAria {
    // No arguments passed
    if (!arguments.length) {
      throw new TypeError(
        'EasyAria.setRole() requires 1 argument, but received 0.'
      );
    }
    // Non-string passed
    if (typeof role !== 'string') {
      throw new TypeError('Please specify an ARIA role (e.g., "group").');
    }
    this.el.setAttribute('role', role);
    return this;
  }

  /**
   * Takes a callback function which runs immediately, and is passed the
   * wrapped Element. The callback's return value is discarded, and the `EasyAria`
   * instance is returned.
   *
   * @param callback The callback function which is passed the wrapped Element.
   */
  call(callback: (this: EasyAria, el: Element) => void): EasyAria {
    // No arguments passed
    if (!arguments.length) {
      throw new TypeError(
        'EasyAria.call() requires 1 argument, but received 0.'
      );
    }
    // Non-function passed
    if (typeof callback !== 'function') {
      throw new TypeError('EasyAria.call() requires a function.');
    }
    callback.call(this, this.el);
    return this;
  }

  // ==================== `set()` methods ====================

  /**
   * Sets the given aria attribute with the given value on
   * the wrapped Element.
   *
   * @param attribute The aria attribute to be applied, without the `aria-` prefix.
   * @param value The value to be assigned to the given attribute.
   * If a string, assigns it as the ID reference.
   * If an Element, retrieves its ID first and assigns it.
   */
  set<K extends keyof IDREFAttributes>(
    attribute: K,
    value: IDREFAttributeValue
  ): EasyAria;

  /**
   * Sets the given aria attribute with the given value on
   * the wrapped Element.
   *
   * @param attribute The aria attribute to be applied, without the `aria-` prefix.
   * @param value The value to be assigned to the given attribute.
   * If a string, assigns it as the ID reference list.
   * If an Element, retrieves its ID first and assigns it.
   * If a an array or NodeList of Elements, retrieves their IDs and assigns them
   * as a space-separated string of IDs.
   */
  set<K extends keyof IDREFListAttributes>(
    attribute: K,
    value: IDREFListAttributeValue
  ): EasyAria;

  /**
   * Sets the given aria attribute with the given value on
   * the wrapped Element.
   *
   * @param attribute The aria attribute to be applied, without the `aria-` prefix.
   * @param value The value to be assigned to the given attribute.
   * The value can be omitted if the given attribute accepts a boolean.
   * An empty value defaults to `true`.
   */
  set<K extends keyof BooleanOnlyAttributes>(
    attribute: K,
    value?: BooleanOnlyAttributes[K]
  ): EasyAria;

  /**
   * Sets the given aria attribute with the given value on
   * the wrapped Element.
   *
   * @param attribute The aria attribute to be applied, without the `aria-` prefix.
   * @param value The value to be assigned to the given attribute.
   * The value can be omitted if the given attribute accepts a boolean.
   * An empty value defaults to `true`.
   */
  set<K extends keyof BooleanSupportedAttributes>(
    attribute: K,
    value?: BooleanSupportedAttributes[K]
  ): EasyAria;

  /**
   * Sets the given aria attribute with the given value on
   * the wrapped Element.
   *
   * @param attribute The aria attribute to be applied, without the `aria-` prefix.
   * @param value The value to be assigned to the given attribute.
   */
  set<K extends keyof AriaAttributes>(
    attribute: K,
    value: AriaAttributes[K]
  ): EasyAria;

  // Implementation for `set()`
  set<K extends keyof AriaAttributes>(
    attribute: K,
    value?: AriaAttributes[K]
  ): EasyAria {
    // No arguments passed
    if (!arguments.length) {
      throw new TypeError(
        'EasyAria.set() requires at least 1 argument, but received 0.'
      );
    }
    // Non-string passed
    if (typeof attribute !== 'string') {
      throw new TypeError(
        'Please specify an un-prefixed ARIA 1.2 attribute (e.g., "checked").'
      );
    }

    attribute = attribute.toLowerCase() as K;
    switch (attribute) {
      // Arbitrary string attributes
      case 'keyshortcuts':
      case 'label':
      case 'placeholder':
      case 'roledescription':
      case 'valuetext':
        if (typeof value !== 'string') {
          throw new TypeError(`"aria-${attribute}" requires a string.`);
        }
        this.#setAttr(attribute, String(value));
        break;

      // IDREFAttributes
      case 'activedescendant':
      case 'details':
      case 'errormessage':
        if (value instanceof Element) {
          // `value` is an Element
          this.#setAttr(attribute, EasyAria.#getId(value));
        } else if (typeof value === 'string') {
          // `value` is a string
          this.#setAttr(attribute, value);
        } else {
          throw new TypeError(
            `"aria-${attribute}" requires a string, or pass an Element to use its ID.`
          );
        }
        break;

      // IDREFListAttributes
      case 'controls':
      case 'describedby':
      case 'flowto':
      case 'labelledby':
      case 'owns':
        if (value instanceof Element) {
          // `value` is an Element
          this.#setAttr(attribute, EasyAria.#getId(value));
        } else if (Array.isArray(value) || value instanceof NodeList) {
          // `value` is an array or NodeList of Elements
          this.#setAttr(
            attribute,
            Array.prototype.map
              .call(value, (el: Element) => EasyAria.#getId(el))
              .filter(Boolean)
              .join(' ')
          );
        } else if (typeof value === 'string') {
          // `value` is a string
          this.#setAttr(attribute, value);
        } else {
          throw new TypeError(
            `"aria-${attribute}" requires a string, or pass an Element or Array/NodeList of Elements to use their IDs.`
          );
        }
        break;

      // Boolean only attributes
      case 'atomic':
      case 'busy':
      case 'disabled':
      case 'modal':
      case 'multiline':
      case 'multiselectable':
      case 'readonly':
      case 'required':
        if (typeof value === 'undefined') {
          this.#setAttr(attribute, String(true));
        } else {
          switch (value) {
            case true:
            case false:
              this.#setAttr(attribute, String(value));
              break;
            default:
              throw new TypeError(
                `"aria-${attribute}" requires a boolean value.`
              );
          }
        }
        break;

      // Boolean with tokens
      case 'expanded':
      case 'grabbed':
      case 'hidden':
      case 'selected':
        if (typeof value === 'undefined') {
          // `value` is empty, `true` is inferred
          this.#setAttr(attribute, String(true));
        } else {
          switch (value) {
            case true:
            case false:
              this.#setAttr(attribute, String(value));
              break;
            case 'undefined':
              this.#setAttr(attribute, value);
              break;
            default:
              throw new TypeError(
                `"aria-${attribute}" requires a boolean value, or the string "undefined".`
              );
          }
        }
        break;
      case 'checked':
      case 'pressed':
        if (typeof value === 'undefined') {
          // `value` is empty, `true` is inferred
          this.#setAttr(attribute, String(true));
        } else {
          switch (value) {
            case true:
            case false:
              this.#setAttr(attribute, String(value));
              break;
            case 'mixed':
            case 'undefined':
              this.#setAttr(attribute, value);
              break;
            default:
              throw new TypeError(
                `"aria-${attribute}" requires a boolean value, or any of the following strings: "mixed", "undefined".`
              );
          }
        }
        break;
      case 'current':
        if (typeof value === 'undefined') {
          // `value` is empty, `true` is inferred
          this.#setAttr(attribute, String(true));
        } else {
          switch (value) {
            case true:
            case false:
              this.#setAttr(attribute, String(value));
              break;
            case 'page':
            case 'step':
            case 'location':
            case 'date':
            case 'time':
              this.#setAttr(attribute, value);
              break;
            default:
              throw new TypeError(
                `"aria-${attribute}" requires a boolean value, or any of the following strings: "page", "step", "location", "date", "time".`
              );
          }
        }
        break;
      case 'haspopup':
        if (typeof value === 'undefined') {
          // `value` is empty, `true` is inferred
          this.#setAttr(attribute, String(true));
        } else {
          switch (value) {
            case true:
            case false:
              this.#setAttr(attribute, String(value));
              break;
            case 'menu':
            case 'listbox':
            case 'tree':
            case 'grid':
            case 'dialog':
              this.#setAttr(attribute, value);
              break;
            default:
              throw new TypeError(
                `"aria-${attribute}" requires a boolean value, or any of the following strings: "menu", "listbox", "tree", "grid", "dialog".`
              );
          }
        }
        break;
      case 'invalid':
        if (typeof value === 'undefined') {
          // `value` is empty, `true` is inferred
          this.#setAttr(attribute, String(true));
        } else {
          switch (value) {
            case true:
            case false:
              this.#setAttr(attribute, String(value));
              break;
            case 'grammar':
            case 'spelling':
              this.#setAttr(attribute, value);
              break;
            default:
              throw new TypeError(
                `"aria-${attribute}" requires a boolean value, or any of the following strings: "grammar", "spelling".`
              );
          }
        }
        break;

      // Token string attributes
      case 'autocomplete':
        switch (value) {
          case 'both':
          case 'inline':
          case 'list':
          case 'none':
            this.#setAttr(attribute, value);
            break;
          default:
            throw new TypeError(
              `"aria-${attribute}" only accepts the values specified at: https://www.w3.org/TR/wai-aria-1.2/#aria-${attribute}`
            );
        }
        break;
      case 'dropeffect':
        switch (value) {
          case 'copy':
          case 'execute':
          case 'link':
          case 'move':
          case 'none':
          case 'popup':
            this.#setAttr(attribute, value);
            break;
          default:
            throw new TypeError(
              `"aria-${attribute}" only accepts the values specified at: https://www.w3.org/TR/wai-aria-1.2/#aria-${attribute}`
            );
        }
        break;
      case 'live':
        switch (value) {
          case 'assertive':
          case 'off':
          case 'polite':
            this.#setAttr(attribute, value);
            break;
          default:
            throw new TypeError(
              `"aria-${attribute}" only accepts the values specified at: https://www.w3.org/TR/wai-aria-1.2/#aria-${attribute}`
            );
        }
        break;
      case 'orientation':
        switch (value) {
          case 'horizontal':
          case 'undefined':
          case 'vertical':
            this.#setAttr(attribute, value);
            break;
          default:
            throw new TypeError(
              `"aria-${attribute}" only accepts the values specified at: https://www.w3.org/TR/wai-aria-1.2/#aria-${attribute}`
            );
        }
        break;
      case 'relevant':
        switch (value) {
          case 'additions':
          case 'additions text':
          case 'all':
          case 'removals':
          case 'text':
            this.#setAttr(attribute, value);
            break;
          default:
            throw new TypeError(
              `"aria-${attribute}" only accepts the values specified at: https://www.w3.org/TR/wai-aria-1.2/#aria-${attribute}`
            );
        }
        break;
      case 'sort':
        switch (value) {
          case 'ascending':
          case 'descending':
          case 'none':
          case 'other':
            this.#setAttr(attribute, value);
            break;
          default:
            throw new TypeError(
              `"aria-${attribute}" only accepts the values specified at: https://www.w3.org/TR/wai-aria-1.2/#aria-${attribute}`
            );
        }
        break;

      // Number attributes
      case 'colcount':
      case 'colindex':
      case 'colspan':
      case 'level':
      case 'posinset':
      case 'rowcount':
      case 'rowindex':
      case 'rowspan':
      case 'setsize':
      case 'valuemax':
      case 'valuemin':
      case 'valuenow': {
        // Convert value to number. If result is `NaN`, throw TypeError.
        if (
          typeof value === 'bigint' ||
          typeof value === 'number' ||
          typeof value === 'string'
        ) {
          const num = Number(value);
          if (Number.isNaN(num)) {
            throw new TypeError(
              `"aria-${attribute}" requires a number or numerical string.`
            );
          }
          this.#setAttr(attribute, String(num));
        } else {
          throw new TypeError(
            `"aria-${attribute}" requires a number or numerical string.`
          );
        }
        break;
      }

      // Invalid attribute
      default: {
        // Exhaustive check
        const neverAttribute: never = attribute;
        throw new TypeError(
          `Invalid attribute: "aria-${neverAttribute}". Please specify an un-prefixed ARIA 1.2 attribute (e.g., "checked").`
        );
      }
    }

    return this;
  }

  /**
   * Removes the given aria attribute from the wrapped Element.
   *
   * @param attribute The aria attribute to remove, without the `aria-` prefix.
   */
  unset<K extends keyof AriaAttributes>(attribute: K): EasyAria {
    // No arguments passed
    if (!arguments.length) {
      throw new TypeError(
        'EasyAria.unset() requires 1 argument, but received 0.'
      );
    }
    // Non-string passed
    if (typeof attribute !== 'string') {
      throw new TypeError(
        'Please specify an un-prefixed ARIA 1.2 attribute (e.g., "checked").'
      );
    }

    attribute = attribute.toLowerCase() as K;
    switch (attribute) {
      case 'keyshortcuts':
      case 'label':
      case 'placeholder':
      case 'roledescription':
      case 'valuetext':
      case 'activedescendant':
      case 'details':
      case 'errormessage':
      case 'controls':
      case 'describedby':
      case 'flowto':
      case 'labelledby':
      case 'owns':
      case 'atomic':
      case 'busy':
      case 'disabled':
      case 'modal':
      case 'multiline':
      case 'multiselectable':
      case 'readonly':
      case 'required':
      case 'expanded':
      case 'grabbed':
      case 'hidden':
      case 'selected':
      case 'checked':
      case 'current':
      case 'haspopup':
      case 'invalid':
      case 'pressed':
      case 'autocomplete':
      case 'dropeffect':
      case 'live':
      case 'orientation':
      case 'relevant':
      case 'sort':
      case 'colcount':
      case 'colindex':
      case 'colspan':
      case 'level':
      case 'posinset':
      case 'rowcount':
      case 'rowindex':
      case 'rowspan':
      case 'setsize':
      case 'valuemax':
      case 'valuemin':
      case 'valuenow':
        this.el.removeAttribute(`aria-${attribute}`);
        break;
      // Invalid attribute
      default: {
        // Exhaustive check
        const neverAttribute: never = attribute;
        throw new TypeError(
          `Invalid attribute: "aria-${neverAttribute}". Please specify an un-prefixed ARIA 1.2 attribute (e.g., "checked").`
        );
      }
    }
    return this;
  }

  // ==================== `get()` methods ====================

  /**
   * Retrieves the value of the given aria attribute on the wrapped Element.
   *
   * @param attribute The aria attribute (without the `aria-` prefix) whose value to return.
   */
  get<K extends keyof (IDREFAttributes & IDREFListAttributes)>(
    attribute: K
  ): string | null;

  /**
   * Retrieves the value of the given aria attribute on the wrapped Element.
   *
   * @param attribute The aria attribute (without the `aria-` prefix) whose value to return.
   */
  get<K extends keyof AriaAttributes>(attribute: K): AriaAttributes[K] | null;

  // Implementation for `get()`
  get<K extends keyof AriaAttributes>(attribute: K): unknown {
    // No arguments passed
    if (!arguments.length) {
      throw new TypeError(
        'EasyAria.get() requires 1 argument, but received 0.'
      );
    }
    // Non-string passed
    if (typeof attribute !== 'string') {
      throw new TypeError(
        'Please specify an un-prefixed ARIA 1.2 attribute (e.g., "checked").'
      );
    }

    attribute = attribute.toLowerCase() as K;
    // Retrieved attribute value from DOM query
    const value = this.el.getAttribute(`aria-${String(attribute)}`);

    switch (attribute) {
      // IDREF, IDREFList and Arbitrary string attributes
      case 'activedescendant':
      case 'controls':
      case 'describedby':
      case 'details':
      case 'errormessage':
      case 'flowto':
      case 'keyshortcuts':
      case 'label':
      case 'labelledby':
      case 'owns':
      case 'placeholder':
      case 'roledescription':
      case 'valuetext':
        // For these attributes, return the value as is
        return value;

      // Token string attributes
      case 'autocomplete':
        switch (value) {
          case 'both':
          case 'inline':
          case 'list':
          case 'none':
            return value;
        }
        break;
      case 'dropeffect':
        switch (value) {
          case 'copy':
          case 'execute':
          case 'link':
          case 'move':
          case 'none':
          case 'popup':
            return value;
        }
        break;
      case 'live':
        switch (value) {
          case 'assertive':
          case 'off':
          case 'polite':
            return value;
        }
        break;
      case 'orientation':
        switch (value) {
          case 'horizontal':
          case 'undefined':
          case 'vertical':
            return value;
        }
        break;
      case 'relevant':
        switch (value) {
          case 'additions':
          case 'additions text':
          case 'all':
          case 'removals':
          case 'text':
            return value;
        }
        break;
      case 'sort':
        switch (value) {
          case 'ascending':
          case 'descending':
          case 'none':
          case 'other':
            return value;
        }
        break;

      // Boolean with token string attributes
      // Might find a more elegant way to do this
      case 'expanded':
      case 'grabbed':
      case 'hidden':
      case 'selected':
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'undefined':
            return value;
        }
        break;
      case 'checked':
      case 'pressed':
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'mixed':
          case 'undefined':
            return value;
        }
        break;
      case 'current':
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'page':
          case 'step':
          case 'location':
          case 'date':
          case 'time':
            return value;
        }
        break;

      case 'haspopup':
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'menu':
          case 'listbox':
          case 'tree':
          case 'grid':
          case 'dialog':
            return value;
        }
        break;

      case 'invalid':
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
          case 'grammar':
          case 'spelling':
            return value;
        }
        break;

      // Boolean only attributes
      case 'atomic':
      case 'busy':
      case 'disabled':
      case 'modal':
      case 'multiline':
      case 'multiselectable':
      case 'readonly':
      case 'required':
        switch (value) {
          case 'true':
            return true;
          case 'false':
            return false;
        }
        break;

      // Number attributes
      case 'colcount':
      case 'colindex':
      case 'colspan':
      case 'level':
      case 'posinset':
      case 'rowcount':
      case 'rowindex':
      case 'rowspan':
      case 'setsize':
      case 'valuemax':
      case 'valuemin':
      case 'valuenow': {
        // Convert value to number. If result is `NaN`, break.
        // Otherwise return value as numeric.
        const num = Number(value);
        if (!Number.isNaN(num)) {
          return num;
        }
        break;
      }
      default: {
        // Exhaustive check
        const neverAttribute: never = attribute;
        throw new TypeError(
          `Invalid attribute: "aria-${neverAttribute}". Please specify an un-prefixed ARIA 1.2 attribute (e.g., "checked").`
        );
      }
    }
    return null;
  }

  // ================== Convenience methods ==================

  // =============== Setter methods ===============

  /** Sets `aria-checked` to `true`. */
  check(): EasyAria {
    return this.set('checked');
  }

  /** Sets `aria-checked` to `false`. */
  uncheck(): EasyAria {
    return this.set('checked', false);
  }

  /**
   * Toggles the state of `aria-checked` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   */
  toggleChecked(): EasyAria {
    return this.set('checked', !this.isChecked());
  }

  /**
   * Sets `aria-controls` to the given value.
   *
   * @param value A space-separated string of ID references, an Element,
   * or array/NodeList of Elements whose ID(s) to use for the attribute.
   */
  control(value: IDREFListAttributeValue): EasyAria {
    return this.set('controls', value);
  }

  /**
   * Sets `aria-describedby` to the given value.
   *
   * @param value A space-separated string of ID references, an Element,
   * or array/NodeList of Elements whose ID(s) to use for the attribute.
   */
  describeWith(value: IDREFListAttributeValue): EasyAria {
    return this.set('describedby', value);
  }

  /** Sets `aria-disabled` to `true`. */
  disable(): EasyAria {
    return this.set('disabled');
  }

  /** Sets `aria-disabled` to `false`. */
  enable(): EasyAria {
    return this.set('disabled', false);
  }

  /**
   * Toggles the state of `aria-disabled` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   */
  toggleDisabled(): EasyAria {
    return this.set('disabled', !this.isDisabled());
  }

  /** Sets `aria-expanded` to `true`. */
  expand(): EasyAria {
    return this.set('expanded');
  }

  /** Sets `aria-expanded` to `false`. */
  collapse(): EasyAria {
    return this.set('expanded', false);
  }

  /**
   * Toggles the state of `aria-expanded` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   */
  toggleExpanded(): EasyAria {
    return this.set('expanded', !this.isExpanded());
  }

  /**
   * Sets `aria-flowto` to the given value.
   *
   * @param value A space-separated string of ID references, an Element,
   * or array/NodeList of Elements whose ID(s) to use for the attribute.
   */
  flowTo(value: IDREFListAttributeValue): EasyAria {
    return this.set('flowto', value);
  }

  /**
   * Sets `aria-grabbed` to `true`.
   *
   * @deprecated in ARIA 1.1.
   * The `aria-grabbed` state is expected to be replaced by a new feature
   * in a future version of WAI-ARIA. Authors are therefore advised to treat
   * `aria-grabbed` as deprecated.
   */
  grab(): EasyAria {
    return this.set('grabbed');
  }

  /**
   * Sets `aria-grabbed` to `false`.
   *
   * @deprecated in ARIA 1.1.
   * The `aria-grabbed` state is expected to be replaced by a new feature
   * in a future version of WAI-ARIA. Authors are therefore advised to treat
   * `aria-grabbed` as deprecated.
   */
  ungrab(): EasyAria {
    return this.set('grabbed', false);
  }

  /**
   * Toggles the state of `aria-grabbed` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   *
   * @deprecated in ARIA 1.1.
   * The `aria-grabbed` state is expected to be replaced by a new feature
   * in a future version of WAI-ARIA. Authors are therefore advised to treat
   * `aria-grabbed` as deprecated.
   */
  toggleGrabbed(): EasyAria {
    return this.set('grabbed', !this.isGrabbed());
  }

  /** Sets `aria-hidden` to `true`. */
  hide(): EasyAria {
    return this.set('hidden');
  }

  /** Sets `aria-hidden` to `false`. */
  unhide(): EasyAria {
    return this.set('hidden', false);
  }

  /**
   * Toggles the state of `aria-expanded` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   */
  toggleHidden(): EasyAria {
    return this.set('hidden', !this.isHidden());
  }

  /** Sets `aria-label` to the given string. */
  label(value: string): EasyAria {
    return this.set('label', value);
  }

  /**
   * Sets `aria-labelledby` to the given value.
   *
   * @param value A space-separated string of ID references, an Element,
   * or array/NodeList of Elements whose ID(s) to use for the attribute.
   */
  labelWith(value: IDREFListAttributeValue): EasyAria {
    return this.set('labelledby', value);
  }

  /**
   * Sets `aria-owns` to the given value.
   *
   * @param value A space-separated string of ID references, an Element,
   * or array/NodeList of Elements whose ID(s) to use for the attribute.
   */
  own(value: IDREFListAttributeValue): EasyAria {
    return this.set('owns', value);
  }

  /** Sets `aria-pressed` to `true`. */
  press(): EasyAria {
    return this.set('pressed');
  }

  /** Sets `aria-pressed` to `false`. */
  unpress(): EasyAria {
    return this.set('pressed', false);
  }

  /**
   * Toggles the state of `aria-pressed` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   */
  togglePressed(): EasyAria {
    return this.set('pressed', !this.isPressed());
  }

  /** Sets `aria-required` to `true`. */
  require(): EasyAria {
    return this.set('required');
  }

  /** Sets `aria-required` to `false`. */
  unrequire(): EasyAria {
    return this.set('required', false);
  }

  /**
   * Toggles the state of `aria-required` between `true` and `false`.
   */
  toggleRequired(): EasyAria {
    return this.set('required', !this.isRequired());
  }

  /** Sets `aria-roledescription` to the given string. */
  describeRole(value: string): EasyAria {
    return this.set('roledescription', value);
  }

  /** Sets `aria-selected` to `true`. */
  select(): EasyAria {
    return this.set('selected');
  }

  /** Sets `aria-selected` to `false`. */
  unselect(): EasyAria {
    return this.set('selected', false);
  }

  /**
   * Toggles the state of `aria-selected` between `true` and `false`.
   * Sets it to `true` if its current value is neither.
   */
  toggleSelected(): EasyAria {
    return this.set('selected', !this.isSelected());
  }

  // =============== Boolean methods ===============

  /**
   * @returns `true` if `aria-atomic` is set to `true`, otherwise returns `false`.
   */
  isAtomic(): boolean {
    return this.get('atomic') === true;
  }

  /**
   * @returns `true` if `aria-busy` is set to `true`, otherwise returns `false`.
   */
  isBusy(): boolean {
    return this.get('busy') === true;
  }

  /**
   * @returns `true` if `aria-checked` is set to `true`, otherwise returns `false`.
   */
  isChecked(): boolean {
    return this.get('checked') === true;
  }

  /**
   * @param value Any of the tokens supported by `aria-current`, except `true` or `false`.
   * @returns `true` if `aria-current` is set to the given value,
   * or any of its supported values if none is provided, except `false`,
   * in which case it returns `false`.
   */
  isCurrent(value?: 'page' | 'step' | 'location' | 'date' | 'time'): boolean {
    const currentValue = this.get('current');

    if (value) {
      return currentValue === value;
    } else {
      return (
        currentValue === true ||
        currentValue === 'page' ||
        currentValue === 'step' ||
        currentValue === 'location' ||
        currentValue === 'date' ||
        currentValue === 'time'
      );
    }
  }

  /**
   * @returns `true` if `aria-disabled` is set to `true`, otherwise returns `false`.
   */
  isDisabled(): boolean {
    return this.get('disabled') === true;
  }

  /**
   * @returns `true` if `aria-expanded` is set to `true`, otherwise returns `false`.
   */
  isExpanded(): boolean {
    return this.get('expanded') === true;
  }

  /**
   * @returns `true` if `aria-grabbed` is set to `true`, otherwise returns `false`.
   * @deprecated in ARIA 1.1.
   * The `aria-grabbed` state is expected to be replaced by a new feature
   * in a future version of WAI-ARIA. Authors are therefore advised to treat
   * `aria-grabbed` as deprecated.
   */
  isGrabbed(): boolean {
    return this.get('grabbed') === true;
  }

  /**
   * @param value Any of the tokens supported by `aria-haspopup`, except `true` or `false`.
   * @returns `true` if `aria-haspopup` is set to the given value,
   * or any of its supported values if none is provided, except `false`,
   * in which case it returns `false`.
   */
  hasPopup(value?: 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog'): boolean {
    const currentValue = this.get('haspopup');

    if (value) {
      return currentValue === value;
    } else {
      return (
        currentValue === true ||
        currentValue === 'menu' ||
        currentValue === 'listbox' ||
        currentValue === 'tree' ||
        currentValue === 'grid' ||
        currentValue === 'dialog'
      );
    }
  }

  /**
   * @returns `true` if `aria-hidden` is set to `true` only on the wrapped Element.
   * This method does not consider whether an ancestor has `aria-hidden` set to `true`.
   */
  isHidden(): boolean {
    return this.get('hidden') === true;
  }

  /**
   * @param value Any of the tokens supported by `aria-invalid`, except `true` or `false`.
   * @returns `true` if `aria-invalid` is set to the given value,
   * or any of its supported values if none is provided, except `false`,
   * in which case it returns `false`.
   */
  isInvalid(value?: 'grammar' | 'spelling'): boolean {
    const currentValue = this.get('invalid');

    if (value) {
      return currentValue === value;
    } else {
      return (
        currentValue === true ||
        currentValue === 'grammar' ||
        currentValue === 'spelling'
      );
    }
  }

  /**
   * @returns `true` if `aria-modal` is set to `true`, otherwise returns `false`.
   */
  isModal(): boolean {
    return this.get('modal') === true;
  }

  /**
   * @returns `true` if `aria-multiline` is set to `true`, otherwise returns `false`.
   */
  isMultiline(): boolean {
    return this.get('multiline') === true;
  }

  /**
   * @returns `true` if `aria-multiselectable` is set to `true`, otherwise returns `false`.
   */
  isMultiselectable(): boolean {
    return this.get('multiselectable') === true;
  }

  /**
   * @returns `true` if `aria-pressed` is set to `true`, otherwise returns `false`.
   */
  isPressed(): boolean {
    return this.get('pressed') === true;
  }

  /**
   * @returns `true` if `aria-readonly` is set to `true`, otherwise returns `false`.
   */
  isReadonly(): boolean {
    return this.get('readonly') === true;
  }

  /**
   * @returns `true` if `aria-required` is set to `true`, otherwise returns `false`.
   */
  isRequired(): boolean {
    return this.get('required') === true;
  }

  /**
   * @returns `true` if `aria-selected` is set to `true`, otherwise returns `false`.
   */
  isSelected(): boolean {
    return this.get('selected') === true;
  }
}

/**
 * Creates a new `EasyAria` object which wraps the given Element.
 *
 * @param selector A CSS selector or HTML Element.
 * @throws {DOMException} If the syntax of a string selector is invalid.
 * @returns The wrapped Element in an `EasyAria` object, or `null` if the
 * element does not exist.
 */
function aria(selector: Element): EasyAria;

/**
 * Creates a new `EasyAria` object which wraps the given Element.
 *
 * @param selector A CSS selector or HTML Element.
 * @throws {DOMException} If the syntax of a string selector is invalid.
 * @returns The wrapped Element in an `EasyAria` object, or `null` if the
 * element does not exist.
 */
function aria(selector: string | Element | null): EasyAria | null;

/**
 * Creates a new `EasyAria` object which wraps the given Element.
 *
 * @param selector A CSS selector or HTML Element.
 * @throws {DOMException} If the syntax of a string selector is invalid.
 * @returns The wrapped Element in an `EasyAria` object, or `null` if the
 * element does not exist.
 */
function aria(selector: string | Element | null): EasyAria | null {
  if (typeof selector === 'string') {
    // CSS selector
    const el = document.querySelector(selector);
    if (el) {
      return new EasyAria(el);
    }
  } else if (selector instanceof Element) {
    // Concrete element
    return new EasyAria(selector);
  }
  return null;
}

export default aria;
