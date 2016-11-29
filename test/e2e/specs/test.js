// For authoring Nightwatch tests, see
// http://nightwatchjs.org/guide#usage

module.exports = {
  'default e2e tests': function test(browser) {
    // automatically uses dev Server port from /config.index.js
    // default: http://localhost:8080
    // see nightwatch.conf.js
    const devServer = browser.globals.devServerURL;

    // drag and drop 不能被测试
    browser
      .url(devServer)
    browser.waitForElementVisible('#table2', 5000)
      .moveToElement('ul.sindu_sortable_table > li:nth-child(1)', 10, 10)
      .mouseButtonDown(0)
      .moveToElement('ul.sindu_sortable_table > li:nth-child(3)', 10, 10)
      .mouseButtonUp(0)
      .pause(5000)
      .end()
  },
};
