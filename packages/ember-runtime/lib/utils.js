import EmberArray from 'ember-runtime/mixins/array';
import EmberObject from 'ember-runtime/system/object';
import {isArray as _isArray} from 'ember-metal/utils';

// ........................................
// TYPING & ARRAY MESSAGING
//
var TYPE_MAP = {
  '[object Boolean]':  'boolean',
  '[object Number]':   'number',
  '[object String]':   'string',
  '[object Function]': 'function',
  '[object Array]':    'array',
  '[object Date]':     'date',
  '[object RegExp]':   'regexp',
  '[object Object]':   'object'
};

var toString = Object.prototype.toString;

/**
  Returns true if the passed object is an array or Array-like.

  Ember Array Protocol:

    - the object has an objectAt property
    - the object is a native Array
    - the object is an Object, and has a length property

  Unlike `Ember.typeOf` this method returns true even if the passed object is
  not formally array but appears to be array-like (i.e. implements `Ember.Array`)

  ```javascript
  Ember.isArray();                                          // false
  Ember.isArray([]);                                        // true
  Ember.isArray(Ember.ArrayProxy.create({ content: [] }));  // true
  ```

  @method isArray
  @for Ember
  @param {Object} obj The object to test
  @return {Boolean} true if the passed object is an array or Array-like
*/
export function isArray(obj) {
  if (!obj || obj.setInterval) { return false; }
  if (_isArray(obj)) { return true; }
  if (EmberArray.detect(obj)) { return true; }

  let type = typeOf(obj);
  if ('array' === type) { return true; }
  if ((obj.length !== undefined) && 'object' === type) { return true; }
  return false;
}

/**
  Returns a consistent type for the passed item.

  Use this instead of the built-in `typeof` to get the type of an item.
  It will return the same result across all browsers and includes a bit
  more detail. Here is what will be returned:

      | Return Value  | Meaning                                              |
      |---------------|------------------------------------------------------|
      | 'string'      | String primitive or String object.                   |
      | 'number'      | Number primitive or Number object.                   |
      | 'boolean'     | Boolean primitive or Boolean object.                 |
      | 'null'        | Null value                                           |
      | 'undefined'   | Undefined value                                      |
      | 'function'    | A function                                           |
      | 'array'       | An instance of Array                                 |
      | 'regexp'      | An instance of RegExp                                |
      | 'date'        | An instance of Date                                  |
      | 'class'       | An Ember class (created using Ember.Object.extend()) |
      | 'instance'    | An Ember object instance                             |
      | 'error'       | An instance of the Error object                      |
      | 'object'      | A JavaScript object not inheriting from Ember.Object |

  Examples:

  ```javascript
  Ember.typeOf();                       // 'undefined'
  Ember.typeOf(null);                   // 'null'
  Ember.typeOf(undefined);              // 'undefined'
  Ember.typeOf('michael');              // 'string'
  Ember.typeOf(new String('michael'));  // 'string'
  Ember.typeOf(101);                    // 'number'
  Ember.typeOf(new Number(101));        // 'number'
  Ember.typeOf(true);                   // 'boolean'
  Ember.typeOf(new Boolean(true));      // 'boolean'
  Ember.typeOf(Ember.makeArray);        // 'function'
  Ember.typeOf([1, 2, 90]);             // 'array'
  Ember.typeOf(/abc/);                  // 'regexp'
  Ember.typeOf(new Date());             // 'date'
  Ember.typeOf(Ember.Object.extend());  // 'class'
  Ember.typeOf(Ember.Object.create());  // 'instance'
  Ember.typeOf(new Error('teamocil'));  // 'error'

  // 'normal' JavaScript object
  Ember.typeOf({ a: 'b' });             // 'object'
  ```

  @method typeOf
  @for Ember
  @param {Object} item the item to check
  @return {String} the type
*/
export function typeOf(item) {
  if (item === null) { return 'null'; }
  if (item === undefined) { return 'undefined'; }
  var ret = TYPE_MAP[toString.call(item)] || 'object';

  if (ret === 'function') {
    if (EmberObject.detect(item)) {
      ret = 'class';
    }
  } else if (ret === 'object') {
    if (item instanceof Error) {
      ret = 'error';
    } else if (item instanceof EmberObject) {
      ret = 'instance';
    } else if (item instanceof Date) {
      ret = 'date';
    }
  }

  return ret;
}
