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

    const table = await page.$(`#${tableName}`)
    await page.evaluate((element) => {
      window.scroll(0, element.offsetTop);
    }, table);
    const tableBox = await table.boundingBox()
    const start = await table.$('.' + startClass)
    const end = await table.$('.' + endClass)
    const startBox = await start.boundingBox()
    const endBox = await end.boundingBox()

    await page.mouse.move(...getCenter(startBox));
    await page.mouse.down()
    await page.mouse.move(...getTargetPosition(endBox))
    await page.mouse.move(...getCenter(startBox));
    await page.mouse.move(...getTargetPosition(endBox))

    expect(await getClasses(table)).toContain(classes.originTable)
    expect(await page.evaluate((table) => {
        return getComputedStyle(table).getPropertyValue('visibility');
      }, table)
    ).toBe('hidden')

    const fakeTable = await page.$(`.${classes.fakeTable}`)
    expect(fakeTable).toBeTruthy()
    expect(await getClasses(await parent(fakeTable))).toContain(classes.dragging)

    const fakeTableBox = await fakeTable.boundingBox()
    expect(tableBox).toEqual(fakeTableBox)

    await page.mouse.up()
    if (mode === 'column') {
      expect(await getClasses(await previous(start))).toContain(endClass)
    }
  }, 10000)
}


afterAll(async () => {
  page.close()
})

function getCenter(box) {
  return [box.x + box.width / 2,
    box.y + box.height / 2
  ]
}

function getRight(box) {
  return [box.x + box.width, box.y + box.height / 2]
}

function getLeft(box) {
  return [box.x, box.y + box.height / 2]
}

function getTop(box) {
  return [box.x + box.width / 2, box.y]
}

function getBottom(box) {
  return [box.x + box.width / 2, box.y]
}

function parent(element) {
  return page.evaluateHandle((element) => {
    return element.parentElement
  }, element);
}

function children(element) {
  return page.evaluateHandle((element) => {
    return element.children
  }, element);
}

function previous(element) {
  return page.evaluateHandle((element) => {
    return element.previousElementSibling
  }, element);
}

async function getClasses(element) {
  return page.evaluate((element) => {
    return Array.from(element.classList)
  }, element);
}


//