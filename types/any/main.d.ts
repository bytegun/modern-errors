import type { Plugins } from '../plugins/shape.js'
import type { PluginsStaticMethods } from '../plugins/static.js'
import type { ErrorProps, MergeErrorProps } from '../core_plugins/props/main.js'
import type { SpecificInstanceOptions } from '../options/instance.js'
import type { NoAdditionalProps } from '../utils.js'
import type { CreateSubclass } from '../subclass/main/main.js'
import type { BaseErrorInstance, NormalizeError } from './normalize/main.js'

interface BaseErrorClassCore<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
> {
  /**
   * Base error class.
   *
   * @example
   * ```js
   * try {
   *   throw new AuthError('...')
   * } catch (cause) {
   *   // Still an AuthError
   *   throw new BaseError('...', { cause })
   * }
   * ```
   */
  new <InstanceOptionsArg extends SpecificInstanceOptions<PluginsArg> = {}>(
    message: string,
    options?: NoAdditionalProps<
      InstanceOptionsArg,
      SpecificInstanceOptions<PluginsArg>
    >,
    ...extra: readonly any[]
  ): BaseErrorInstance<
    PluginsArg,
    MergeErrorProps<ErrorPropsArg, InstanceOptionsArg>,
    InstanceOptionsArg['cause'],
    InstanceOptionsArg
  >

  readonly prototype: InstanceType<
    SpecificBaseErrorClass<PluginsArg, ErrorPropsArg>
  >

  /**
   * Creates and returns an error subclass.
   * The first one must be named `UnknownError`.
   * Subclasses can also call `ErrorClass.subclass()` themselves.
   *
   * @example
   * ```js
   * export const InputError = BaseError.subclass('InputError', options)
   * ```
   */
  readonly subclass: CreateSubclass<
    PluginsArg,
    ErrorPropsArg,
    SpecificBaseErrorClass<PluginsArg, ErrorPropsArg>,
    {}
  >

  /**
   * Normalizes invalid errors and assigns the `UnknownError` class to
   * _unknown_ errors.
   *
   * @example
   * ```js
   * try {
   *   throw 'Missing file path.'
   * } catch (error) {
   *   // Normalized from a string to an `Error` instance
   *   throw BaseError.normalize(error)
   * }
   * ```
   */
  normalize<ErrorArg extends unknown>(
    error: ErrorArg,
  ): NormalizeError<PluginsArg, ErrorPropsArg, ErrorArg>
}

/**
 * Base error class `BaseError`, used internally only with additional generics
 */
export type SpecificBaseErrorClass<
  PluginsArg extends Plugins,
  ErrorPropsArg extends ErrorProps,
> = BaseErrorClassCore<PluginsArg, ErrorPropsArg> &
  PluginsStaticMethods<PluginsArg>

/**
 * Base error class `BaseError`
 */
export type BaseErrorClass<PluginsArg extends Plugins = []> =
  SpecificBaseErrorClass<PluginsArg, ErrorProps>
