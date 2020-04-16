const pkg = require('yvan-ui')
const { hello } = require('yvan-ui')

describe('test', () => {
  it('simple example', () => {
    pkg.hello()
    hello()
  })
})
