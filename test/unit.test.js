import * as fns from '../src/dragger'
import classes from '../src/classes'
import {columnType, rowType} from "../src/dragger";
import * as R from 'ramda'

let wrapper, table, tableRect

const querySelectorAll = document.querySelectorAll.bind(document)
const querySelector = document.querySelector.bind(document)

function rect(element) {
  return element.getBoundingClientRect()
}

const hasClass = R.curry(function (className, cell) {
  return cell.classList.contains(className)
})

beforeEach(() => {
  document.body.innerHTML = ''
  wrapper = document.createElement('div')
  wrapper.innerHTML = `
        <table border="1" style="border-spacing: 2px 3px; table-layout: initial;border-collapse:separate;width: auto "
               id="pack-table" class="sindu-table">
          <colgroup style="width: 150px" span="2"></colgroup>
          <col style="width: 200px">
          <col>
          <thead>
          <tr>
            <th class="c1 r1">Movie Title</th>
            <th class="c2 r1 cellInThead">Genre</th>
            <th class="c3 r1">Year</th>
            <th class="c4 r1">Gross</th>
          </tr>
          </thead>
          <tr>
            <td class="c1 r2" id="firstTd"><i class="handle"></i>Star Wars</td>
            <td class="c2 r2" id="secondTd"><i class="handle"></i>Adventure, Sci-fi</td>
            <td class="c3 r2" id="thirdTd">1977</td>
            <td class="c4 r2" id="lastTd">$460,935,665</td>
          </tr>
          <tr>
            <td class="c1 r3">American Graffiti</td>
            <td class="c2 r3">Comedy, Drama</td>
            <td class="c3 r3">1973</td>
            <td class="c4 r3">$115,000,000</td>
          </tr>
          <tr>
            <td class="c1 r4">Howard The Duck</td>
            <td class="c2 r4">"Comedy"</td>
            <td class="c3 r4">1986</td>
            <td class="c4 r4">$321,391,432</td>
          </tr>
          <tfoot>
          <td class="c1 r5">300</td>
          <td class="c2 r5">100</td>
          <td class="c3 r5">200</td>
          <td class="c4 r5">50</td>
          </tfoot>
        </table>
  `
  document.body.appendChild(wrapper)
  table = document.querySelector('#pack-table')
  tableRect = rect(table)
})

test('get first column', () => {
  expect(fns.getTheFirstColumn(table).length).toBe(5);
});

test('get first row', () => {
  expect(fns.getTheFistRow(table).length).toBe(4);
})

test('get handlers', () => {
  const defaultColumnHandlers = fns.getHandlers(table, {mode: 'column'})
  const defaultRowHandlers = fns.getHandlers(table, {mode: 'row'})
  const customHandlers = fns.getHandlers(table, {mode: 'row'}, '.handle')
  expect(defaultColumnHandlers).toEqual(Array.from(fns.getTheFistRow(table)))
  expect(defaultRowHandlers).toEqual(Array.from(fns.getTheFirstColumn(table)))
  expect(customHandlers).toEqual(Array.from(table.querySelectorAll('.handle')))
})

test('move direction', () => {
  expect(fns.getMoveDirection(
    {clientX: 100, clientY: 100},
    {clientX: 100, clientY: 100}
  )).toBe(null)
  expect(fns.getMoveDirection(
    {clientX: 101, clientY: 100},
    {clientX: 100, clientY: 100}
  )).toBe(columnType)
  expect(fns.getMoveDirection(
    {clientX: 101, clientY: 100},
    {clientX: 100, clientY: 102}
  )).toBe(rowType)
})

test('get real mode', () => {
  expect(fns.getRealMode('column', rowType) === columnType).toBe(true)
  expect(fns.getRealMode('row', columnType) === rowType).toBe(true)
  expect(fns.getRealMode('free', columnType) === columnType).toBe(true)
  expect(fns.getRealMode('free', rowType) === rowType).toBe(true)
})

test('get target index in table', () => {
  const firstHandle = querySelector('.handle')
  const thirdTd = querySelector('#thirdTd')
  expect(fns.getTargetIndexInTable(firstHandle, columnType)).toBe(0)
  expect(fns.getTargetIndexInTable(firstHandle, rowType)).toBe(1)
  expect(fns.getTargetIndexInTable(thirdTd, rowType)).toBe(1)
  expect(fns.getTargetIndexInTable(thirdTd, columnType)).toBe(2)
})

test('get fake row table by index', () => {
  const rowIndex = 2
  const fakeRowTable = fns.getFakeTableByIndex(table, rowType, rowIndex)

  expect(fakeRowTable.rows.length).toBe(1)
  expect(fakeRowTable.rows[0].children.length).toBe(table.rows[rowIndex].children.length)
  expect(
    R.zip(
      Array.from(fakeRowTable.rows[0].children),
      Array.from(table.rows[rowIndex].children)
    ).every(([fakeCell, realCell]) => {
      return realCell.innerHTML === fakeCell.innerHTML
    })).toBe(true)
})

