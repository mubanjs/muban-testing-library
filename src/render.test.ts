import { defineComponent } from '@muban/muban';
import type { StoryFn, StoryObj } from '@muban/storybook';
import { html } from '@muban/template';
import { render } from './render';

describe('render', () => {
  it('should render a story object', () => {
    const story: StoryObj = {
      render() {
        return {
          component: defineComponent({
            name: 'test',
            setup() {
              return [];
            },
          }),
          template: () => html`<div data-component="test"><h1>Hello World</h1></div>`,
        };
      },
    };

    const { html: storyHtml } = render(story);
    expect(storyHtml()).toEqual('<div><div data-component="test"><h1>Hello World</h1></div></div>');
  });

  it('should render a story function', () => {
    const story: StoryFn = () => ({
      component: defineComponent({
        name: 'test',
        setup() {
          return [];
        },
      }),
      template: () => html`<div data-component="test"><h1>Hello World</h1></div>`,
    });

    const { html: storyHtml } = render(story);
    expect(storyHtml()).toEqual('<div><div data-component="test"><h1>Hello World</h1></div></div>');
  });
});
