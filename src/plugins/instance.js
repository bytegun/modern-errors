import { deepClone } from './clone.js'
import { validateDuplicatePlugin } from './duplicate.js'
import { getErrorClasses } from './error_classes.js'
import { applyIsOptions } from './method_opts.js'
import { normalizePluginOpts } from './normalize.js'

// Plugins can define an `instanceMethods` object, which is merged to
// `AnyError.prototype.*`.
export const addAllInstanceMethods = function ({
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  plugins.forEach((plugin) => {
    addInstanceMethods({ plugin, plugins, ErrorClasses, errorData, AnyError })
  })
}

const addInstanceMethods = function ({
  plugin,
  plugin: { instanceMethods },
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
}) {
  Object.entries(instanceMethods).forEach(
    addInstanceMethod.bind(undefined, {
      plugin,
      plugins,
      ErrorClasses,
      errorData,
      AnyError,
    }),
  )
}

const addInstanceMethod = function (
  { plugin, plugins, ErrorClasses, errorData, AnyError },
  [methodName, methodFunc],
) {
  validateMethodName(methodName, plugin, plugins)
  // eslint-disable-next-line fp/no-mutating-methods
  Object.defineProperty(AnyError.prototype, methodName, {
    value(...args) {
      return callInstanceMethod({
        // eslint-disable-next-line fp/no-this
        error: this,
        methodFunc,
        plugin,
        plugins,
        ErrorClasses,
        errorData,
        AnyError,
        args,
      })
    },
    enumerable: false,
    writable: true,
    configurable: true,
  })
}

const validateMethodName = function (methodName, plugin, plugins) {
  if (methodName in Error.prototype) {
    throw new Error(
      `Plugin "${plugin.fullName}" must not redefine "error.${methodName}()"`,
    )
  }

  const propName = 'instanceMethods'
  const prefix = 'error'
  validateDuplicatePlugin({ methodName, plugin, plugins, propName, prefix })
}

const callInstanceMethod = function ({
  error,
  methodFunc,
  plugin,
  plugins,
  ErrorClasses,
  errorData,
  AnyError,
  args,
}) {
  const { pluginsOpts } = errorData.get(error)
  const { args: argsA, pluginsOpts: allOptions } = applyIsOptions({
    args,
    pluginsOpts: deepClone(pluginsOpts),
    plugin,
    plugins,
  })
  const options = normalizePluginOpts(allOptions, plugin, true)
  const ErrorClassesA = getErrorClasses(ErrorClasses)
  return methodFunc(
    { options, allOptions, error, AnyError, ErrorClasses: ErrorClassesA },
    ...argsA,
  )
}
