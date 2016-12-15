/**
 * Created by lijun on 2016/12/8.
 */
import dragula from 'dragula';
// import dragula from './dragula';
import { insertBeforeSibling, classes, getScrollBarWidth, css, remove, getLongestRow, empty, sort } from './util';

// const isTest = true;
const isTest = false;
// TODO 注意Drop以后排列tables
// TODO 学习dragula，注意startBecauseDrag，左右键，ignoreTextSelection等
// TODO mode 改为 horizentol 等关键词
// TODO alt等，再看一遍drugula
// TODO render等好好组织一下
// TODO 函数克里化，函数式？
// 改drgula时注意，reference指明了被交换的坐标
export default class Dragger {
  constructor ({ originTable, mode }) {
    const fakeTables = buildTables(originTable.el, mode);
    sizeFakeTables(fakeTables, originTable.el, mode);
    this.mode = mode;

    this.destroy = this.destroy.bind(this);

    const options = originTable.options;
    const dragger = originTable.dragger;
    const index = mode === 'column' ? originTable.activeCoord.x : originTable.activeCoord.y;

    let s = originTable.el.getAttribute('cellspacing');
    s = s === null ? 2 : s;
    const a = mode === 'column' ? 'margin-right' : 'margin-bottom';
    this.el = fakeTables.reduce((previous, current, indexOrder) => {
      const li = document.createElement('li');

      if (s && indexOrder < (fakeTables.length - 1)) {
        li.style[a] = `-${s}px`;
      }

      if (options.onlyBody && mode === 'row' && !Array.from(current.children).some(o => o.nodeName === 'TBODY')) {
        li.classList.add('sindu_static');
      }
      li.appendChild(current);
      return previous.appendChild(li) && previous;
    }, document.createElement('ul'));

    this.el.classList.add(classes.draggableTable);
    this.el.classList.add(`sindu_${mode}`);
    css(this.el, { position: 'fixed' });
    insertBeforeSibling({ target: this.el, origin: originTable.el });

    this.originTable = originTable;
    // this._renderTables();
    this.el.parentElement.classList.add(classes.dragging);

    const bodyPaddingRight = parseInt(document.body.style.paddingRight, 0) || 0;
    const bodyOverflow = document.body.style.overflow;
    this.drake = dragula([this.el], {
      animation: 300,
      mirrorContainer: this.el,
      staticClass: classes.static,
      direction: mode === 'column' ? 'horizontal' : 'vertical',
    })
      .on('drag', () => {
        css(document.body, { overflow: 'hidden' });
        // const originRight = document.body.style.paddingRight || 0;
        const barWidth = getScrollBarWidth();
        if (barWidth) {
          css(document.body, { 'padding-right': `${barWidth + bodyPaddingRight}px` });
        }
        remove(document, 'mouseup', this.destroy);
        dragger.emit('onDrag');
      })
      .on('dragend', (el) => {
        css(document.body, { overflow: bodyOverflow, 'padding-right': `${bodyPaddingRight}px` });
        const from = index;
        const to = Array.from(this.el.children).indexOf(el);
        sortTable(this.mode, from, to, this.originTable.el);
        if (!isTest) {
          this.destroy();
        }
        dragger.emit('onDrop', from, to, originTable.el);
      })
      .on('shadow', (el) => {
        const from = index;
        const to = Array.from(this.el.children).indexOf(el);
        dragger.emit('onShadowMove', from, to, originTable.el);
      })
      .on('out', () => {
        dragger.emit('onOut', originTable.el);
      })
    ;

    const event = new MouseEvent('mousedown',
      {
        cancelable: true,
        bubbles: true,
        view: window,
      });
    this.el.children[index].dispatchEvent(event);
  }

  destroy () {
    remove(document, 'mouseup', this.destroy);
    this.el.parentElement.classList.remove(classes.dragging);
    this.el.parentElement.removeChild(this.el);
    setTimeout(() => {
      this.drake.destroy();
    }, 0);
  }

  _renderPosition () {
    // 计算ul相对于视窗的位置
    // 考虑到和父元素class联动等，必须放在目标元素sibling的位置
    // 考虑到table 相对移动或者transform时ul会错位，必须用绝对定位
    // 所以选择position 为fixed,相对视窗定位，所以不需要加window.pageYoffset了
    const originRect = this.originTable.el.getBoundingClientRect();
    // http://stackoverflow.com/questions/20514596/document-documentelement-scrolltop-return-value-differs-in-chrome
    css(this.el, { top: `${originRect.top}px`, left: `${originRect.left}px` });
    if (isTest) {
      css(this.el, { left: '500px' });
    }
  }

