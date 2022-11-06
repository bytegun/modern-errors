import test from 'ava'
import { each } from 'test-each'

import { getClasses, ModernError } from './helpers/main.js'
import { getUnknownErrors } from './helpers/unknown.js'

const { ErrorClasses, ErrorSubclasses, AnyError } = getClasses()

each(ErrorClasses, ({ title }, ErrorClass) => {
  test(`Can use known error classes | ${title}`, (t) => {
    const error = new ErrorClass('test')
    t.true(error instanceof ErrorClass)
    t.true(error instanceof Error)
  })
})

each(ErrorSubclasses, ({ title }, ErrorClass) => {
  test(`instanceof AnyError can be used with known errors | ${title}`, (t) => {
    t.true(new ErrorClass('test') instanceof AnyError)
  })
})

each(getUnknownErrors(), ({ title }, getUnknownError) => {
  test(`instanceof AnyError can be used with known errors | ${title}`, (t) => {
    t.false(getUnknownError() instanceof AnyError)
  })
})

test('instanceof AnyError prevents naming collisions', (t) => {
  const OtherAnyError = ModernError.subclass('AnyError')
  t.false(new OtherAnyError('test') instanceof AnyError)
})

test('AnyError.prototype.name is correct', (t) => {
  t.is(AnyError.prototype.name, 'AnyError')
  t.false(
    Object.getOwnPropertyDescriptor(AnyError.prototype, 'name').enumerable,
  )
})

test('Can instantiate ModernError without any subclass', (t) => {
  t.true(new ModernError('') instanceof ModernError)
})
