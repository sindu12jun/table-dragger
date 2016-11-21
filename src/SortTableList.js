/**
 * Created by lijun on 2016/11/16.
 */
// import Sortable from 'sortablejs';
import Sortable from './Sortable';
import { insertBeforeSibling } from './util';

export default class SortTableList {
  constructor({ tables = [], originTable }) {
    for (const fn of Object.getOwnPropertyNames((Object.getPrototypeOf(this)))) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    this.el = tables.reduce((previous, current) => {
      const li = document.createElement('li');
      li.appendChild(current.el);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));

    Sortable.create(this.el, {
      onEnd: (evt) => {
        this._onDrop({ from: evt.oldIndex, to: evt.newIndex });
      },
    });

    this.originTable = originTable;

    this.el.children[originTable.mouseDownIndex].dispatchEvent(new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
        which: 1,
      })
    );

    this.render();
  }

  _onDrop({ from, to }) {
    this.el.parentNode.removeChild(this.el);
    this.el = null;
    this.originTable.onSortTableDrop({ from, to });
  }

  render() {
    const { el, originTable } = this;
    el.style.position = 'absolute';
    insertBeforeSibling({ target: el, origin: originTable.el });
  }
}
