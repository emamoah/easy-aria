# EasyAria

The easiest (and safest) way to manipulate ARIA attributes in HTML. Based on the W3C [WAI-ARIA 1.2 Specification](https://www.w3.org/TR/wai-aria-1.2/) (published 6 June 2023).

## Installation

### NPM

```bash
npm i easy-aria
```

### Via script tag

```html
<script src="https://unpkg.com/easy-aria/easy-aria.min.js"></script>
```

## How to use

Simply call the `aria()` function with an HTML Element or valid CSS selector, and use the utility methods exposed by the returned object.

Example:

```js
import aria from 'easy-aria';

aria('#menu-btn')?.expand(); // Sets the `aria-expanded` attribute to `true`
```

## Constructor

### `aria(selector)`

The main function which returns a wrapped Element in an `EasyAria` object. The Element can be accessed by the [`.el` property](#el).

#### Arguments

- `selector` - A valid CSS selector or HTML Element. If a selector is given, it is passed to `document.querySelector()` and the result is returned.

#### Return value

- The `EasyAria` instance which wraps the specified HTML Element, `null` if a given selector does not match any element.

#### Example

```js
let ariaToolbar = aria('div#toolbar'); // CSS Selector

let menubar = document.getElementById('#menubar');
let ariaMenubar = aria(menubar); // HTML Element
```

## Instance properties

### `.el`

The HTML Element wrapped in the `EasyAria` object.

#### Example

```js
let button = document.createElement('button');

aria(button).el === button; // true
```

## Main methods

### `.set(attribute, value)`

Sets the given ARIA attribute on the wrapped Element to the given value.

> ℹ️ **NOTE:**
>
> The `attribute` parameter only accepts the _un-prefixed_ versions of all `aria-*` attributes (i.e., `"aria-haspopup"` becomes `"haspopup"`). This is done deliberately to make the code less verbose, as it is clear the context of attributes we want to manipulate.

#### Arguments

- `attribute` - The ARIA attribute to set, without its `"aria-"` prefix.
- `value` - The value to assign to the given ARIA attribute.
  - The `value` argument is fully type-checked, and will only accept values supported by the given ARIA attribute.
  - The `value` argument only accepts the **primitive** equivalent of relevant attribute values (e.g., `aria-level` accepts a `number`; `aria-atomic` accepts a `boolean`; `aria-hidden` accepts either a `boolean`, or the literal string `"undefined"`).
  - For attributes which accept a `boolean` value (e.g., `aria-atomic` or `aria-hidden`), this argument can be omitted. In that case, the implied value is `true`.
  - For attributes which require an _IDREF_ (e.g., `aria-activedescendant`), an HTML `Element` can be passed, as well as an arbitrary `string`. A `null` value does nothing, so the caller can directly pass the result of a `querySelector()` call.
  - For attributes which require a _List of IDREFs_ (e.g., `aria-controls`), the parameter accepts an arbitrary `string`, an `Element`, an `Array<Element>`, `NodeList<Element>`, or `null`. The caller can directly pass the result of a `querySelectorAll()` call.
  - In the case of the above two points, if an element or collection of elements are passed to `value`, their IDs are retrieved and rendered as a string. If any element does not have an ID, one is generated and assigned to it.

#### Return value

- The current `EasyAria` instance.

#### Example

```js
aria(button).set('label', 'Close'); // Sets `aria-label` to `Close`

aria(row).set('selected'); // Sets `aria-selected` to `true`

// <li id="id1" class="listitem">...</li>
// <li id="id2" class="listitem">...</li>
// <li id="id3" class="listitem">...</li>
aria(listbox).set('owns', document.querySelectorAll('.listitem'));
// Sets `aria-owns` to `"id1 id2 id3"`
```

### `.get(attribute)`

Retrieves the given attribute's value from the wrapped Element.

> ℹ️ **NOTE:**
>
> The `attribute` parameter only accepts the _un-prefixed_ versions of all `aria-*` attributes (i.e., `"aria-haspopup"` becomes `"haspopup"`). This is done deliberately to make the code less verbose, as it is clear the context of attributes we want to manipulate.

#### Arguments

- `attribute` - The ARIA attribute whose value to retrieve, without its `"aria-"` prefix.

#### Return value

- The parsed DOM-rendered value of the given attribute on the wrapped Element. Returns `null` if the attribute is not present, or its value is invalid\*.
  - The return value is converted to the **primitive** equivalent of relevant attribute values (e.g., `aria-level` returns a `number`; `aria-atomic` returns a `boolean`; `aria-hidden` returns either a `boolean`, or the literal string `"undefined"`).
  - Currently, attributes which accept _IDREF_ or a _List of IDREFs_ will return their rendered string of ID(s), and not the elements themselves.
  - \* Parsing the DOM value is done strictly. That means, except for attributes which accept arbitrary strings—whose values are returned as is—values are strictly compared with their intended representation, and `null` is returned if they don't match. Hence, no whitespace around token strings is allowed, tokens are case-sensitive, and number values are casted with `Number()`, returning `null` if the result is `NaN`.

#### Example

```js
// <nav aria-label="Site">...</nav>
aria(nav).get('label'); // Returns "Site" (string)

// <tr aria-rowindex="8">...</tr>
aria(tr).get('rowindex'); // Returns 8 (number)

// <button aria-checked="false">...</button>
aria(button).get('checked'); // Returns false (boolean)
```

### `.unset(attribute)`

Removes the given ARIA attribute from the wrapped Element.

> ℹ️ **NOTE:**
>
> The `attribute` parameter only accepts the _un-prefixed_ versions of all `aria-*` attributes (i.e., `"aria-haspopup"` becomes `"haspopup"`). This is done deliberately to make the code less verbose, as it is clear the context of attributes we want to manipulate.

#### Arguments

- `attribute` - The ARIA attribute to remove, without its `"aria-"` prefix.

#### Return value

- The current `EasyAria` instance.

#### Example

```js
// Before: <li id="opt-4" aria-selected="true">...</li>

aria(li).unset('selected');

// After: <li id="opt-4">...</li>
```

### `.setRole(value)`

Sets the `role` atribute on the wrapped Element to the given value.

#### Arguments

- `value` - The value to set for the `role` attribute. Supports full IntelliSense code-completion for all roles in the specification.

#### Return value

- The current `EasyAria` instance.

### `.getRole()`

Returns the value of the `role` attribute on the wrapped Element. It only considers the explicitly defined role attribute, and not the implied role based on element type.

#### Return value

- The value of the `role` attribute as a `string`, or `null` if the attribute is absent.

### `.call(callbackFn)`

Executes the given callback function, passing in the wrapped Element as an argument.

#### Arguments

- `callbackFn` - The callback function to run, which receives the wrapped Element as its argument.<br>You can pass a _function expression_ (i.e., `function(el) {...}`) to have access to `this` as the current `EasyAria` instance.

#### Return value

- The current `EasyAria` instance.

#### Example

```js
aria(button)
  .call(el => (el.dataset.open = true))
  .expand();
```

## Method chaining

The `.set()`, `.setRole()`, `.unset()` and `.call()` methods, as well as all [boolean convenience methods](#boolean-methods) return the current `EasyAria` instance. This allows the caller to chain similar methods for simpler and more readable code.

Example:

```js
aria('input#combo-1')
  ?.control('combo1-popup')
  .set('autocomplete', 'list')
  .set('activedescendant', 'option-1')
  .expand();
```

This set of calls will cause the wrapped element to have the following HTML:

```html
<input
  id="combo-1"
  aria-controls="combo1-popup"
  aria-autocomplete="list"
  aria-activedescendant="option-1"
  aria-expanded="true"
  ...
/>
```

## Convenience methods

The `EasyAria` class provides a set of convenience methods which further make the manipulation of many attributes easier. They are classified into _Setter methods_ and _Boolean methods_.

### Setter methods

These are defined as **verbs**, and call `this.set()` under the hood. Setter methods can be chained, since they return the current instance after manipulation. Most of them require no arguments.

| Method                 | Description                                                                                                         |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `.check()`             | Sets `aria-checked` to `true`.                                                                                      |
| `.uncheck()`           | Sets `aria-checked` to `false`.                                                                                     |
| `.toggleChecked()`     | Toggles the state of `aria-checked` between `true` and `false`. Sets it to `true` if its current value is neither.  |
| `.control(value)`      | Sets `aria-controls` to the given element ID(s). Equivalent to calling `.set('controls', value)`.                   |
| `.describeWith(value)` | Sets `aria-describedby` to the given element ID(s). Equivalent to calling `.set('describedby', value)`.             |
| `.disable()`           | Sets `aria-disabled` to `true`.                                                                                     |
| `.enable()`            | Sets `aria-disabled` to `false`.                                                                                    |
| `.toggleDisabled()`    | Toggles the state of `aria-disabled` between `true` and `false`. Sets it to `true` if its current value is neither. |
| `.expand()`            | Sets `aria-expanded` to `true`.                                                                                     |
| `.collapse()`          | Sets `aria-expanded` to `false`.                                                                                    |
| `.toggleExpanded()`    | Toggles the state of `aria-expanded` between `true` and `false`. Sets it to `true` if its current value is neither. |
| `.flowTo(value)`       | Sets `aria-flowto` to the given element ID(s). Equivalent to calling `.set('flowto', value)`.                       |
| `.grab()`              | Sets `aria-grabbed` to `true`.                                                                                      |
| `.ungrab()`            | Sets `aria-grabbed` to `false`.                                                                                     |
| `.toggleGrabbed()`     | Toggles the state of `aria-grabbed` between `true` and `false`. Sets it to `true` if its current value is neither.  |
| `.hide()`              | Sets `aria-hidden` to `true`.                                                                                       |
| `.unhide()`            | Sets `aria-hidden` to `false`.                                                                                      |
| `.toggleHidden()`      | Toggles the state of `aria-expanded` between `true` and `false`. Sets it to `true` if its current value is neither. |
| `.label(value)`        | Sets `aria-label` to the given string.                                                                              |
| `.labelWith(value)`    | Sets `aria-labelledby` to the given element ID(s). Equivalent to calling `.set('labelledby', value)`.               |
| `.own(value)`          | Sets `aria-owns` to the given element ID(s). Equivalent to calling `.set('owns', value)`.                           |
| `.press()`             | Sets `aria-pressed` to `true`.                                                                                      |
| `.unpress()`           | Sets `aria-pressed` to `false`.                                                                                     |
| `.togglePressed()`     | Toggles the state of `aria-pressed` between `true` and `false`. Sets it to `true` if its current value is neither.  |
| `.require()`           | Sets `aria-required` to `true`.                                                                                     |
| `.unrequire()`         | Sets `aria-required` to `false`.                                                                                    |
| `.toggleRequired()`    | Toggles the state of `aria-required` between `true` and `false`. Sets it to `true` if its current value is neither. |
| `.select()`            | Sets `aria-selected` to `true`.                                                                                     |
| `.unselect()`          | Sets `aria-selected` to `false`.                                                                                    |
| `.toggleSelected()`    | Toggles the state of `aria-selected` between `true` and `false`. Sets it to `true` if its current value is neither. |

### Boolean methods

Each of these methods returns a `boolean` value, indicating if the corresponding attribute has the value `true`, or in a few cases, has a _truthy_ value.

| Method                 | Description                                                                                                                                                                                                                                                                                                                                  |
| ---------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.isAtomic()`          | Returns `true` if `aria-atomic` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                 |
| `.isBusy()`            | Returns `true` if `aria-busy` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                   |
| `.isChecked()`         | Returns `true` if `aria-checked` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                |
| `.isCurrent([value])`  | If a value is given, returns `true` if `aria-current` is equal to that value, and false otherwise. If no value is given, returns `true` if `aria-current` is set to `true`, `page`, `step`, `location`, `date` or `time`.<br>`value` should not be `true`, since it makes more sense to call the method without an argument in that case.    |
| `.isDisabled()`        | Returns `true` if `aria-disabled` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                               |
| `.isExpanded()`        | Returns `true` if `aria-expanded` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                               |
| `.isGrabbed()`         | Returns `true` if `aria-grabbed` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                |
| `.hasPopup([value])`   | If a value is given, returns `true` if `aria-haspopup` is equal to that value, and false otherwise. If no value is given, returns `true` if `aria-haspopup` is set to `true`, `menu`, `listbox`, `tree`, `grid` or `dialog`.<br>`value` should not be `true`, since it makes more sense to call the method without an argument in that case. |
| `.isHidden()`          | Returns `true` if `aria-hidden` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                 |
| `.isInvalid([value])`  | If a value is given, returns `true` if `aria-invalid` is equal to that value, and false otherwise. If no value is given, returns `true` if `aria-invalid` is set to `true`, `grammar` or `spelling`.<br>`value` should not be `true`, since it makes more sense to call the method without an argument in that case.                         |
| `.isModal()`           | Returns `true` if `aria-modal` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                  |
| `.isMultiline()`       | Returns `true` if `aria-multiline` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                              |
| `.isMultiselectable()` | Returns `true` if `aria-multiselectable` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                        |
| `.isPressed()`         | Returns `true` if `aria-pressed` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                                |
| `.isReadonly()`        | Returns `true` if `aria-readonly` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                               |
| `.isRequired()`        | Returns `true` if `aria-required` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                               |
| `.isSelected()`        | Returns `true` if `aria-selected` is set to `true`, otherwise returns `false`.                                                                                                                                                                                                                                                               |

_Currently, `aria-checked="mixed"` and `aria-pressed="mixed"` are treated as falsy._

## Caveat

These methods are provided for the ease of manipulating ARIA attributes on HTML Elements. It does not verify conformance of the product to the ARIA specification. Authors therefore maintain the responsibility of ensuring the right attributes are used for the right ARIA role in order to conform to the specification.

Access the full specification at <https://www.w3.org/TR/wai-aria-1.2/>.

Remember, **_[No ARIA is better than Bad ARIA](https://www.w3.org/WAI/ARIA/apg/practices/read-me-first/#noariaisbetterthanbadaria)_**.

## Author

Emmanuel Amoah (<emma.amoah.jr@gmail.com>)

- LinkedIn: [Emmanuel Amoah](https://www.linkedin.com/in/emamoah)
- Instagram: [@mystery.graphics](https://instagram.com/mystery.graphics)

## License

[The MIT License](https://opensource.org/license/mit/)
