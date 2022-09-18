import test from 'ava'
import { each } from 'test-each'

import { defineSimpleClass } from '../helpers/main.js'

each(['AnyError', 'TestError', 'UnknownError'], ({ title }, errorName) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    const ParentError = defineSimpleClass()[errorName]
    class ChildError extends ParentError {}
    // eslint-disable-next-line max-nested-callbacks
    t.throws(() => new ChildError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const ParentError = defineSimpleClass()[errorName]
    const ChildError = ParentError.subclass('ChildError', {
      custom: class extends ParentError {},
    })
    t.is(new ChildError('test').name, 'ChildError')
  })
})
