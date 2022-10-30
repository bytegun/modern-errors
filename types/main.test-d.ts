import { expectType, expectAssignable, expectError } from 'tsd'

import modernErrors, { ErrorClass, ErrorInstance } from './main.js'

import './any/aggregate.test-d.js'
import './any/main.test-d.js'
import './any/modify/intersect.test-d.js'
import './any/modify/main.test-d.js'
import './any/modify/plugins.test-d.js'
import './any/normalize.test-d.js'
import './core_plugins/props.test-d.js'
import './options/class.test-d.js'
import './options/instance.test-d.js'
import './options/plugins.test-d.js'
import './plugins/info.test-d.js'
import './plugins/instance.test-d.js'
import './plugins/properties.test-d.js'
import './plugins/shape.test-d.js'
import './plugins/static.test-d.js'
import './subclass/custom.test-d.js'
import './subclass/inherited.test-d.js'
import './subclass/main/class.test-d.js'
import './subclass/main/instanceof.test-d.js'
import './subclass/main/plugins.test-d.js'
import './subclass/name.test-d.js'
import './subclass/parent.test-d.js'

expectAssignable<Error>({} as ErrorInstance)
expectType<ErrorInstance>({} as InstanceType<ErrorClass>)

modernErrors([])
modernErrors([], {})
modernErrors([{ name: 'test' as const }], {})
expectError(modernErrors(true))
