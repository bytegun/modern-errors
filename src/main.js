import { polyfill } from 'error-cause-polyfill'

import { callErrorHandler } from './handler.js'
import { getOpts } from './opts.js'
import { createProxy } from './proxy.js'
import { createInternalError } from './types.js'

// Create error types and returns an `errorHandler(error) => error` function to
// use as a top-level error handler.
// Also:
//  - merge `error.cause`, and polyfill it if unsupported
export default function modernErrors(opts) {
  polyfill()
  const { onCreate, bugsUrl } = getOpts(opts)
  const InternalError = createInternalError()
  const state = {}
  state.errorHandler = callErrorHandler.bind(undefined, {
    state,
    InternalError,
    bugsUrl,
  })
  return createProxy(state, onCreate)
}
