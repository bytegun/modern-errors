import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { TestError } = defineClassOpts()

each([undefined, true], ({ title }, value) => {
  test(`plugin.set() must return a plain object | ${title}`, (t) => {
    const { TestError: OtherTestError } = defineClassOpts({}, {}, [
      { ...TEST_PLUGIN, set: () => value },
    ])
    t.throws(() => new OtherTestError('test'))
  })
})

each(['message', 'stack'], ({ title }, key) => {
  test(`plugin.set() can set some core properties | ${title}`, (t) => {
    const error = new TestError('test', { prop: { toSet: { [key]: '0' } } })
    t.is(error[key], '0')
    t.false(Object.getOwnPropertyDescriptor(error, key).enumerable)
  })
})

each(['one', Symbol('one')], ({ title }, key) => {
  test(`plugin.set() can set properties | ${title}`, (t) => {
    const error = new TestError('test', { prop: { toSet: { [key]: true } } })
    t.true(error[key])
  })
})

each(
  ['wrap', 'constructorArgs', 'name', 'cause', 'errors'],
  ({ title }, key) => {
    test(`plugin.set() cannot set forbidden properties | ${title}`, (t) => {
      const error = new TestError('test', {
        prop: { toSet: { [key]: 'true' } },
      })
      t.not(error[key], 'true')
    })
  },
)

test('plugin.set() shallow merge properties', (t) => {
  const error = new Error('test')
  error.one = false
  error.two = false
  const { one, two, three } = new TestError('', {
    cause: error,
    prop: { toSet: { one: true, three: true } },
  })
  t.true(one)
  t.false(two)
  t.true(three)
})
