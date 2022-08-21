import {
  ErrorName,
  CustomError as RawCustomError,
  ErrorParams,
  Options as CreateErrorTypesOptions,
} from 'create-error-types'
import { serialize, parse, ErrorObject } from 'error-serializer'

/**
 * `modern-errors` options
 */
export interface Options<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> {
  /**
   * URL where users should report unknown errors.
   *
   * @example 'https://github.com/my-name/my-project/issues'
   */
  readonly bugsUrl?: CreateErrorTypesOptions['bugsUrl']

  /**
   * Called on any `new CustomError('message', parameters)`.
   * Can be used to customize error parameters or to set error class properties.
   * By default, any `parameters` are set as error properties.
   *
   * @example
   * ```js
   * modernErrors({
   *   onCreate(error, parameters) {
   *     const { filePath } = parameters
   *
   *     if (typeof filePath !== 'string') {
   *       throw new Error('filePath must be a string.')
   *     }
   *
   *     const hasFilePath = filePath !== undefined
   *     Object.assign(error, { filePath, hasFilePath })
   *   },
   * })
   * ```
   */
  readonly onCreate?: (
    error: CustomError<ErrorNames, ErrorParamsArg>,
    params: Parameters<
      NonNullable<
        CreateErrorTypesOptions<ErrorNames, ErrorParamsArg>['onCreate']
      >
    >[1],
  ) => ReturnType<
    NonNullable<CreateErrorTypesOptions<ErrorNames, ErrorParamsArg>['onCreate']>
  >
}

type CustomErrors<
  ErrorNames extends ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = {
  [errorName in ErrorNames]: typeof CustomError<errorName, ErrorParamsArg>
}

/**
 * Any error name passed as argument is returned as an error class.
 *
 * @example
 * ```js
 * export const { InputError, AuthError, DatabaseError, errorHandler, parse } =
 *   modernErrors(['InputError', 'AuthError', 'DatabaseError'])
 * ```
 */
export type Result<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = CustomErrors<ErrorNames, ErrorParamsArg> & {
  /**
   * Error handler that should wrap each main function.
   *
   * @example
   * ```js
   * export const main = async function (filePath) {
   *   try {
   *     return await readContents(filePath)
   *   } catch (error) {
   *     // `errorHandler()` returns `error`, so `throw` must be used
   *     throw errorHandler(error)
   *   }
   * }
   * ```
   */
  errorHandler: ErrorHandler<ErrorNames, ErrorParamsArg>

  /**
   * Convert an error plain object into an `Error` instance.
   *
   * @example
   * ```js
   * try {
   *   await readFile(filePath)
   * } catch (cause) {
   *   const error = new InputError('Could not read the file.', {
   *     cause,
   *     filePath: '/path',
   *   })
   *   const errorObject = error.toJSON()
   *   // {
   *   //   name: 'InputError',
   *   //   message: 'Could not read the file',
   *   //   stack: '...',
   *   //   cause: { name: 'Error', ... },
   *   //   filePath: '/path'
   *   // }
   *   const errorString = JSON.stringify(error)
   *   // '{"name":"InputError",...}'
   *   const newErrorObject = JSON.parse(errorString)
   *   const newError = parse(newErrorObject)
   *   // InputError: Could not read the file.
   *   //   filePath: '/path'
   *   //   [cause]: Error: ...
   * }
   * ```
   */
  parse: Parse<ErrorNames, ErrorParamsArg>
}

export declare class CustomError<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> extends RawCustomError<ErrorNames, ErrorParamsArg> {
  /**
   * Convert errors to plain objects that are
   * [serializable](https://github.com/ehmicky/error-serializer#json-safety) to
   * JSON
   * ([or YAML](https://github.com/ehmicky/error-serializer#custom-serializationparsing),
   * etc.). It is
   * [automatically called](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/stringify#tojson_behavior)
   * by `JSON.stringify()`. All error properties
   * [are kept](https://github.com/ehmicky/error-serializer#additional-error-properties),
   * including
   * [`cause`](https://github.com/ehmicky/error-serializer#errorcause-and-aggregateerror).
   *
   * @example
   * ```js
   * try {
   *   await readFile(filePath)
   * } catch (cause) {
   *   const error = new InputError('Could not read the file.', {
   *     cause,
   *     filePath: '/path',
   *   })
   *   const errorObject = error.toJSON()
   *   // {
   *   //   name: 'InputError',
   *   //   message: 'Could not read the file',
   *   //   stack: '...',
   *   //   cause: { name: 'Error', ... },
   *   //   filePath: '/path'
   *   // }
   *   const errorString = JSON.stringify(error)
   *   // '{"name":"InputError",...}'
   * }
   * ```
   */
  toJSON: () => ReturnType<
    typeof serialize<RawCustomError<ErrorNames, ErrorParamsArg>>
  >
}

/**
 * Type of `errorHandler()`
 */
export type ErrorHandler<
  ErrorNames extends ErrorName = ErrorName,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = (error: unknown) => CustomError<ErrorNames | 'UnknownError', ErrorParamsArg>

/**
 * Type of `parse()`
 */
export type Parse<
  ErrorNames extends ErrorName = never,
  ErrorParamsArg extends ErrorParams = ErrorParams,
> = <ArgType>(
  value: ArgType,
) => ReturnType<
  typeof parse<
    ArgType,
    { loose: true; classes: CustomErrors<ErrorNames, ErrorParamsArg> }
  >
>

export type { ErrorName, ErrorObject, ErrorParams }

/**
 * Creates custom error classes.
 *
 * @example
 * ```js
 * export const { InputError, AuthError, DatabaseError, errorHandler, parse } =
 *   modernErrors(['InputError', 'AuthError', 'DatabaseError'])
 * ```
 */
export default function modernErrors<
  ErrorParamsArg extends ErrorParams = ErrorParams,
  ErrorNames extends ErrorName[] = [],
>(
  errorNames: ErrorNames,
  options?: Options<ErrorNames[number], ErrorParamsArg>,
): Result<ErrorNames[number], ErrorParamsArg>
