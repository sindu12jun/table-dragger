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
      animation: 150,
      onUpdate: (evt) => {
        this._onDrop({ from: evt.oldIndex, to: evt.newIndex });
      },
    });

    this.originTable = originTable;
    this.render();
    const event = new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
      });
    this.el.children[originTable.mouseDownIndex].dispatchEvent(event);
  }

  _onDrop({ from, to }) {
    this.el.parentNode.removeChild(this.el);
    this.el = null;
    this.originTable.onSortTableDrop({ from, to });
  }

  render() {
    const { el, originTable } = this;
    const originRect = originTable.el.getBoundingClientRect();
    // http://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
    const top = originRect.top;
    const left = originRect.left;
    el.style.position = 'fixed';
    el.style.top = `${top}px`;
    el.style.left = `${left}px`;
    // document.body.appendChild(el);
    // 考虑到和父元素class联动等，必须放在目标元素sibling的位置
    // 考虑到table 相对移动或者transform时ul会错位，必须用绝对定位
    // 所以选择position 为fixed,相对视窗定位，所以不需要加window.pageYoffset了
    insertBeforeSibling({ target: el, origin: originTable.el });
  }
}
