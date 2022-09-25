import test from 'ava'
import { each } from 'test-each'

import { defineGlobalOpts, defineClassOpts } from '../helpers/main.js'
import { TEST_PLUGIN } from '../helpers/plugin.js'

const { TestError } = defineClassOpts()

test('plugin.normalize() is optional', (t) => {
  const { TestError: OtherTestError } = defineClassOpts({}, {}, [
    { ...TEST_PLUGIN, normalize: undefined },
  ])
  t.true(new OtherTestError('test', { prop: true }).set.options)
})

each([defineGlobalOpts, defineClassOpts], ({ title }, defineOpts) => {
  test(`plugin.normalize() exceptions are thrown right away for global and class options | ${title}`, (t) => {
    t.throws(defineOpts.bind(undefined, { prop: 'invalid' }))
  })
})

test('plugin.normalize() exceptions are not thrown right away for instance options', (t) => {
  t.throws(() => new TestError('test', { prop: 'invalid' }))
})
