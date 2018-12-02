import Drag from '../src/drag'
import DragList from '../src/draggable-list'
import { createDrag, raise } from './utils'

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
  dragList = new DragList({mode:'column',originTable:table})
})

test('listener triggers when event emits', () => {
  const drag = new Drag(table)
  const onDrag = jest.fn();
  const onDrop = jest.fn();
  const onShadowMove = jest.fn();
  const onOut = jest.fn();

  drag.on('drag',onDrag)
  drag.on('drop',onDrop)
  drag.on('shadowMove',onShadowMove)
  drag.on('out',onOut)
})
