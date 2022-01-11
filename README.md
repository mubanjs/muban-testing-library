# @muban/testing-library

## Introduction

Muban Testing Library builds on top of DOM Testing Library by adding APIs for working with Muban 
components.

Since muban components require both a Component and a Template to be provided 
separately, we chose to leverage the Story format from `@muban/storybook` to render these 
components.

In short, Muban Testing Library does three things:

* Re-exports query utilities and helpers from DOM Testing Library.
* Provides a `render` function to render a Muban component
* Binds all the query functions to the rendered component template.


### Quick start

Add `@muban/testing-library` to your project:
```sh
npm i -D @muban/testing-library
yarn add -D @muban/testing-library
```

You can now use all of DOM Testing Library's getBy, getAllBy, queryBy and queryAllBy commands. 
See here the
[full list of queries](https://testing-library.com/docs/queries/about#types-of-queries).

You may also be interested in installing `@testing-library/jest-dom` so you can use
[the custom Jest matchers](https://github.com/testing-library/jest-dom#readme) for the DOM.

## API

### render

Renders a Muban Story into the (virtual) DOM, and returns `@testing-library/dom` helpers,
alongside with some debug functions, and the `byRef` helpers.

```ts
function render<T extends StoryFn | StoryObj>(
  componentFactory: T,
  templateData?: StoryArgs<T>,
)
```

**Parameters**
* `componentFactory` – An `StoryObj` or `StoryFn` Muban story to render.
* `templateData` – The storybook args that are used by the template to render dynamic parts.

**Returns**
* `container` – a wrapper `div` that is used to render the story in.
* `debug(element)` – A function to output the DOM in a formatted way.
* `html()` – A function that outputs the `outerHTML` of the container.
* `unmount()` - A function to remove the container from the DOM again, which should unmount the 
  attached component as well.
* `...queries` – All **query** functions from `@testing-library/dom` + the `byRef` functions 
  from this package, all bound to the rendered component container.

```ts
// render the story component
const { queryByRef } = render(StoryItem, { param: 'value'});

// query al element inside the story container
const element = queryByRef('item');
```

### byRef

The following query functions can be used to query elements by their `data-ref` attribute.
Even though this is not recommended, and goes against
[the philosophy](https://testing-library.com/docs/guiding-principles) of `testing-library`, we 
still want to offer these in case of need, since they are a big part of how Muban itself queries 
elements. You _could_ compare them with `data-testid` in that way, which does have supported 
queries.

* `queryByRef`
* `queryAllByRef`
* `getByRef`
* `getAllByRef`

How they work in certain situations is explained
[here](https://testing-library.com/docs/queries/about#types-of-queries).

```ts
import {queryByRef, queryAllByRef} from '@muban/testing-library';

// container = <span data-ref="item">test</span>
const element = queryByRef(container, 'item');

// container = <div>
//  <span data-ref="item">test</span>
//  <span data-ref="item">test</span>
// </div>
const elements = queryAllByRef(container, 'item');
```

## Use Cases

### In Unit Tests

This is the core use case of this library. In each test you want to `render` a component, and 
used the returned queries to retrieve elements to interact with or assert correctness.

Then use the `@testing-library/dom` helpers to interact with these elements, and use `jest` and 
the `@testing-library/jest-dom` matchers to manage your expectations.

When possible, you want to re-use your stories to execute these tests on.

### In the Storybook Play function

Storybook has a `play` function that allows you to
[interact with your stories](https://storybook.js.org/docs/react/writing-tests/interaction-testing).

The recommended use case is to interact with the element provided to the `play` function, using 
the functions from the `@storybook/testing-library` package. This is a re-export of the normal 
`@testing-library/dom` package, but instrumentation is added to show all interactions in the 
`interactions` panel. This panel is available when you add the `@storybook/addon-interactions` 
addon.

The queries exported by this library (e.g. `queryByRef`) are not bound to that element, and also 
not instrumented. You can still use them the normal way, by manually providing the container 
element as the first parameter, but they won't show up in the interactions panel.


## Examples

TODO
