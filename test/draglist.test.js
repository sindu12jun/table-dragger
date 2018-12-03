import Drag from '../src/drag'
import DragList from '../src/draggable-list'
import classes from '../src/classes'

let table = null
let drag = null
let dragList = null

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
  drag = new Drag(table)
  dragList = new DragList({ mode: 'column', originTable: drag })
})

test('new ul position is the same with table', () => {
  const ul = dragList.el
  const tableRect = table.getBoundingClientRect()
  const ulRect = ul.getBoundingClientRect()
  expect(tableRect).toMatchObject(ulRect)
})

test('classes is ok', () => {
  window.getComputedStyle(table).getPropertyValue('visibility').toBe('hidden')
})

