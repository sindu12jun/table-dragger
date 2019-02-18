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

  function modeString(mode) {
    return mode === columnType ? 'column' : 'row'
  }

