# table-dragger

> Finally, you are able to drag and sort table freely

# Demo

Try out the [demo][2]!

# Inspiration
Table-dragger is a minimalist plain Javascript library for building reorderable drag-and-drop table.

# Features
- Super easy to set up
- Able to sort columns or rows at the same time
- No bloated dependencies
- Smooth animation when sort
- Touch events

# Install
You can get it on npm.

```shell
npm install table-dragger --save
```

# Usage
```
import tableDragger from 'table-dragger'

tableDragger(el, options?)
```
```html
<table id="table">
  <thead>
  <tr>
    <th class='handle'>header1</th>
    <th class='handle'>header2</th>
  </tr>
  </thead>
  <tbody>
  <tr>
    <td>conten1</td>
    <td>conten2</td>
  </tr>
  </tbody>
</table>
```
```js
var el = document.getElementById('table');
var dragger = tableDragger(el, {
  mode: 'row',
  dragHandler: '.handle',
  onlyBody: true,
  animation: 300
});
dragger.on('drop',function(from, to){
  console(from);
  console(to);
});
```
And you could also not set any options, which defaults to drag with the default options.

The options are detailed below.

#### `options.mode`
- Setting `mode` to `column`, user drag and sort columns of table
- Setting `mode` to `row`, user drag and sort rows of table
- Setting `mode` to `free`, user drag rows or columns, depending on the direction of the mouse movement after tapping.

#### `options.dragHandler`
- `dragHandler` is drag handle selector within table
- By default, when in `column` mode, `dragHandler` is the first row of table; in `row` mode, the first column.

#### `options.onlyBody`
- Setting `onlyBody` to `true` in `row` mode, user can only lift rows in `tbody`.

#### `options.animation`
- ms, animation speed moving items when sorting, `300` — without animation

# API
The `tableDragger` method returns a tiny object with a concise API. We'll refer to the API returned by `tableDragger` as `dragger`

#### `dragger.on (Events)`
The `dragger` is an event emitter. The following events can be tracked using `dragger.on(type, listener)`:

Event Name | Listener Arguments               | Event Description
-----------|----------------------------------|-------------------------------------------------------------------------------------
`drag`     | `el, mode`                     | `el` is the origin table, `mode` is `column` or `row`, shows the mode user sort
`drop`  | `oldIndex, newIndex, el, mode`                             | `oldIndex` is the index before sort. `newIndex` is the index after sort.
`shadowMove`  | `oldIndex, newIndex, el, mode`                             | trigger when column(row) is being lifted and moving into other column(row) place.
`out`   | `el, mode`          | column(row) was dragged out of `el`, or dropped


#### `dragger.dragging`
This property will be true whenever an element is being dragged.

#### `dragger.destroy`
Removes all drag and drop events used by `table-dragger` to manage drag and drop.

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# run unit tests
npm run unit

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

[2]: http://bevacqua.github.io/dragula/
