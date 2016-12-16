/**
 * Created by lijun on 2016/12/7.
 */
import Dragger from './draggable-list';
import classes from './classes';
import { on, remove, touchy } from './util';

export default class Drag {
  constructor (table = null, userOptions = {}) {
    if (!checkIsTable(table)) {
      throw new TypeError(`table-dragger: el must be TABLE HTMLElement, not ${{}.toString.call(table)}`);
    }
    if (!table.rows.length) {
      return;
    }
    if (mode === 'free' && !options.dragHandler) {
      throw new Error('table-dragger: please specify dragHandler in free mode');
    }

    this.onTap = this.onTap.bind(this);
    this.destroy = this.destroy.bind(this);
    this.startBecauseMouseMoved = this.startBecauseMouseMoved.bind(this);

    const defaults = {
      mode: 'column',
      dragHandler: '',
      onlyBody: false,
      animation: 300,
    };
    const options = this.options = Object.assign({}, defaults, userOptions);
    const { mode } = options;

    this.dragger = emitter({
      dragging: false,
      destroy: this.destroy,
    });

    let handlers;
    if (options.dragHandler) {
      handlers = table.querySelectorAll(options.dragHandler);
      if (handlers && !handlers.length) {
        throw new Error('table-dragger: no element match dragHandler selector');
      }
    } else {
      handlers = mode === 'column' ? (table.rows[0] ? table.rows[0].children : []) : Array.from(table.rows).map(row => row.children[0]);
    }
    this.handlers = Array.from(handlers);

    table.classList.add(classes.originTable);

    this.tappedCoord = { x: 0, y: 0 }; // the coord of mouseEvent user clicked
    this.cellIndex = { x: 0, y: 0 }; // the cell's index of row and column
    this.el = table;
    this.bindEvents();
  }

  bindEvents () {
    for (const e of this.handlers) {
      touchy(e, 'add', 'mousedown', this.onTap);
    }
  }

  onTap (event) {
    let { target } = event;
    while (target.nodeName !== 'TD' && target.nodeName !== 'TH') {
      target = target.parentElement;
    }

    const ignore = !isLeftButton(event) || event.metaKey || event.ctrlKey;
    if (ignore) {
      return;
    }

    this.cellIndex = { x: target.cellIndex, y: target.parentElement.rowIndex };
    this.tappedCoord = { x: event.clientX, y: event.clientY };

    this.eventualStart(false);
    touchy(document, 'add', 'mouseup', () => {
      this.eventualStart(true);
    });
  }

  startBecauseMouseMoved (event) {
    const { tappedCoord, options:{ mode } } = this;
    const gapX = Math.abs(event.clientX - tappedCoord.x);
    const gapY = Math.abs(event.clientY - tappedCoord.y);
    const isFree = mode === 'free';
    let realMode = mode;

    if (gapX === 0 && gapY === 0) {
      return;
    }

    if (isFree) {
      realMode = gapX < gapY ? 'row' : 'column';
    }

    const sortTable = new Dragger({
      mode: realMode,
      originTable: this,
    });
    this.eventualStart(true);
    // this listener will be removed after user start dragging
    touchy(document, 'add', 'mouseup', sortTable.destroy);
  }

  eventualStart (remove) {
    const op = remove ? 'remove' : 'add';
    touchy(document, op, 'mousemove', this.startBecauseMouseMoved);
  }

  destroy () {
    for (const h of this.handlers) {
      touchy(h, 'remove', 'mousedown', this.onTap);
    }
    this.el.classList.remove(classes.originTable);
  }


  static create (el, options) {
    const d = new Drag(el, options);
    return d && d.dragger;
  }

  static version = '1.0';
}

function checkIsTable (ele) {
  return ele
    &&
    typeof ele === 'object'
    &&
    'nodeType' in ele
    &&
    ele.nodeType === 1
    &&
    ele.cloneNode
    &&
    ele.nodeName === 'TABLE';
}

function isLeftButton (e) {
  if ('touches' in e) {
    return e.touches.length === 1;
  }
  if ('buttons' in e) {
    return e.buttons === 1;
  }
  if ('button' in e) {
    return e.button === 0;
  }
  return false;
}

function emitter (thing = {}) {
  /* eslint-disable no-param-reassign */
  const evt = {};
  thing.on = (type, fn) => {
    evt[type] = evt[type] || [];
    evt[type].push(fn);
    return thing;
  };
  thing.emit = (type, ...args) => {
    if (!evt[type]) {
      return;
    }
    for (const fn of evt[type]) {
      fn(...args);
    }
  };
  return thing;
}
