import classes from '../src/classes'

const timeout = 20000

beforeAll(async () => {
  await page.goto('http://localhost:8080/');
}, timeout);

const tables = [
  {
    id: 'row-table',
    desc: 'row mode',
    mode: 'row'
  },
  {
    id: 'column-table',
    desc: 'column mode',
    mode: 'column'
  },
  {
    id: 'free-table',
    desc: 'free-column mode',
    mode: 'column'
  },
  {
    id: 'free-table',
    desc: 'free-row',
    mode: 'row'
  },
]

tables.forEach(({id, desc, mode}) => {
  testTable({tableName: id, desc, mode})
})

function testTable({tableName, desc, mode}) {

  const startIndex = 1
  const endIndex = 3
  test(desc, async () => {
    const startClass = `${mode === 'column' ? 'c' : 'r'}${startIndex}`
    const endClass = `${mode === 'column' ? 'c' : 'r'}${endIndex}`

    let getTargetPosition
    if (mode === 'column') {
      getTargetPosition = startIndex < endIndex ? getRight : getLeft
    } else {
      getTargetPosition = startIndex < endIndex ? getBottom : getTop
    }

    await page.evaluate((element) => {
      window.scroll(0, element.offsetTop);
    }, table);
    const startBox = await start.boundingBox()
    const endBox = await end.boundingBox()
  }
}