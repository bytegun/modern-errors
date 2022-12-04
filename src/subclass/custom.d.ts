import type { AggregateErrors } from '../merge/aggregate.js'
import type {
  Cause,
  InstanceOptions,
  SpecificInstanceOptions,
} from '../options/instance.js'
import type { ErrorProps } from '../plugins/core/props/main.js'
import type { Plugins } from '../plugins/shape/main.js'

/**
 * `custom` option
 */
export interface CustomClass {
  new (message: string, options?: InstanceOptions): Error
  subclass: unknown
}

/**
 * Second argument of the `constructor` of the parent error class
 */
export type ParentInstanceOptions<
  PluginsArg extends Plugins,
  ChildProps extends ErrorProps,
  CustomClassArg extends CustomClass,
  AggregateErrorsArg extends AggregateErrors,
  CauseArg extends Cause,
> = ConstructorParameters<CustomClassArg>[1] &
  SpecificInstanceOptions<PluginsArg, ChildProps, AggregateErrorsArg, CauseArg>

/**
 * Last variadic arguments of the `constructor` of the parent error class
 */
export type ParentExtra<CustomClassArg extends CustomClass> =
  ConstructorParameters<CustomClassArg> extends readonly [
    unknown,
    unknown?,
    ...infer Extra extends readonly unknown[],
  ]
    ? Extra
    : readonly never[]
