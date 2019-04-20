import * as Rx from 'rxjs'
import * as R from 'ramda'

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
  const sortFunc = mode === columnType ? exchangeColumns : exchangeRows
  sortFunc(table, from, to)
  removeClass(fakeTable.parentElement, classes.dragging)
  removeDom(fakeTable)
  removeClass(table, classes.originTable)
  dragger.emit('drop', from, to, table, modeString(mode));
  dragger.dragging = false
}

export default function tableDragger(table, userOptions) {
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

  const firstDrag$ = down$.pipe(
    filter(isMousedownValid),
    mergeMap((downEvent) => {
      return move$.pipe(
        takeUntil(up$),
        map(R.partial(realMode, [downEvent])),
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

          export function exchangeColumns(table, from, to) {

          }

          export function exchangeRows(table, from, to) {
            if (from === to) {
              return;
            }
            const list = Array.from(table.rows);
            sortElements(list[from], list[to], from < to)
          }

          export function getRowFakeTableByIndex(table, index) {
            const realRow = table.rows[index]
            const realOrgan = getOrganByCell(realRow)
            const fakeTable = R.pipe(
              cloneNode(true),
              realOrgan ? R.curry(appendDOMChild)(cloneNode(false)(realOrgan)) : R.identity,
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

          export function onDrag(dragger, table, mode,) {
            dragger.dragging = true
            dragger.emit('drag', table, mode);
          }

          export function getTableLength(table, mode) {
            R.partialRight(prop, ['length']),
              R.partialRight(prop, ['children'])
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
              // const realOrgan = getOrganByCell(cell)
              return R.pipe(
                R.partialRight(setStyle, ['height', addPx(cell.clientHeight)]),
                // (realOrgan && !fakeTable.querySelector(realOrgan.nodeName)) ? R.partial(appendDOMChild, [cloneNode(false)(realOrgan)]) : R.identity,
                R.curry(appendDOMChild)(fakeTable))
              (cell)
            })
            (fakeTable)
            (cells)
          }


          export function getColumnCellsByIndex(table, index) {
            return R.compose(
              R.map((row) => {
                return row.children[index]
              }),
              ArrayFrom)(table.rows)
          }

          function modeString(mode) {
            return mode === columnType ? 'column' : 'row'
          }

          export function getRowFakeTableByIndex(table, index) {
            const realRow = table.rows[index]
            const realOrgan = getOrganByCell(realRow)
            const fakeTable = R.pipe(
              cloneNode(true),
              realOrgan ? R.curry(appendDOMChild)(clone(false)(real)) : R.identity,
              R.curry(appendDOMChild)(cloneNode(false)(table))
            )(fakeF)
            const tuple = R.zip(
              ArrayFrom(fakeTable.rows[0].children)
            )
            R.forEach(function ([realCell, fakeCell]) {
              setStyle(fakeCell, 'height', addPx(prop(realCell, 'clientWidth')))
            })(tuple)
          }

          export function getTableLength(table, mode) {
            const getRowLength = R.compose(
            )
            return mode === rowType ?
              table.rows.length :
              R.compose(R.apply(Math.max), R.map(getRowLength), ArrayFrom)(table.rows)
          }

          export function getFakeTables(table, mode) {
            const tableLength = getTableLength(table, mode)
            return R.map(R.partial(getFakeTableByIndex, [table, mode]))(createArrByNumber(tableLength))
          }

          export function getColumnCellsByIndex(table, index) {
            return R.compose(
              R.map((row) => {
                return row.children[index]
              }),
              ArrayFrom)(table.rows)
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

