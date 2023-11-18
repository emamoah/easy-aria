import { beforeEach, describe, test, expect, vi } from 'vitest';

import aria from '../src/EasyAria';

beforeEach(() => {
  document.body.innerHTML =
    '<section>' +
    '<div id="btn">click me</div>' +
    '<ul>' +
    '<li>Item 1</li>' +
    '<li id="item-2">Item 2</li>' +
    '<li>Item 3</li>' +
    '<li>Item 4</li>' +
    '</ul>' +
    '</section>';
});

describe('constructor', () => {
  test('returns null for a non-existent selector', () => {
    expect(aria('.no-existent')).toBeNull();
  });

  test('throws a DOMException for an invalid selector', () => {
    expect(() => aria('~li')).toThrow(DOMException);
  });

  test('returns the right wrapped Element for a valid selector', () => {
    expect(aria('li:nth-child(2)')?.el.innerHTML).toBe('Item 2');
  });

  test('returns the same wrapped element when it is passed to aria()', () => {
    const section = document.querySelector('section');
    expect(aria(section)?.el).toEqual(section);
  });
});

describe('.getRole() method', () => {
  test('returns null if role is absent', () => {
    expect(aria('section')?.getRole()).toBeNull;
  });

  test('returns role if present', () => {
    const section = document.querySelector('section');
    section?.setAttribute('role', 'region');

    expect(aria(section)?.getRole()).toBe('region');
  });
});

