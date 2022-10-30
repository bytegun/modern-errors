import { expectType, expectAssignable } from 'tsd'
import type { ErrorName } from 'error-custom-class'

import modernErrors, { ErrorInstance } from '../../main.js'

const AnyError = modernErrors()
type AnyInstance = InstanceType<typeof AnyError>

const SError = AnyError.subclass('SError')
const SSError = SError.subclass('SSError')
const CError = AnyError.subclass('CError', {
  custom: class extends AnyError {},
})
const SCError = CError.subclass('SCError')
const CSError = SError.subclass('CSError', { custom: class extends SError {} })
const CCError = CError.subclass('CCError', { custom: class extends CError {} })

const wideError = {} as any as AnyInstance
const sError = new SError('')
const ssError = new SSError('')
const cError = new CError('')
const scError = new SCError('')
const csError = new CSError('')
const ccError = new CCError('')

expectAssignable<Error>(wideError)
expectAssignable<Error>(sError)
expectAssignable<Error>(ssError)
expectAssignable<Error>(cError)
expectAssignable<Error>(scError)
expectAssignable<Error>(csError)
expectAssignable<Error>(ccError)

expectAssignable<ErrorInstance>(wideError)
expectAssignable<ErrorInstance>(sError)
expectAssignable<ErrorInstance>(ssError)
expectAssignable<ErrorInstance>(cError)
expectAssignable<ErrorInstance>(scError)
expectAssignable<ErrorInstance>(csError)
expectAssignable<ErrorInstance>(ccError)

expectAssignable<AnyInstance>(wideError)
expectAssignable<AnyInstance>(sError)
expectAssignable<AnyInstance>(ssError)
expectAssignable<AnyInstance>(cError)
expectAssignable<AnyInstance>(scError)
expectAssignable<AnyInstance>(csError)
expectAssignable<AnyInstance>(ccError)

expectAssignable<typeof AnyError['prototype']>(wideError)
expectAssignable<typeof SError['prototype']>(sError)
expectAssignable<typeof SSError['prototype']>(ssError)
expectAssignable<typeof CError['prototype']>(cError)
expectAssignable<typeof SCError['prototype']>(scError)
expectAssignable<typeof CSError['prototype']>(csError)
expectAssignable<typeof CCError['prototype']>(ccError)

expectType<ErrorName>(wideError.name)
expectType<'SError'>(sError.name)
expectType<'SSError'>(ssError.name)
expectType<'CError'>(cError.name)
expectType<'SCError'>(scError.name)
expectType<'CSError'>(csError.name)
expectType<'CCError'>(ccError.name)

expectAssignable<Error>({} as ErrorInstance)