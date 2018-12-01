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

test('')