  // TODO li设定宽度，ul overflow-hidden
  _renderTables () {
    const oel = this.originTable.el;
    const rect = oel.getBoundingClientRect();
    // const border = oel.getAttribute('border');
    css(this.el, { width: `${rect.width}px`, height: `${rect.height}px` });
    this._renderPosition();
  }
}

function getColumnAsTableByIndex (table, index) {
  const cTable = table.cloneNode(true);
  css(cTable, { 'table-layout': 'fixed', width: 'initial', height: 'initial' });
  cTable.removeAttribute('width');
  cTable.removeAttribute('height');
  cTable.removeAttribute('id');
  const cols = cTable.querySelectorAll('col');

  if (cols) {
    const c = cols[index];
    if (c) {
      css(c, { width: 'initial' });
      c.removeAttribute('width');
    } else {
      throw new Error('Please make sure the length of col element is equal with table\'s row length');
    }
    Array.from(cols).forEach((col) => {
      if (col !== c) {
        col.parentElement.removeChild(col);
      }
    });
  }

  cTable.removeAttribute('id');
  cTable.classList.remove(classes.originTable);
  Array.from(cTable.rows).forEach((row) => {
    const target = row.children[index];
    empty(row);
    if (target) {
      row.appendChild(target);
    }
  });
  return cTable;
}

function sizeColumnFake (fakeTables, table) {
  // 列排列时重新计算每一列的宽度
  Array.from(getLongestRow(table).children).forEach(
    (cell, index) => {
      const w = cell.getBoundingClientRect().width;
      const t = fakeTables[index];
      // table 的width比td稍微宽一点，所以不要直接给table直接赋宽度
      css(t, { width: `${w}px` });
      css(t.rows[0].children[0], { width: `${w}px` });
    }
  );
  // 列排列时重新计算每一行的高度
  const rowHeights = Array.from(table.rows)
    .map(row => row.children[0].getBoundingClientRect().height);
  fakeTables.forEach((t) => {
    /* eslint-disable no-param-reassign*/
    Array.from(t.rows).forEach((row, index) => {
      css(row, { height: `${rowHeights[index]}px` });
    });
  });
}

function sizeRowFake (fakeTables, table) {
  const cells = getLongestRow(table).children;
  const w = table.getBoundingClientRect().width;
  // 行排列时计算每一行各个cell宽度
  /* eslint-disable no-param-reassign*/
  fakeTables.forEach((t) => {
    css(t, { width: `${w}px` });
    Array.from(t.rows[0].children).forEach((cell, i) => {
      css(cell, { width: `${cells[i].getBoundingClientRect().width}px` });
    });
  });
  // 行排列时计算每一行高度
  // 似乎用不着计算
  // this.fakeTables.forEach((table, index) => {
  //   /* eslint-disable no-param-reassign*/
  //   table.style.height = `${this.el.rows[index].getBoundingClientRect().height}px`;
  // });
}

function sortColumn ({ from, to, table }) {
  if (from === to) {
    return;
  }

  Array.from(table.rows).forEach((row) => {
    sort({ list: row.children, from, to });
  });

  const cols = table.querySelectorAll('col');
  if (cols) {
    sort({ list: cols, from, to });
  }
}

function sortRow ({ from, to, table }) {
  if (from === to) {
    return;
  }
  const list = Array.from(table.rows);
  sort({ list, parent: list[to].parentElement, from, to });
}

function sortTable (mode, from, to, table) {
  (mode === 'column' ? sortColumn : sortRow)({ from, to, table });
}

function buildRowTables (table) {
  return Array.from(table.rows).map((row) => {
    const cTable = table.cloneNode(true);
    css(cTable, 'table-layout', 'fixed');
    const cols = cTable.querySelectorAll('col');
    css(cTable, { 'table-layout': 'fixed', width: 'initial', height: 'initial' });
    cTable.removeAttribute('width');
    cTable.removeAttribute('height');
    cTable.removeAttribute('id');
    cTable.classList.remove(classes.originTable);
    cTable.innerHTML = '';
    if (cols) {
      const f = document.createDocumentFragment();
      Array.from(cols).forEach((col) => {
        col.removeAttribute('width');
        col.style.width = 'initial';
        f.appendChild(col);
      });
      cTable.appendChild(f);
    }
    const organ = row.parentNode.cloneNode();
    organ.innerHTML = '';
    organ.appendChild(row.cloneNode(true));
    cTable.appendChild(organ);
    return cTable;
  });
}

function buildColumnTables (table) {
  return Array.from(getLongestRow(table).children).map((cell, index) =>
    getColumnAsTableByIndex(table, index));
}

function buildTables (table, mode) {
  return mode === 'column' ? buildColumnTables(table) : buildRowTables(table);
}

// TODO 克里化？
function sizeFakeTables (fakeTables, table, mode) {
  return mode === 'column' ? sizeColumnFake(fakeTables, table) : sizeRowFake(fakeTables, table);
}
