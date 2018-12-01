import Drag from '../src/drag'
import DragList from '../src/draggable-list'
import { createDrag, raise } from './utils'

let table = null

beforeEach(() => {
  document.body.innerHTML = `
    <table id="table">
      <tr>
        <th>Month</th>
        <th>Savings</th>
      </tr>
      <tr>
        <td id="handler">January</td>
        <td>$100</td>
      </tr>
    </table>
  `
  table = document.querySelector('#table')
});

//
test('should specify dragHandler in free mode', () => {
  expect(() => {
    new Drag(table, { mode: 'free' })
  }).toThrow()
})

test('should be dragging', () => {
  var table = document.querySelector('#table')
  const drag = new Drag(table)
  createDrag(drag, drag.handlers[0], { gapX: 20 })
  raise(drag.handlers[0], 'mousedown', { button: 0, clientX: 100, clientY: 100 })
  expect(drag.dragger.dragging).toBe(true)
  raise(drag.handlers[0], 'mouseup', { button: 0 })
})

test('should record coord when tapping', () => {
  var table = document.querySelector('#table')
  const drag = new Drag(table)
  raise(drag.handlers[0], 'mousedown', { button: 0, clientX: 100, clientY: 100 })
  expect(drag.tappedCoord).toMatchObject({ x: 100, y: 100 })
  raise(drag.handlers[0], 'mouseup', { button: 0 })
})

test('transform into column mode when dragging', () => {
  var table = document.querySelector('#table')
  const drag = new Drag(table, { mode: 'free', dragHandler: '#handler' })
  createDrag(drag, drag.handlers[0], { gapX: 10 })
  expect(drag.realMode).toBe('column')
})

test('transform into row mode when dragging', () => {
  const drag = new Drag(table, { mode: 'free', dragHandler: '#handler' })
  createDrag(drag, drag.handlers[0], { gapY: 10 })
  expect(drag.realMode).toBe('row')
})

test('create drag list when dragging start', () => {
  const drag = new Drag(table)
  createDrag(drag, drag.handlers[0], { gapX: 10 })
  expect(drag.sortTable).toBeInstanceOf(DragList)
})


