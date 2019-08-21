import * as Rx from 'rxjs'
import * as R from 'ramda'
import classes from './classes'
import {map, first, takeUntil, filter, mergeMap} from 'rxjs/operators'
import dragula from 'dragula-with-animation';
import {
  setCSSes,
  addClass,
  removeClass,
  removeAttrs,
  isLeftButton,
  checkIsTable,
  appendDOMChild,
  removeDom,
  prop,
  setStyle,
  getCellByIndexInRow,
  createArrByNumber,
  insertBeforeSibling,
  appendSibling,
  addPx,
  getMouseDownEvent
} from './helpers'

const up$ = Rx.fromEvent(document, 'mouseup')
const move$ = Rx.fromEvent(document, 'mousemove')
const ArrayFrom = R.flip(R.invoker(1, 'from'))(Array);
const cloneNode = R.invoker(1, 'cloneNode')
const createElement = document.createElement.bind(document)
const columnType = Symbol()
const rowType = Symbol()
export {columnType, rowType}
const defaultOptions = {
  mode: 'column',
  dragHandler: '',
  onlyBody: false,
  animation: 300,
};

export function getTheFirstColumn(table) {
  return R.map(R.curry(getCellByIndexInRow)(0))(table.rows)
}

export function getTheFistRow(table) {
  return table.rows[0].children
}

export function getHandlers(table, options, dragHandler) {
  const optionMode = options.mode
  const onlyBody = options.onlyBody && optionMode === 'row'
  if (dragHandler) {
    return R.compose(ArrayFrom, table.querySelectorAll.bind(table))(dragHandler)
  } else {
    return ArrayFrom(optionMode === 'column' ? getTheFistRow(table) : getTheFirstColumn(
      onlyBody ? table.querySelector('tbody') : table
    ))
  }
}

export const errMsgs = {
  shouldBeTable: 'table-dragger: el must be TABLE HTMLElement',
  specifyHandler: 'table-dragger: please specify dragHandler in free mode'
}

export function checkTable(table, options) {
  let errorMsg
  if (!checkIsTable(table)) {
    errorMsg = errMsgs.shouldBeTable
  }
  if (options.mode === 'free' && !options.dragHandler) {
    errorMsg = errMsgs.specifyHandler
  }
  return errorMsg
}

function isMousedownValid(mousedownEvent) {
  const ignore = !isLeftButton(mousedownEvent) || mousedownEvent.metaKey || mousedownEvent.ctrlKey;
  return !ignore
}

export function getRealMode(optionMode, moveDirection) {
  if (!moveDirection) {
    return
  }
  return optionMode === 'free' ? moveDirection : optionMode === 'row' ? rowType : columnType
}

export function getTableLength(table, mode) {
  const getRowLength = R.compose(
    R.partialRight(prop, ['length']),
    R.partialRight(prop, ['children'])
  )
  return mode === rowType ?
    table.rows.length :
    R.compose(R.apply(Math.max), R.map(getRowLength), ArrayFrom)(table.rows)
}

export function getFakeTables(table, mode) {
  const tableLength = getTableLength(table, mode)
  return R.map(R.partial(getFakeTableByIndex, [table, mode]))(createArrByNumber(tableLength))
}

function renderFakeTable(table, fakeTable) {
  R.pipe(
    R.partial(insertBeforeSibling, [table]),
  )(fakeTable)
  fakeTable.parentElement.classList.add(classes.dragging);
  return fakeTable
}

export function getColumnCellsByIndex(table, index) {
  return R.compose(
    R.map((row) => {
      return row.children[index]
    }),
    ArrayFrom)(table.rows)
}

