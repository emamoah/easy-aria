/** Denotes a reference to the `id` of a single element. */
type idref = { readonly __tag: unique symbol };
/** Denotes a list of {@link idref}s. */
type idref_list = { readonly __tag: unique symbol };

/**
 * {@link https://www.w3.org/TR/wai-aria-1.2/#state_prop_def}
 *
 * All WAI-ARIA 1.2 attributes, without their `aria-` prefix.
 */
export interface AriaAttributes {
  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-activedescendant}
   *
   * Identifies the currently active element when DOM focus is on a `composite` widget, `combobox`, `textbox`, `group`, or `application`.
   */
  activedescendant: idref;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-atomic}
   *
   * Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the `aria-relevant` attribute.
   */
  atomic: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-autocomplete}
   *
   * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for a `combobox`, `searchbox`, or `textbox` and specifies how predictions would be presented if they were made.
   */
  autocomplete: 'inline' | 'list' | 'both' | 'none';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-busy}
   *
   * Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user.
   */
  busy: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-checked}
   *
   * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
   * @see pressed @see selected.
   */
  checked: boolean | 'mixed' | 'undefined';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-colcount}
   *
   * Defines the total number of columns in a `table`, `grid`, or `treegrid`.
   * @see colindex.
   */
  colcount: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-colindex}
   *
   * Defines an element's column index or position with respect to the total number of columns within a `table`, `grid`, or `treegrid`.
   * @see colcount @see colspan.
   */
  colindex: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-colspan}
   *
   * Defines the number of columns spanned by a cell or gridcell within a `table`, `grid`, or `treegrid`.
   * @see colindex @see rowspan.
   */
  colspan: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-controls}
   *
   * Identifies the element (or elements) whose contents or presence are controlled by the current element.
   * @see owns.
   */
  controls: idref_list;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-current}
   *
   * Indicates the element that represents the current item within a container or set of related elements.
   */
  current: boolean | 'page' | 'step' | 'location' | 'date' | 'time';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-describedby}
   *
   * Identifies the element (or elements) that describes the object.
   * @see labelledby.
   */
  describedby: idref_list;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-details}
   *
   * Identifies the element that provides a detailed, extended description for the object.
   * @see describedby.
   */
  details: idref;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-disabled}
   *
   * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
   * @see hidden @see readonly.
   */
  disabled: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-dropeffect}
   *
   * Indicates what functions can be performed when a dragged object is released on the drop target.
   * @deprecated in ARIA 1.1
   */
  dropeffect: 'copy' | 'execute' | 'link' | 'move' | 'none' | 'popup';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-errormessage}
   *
   * Identifies the element that provides an error message for an object.
   * @see invalid @see describedby.
   */
  errormessage: idref;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-expanded}
   *
   * Indicates whether a grouping element owned or controlled by this element is expanded or collapsed.
   */
  expanded: boolean | 'undefined';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-flowto}
   *
   * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion, allows assistive technology to override the general default of reading in document source order.
   */
  flowto: idref_list;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-grabbed}
   *
   * Indicates an element's "grabbed" state in a drag-and-drop operation.
   * @deprecated in ARIA 1.1
   */
  grabbed: boolean | 'undefined';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-haspopup}
   *
   * Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element.
   */
  haspopup: boolean | 'menu' | 'listbox' | 'tree' | 'grid' | 'dialog';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-hidden}
   *
   * Indicates whether the element is exposed to an accessibility API.
   * @see disabled.
   */
  hidden: boolean | 'undefined';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-invalid}
   *
   * Indicates the entered value does not conform to the format expected by the application.
   * @see errormessage.
   */
  invalid: boolean | 'grammar' | 'spelling';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-keyshortcuts}
   *
   * Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element.
   */
  keyshortcuts: string;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-label}
   *
   * Defines a string value that labels the current element.
   * @see labelledby.
   */
  label: string;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-labelledby}
   *
   * Identifies the element (or elements) that labels the current element.
   * @see describedby.
   */
  labelledby: idref_list;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-level}
   *
   * Defines the hierarchical level of an element within a structure.
   */
  level: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-live}
   *
   * Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region.
   */
  live: 'assertive' | 'off' | 'polite';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-modal}
   *
   * Indicates whether an element is modal when displayed.
   */
  modal: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-multiline}
   *
   * Indicates whether a text box accepts multiple lines of input or only a single line.
   */
  multiline: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-multiselectable}
   *
   * Indicates that the user may select more than one item from the current selectable descendants.
   */
  multiselectable: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-orientation}
   *
   * Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous.
   */
  orientation: 'horizontal' | 'undefined' | 'vertical';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-owns}
   *
   * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
   * @see controls.
   */
  owns: idref_list;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-placeholder}
   *
   * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value. A hint could be a sample value or a brief description of the expected format.
   */
  placeholder: string;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-posinset}
   *
   * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see setsize.
   */
  posinset: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-pressed}
   *
   * Indicates the current "pressed" state of toggle buttons.
   * @see checked @see selected.
   */
  pressed: boolean | 'mixed' | 'undefined';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-readonly}
   *
   * Indicates that the element is not editable, but is otherwise operable.
   * @see disabled.
   */
  readonly: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-relevant}
   *
   * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
   * @see atomic.
   */
  relevant: 'additions' | 'additions text' | 'all' | 'removals' | 'text';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-required}
   *
   * Indicates that user input is required on the element before a form may be submitted.
   */
  required: boolean;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-roledescription}
   *
   * Defines a human-readable, author-localized description for the role of an element.
   */
  roledescription: string;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-rowcount}
   *
   * Defines the total number of rows in a `table`, `grid`, or `treegrid`.
   * @see rowindex.
   */
  rowcount: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-rowindex}
   *
   * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
   * @see rowcount @see rowspan.
   */
  rowindex: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-rowspan}
   *
   * Defines the number of rows spanned by a cell or gridcell within a `table`, `grid`, or `treegrid`.
   * @see rowindex @see colspan.
   */
  rowspan: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-selected}
   *
   * Indicates the current "selected" state of various widgets.
   * @see checked @see pressed.
   */
  selected: boolean | 'undefined';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-setsize}
   *
   * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
   * @see posinset.
   */
  setsize: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-sort}
   *
   * Indicates if items in a table or grid are sorted in ascending or descending order.
   */
  sort: 'ascending' | 'descending' | 'none' | 'other';

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-valuemax}
   *
   * Defines the maximum allowed value for a range widget.
   */
  valuemax: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-valuemin}
   *
   * Defines the minimum allowed value for a range widget.
   */
  valuemin: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-valuenow}
   *
   * Defines the current value for a range widget.
   * @see valuetext.
   */
  valuenow: number;

  /**
   * {@link https://www.w3.org/TR/wai-aria-1.2/#aria-valuetext}
   *
   * Defines the human readable text alternative of `aria-valuenow` for a range widget.
   */
  valuetext: string;
}

