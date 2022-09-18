import test from 'ava'
import { each } from 'test-each'

import {
  defineClassOpts,
  defineSimpleClass,
  defineSimpleCustom,
  defineDeepCustom,
  defineClassesOpts,
} from '../helpers/main.js'

const { TestError, AnyError } = defineSimpleClass()
const { SimpleCustomError } = defineSimpleCustom()
const { DeepCustomError } = defineDeepCustom()

test('Parent class is AnyError by default', (t) => {
  t.is(Object.getPrototypeOf(TestError), AnyError)
})

test('AnyError cannot be passed as is', (t) => {
  t.throws(
    defineClassesOpts.bind(undefined, (TestAnyError) => ({
      ShallowError: { custom: TestAnyError },
    })),
  )
})

each([SimpleCustomError, DeepCustomError], ({ title }, ErrorClass) => {
  test(`Parent class is custom class when passed | ${title}`, (t) => {
    t.is(Object.getPrototypeOf(ErrorClass).name, ErrorClass.name)
  })

  test(`Custom classes are inherited | ${title}`, (t) => {
    t.true(ErrorClass.staticProp)
    t.true(new ErrorClass('test').prop)
  })
})

class NullClass {}
// eslint-disable-next-line fp/no-mutating-methods, unicorn/no-null
Object.setPrototypeOf(NullClass, null)

each(
  [
    'TestError',
    NullClass,
    Object,
    Function,
    () => {},
    Error,
    TypeError,
    class ChildTypeError extends TypeError {},
    class NoParentError {},
    class InvalidError extends Object {},
    Object.getPrototypeOf(AnyError),
    AnyError,
    TestError,
  ],
  ({ title }, custom) => {
    test(`Validate against invalid "custom" option | ${title}`, (t) => {
      t.throws(defineClassOpts.bind(undefined, { custom }))
    })
  },
)

// eslint-disable-next-line unicorn/no-null
each(['', null], ({ title }, invalidPrototype) => {
  test(`Validate against invalid prototypes | ${title}`, (t) => {
    t.throws(
      // eslint-disable-next-line max-nested-callbacks
      defineClassesOpts.bind(undefined, (TestAnyError) => {
        // eslint-disable-next-line unicorn/consistent-function-scoping, max-nested-callbacks
        const custom = function () {}
        // eslint-disable-next-line fp/no-mutation
        custom.prototype = invalidPrototype
        // eslint-disable-next-line fp/no-mutating-methods
        Object.setPrototypeOf(custom, TestAnyError)
        return { InputError: { custom } }
      }),
    )
  })
})

test('Validate against invalid constructor', (t) => {
  t.throws(
    defineClassesOpts.bind(undefined, (TestAnyError) => {
      class custom extends TestAnyError {}
      // eslint-disable-next-line fp/no-mutation
      custom.prototype.constructor = Error
      return { InputError: { custom } }
    }),
  )
})

test('"custom" option is not modified', (t) => {
  const { InputError } = defineClassesOpts((TestAnyError) => ({
    InputError: {
      custom: class ReadonlyClass extends TestAnyError {},
    },
  }))
  t.is(Object.getPrototypeOf(InputError).name, 'ReadonlyClass')
})

test('"custom" option can be shared', (t) => {
  const { TwoError } = defineClassesOpts((TestAnyError) => {
    class Parent extends TestAnyError {}
    return { OneError: { custom: Parent }, TwoError: { custom: Parent } }
  })
  t.is(Object.getPrototypeOf(TwoError).name, 'Parent')
})