export function getWholeFakeTable(table, mode) {
  const fakeTables = getFakeTables(table, mode)
  const rect = table.getBoundingClientRect()
  const styles = {
    position: 'fixed',
    top: `${rect.top}px`,
    left: `${rect.left}px`,
    width: `${rect.width}px`,
    height: `${rect.height}px`,
    margin: window.getComputedStyle(table).margin
  }
  // 'ul'
  const ul = R.compose(R.partialRight(setCSSes, [styles]), R.partialRight(addClass, [classes.fakeTable]), createElement)('ul')
  // 'li'
  const lis = R.map(fakeTable => {
    return appendDOMChild(createElement('li'), fakeTable)
  })(fakeTables)
  return R.reduce(appendDOMChild)(ul)(lis)
}

function removeAllCols(table) {
  const cols = [...ArrayFrom(table.querySelectorAll('col')), ...ArrayFrom(table.querySelectorAll('colgroup'))]
  R.forEach(removeDom)(cols)
  return table
}

/**
 * Get tbody thead or tfoot
 * @param cell
 * @returns {*}
 */
export function getOrganByCell(cell) {
  while (cell && !['TBODY', 'THEAD', 'TFOOT'].includes(cell.nodeName)) {
    cell = cell.parentElement;
  }
  return cell
}

export function getRowFakeTableByIndex(table, index) {
  const realRow = table.rows[index]
  const fakeTable = R.pipe(
    cloneNode(true),
    R.curry(appendDOMChild)(cloneNode(false)(table))
  )(realRow)
  const tuple = R.zip(
    ArrayFrom(realRow.children),
    ArrayFrom(fakeTable.rows[0].children)
  )
  R.forEach(function ([realCell, fakeCell]) {
    setStyle(fakeCell, 'width', addPx(prop(realCell, 'clientWidth')))
  })(tuple)
  // set table height & width
  setStyle(fakeTable, 'height', addPx(prop(realRow, 'clientHeight')))
  setStyle(fakeTable, 'width', addPx(prop(table, 'clientWidth')))
  return fakeTable
}

export function getColumnFakeTableByIndex(table, index) {
  const cells = R.map(R.partial(getCellByIndexInRow, [index]))(ArrayFrom(table.rows))
  const fakeTable = R.pipe(cloneNode(false),
    // set table height
    R.partialRight(setStyle, ['height', addPx(table.clientHeight),]),
    // set table width
    R.partialRight(setStyle, ['width', addPx(cells[0].clientWidth),])
  )(table)
  return R.reduce(function (fakeTable, cell) {
    return R.pipe(
      cloneNode(true),
      R.partial(appendDOMChild, [createElement('tr')]),
      R.partialRight(setStyle, ['height', addPx(cell.clientHeight)]),
      R.curry(appendDOMChild)(fakeTable))
    (cell)
  })
  (fakeTable)
  (cells)
}

export function getFakeTableByIndex(table, mode, index) {
  const getFakeTable = mode === rowType ? getRowFakeTableByIndex : getColumnFakeTableByIndex
  const attrsToRemove = ['width', 'height', 'id']
  return R.pipe(
    getFakeTable,
    R.partialRight(removeAttrs, [attrsToRemove]),
    R.partialRight(removeClass, [classes.originTable]),
    removeAllCols,
  )(table, index)
}

export function getTargetIndexInTable(target, mode) {
  while (target.nodeName !== 'TD' && target.nodeName !== 'TH') {
    target = target.parentElement;
  }
  return mode === rowType ? target.parentElement.rowIndex : target.cellIndex
}


export function getMoveDirection(downEvent, moveEvent) {
  const gapX = Math.abs(moveEvent.clientX - downEvent.clientX)
  const gapY = Math.abs(moveEvent.clientY - downEvent.clientY)
  if (gapX === gapY) return null
  return gapX > gapY ? columnType : rowType
}

/**
 * Put fromEle after toEle
 * @param fromEle
 * @param toEle
 * @param isForward if true, down or right
 */
export function sortElements(fromEle, toEle, isForward) {
  if (isForward) {
    appendSibling(toEle, fromEle);
  } else {
    insertBeforeSibling(toEle, fromEle);
  }
}