/** Filters keys from `T` which include `V` possibly in a mixed union type. */
type FilterKeysWithValue<T, V> = {
  [K in keyof T as V extends T[K] ? K : never]: T[K];
};

/**
 * Filters keys from `T` which have `V` as their only type
 * or in a homogeneous union type.
 */
type FilterKeysWithValueStrict<T, V> = {
  [K in keyof T as T[K] extends V ? K : never]: T[K];
};

/** Attributes which accept IDREFs. */
export type IDREFAttributes = FilterKeysWithValue<AriaAttributes, idref>;

/** Attributes which accept a list of IDREFs. */
export type IDREFListAttributes = FilterKeysWithValue<
  AriaAttributes,
  idref_list
>;

/** Attributes which accept booleans. */
export type BooleanSupportedAttributes = FilterKeysWithValue<
  AriaAttributes,
  boolean
>;

/** Attributes which support only boolean values. */
export type BooleanOnlyAttributes = FilterKeysWithValueStrict<
  AriaAttributes,
  boolean
>;

/** Attributes which support both boolean values and string tokens. */
export type BooleanWithTokenAttributes = Omit<
  BooleanSupportedAttributes,
  keyof BooleanOnlyAttributes
>;

/** Attributes which accept arbitrary strings or token strings. */
export type StringAttributes = FilterKeysWithValueStrict<
  AriaAttributes,
  string
>;

/** Attributes which accept arbitrary strings only. */
export type ArbitraryStringAttributes = FilterKeysWithValue<
  AriaAttributes,
  string
>;

/** Attributes which accept only defined token strings. */
export type TokenStringAttributes = Omit<
  StringAttributes,
  keyof ArbitraryStringAttributes
>;

/** Attributes which accept numbers. */
export type NumberAttributes = FilterKeysWithValue<AriaAttributes, number>;

/**
 * {@link https://www.w3.org/TR/wai-aria-1.2/#role_definitions}
 *
 * All WAI-ARIA 1.2 roles.
 */
export type AriaRoles =
  | 'alert'
  | 'alertdialog'
  | 'application'
  | 'article'
  | 'banner'
  | 'blockquote'
  | 'button'
  | 'caption'
  | 'cell'
  | 'checkbox'
  | 'code'
  | 'columnheader'
  | 'combobox'
  | 'command'
  | 'complementary'
  | 'composite'
  | 'contentinfo'
  | 'definition'
  | 'deletion'
  | 'dialog'
  | 'directory'
  | 'document'
  | 'emphasis'
  | 'feed'
  | 'figure'
  | 'form'
  | 'generic'
  | 'grid'
  | 'gridcell'
  | 'group'
  | 'heading'
  | 'img'
  | 'input'
  | 'insertion'
  | 'landmark'
  | 'link'
  | 'list'
  | 'listbox'
  | 'listitem'
  | 'log'
  | 'main'
  | 'marquee'
  | 'math'
  | 'meter'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'menuitemcheckbox'
  | 'menuitemradio'
  | 'navigation'
  | 'none'
  | 'note'
  | 'option'
  | 'paragraph'
  | 'presentation'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'range'
  | 'region'
  | 'roletype'
  | 'row'
  | 'rowgroup'
  | 'rowheader'
  | 'scrollbar'
  | 'search'
  | 'searchbox'
  | 'section'
  | 'sectionhead'
  | 'select'
  | 'separator'
  | 'slider'
  | 'spinbutton'
  | 'status'
  | 'strong'
  | 'structure'
  | 'subscript'
  | 'superscript'
  | 'switch'
  | 'tab'
  | 'table'
  | 'tablist'
  | 'tabpanel'
  | 'term'
  | 'textbox'
  | 'time'
  | 'timer'
  | 'toolbar'
  | 'tooltip'
  | 'tree'
  | 'treegrid'
  | 'treeitem'
  | 'widget'
  | 'window'
  // eslint-disable-next-line @typescript-eslint/ban-types
  | (string & {});
