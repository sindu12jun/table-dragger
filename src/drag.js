/**
 * Created by lijun on 2016/12/7.
 */

// TODO 目前只是处理了handler，没有处理moves和acceptable
import DraggableList from './draggable-list';
import { appendSibling, insertBeforeSibling, handleTr } from './util';


export default class Drag {
  constructor (table = null, userOptions = {}) {

    if (!checkIsTable(table)) {
      throw new Error(`TableSortable: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }


    // bind all methods start with '_' to THIS instance
    for (const fn of Object.getOwnPropertyNames((Object.getPrototypeOf(this)))) {
      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
        this[fn] = this[fn].bind(this);
      }
    }

    const defaults = {
      mode: 'column',
      excludeFooter: false,
      animation: 150,
      dragHandle: '',
      onlyBody: '',
    };
    const options = this.options = Object.assign({}, defaults, userOptions);

    const defaultHandlers = options.mode === 'column' ? table.rows[0].children : Array.from(table.rows).map(row => row.children[0]);

    this.handlers = Array.from(options.dragHandle ? this.el.querySelectorAll(options.dragHandle) : defaultHandlers);
    if (!handlers) {
      throw new Error('TableSortable: Please ensure dragHandler in table');
    }

    this.el = table;
    this.cols = table.querySelectorAll('col');
    // this.colGroup = document.querySelector('colgroup');
    // the index number of column/row user selected
    this.activeIndex = -1; //
    this.el.classList.add(classes.originTable);
    this.bindEvents();
  }


  bindEvents () {
    for (const h of this.handlers) {
      on(h, 'mousedown', this._onTapStart);
      on(h, 'touchstart', this._onTapStart);
      on(h, 'pointerdown', this._onTapStart);
    }
  }

  _onTapStart (event) {
    // TODO 兼容性
    let t = event.target;
    while (t.nodeName !== 'TD') {
      t = t.parentElement;
    }

    const cellIndex = t.cellIndex;
    const rowIndex = t.parentElement.rowIndex;

    this.activeIndex = Array.from(this.movingRow.children).indexOf(event.target);
    const fakeTables = this.fakeTables = this.buildTables();
    this.sizeFake();
    this.sortTable = new DraggableList({
      fakeTables,
      originTable: this,
      activeIndex: this.options.mode === 'row' ? rowIndex : cellIndex
    });
  }

  buildTables () {

  }

  // get the longest row length
  getLongestRow () {
    let result = this.el.rows[0];
    Array.from(this.el.rows).forEach(row => {
      result = row.children.length > result.length ? row : result
    })
    return result;
  }

  static version = '1.0';
}


function checkIsTable (ele) {
  return typeof ele === 'object'
    &&
    'nodeType' in ele
    &&
    ele.nodeType === 1
    &&
    ele.cloneNode
    &&
    ele.nodeName === 'TABLE';
}
