import test from 'ava'
import { each } from 'test-each'

import { KnownErrorClasses, AnyError, TestError } from '../helpers/known.js'
import { defineClassOpts } from '../helpers/main.js'

each(KnownErrorClasses, ({ title }, ErrorClass) => {
  test(`ErrorClass.normalize() normalizes unknown errors | ${title}`, (t) => {
    t.true(ErrorClass.normalize() instanceof Error)
  })

  test(`ErrorClass.normalize() normalizes known errors | ${title}`, (t) => {
    const error = new ErrorClass('test')
    const { name } = error
    // eslint-disable-next-line fp/no-mutating-methods
    Object.defineProperty(error, 'name', {
      value: name,
      enumerable: true,
      writable: true,
      configurable: true,
    })
    error.message = true
    const normalizedError = ErrorClass.normalize(error)
    t.true(normalizedError instanceof ErrorClass)
    t.is(normalizedError.name, name)
    t.false(Object.getOwnPropertyDescriptor(error, 'name').enumerable)
    t.is(normalizedError.message, '')
  })

  test(`ErrorClass.normalize() keeps error class if known | ${title}`, (t) => {
    const error = new TestError('test')
    const normalizedError = ErrorClass.normalize(error)
    t.is(error, normalizedError)
    t.true(normalizedError instanceof TestError)
  })

  test(`ErrorClass.normalize() prevents naming collisions | ${title}`, (t) => {
    const { TestError: OtherTestError } = defineClassOpts()
    const normalizedError = ErrorClass.normalize(new OtherTestError('test'))
    t.is(normalizedError.constructor, ErrorClass)
  })
})

test('AnyError.normalize() keeps AnyError error class', (t) => {
  const error = new AnyError('test')
  t.is(AnyError.normalize(error).constructor, AnyError)
})

test('Non-AnyError.normalize() changes AnyError error class', (t) => {
  const error = new AnyError('test')
  const { message } = error
  const normalizedError = TestError.normalize(error)
  t.is(normalizedError.constructor, TestError)
  t.is(normalizedError.message, message)
})
