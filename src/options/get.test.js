import test from 'ava'
import { each } from 'test-each'

import { getClasses } from '../helpers/main.test.js'
import { ErrorSubclasses, TEST_PLUGIN } from '../helpers/plugin.test.js'

const { ErrorSubclasses: NoOptionsErrorClasses } = getClasses({
  plugins: [{ ...TEST_PLUGIN, getOptions: undefined }],
})

each(NoOptionsErrorClasses, ({ title }, ErrorClass) => {
  test(`plugin.getOptions() forbids options by default | ${title}`, (t) => {
    t.throws(() => new ErrorClass('test', { prop: true }))
  })
})

each(
  NoOptionsErrorClasses,
  [undefined, {}, { prop: undefined }],
  ({ title }, ErrorClass, opts) => {
    test(`plugin.getOptions() allows undefined options by default | ${title}`, (t) => {
      t.notThrows(() => new ErrorClass('test', opts))
    })
  },
)

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`plugin.getOptions() validate class options | ${title}`, (t) => {
    t.throws(
      ErrorClass.subclass.bind(undefined, 'TestError', { prop: 'invalid' }),
      { message: 'Invalid "prop" options: Invalid prop' },
    )
  })

  test(`plugin.getOptions() validate instance options | ${title}`, (t) => {
    t.throws(() => new ErrorClass('test', { prop: 'invalid' }), {
      message: 'Invalid "prop" options: Invalid prop',
    })
  })
})
