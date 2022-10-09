import { runInNewContext } from 'vm'

import test from 'ava'
import { each } from 'test-each'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, UnknownError, AnyError } = defineClassOpts()
const ChildUnknownError = UnknownError.subclass('ChildUnknownError')

test('Validate that AnyError has a cause', (t) => {
  t.throws(() => new AnyError('message'))
})

test('AnyError with known cause uses its class', (t) => {
  const cause = new TestError('causeMessage')
  const error = new AnyError('message', { cause })
  t.true(error instanceof Error)
  t.true(error instanceof TestError)
  t.is(Object.getPrototypeOf(error), TestError.prototype)
  t.is(error.name, 'TestError')
})

test('AnyError with unknown cause uses UnknownError', (t) => {
  const cause = new Error('causeMessage')
  const error = new AnyError('message', { cause })
  t.true(error instanceof Error)
  t.true(error instanceof UnknownError)
  t.is(Object.getPrototypeOf(error), UnknownError.prototype)
  t.is(error.name, 'UnknownError')
})

test('AnyError with undefined cause uses UnknownError', (t) => {
  t.is(new AnyError('message', { cause: undefined }).name, 'UnknownError')
})

each(
  [AnyError, UnknownError, ChildUnknownError],
  [TypeError, runInNewContext('TypeError')],
  ({ title }, ParentErrorClass, ErrorClass) => {
    test(`AnyError and UnknownError with unknown cause keeps error name if present | ${title}`, (t) => {
      const message = 'causeMessage'
      const cause = new ErrorClass(message)
      t.is(
        new ParentErrorClass('', { cause }).message,
        `${ErrorClass.name}: ${message}`,
      )
    })
  },
)

each(
  [AnyError, UnknownError, ChildUnknownError],
  [
    () => 'causeMessage',
    // eslint-disable-next-line fp/no-mutating-assign
    () => Object.assign(new TypeError('causeMessage'), { name: true }),
    () => new Error('causeMessage'),
    () => new UnknownError('causeMessage'),
  ],
  ({ title }, ParentErrorClass, getCause) => {
    test(`AnyError and UnknownError with unknown cause does not keep error name if absent | ${title}`, (t) => {
      t.is(
        new ParentErrorClass('', { cause: getCause() }).message,
        'causeMessage',
      )
    })
  },
)

each([UnknownError, ChildUnknownError], ({ title }, ErrorClass) => {
  test(`UnknownError with known cause keeps error name | ${title}`, (t) => {
    const message = 'causeMessage'
    const cause = new TestError(message)
    t.is(new ErrorClass('', { cause }).message, `TestError: ${message}`)
  })
})

test('Known errors with known cause do not keep error name', (t) => {
  const message = 'causeMessage'
  const cause = new TestError(message)
  t.is(new TestError('', { cause }).message, message)
})

each(
  [TypeError, TestError],
  [UnknownError, ChildUnknownError],
  ({ title }, ErrorClass, ParentErrorClass) => {
    test(`UnknownError does not keeps error name if non-empty message | ${title}`, (t) => {
      const message = 'causeMessage'
      const parentMessage = 'message'
      const cause = new ErrorClass(message)
      t.is(
        new ParentErrorClass(parentMessage, { cause }).message,
        `${message}\n${parentMessage}`,
      )
    })
  },
)
