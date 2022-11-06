import isErrorInstance from 'is-error-instance'
import mergeErrorCause from 'merge-error-cause'
import setErrorMessage from 'set-error-message'

import { isSubclass } from './utils/subclass.js'

// Like `mergeCause()` but run outside of `new ErrorClass(...)`
export const mergeSpecificCause = function (error, cause) {
  error.cause = cause
  error.wrap = true
  return mergeErrorCause(error)
}

// `error.cause` is merged as soon as the error is instantiated:
//  - This is simpler as it avoids the error shape to change over its lifetime
//    (before|after `ErrorClass.normalize()`)
//  - This makes it easier to debug that merging itself
//  - This allow benefitting from `cause` merging before
//    `ErrorClass.normalize()`, e.g. for improved debugging
// `error`'s class is used over `error.cause`'s since users expect the instance
// class to match the constructor being used.
// However, if `error.cause` has the same class or a child class, we keep it
// instead
//  - This allows using `new AnyError(...)` to wrap an error without changing
//    its class
//  - This returns a subclass of the parent class, which does not break
//    inheritance nor user expectations
export const mergeCause = function (error, ErrorClass) {
  return isErrorInstance(error.cause)
    ? mergeInstanceCause(error, ErrorClass)
    : mergeErrorCause(error)
}

const mergeInstanceCause = function (error, ErrorClass) {
  const { cause } = error
  error.wrap = isSubclass(cause.constructor, ErrorClass)
  return shouldPrefixCause(error, ErrorClass)
    ? mergePrefixedCause(error)
    : mergeErrorCause(error)
}

// When switching error classes, we keep the old class name in the error
// message, except:
//  - When the error name is absent or is too generic
//     - Including `Error`, `TypeError`, etc. except when `error.name` has been
//       set to something else, since this is a common pattern
//  - When the child is a subclass of the parent, since the class does not
//    change then
//  - When the parent is a subclass of the child, since the new class becomes
//    the subclass, which already contains the other class in its chain, i.e.
//    not worth adding to the message
const shouldPrefixCause = function (error, ErrorClass) {
  const { cause } = error
  return (
    hasValidName(cause) &&
    (hasUsefulName(cause, ErrorClass) || cause.name !== cause.constructor.name)
  )
}

const hasValidName = function (cause) {
  return (
    typeof cause.name === 'string' &&
    cause.name !== '' &&
    typeof cause.constructor === 'function' &&
    typeof cause.constructor.name === 'string'
  )
}

const hasUsefulName = function (cause, ErrorClass) {
  return !(
    isSubclass(cause.constructor, ErrorClass) ||
    isSubclass(ErrorClass, cause.constructor) ||
    cause.constructor.name in globalThis
  )
}

const mergePrefixedCause = function (error) {
  const { cause } = error
  const { oldMessage, newMessage } = prefixCauseName(cause)
  setErrorMessage(cause, newMessage)
  const errorA = mergeErrorCause(error)
  setErrorMessage(cause, oldMessage)
  return errorA
}

const prefixCauseName = function (cause) {
  const oldMessage = typeof cause.message === 'string' ? cause.message : ''
  const newMessage =
    oldMessage === '' ? cause.name : `${cause.name}: ${oldMessage}`
  return { oldMessage, newMessage }
}
