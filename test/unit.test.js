const table = `
        <table id="default-table" class="sindu-table">
          <thead>
          <tr>
            <th>Movie Title<i class="handle"></i></th>
            <th>Genre<i class="handle"></i></th>
            <th>Year<i class="handle"></i></th>
            <th>Gross<i class="handle"></i></th>
          </tr>
          </thead>
          <tr>
            <td>Star Wars</td>
            <td>Adventure, Sci-fi</td>
            <td>1977</td>
            <td>$460,935,665</td>
          </tr>
          <tr>
            <td>Howard The Duck</td>
            <td>"Comedy"</td>
            <td>1986</td>
            <td>$16,295,774</td>
          </tr>
          <tr>
            <td>American Graffiti</td>
            <td>Comedy, Drama</td>
            <td>1973</td>
            <td>$115,000,000</td>
          </tr>
        </table>
`

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
  expect(fns.getRealMode('free', columnType) === columnType).toBe(true)
  expect(fns.getRealMode('free', rowType) === rowType).toBe(true)
})

test('get target index in table', () => {
  const firstHandle = querySelector('.handle')
  const thirdTd = querySelector('#thirdTd')
  expect(fns.getTargetIndexInTable(thirdTd, rowType)).toBe(1)
  expect(fns.getTargetIndexInTable(thirdTd, columnType)).toBe(2)
})


