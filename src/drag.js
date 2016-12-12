/**
 * Created by lijun on 2016/12/7.
 */

// TODO 目前只是处理了handler，没有处理moves和acceptable
// 几个add和remove，用eventual
import DraggableList from './draggable-list';
import { on, classes } from './util';
import '../node_modules/dragula/dist/dragula.min.css';

const doc = document;
const documentElement = doc.documentElement;

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

// TODO 根据兼容性，再考虑一下这里怎么写
function whichMouseButton (e) {
  if ('touches' in e) {
    return e.touches.length;
  }
  if ('buttons' in e) {
    return e.buttons;
  }
  return false;
}

export default class Drag {
  constructor (table = null, userOptions = {}) {
    if (!checkIsTable(table)) {
      throw new Error(`TableSortable: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }

    this.onTap = this.onTap.bind(this);
    this.startBecauseMouseMoved = this.startBecauseMouseMoved.bind(this);
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
    this.grabbed = null;
    this.tappedCoord = { x: 0, y: 0 };
    // this.colGroup = document.querySelector('colgroup');
    // the coord of selected column/row
    this.activeCoord = { x: 0, y: 0 }; //
    this.el.classList.add(classes.originTable);
    this.bindEvents();
  }

  getCols () {
    return this.el.querySelectorAll('col');
  }

  bindEvents () {
    for (const h of this.handlers) {
      on(h, 'mousedown', this.onTap);
      // on(h, 'touchstart', this.onTapStart);
      // on(h, 'pointerdown', this.onTapStart);
    }
  }

  onTap (event) {
    // TODO 兼容性
    let t = event.target;
    while (t.nodeName !== 'TD' && t.nodeName !== 'TH') {
      t = t.parentElement;
    }

    const ignore = whichMouseButton(event) !== 1 || event.metaKey || event.ctrlKey;
    if (ignore) {
      return;
    }

    this.grabbed = t;
    this.activeCoord = { x: t.cellIndex, y: t.parentElement.rowIndex };
    this.tappedCoord = { x: event.clientX, y: event.clientY };
    documentElement.addEventListener('mousemove', this.startBecauseMouseMoved);
    documentElement.addEventListener('mouseup', () => {
      documentElement.removeEventListener('mousemove', this.startBecauseMouseMoved);
    });
    // touchy(documentElement, op, 'mousemove', startBecauseMouseMoved);
  }

  startBecauseMouseMoved (event) {
    const x = event.clientX;
    const y = event.clientY;
    const oldX = this.tappedCoord.x;
    const oldY = this.tappedCoord.y;
    if (x === oldX && y === oldY) {
      return;
    }

    documentElement.removeEventListener('mousemove', this.startBecauseMouseMoved);
    const fakeTables = this.fakeTables = this.buildTables();
    this.sizeFake();
    this.sortTable = new DraggableList({
      tables: fakeTables,
      originTable: this,
    });
    documentElement.addEventListener('mouseup', this.sortTable.destroy);
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
