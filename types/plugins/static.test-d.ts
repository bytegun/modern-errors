import {
  expectType,
  expectAssignable,
  expectNotAssignable,
  expectError,
} from 'tsd'

import modernErrors, { Info, Plugin } from 'modern-errors'

const name = 'test' as const
const emptyPlugin = { name }
const barePlugin = {
  ...emptyPlugin,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], arg: '') => arg,
  },
}
const fullPlugin = {
  ...barePlugin,
  getOptions: (input: true) => input,
}

const BareBaseError = modernErrors([barePlugin])
const FullBaseError = modernErrors([fullPlugin])
const MixBaseError = modernErrors([emptyPlugin, fullPlugin] as const)
const BareChildError = BareBaseError.subclass('BareChildError')
const FullChildError = FullBaseError.subclass('FullChildError')
const MixChildError = MixBaseError.subclass('MixChildError')

expectType<''>(BareBaseError.staticMethod(''))
expectType<''>(FullBaseError.staticMethod(''))
expectType<''>(MixBaseError.staticMethod(''))
expectError(expectType<''>(BareBaseError.staticMethod(true)))
expectError(expectType<''>(FullBaseError.staticMethod(true)))
expectError(expectType<''>(MixBaseError.staticMethod(true)))

expectType<''>(FullBaseError.staticMethod('', true))
expectError(BareBaseError.staticMethod('', true))
expectError(BareBaseError.staticMethod('', undefined))
expectError(FullBaseError.staticMethod('', false))
expectError(FullBaseError.staticMethod('', undefined))
expectError(FullBaseError.staticMethod('', true, undefined))
expectError(MixBaseError.staticMethod('', false))
expectError(MixBaseError.staticMethod('', undefined))
expectError(MixBaseError.staticMethod('', true, undefined))

const info = {} as Info['staticMethods']
expectError(BareBaseError.staticMethod(info))
expectError(FullBaseError.staticMethod(info, ''))
expectError(MixBaseError.staticMethod(info, ''))

const WideBaseError = modernErrors([{} as Plugin])
const ChildWideError = WideBaseError.subclass('ChildWideError')

expectError(BareBaseError.otherMethod())
expectError(FullBaseError.otherMethod())
expectError(MixBaseError.otherMethod())
expectError(WideBaseError.otherMethod())
expectError(BareChildError.otherMethod())
expectError(FullChildError.otherMethod())
expectError(MixChildError.otherMethod())
expectError(ChildWideError.otherMethod())

expectError(BareChildError.staticMethod())
expectError(FullChildError.staticMethod())
expectError(MixChildError.staticMethod())
expectError(ChildWideError.staticMethod())

expectAssignable<Plugin>({
  name,
  staticMethods: {
    staticMethod: (info: Info['staticMethods'], one: '', two: '') => '',
  },
})
expectAssignable<Plugin>({ name, staticMethods: {} })
expectNotAssignable<Plugin>({ name, staticMethods: true })
expectNotAssignable<Plugin>({ name, staticMethods: { staticMethod: true } })
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: true) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: { one: '' }) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: Info['properties']) => '' },
})
expectNotAssignable<Plugin>({
  name,
  staticMethods: { staticMethod: (info: Info['instanceMethods']) => '' },
})
