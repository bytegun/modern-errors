import { expectAssignable, expectNotAssignable } from 'tsd'

import ModernError, { Plugin, ErrorClass } from 'modern-errors'

const barePlugin = { name: 'test' as const }
const fullPlugin = { ...barePlugin, instanceMethods: { instanceMethod() {} } }

type BareErrorClass = ErrorClass<[typeof barePlugin]>
type FullErrorClass = ErrorClass<[typeof fullPlugin]>

const BaseError = ModernError.subclass('BaseError', { plugins: [fullPlugin] })

expectAssignable<ErrorClass>(BaseError)
expectAssignable<BareErrorClass>(BaseError)
expectAssignable<FullErrorClass>(BaseError)

const ChildError = BaseError.subclass('ChildError')

expectAssignable<ErrorClass>(ChildError)
expectAssignable<BareErrorClass>(ChildError)
expectAssignable<FullErrorClass>(ChildError)

const WideBaseError = ModernError.subclass('WideBaseError', {
  plugins: [{} as Plugin],
})

expectAssignable<ErrorClass>(WideBaseError)
expectAssignable<BareErrorClass>(WideBaseError)
expectNotAssignable<FullErrorClass>(WideBaseError)

const WideError = WideBaseError.subclass('WideError')

expectAssignable<ErrorClass>(WideError)
expectAssignable<BareErrorClass>(WideError)
expectNotAssignable<FullErrorClass>(WideError)