describe('.setRole() method', () => {
  test('sets the given role on the element', () => {
    const ariaSection = aria('section')!;

    ariaSection.setRole('region');
    expect(ariaSection.getRole()).toBe('region');

    ariaSection.setRole('group');
    expect(ariaSection.getRole()).toBe('group');
  });

  test('throws if passed a non-string value', () => {
    const ariaSection = aria('section')!;

    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole(8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole(1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole(true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole(undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole(null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole({})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole(() => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.setRole()).toThrowError();
  });
});

describe('.call() method', () => {
  test('calls the given callback function with the wrapped Element', () => {
    const fn = vi.fn();

    const btn = document.querySelector('#btn');
    aria(btn)?.call(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(btn);
  });

  test('throws if passed a non-function argument', () => {
    const ariaSection = aria('section')!;

    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call(8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call(1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call(true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call(undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call(null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call({})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call('')).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.call()).toThrowError();
  });
});

describe('.get() method', () => {
  test('returns null if the attribute is absent', () => {
    expect(aria('#btn')?.get('expanded')).toBe(null);
  });

  test('returns null if the attribute exists, but has an invalid value', () => {
    const newBtn = document.createElement('button');
    newBtn.setAttribute('aria-expanded', ' true'); // leading whitespace
    newBtn.setAttribute('aria-disabled', '');
    newBtn.setAttribute('aria-haspopup', 'polite');
    newBtn.setAttribute('aria-setsize', 'one');

    expect(aria(newBtn).get('expanded')).toBe(null);
    expect(aria(newBtn).get('disabled')).toBe(null);
    expect(aria(newBtn).get('haspopup')).toBe(null);
    expect(aria(newBtn).get('setsize')).toBe(null);
  });

  test('returns the right value (and type) of the attribute if it is valid', () => {
    const newBtn = document.createElement('button');
    newBtn.setAttribute('aria-label', '  ra ndom ');
    newBtn.setAttribute('aria-owns', '  st ring ');
    newBtn.setAttribute('aria-expanded', 'false');
    newBtn.setAttribute('aria-selected', 'undefined');
    newBtn.setAttribute('aria-disabled', 'false');
    newBtn.setAttribute('aria-setsize', ' 59 '); // leading and trailing space

    expect(aria(newBtn).get('label')).toBe('  ra ndom ');
    expect(aria(newBtn).get('owns')).toBe('  st ring ');
    expect(aria(newBtn).get('expanded')).toBe(false);
    expect(aria(newBtn).get('selected')).toBe('undefined');
    expect(aria(newBtn).get('disabled')).toBe(false);
    expect(aria(newBtn).get('setsize')).toBe(59);
  });

  test('throws if passed a non-string value', () => {
    const ariaSection = aria('section')!;

    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get(8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get(1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get(true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get(undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get(null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get({})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get(() => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get()).toThrowError();
  });

  test('throws if passed an invalid string', () => {
    const ariaSection = aria('section')!;

    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get('')).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.get('sth')).toThrowError();
  });
});

describe('.set() method', () => {
  test('sets the given attribute with the given value', () => {
    const btn = document.querySelector('#btn')!;

    const ariaBtn = aria(btn);

    expect(ariaBtn.set('details', ' s t r ').get('details')).toBe(' s t r ');
    expect(ariaBtn.set('controls', 'id-x').get('controls')).toBe('id-x');
    expect(ariaBtn.set('expanded').get('expanded')).toBe(true);
    expect(ariaBtn.set('invalid', 'spelling').get('invalid')).toBe('spelling');
    expect(ariaBtn.set('posinset', 32).get('posinset')).toBe(32);

    expect(btn.outerHTML).toBe(
      '<div id="btn" aria-details=" s t r " aria-controls="id-x" aria-expanded="true" aria-invalid="spelling" aria-posinset="32">click me</div>'
    ); // Verify that all attributes are still applied
  });

  test('converts element to IDREF string if used for an IDREF attribute, assigning empty ID', () => {
    const ariaSection = aria('section')!;
    const btn = document.querySelector('#btn')!;

    ariaSection.set('activedescendant', btn);

    expect(ariaSection.get('activedescendant')).toBe('btn');

    const li = document.querySelector('li')!;

    ariaSection.set('activedescendant', li);

    expect(li.id).toBe('easy-aria-id-1');
    expect(ariaSection.get('activedescendant')).toBe('easy-aria-id-1');
  });

  test('converts elements to IDREF List if used for an IDREF List attribute, assigning empty IDs', () => {
    const ariaSection = aria('section')!;

    ariaSection.set('owns', document.querySelectorAll('li'));
    expect(ariaSection.get('owns')).toMatch(
      /^easy-aria-id-\d item-2( easy-aria-id-\d){2}$/
    );

    const id1 = document.querySelector('li:first-child')?.id;
    const id2 = document.querySelector('li:nth-child(3)')?.id;
    const id3 = document.querySelector('li:nth-child(4)')?.id;

    expect(id1 !== id2 && id2 !== id3).toBe(true);
  });

  test('throws if passed a non-string value for the first argument', () => {
    const ariaSection = aria('section')!;

    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set(8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set(1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set(true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set(undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set(null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set({})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set(() => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set()).toThrowError();
  });

  test('throws if passed an invalid string for the first argument', () => {
    const ariaSection = aria('section')!;

    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set('')).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaSection.set('sth')).toThrowError();
  });

  test('throws if passed an invalid value for the second argument', () => {
    const ariaButton = aria('#btn')!;

    // Not an exhaustive check for an un-typed environment

    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', 8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', 1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts', () => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('keyshortcuts')).toThrowError();

    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant', 8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant', 1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant', true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant', undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant', {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant', () => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('activedescendant')).toThrowError();

    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls', 8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls', 1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls', true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls', undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls', {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls', () => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('controls')).toThrowError();

    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('atomic', 8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('atomic', 1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('atomic', null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('atomic', {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('atomic', () => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('atomic', '')).toThrowError();

    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('expanded', 8)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('expanded', 1n)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('expanded', null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('expanded', {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('expanded', () => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('expanded', '')).toThrowError();

    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('colcount', true)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('colcount', undefined)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('colcount', null)).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('colcount', {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('colcount', () => {})).toThrowError();
    // @ts-expect-error invalid type passed
    expect(() => ariaButton.set('colcount')).toThrowError();
  });
});

describe('.unset() method', () => {
  test('successfully removes the given attribute', () => {
    const ariaSection = aria('section')!;

    ariaSection.set('atomic');
    expect(ariaSection.get('atomic')).toBe(true);
    ariaSection.unset('atomic');
    expect(ariaSection.get('atomic')).toBe(null);
  });
});
