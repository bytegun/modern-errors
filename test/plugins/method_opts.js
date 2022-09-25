import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts, defineGlobalOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const callStaticMethod = function ({ AnyError: TestAnyError, args }) {
  return TestAnyError.getProp(...args)
}

const callInstanceMethod = function ({ TestError, args }) {
  return new TestError('message').getInstance(...args)
}

each([callStaticMethod, callInstanceMethod], ({ title }, callMethod) => {
  test(`plugin methods can pass method options | ${title}`, (t) => {
    const { AnyError, TestError } = defineGlobalOpts({ prop: false })
    t.true(callMethod({ AnyError, TestError, args: [true] }).options.prop)
  })

  test(`plugin methods merge method options | ${title}`, (t) => {
    const { AnyError, TestError } = defineGlobalOpts({
      prop: { one: false, two: { three: false }, five: false },
    })
    t.deepEqual(
      callMethod({
        AnyError,
        TestError,
        args: [{ one: true, two: { three: true }, four: true }],
      }).options.prop,
      { one: true, two: { three: true }, four: true, five: false },
    )
  })

  test(`plugin methods do not forward method options | ${title}`, (t) => {
    const { AnyError, TestError } = defineClassOpts()
    t.deepEqual(callMethod({ AnyError, TestError, args: [0, true] }).args, [0])
  })

  test(`plugin methods pass last argument as method options if plugin.isOptions() is undefined | ${title}`, (t) => {
    const { AnyError, TestError } = defineGlobalOpts({}, [
      { ...TEST_PLUGIN, isOptions: undefined },
    ])
    t.deepEqual(callMethod({ AnyError, TestError, args: [0, true] }).args, [0])
  })

  test(`plugin methods only pass method options if plugin.isOptions() returns true | ${title}`, (t) => {
    const { AnyError, TestError } = defineClassOpts()
    t.deepEqual(callMethod({ AnyError, TestError, args: [0] }).args, [0])
  })

  test(`plugin methods can have no arguments | ${title}`, (t) => {
    const { AnyError, TestError } = defineClassOpts()
    t.deepEqual(callMethod({ AnyError, TestError, args: [] }).args, [])
  })
})
