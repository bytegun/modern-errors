import test from 'ava'
import { each } from 'test-each'

import { ErrorClasses } from '../helpers/main.test.js'

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Cannot extend without subclass() | ${title}`, (t) => {
    class TestError extends ErrorClass {}
    t.throws(() => new TestError('test'))
  })

  test(`Can extend with subclass() | ${title}`, (t) => {
    const TestError = ErrorClass.subclass('TestError')
    t.is(new TestError('test').constructor, TestError)
  })
})
