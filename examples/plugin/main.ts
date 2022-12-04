// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { Info, Plugin } from 'modern-errors'

// /**
//  * Options of `modern-errors-example`
//  */
// export interface Options {
//   /**
//    * Description of `exampleOption`.
//    *
//    * @default true
//    */
//   readonly exampleOption?: boolean
// }

/**
 * `modern-errors-example` plugin.
 *
 * Description of the plugin.
 */
export default {
  // Name used to configure the plugin
  name: 'example' as const,

  // // Set error properties
  // properties(info: Info['properties']): { exampleProp: unknown } {
  //   return {}
  // },

  // // Add error instance methods like
  // // `ErrorClass.exampleMethod(error, ...args)`
  // instanceMethods: {
  //   /**
  //    * Description of `ErrorClass.exampleMethod(error)`.
  //    *
  //    * @example
  //    * ```js
  //    * const value = ErrorClass.exampleMethod(error, arg)
  //    * ```
  //    */
  //   exampleMethod(info: Info['instanceMethods'], ...args: unknown[]): void {
  //     // ...
  //   },
  // },

  // // Add `ErrorClass` static methods like `ErrorClass.staticMethod(...args)`
  // staticMethods: {
  //   /**
  //    * Description of `ErrorClass.staticMethod()`.
  //    *
  //    * @example
  //    * ```js
  //    * const value = ErrorClass.staticMethod(arg)
  //    * ```
  //    */
  //   staticMethod(info: Info['staticMethods'], ...args: unknown[]): void {
  //     // ...
  //   },
  // },

  // // Validate and normalize options
  // getOptions(options: Options, full: boolean): Options {
  //   return options
  // },

  // // Determine if a value is plugin's options
  // isOptions(options: Options): boolean {
  //   return typeof options === 'boolean'
  // },
} satisfies Plugin