test('get fake column table by index', () => {
  const columnIndex = 2
  const fakeColumnTable = fns.getFakeTableByIndex(table, columnType, columnIndex)

  expect(fakeColumnTable.rows.length).toBe(table.rows.length)
  expect(fakeColumnTable.rows[0].children.length).toBe(1)
  expect(R.zip(
    fns.getColumnCellsByIndex(fakeColumnTable, 0),
    fns.getColumnCellsByIndex(table, columnIndex)
    ).every(([fakeCell, realCell]) => {
      return fakeCell.innerHTML === realCell.innerHTML
    })
  )
})

test('get table length', () => {
  expect(fns.getTableLength(table, rowType)).toBe(5)
  expect(fns.getTableLength(table, columnType)).toBe(4)
})


test('get fake tables', () => {
  expect(fns.getFakeTables(table, rowType).length).toBe(table.rows.length)
  expect(fns.getFakeTables(table, columnType).length).toBe(table.rows[0].children.length)
})

test('get whole table', () => {
  const fakeColumnTable = fns.getWholeFakeTable(table, columnType)
  expect(fakeColumnTable.nodeName).toBe('UL')
  expect(fakeColumnTable.children.length).toBe(4)
  expect(Array.from(fakeColumnTable.children).every(node => node.nodeName === 'LI')).toBe(true)

  const fakeRowTable = fns.getWholeFakeTable(table, rowType)
  expect(fakeRowTable.nodeName).toBe('UL')
  expect(fakeRowTable.children.length).toBe(5)
  expect(Array.from(fakeRowTable.children).every(node => node.nodeName === 'LI')).toBe(true)
  expect([fakeColumnTable, fakeRowTable].every(hasClass(classes.fakeTable))).toBe(true)
})

test('sort elements works when insert front element after latter element', () => {
  const firstTd = querySelector('#firstTd')
  const secondTd = querySelector('#secondTd')
  const thirdTd = querySelector('#thirdTd')
  const lastTd = querySelector('#lastTd')
  fns.sortElements(firstTd, thirdTd, true)
  expect(thirdTd.nextElementSibling).toBe(firstTd)
  fns.sortElements(secondTd, lastTd, true)
  expect(lastTd.nextElementSibling).toBe(secondTd)
})

test('sort elements works when insert latter element before front element', () => {
  const firstTd = querySelector('#firstTd')
  const secondTd = querySelector('#secondTd')
  const thirdTd = querySelector('#thirdTd')
  const lastTd = querySelector('#lastTd')
  fns.sortElements(thirdTd, firstTd, false)
  expect(firstTd.previousElementSibling).toBe(thirdTd)
  fns.sortElements(lastTd, secondTd, false)
  expect(secondTd.previousElementSibling).toBe(lastTd)
})

test('get column cells by index', () => {
  const getCells = R.curry(fns.getColumnCellsByIndex)(table)
  const c1 = getCells(0)
  const c2 = getCells(1)
  const c3 = getCells(2)
  expect(c1.length === 5 && c1.every(hasClass('c1'))).toBe(true)
  expect(c2.length === 5 && c2.every(hasClass('c2'))).toBe(true)
  expect(c3.length === 5 && c3.every(hasClass('c3'))).toBe(true)
})

test('exchange columns by index', () => {
  const getCells = R.curry(fns.getColumnCellsByIndex)(table)
  fns.exchangeColumns(table, 0, 1)
  expect(getCells(0).every(hasClass('c2')))
  expect(getCells(1).every(hasClass('c1')))
  fns.exchangeColumns(table, 3, 2)
  expect(getCells(2).every(hasClass('c4')))
  expect(getCells(3).every(hasClass('c3')))
})

test('exchange rows by index', () => {
  const getRowCells = R.curry(function (table, index) {
    return Array.from(table.rows[index].children)
  })(table)
  fns.exchangeRows(table, 0, 2)
  expect(getRowCells(0).every(hasClass('r3')))
  expect(getRowCells(2).every(hasClass('r1')))
  fns.exchangeRows(table, 1, 3)
  expect(getRowCells(1).every(hasClass('r5')))
  expect(getRowCells(3).every(hasClass('r2')))
})

test('get organ by cell', () => {
  const cell = querySelector('.cellInThead')
  expect(fns.getOrganByCell(cell)).toBe(table.querySelector('thead'))
  const cellInTbody = querySelector('#firstTd')
  expect(fns.getOrganByCell(cellInTbody)).toBe(querySelector('tbody'))
})

