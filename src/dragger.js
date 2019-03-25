import * as Rx from 'rxjs'
import * as R from 'ramda'

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


