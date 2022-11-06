import test from 'ava'

import { defineClassOpts } from '../helpers/main.js'

const { TestError, AnyError } = defineClassOpts()

test('"props" are validated', (t) => {
  t.throws(() => new TestError('message', { props: true }))
})

test('"props" are assigned', (t) => {
  t.true(new TestError('message', { props: { prop: true } }).prop)
})

test('"props" are sanitized', (t) => {
  const message = 'message'
  t.is(
    new TestError(message, { props: { message: 'otherMessage' } }).message,
    message,
  )
})

test('"props" have priority over cause', (t) => {
  const cause = new TestError('causeMessage', { props: { prop: false } })
  t.true(new TestError('message', { cause, props: { prop: true } }).prop)
})

test('"props" can be used even if cause has none', (t) => {
  const cause = new TestError('causeMessage')
  t.true(new TestError('message', { cause, props: { prop: true } }).prop)
})

const getPropsMergeError = function (ErrorClass) {
  const propSym = Symbol('prop')
  const cause = new TestError('causeMessage', {
    props: { one: true, [propSym]: true },
  })
  const error = new ErrorClass('message', { cause, props: { two: true } })
  return { error, propSym }
}

test('"props" are overridden without AnyError', (t) => {
  const { error, propSym } = getPropsMergeError(TestError)
  t.false('one' in error)
  t.false(propSym in error)
  t.true(error.two)
})

test('"props" are merged with AnyError', (t) => {
  const { error, propSym } = getPropsMergeError(AnyError)
  t.true(error.one)
  t.true(error[propSym])
  t.true(error.two)
})

test('"props" cannot override "message"', (t) => {
  const message = 'testMessage'
  const error = new TestError('', { props: { message } })
  t.false(error.message.includes(message))
})

test('"props" cannot unset "message"', (t) => {
  const message = 'testMessage'
  const cause = new TestError('', { props: { message: 'causeMessage' } })
  const error = new TestError(message, { cause })
  t.is(error.message, message)
})

test('"props" have less priority than other plugin.properties()', (t) => {
  t.true(
    new TestError('message', {
      prop: { toSet: { prop: true } },
      props: { prop: false },
    }).prop,
  )
})