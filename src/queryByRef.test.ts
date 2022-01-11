import '@testing-library/jest-dom';
import { html } from '@muban/template';
import { getAllByRef, getByRef, queryAllByRef, queryByRef } from './queryByRef';

describe('queryByRef', () => {
  it('should return an element', () => {
    const parent = document.createElement('div');
    parent.innerHTML = html`<span data-ref="item">item</span>`;
    const target = queryByRef(parent, 'item');
    expect(target).toHaveAttribute('data-ref', 'item');
  });
});
describe('queryAllByRef', () => {
  it('should return an element', () => {
    const parent = document.createElement('div');
    parent.innerHTML = html`<span data-ref="item">item</span><span data-ref="item">item</span>`;
    const target = queryAllByRef(parent, 'item');
    expect(Array.from(target)).toHaveLength(2);
  });
});
describe('getByRef', () => {
  it('should return an element', () => {
    const parent = document.createElement('div');
    parent.innerHTML = html`<span data-ref="item">item</span>`;
    const target = getByRef(parent, 'item');
    expect(target).toHaveAttribute('data-ref', 'item');
  });
});
describe('getAllByRef', () => {
  it('should return an element', () => {
    const parent = document.createElement('div');
    parent.innerHTML = html`<span data-ref="item">item</span><span data-ref="item">item</span>`;
    const target = getAllByRef(parent, 'item');
    expect(Array.from(target)).toHaveLength(2);
  });
});
