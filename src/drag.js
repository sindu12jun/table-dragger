/**
 * Created by lijun on 2016/12/7.
 */

// TODO 目前只是处理了handler，没有处理moves和acceptable
import DraggableList from './draggable-list';
import { on, classes } from './util';

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

export default class Drag {
  constructor (table = null, userOptions = {}) {
    if (!checkIsTable(table)) {
      throw new Error(`TableSortable: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }


    this.onTapStart = this.onTapStart.bind(this);
    // bind all methods start with '_' to THIS instance
    // for (const fn of Object.getOwnPropertyNames((Object.getPrototypeOf(this)))) {
    //   if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
    //     this[fn] = this[fn].bind(this);
    //   }
    // }

    const defaults = {
      mode: 'column',
      excludeFooter: false,
      animation: 150,
      dragHandle: '',
      onlyBody: '',
    };
    const options = this.options = Object.assign({}, defaults, userOptions);

    const defaultHandlers = options.mode === 'column' ? table.rows[0].children : Array.from(table.rows).map(row => row.children[0]);

    const handlers =
      this.handlers =
        Array.from(options.dragHandle
          ? this.el.querySelectorAll(options.dragHandle) : defaultHandlers);
    if (!handlers) {
      throw new Error('TableSortable: Please ensure dragHandler in table');
    }

    this.el = table;
    this.cols = table.querySelectorAll('col');
    // this.colGroup = document.querySelector('colgroup');
    // the coord of selected column/row
    this.activeCoord = { x: 0, y: 0 }; //
    this.el.classList.add(classes.originTable);
    this.bindEvents();
  }


  bindEvents () {
    for (const h of this.handlers) {
      on(h, 'mousedown', this.onTapStart);
      on(h, 'touchstart', this.onTapStart);
      on(h, 'pointerdown', this.onTapStart);
    }
  }

  onTapStart (event) {
    // TODO 兼容性
    let t = event.target;
    while (t.nodeName !== 'TD' && t.nodeName !== 'TH') {
      t = t.parentElement;
    }

    this.activeCoord = { x: t.cellIndex, y: t.parentElement.rowIndex };

    const fakeTables = this.fakeTables = this.buildTables();
    this.sizeFake();
    this.sortTable = new DraggableList({
      tables: fakeTables,
      originTable: this,
    });
  }

  // get the longest row length
  getLongestRow () {
    let result = this.el.rows[0];
    Array.from(this.el.rows).forEach((row) => {
      result = row.children.length > result.length ? row : result;
    });
    return result;
  }

  static version = '1.0';
}