export function sortColumns(table, from, to) {
  if (from === to) {
    return;
  }
  Array.from(table.rows).forEach((row) => {
    sortElements(row.children[from], row.children[to], from < to)
  });

  const cols = table.querySelectorAll('col');
  if (cols.length) {
    sortElements(cols[from], cols[to], from < to);
  }
}

export function sortRows(table, from, to) {
  if (from === to) {
    return;
  }
  const list = Array.from(table.rows);
  sortElements(list[from], list[to], from < to)
}

export function onDrag(dragger, table, mode,) {
  dragger.dragging = true
  dragger.emit('drag', table, mode);
}

function modeString(mode) {
  return mode === columnType ? 'column' : 'row'
}

export function onDrop(targetIndex, fakeTable, mode, table, dragger, droppedItem) {
  const from = targetIndex
  const to = ArrayFrom(fakeTable.children).indexOf(droppedItem);
  const sortFunc = mode === columnType ? sortColumns : sortRows
  sortFunc(table, from, to)
  removeClass(fakeTable.parentElement, classes.dragging)
  removeDom(fakeTable)
  removeClass(table, classes.originTable)
  dragger.emit('drop', from, to, table, modeString(mode));
  dragger.dragging = false
}

export function onShadow(targetIndex, fakeTable, mode, table, dragger, draggingItem) {
  const from = targetIndex;
  const to = Array.from(fakeTable.children).indexOf(draggingItem);
  dragger.emit('shadowMove', from, to, table, modeString(mode));
}

export function onOut(mode, table, dragger) {
  dragger.emit('out', table, modeString(mode));
}

function emitter(thing = {}) {
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

export default function tableDragger(table, userOptions) {
  if (!table.rows.length) {
    return
  }
  const options = Object.assign({}, defaultOptions, userOptions)
  const {dragHandler, mode: optionMode} = options
  const handlers = getHandlers(table, options, dragHandler)
  const down$ = Rx.fromEvent(handlers, 'mousedown')
  const realMode = R.pipe(getMoveDirection, R.partial(getRealMode, [optionMode]))
  {
    const errorMsg = checkTable(table, options)
    if (errorMsg) throw new Error(errorMsg)
    R.forEach(R.partialRight(addClass, [classes.handle]))(handlers)
  }
  const dragger = emitter({
    dragging: false,
  });
  // Catch the moment user drag the table
  const firstDrag$ = down$.pipe(
    filter(isMousedownValid),
    mergeMap((downEvent) => {
      return move$.pipe(
        takeUntil(up$),
        map(R.partial(realMode, [downEvent])),
        filter(R.identity),
        first(),
        map(mode => ({
          targetIndex: getTargetIndexInTable(downEvent.target, mode),
          mode
        }))
      )
    }),
  )
  firstDrag$.subscribe(({targetIndex, mode}) => {
    const onlyBody = options.onlyBody && optionMode === 'row'

    addClass(table, classes.originTable)
    const fakeTable = R.compose(
      R.curry(renderFakeTable)(table),
      getWholeFakeTable)(table, mode)

    if (onlyBody) {
      R.forEach(function ([fakeRow, realRow]) {
        if (getOrganByCell(realRow).nodeName !== 'TBODY') {
          addClass(fakeRow, classes.static)
        }
      })(R.zip([...fakeTable.children], [...table.rows]))
    }

    dragula([fakeTable], {
      animation: 300,
      staticClass: classes.static,
      direction: mode === columnType ? 'horizontal' : 'vertical',
    })
      .on('drag', () => {
        return onDrag(dragger, table, mode)
      })
      .on('dragend', R.partial(onDrop, [targetIndex, fakeTable, mode, table, dragger]))
      .on('shadow', R.partial(onShadow, [targetIndex, fakeTable, mode, table, dragger]))
      .on('out', () => {
        return onOut(mode, table, dragger)
      });
    fakeTable.children[targetIndex].dispatchEvent(getMouseDownEvent());
  })
  return dragger
}

