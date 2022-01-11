/* eslint-disable @typescript-eslint/no-explicit-any */
import type { StoryFnMubanReturnType } from '@muban/storybook/dist/esm/client/preview/types';
import { getQueriesForElement, prettyDOM, queries } from '@testing-library/dom';
import type { Story, StoryFn, StoryObj } from '@muban/storybook';
import { createApp } from '@muban/muban';
import type { PrettyDOMOptions } from '@testing-library/dom/types/pretty-dom';
import * as refQueries from './queryByRef';

type StoryArgs<T extends StoryFn | StoryObj> = T extends StoryObj<infer R>
  ? R
  : T extends StoryFn<infer R>
  ? R
  : Record<string, any>;

const mountedWrappers = new Set<HTMLDivElement>();

/**
 * Render a Muban Story into `document.body`, so tests can be run after.
 * @param componentFactory A Muban Story (either a StoryObj or StoryFn).
 * @param [templateData] An optional object with data that is used by the template to render the
 * initial HTML markup.
 *
 * @returns { container, debug, unmount, html, ...queries} An object of useful information and helpers.
 *
 * - `container` HTML Element that the component is rendered in.
 * - `debug` A function that outputs a pretty version of the component HTML.
 * - `unmount` Removes the container from the HTML so the component will be unmounted
 * - `html` Returns the raw outerHTML
 * - `...queries` All element queries bound to the component container
 */
export function render<T extends StoryFn | StoryObj>(
  componentFactory: T,
  templateData?: StoryArgs<T>,
) {
  const { component, appComponents, template } = getComponentInfo(componentFactory, templateData);

  const container = document.createElement('div');
  document.body.appendChild(container);

  if (component) {
    const app = createApp(component);
    app.component(...(appComponents || []));

    app.mount(container, template, templateData);
  } else {
    // only render the basic template
    const result = template(templateData);
    container.innerHTML = Array.isArray(result) ? result.join('') : result;
  }

  mountedWrappers.add(container);

  return {
    container,
    debug: (element = container, ...args: [number?, PrettyDOMOptions?]) =>
      // eslint-disable-next-line no-console
      console.log(prettyDOM(element, ...args)),
    unmount: () => container.remove(),
    html: () => container.outerHTML,
    ...getQueriesForElement(container, { ...queries, ...refQueries }),
  };
}

function getComponentInfo<T extends StoryFn | StoryObj>(
  componentFactory: T,
  templateData?: StoryArgs<T>,
) {
  // render StoryObj
  if (typeof componentFactory !== 'function') {
    if (!componentFactory.render) {
      throw new TypeError('Story must contain a render function.');
    }
    return componentFactory.render(templateData ?? {}, {} as any);
  }

  // render StoryFn
  return (componentFactory as StoryFn<any>)(templateData ?? {}, {} as any);
}

export function cleanup() {
  mountedWrappers.forEach(cleanupAtWrapper);
}

function cleanupAtWrapper(wrapper: HTMLDivElement) {
  if (wrapper.parentNode && wrapper.parentNode.parentNode === document.body) {
    document.body.removeChild(wrapper.parentNode);
  }

  try {
    wrapper.remove();
  } finally {
    mountedWrappers.delete(wrapper);
  }
}
