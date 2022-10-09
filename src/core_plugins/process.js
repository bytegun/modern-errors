import isPlainObj from 'is-plain-obj'
import logProcessErrors from 'log-process-errors'

const logProcess = function ({ options }) {
  return logProcessErrors(getOptions(options))
}

const getOptions = function (options) {
  if (!isPlainObj(options)) {
    throw new TypeError('It must be a plain object.')
  }

  const { exit, onError = defaultOnError, ...unknownOpts } = options
  validateOpts(onError, unknownOpts)
  const onErrorA = customOnError.bind(undefined, onError)
  return { exit, onError: onErrorA }
}

const defaultOnError = function (error) {
  // eslint-disable-next-line no-console, no-restricted-globals
  console.error(error)
}

const validateOpts = function (onError, unknownOpts) {
  const [unknownOpt] = Object.keys(unknownOpts)

  if (unknownOpt !== undefined) {
    throw new TypeError(`Unknown option "${unknownOpt}".`)
  }

  if (typeof onError !== 'function') {
    throw new TypeError(`Option "onError" must be a function: ${onError}.`)
  }
}

const customOnError = async function (onError, ...args) {
  await onError(...args)
}

// eslint-disable-next-line import/no-default-export
export default {
  name: 'process',
  staticMethods: { logProcess },
}
