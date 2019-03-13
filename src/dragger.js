import * as Rx from 'rxjs'
import * as R from 'ramda'

export default function tableDragger(table, userOptions) {
  const options = Object.assign({}, defaultOptions, userOptions)
  const {dragHandler, mode: optionMode} = options
  const handlers = getHandlers(table, options, dragHandler)
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

    }),
  )

  firstDrag$.subscribe(({targetIndex, mode}) => {
    const onlyBody = options.onlyBody && optionMode === 'row'

    addClass(table, classes.originTable)
    const fakeTable = R.compose(
      R.curry(renderFakeTable)(table),
      getWholeFakeTable)(table, mode)
    dragula([fakeTable], {
      animation: 300,
      staticClass: classes.static,
      direction: mode === columnType ? 'horizontal' : 'vertical',
    })
      .on('drag', () => {
        return onDrag(dragger, table, mode)
      })

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




