# Let's write some functional poetry!


---

```js
const padLeft = R.curry((size, placeholder, target) => R.compose(
  R.concat(R.__, R.toString(target)),
  R.join(''),
  R.map(R.always(placeholder)),
  R.range(0),
  R.subtract(size),
  R.prop('length'),
  R.toString
)(target));
```

---

# About me

- Front-end developer @ Wax-Interactive
- twitter.com/renaudtertrais
- github.com/renaudtertrais

---

# Want to play a game ?

---

# Before playing
- js es6:
  - `=>`
  - `const`, `let`
- js:
  - `apply()`, `bind()`
  - closure

---

# Let's play Lego

<center>
![](https://cdn-images-1.medium.com/max/1600/1*yGnDGRW4pTgmcDUi4oC8Uw.png)
</center>

- OOP !== Legos
- Modular code === Graal

---

# The problem with OOP

- state
- hidden inheritance

[video E8I19uA-wGY?start=224&end=262]

---

> Learning functional programming is like starting from scratch

<small>Charles Scalfani</small>

---

# Goal

- No variables
- No loops
- No state
- No this
- No default params

<center>
![](https://media.giphy.com/media/tLql6mMHC6wvK/giphy.gif)
</center>
---

# Language requirements
- First Class Function
- Closure

### Guess what ?

-> **Javascript** is the first language to have those features

---

# Pure functions

> a function is pure if it will allways return the same output given the same input

=> No side effects

Not pure:

```js
let x;
const add = (a) => { x += a };
add(2);
```
Pure:

```js
let x;
// ...
const add = (a, b) => a + b;
// ...
x = add(x, 2);
```

---

# Side effects

[video 7Zlp9rKHGD4?start=1222&end=1268]

---

# (Avoid) side effects

- I/O:
  - events
  - write
  - DB
- Async:
  - timeout/interval
  - fetch
  - Promise/callback
- Impure functions
  - Math.ramdom()
  - Date ...

  => Isolate from logic

---

# Referential Transparency

- expression can be replaced by its value
- pure functions are like maps of `params => value`

```js
const add = (a, b) => a + b;
add(1, 2); // 3
add(2, add(1, 2)); // 5
const addMap = {
  '0,0': 0,
  // ...
  '1,2': 3,
  // ...
  '2,3': 5,
  // ...
};
addMap['1,2']; // 3
addMap[`1,${addMap['1,2']}`]; // 5
```

---

# Immutability

- No variables: forget about `let` and `var`
- Copy
- Big structures => ImmutableJS to the rescue

---

# No Loops ?

=> Recurssion

Array of numbers:

```js
numList(1,10); // [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

```js
const numList = (from, to) => {
  let arr = [];
  for (let i = from ; i < to ; i++) arr.push(i);
  return arr;
}
```

```js
const numList = (from, to) => (
  from < to ? [from, ...numList(from + 1, to)] : []
);
```


---

# Composition

```javascript
const inc = a => a + 1;
const double = a => a * 2;
const doubleAfterInc = a => double(inc(a));
doubleAfterInc(2); // 6
```

---

# Compose

```javascript
const compose = (f, g) => a => f(g(a));
const doubleAfterInc = compose(double, inc);
doubleAfterInc(2); // 6
```

compose `!==` chaining

---

# Currying

> reduce functions to one parameter

```javascript
const add = (a, b) => a + b;
const addCurryed = a => b => a + b;
```

---

# Currying, why ?

=> partial application

```js
const add = a => b => a + b;
const inc = add(1);
const dec = add(-1);
inc(2); // 3;
dec(2); // 1;
```

---

# No default paramaters

```js
const connect = (url, protocol = 'http') => {/*...*/}
```

```js
const connect = protocol => url => {/*...*/};
const connectHTTP = connect('http');
const connectWS = connect('ws');
```

---

# Compose reloaded

```js
const compose = f => g => a => f(g(a));
```

---

# Higher Order Function (HOF)

```javascript
const onlyNumber = f => a => typeof a === 'number' ? f(a) : a;
const double = a => a * 2;
const doubleGuarded = onlyNumber(double);
double(2); // 4 double('foo'); // ERROR!
doubleGuarded(2); // 4
doubleGuarded('foo'); // 'foo'
```

- debounce, throttle, curry...

---

# Useful HOF

- reduce()
- map() (fmap)
- filter()
- flatten()
- flatMap() (chain)

Implemented on:
- Array []
- Object {}

---

# reduce() Array

**Without loop & assignement:**
```js
const reduceArray = res => f => arr => arr.length ? (
  reduceArray(f(arr[0](res)))(f)(arr.slice(1))
): res;
```

**With loop:**

```js
const reduceArray = init => f => arr => {
  let res = init;
  for(let i=0; i < arr.length; i++) res = f(arr[i])(res);
  return res;
};
```

**With native method:**

```js
const reduceArray = init => f => arr => arr.reduce(
  (res, val) => f(val)(res),
  init
);
```

---

# reduce() Array examples

```js
const add = a => b => a + b;
const sum = reduceArray(0)(add);
sum([1, 2, 3]); // 6
```

```js
const assign = key => val => obj => Object.assign({}, obj, {
  [key]: val
});
const get = key => obj => obj[key];
const arrToObj = key => reduceArray({})( val => assign(val[key])(val) );
const users = [
  { id: 'foo', name: 'Bart', age: 10 },
  { id: 'bar', name: 'Lisa', age: 8 }
];
const usersById = arrToObj('id')(users) // { foo: {...}, bar: {...} }
```

---

# reduce() Object

```js
const reduceObject = init => f => obj => {
  let res = init;
  for(let key in obj) res = f(obj[key])(res);
  return res;
};
```

```js
const reduceObjectWithKey = init => f => obj => {
  let res = init;
  for(let key in obj) res = f(key)(obj[key])(res);
  return res;
};
```

**examples**

```js
const push = val => arr => [...arr, val];
const pick = key => reduceObject([])(compose(push)(get(key)));
const userNames = pick('name')(usersById); // ['Bart', 'Lisa']
```

---

# map() Array

```js
const concat = val => arr => [...arr, val];
const mapArray = f => reduceArray([])(compose(concat)(f));
```

```js
const mapArray = f => arr => arr.map(val => f(val));
```

**example:**

```js
const uppercase = s => s.toUpperCase();
mapArray(uppercase)(['foo', 'bar', 'baz']); // ['FOO', 'BAR', 'BAZ']
```

---

# map Object

```js
const assign = key => val => obj => Object.assign({}, obj, {
  [key]: val
});
const mapObject = f => reduceObjectWithKey({},
  key => compose(assign(key))(f)
);
```

**example:**

```js
mapObject(uppercase)({a: 'foo', b: 'bar', c: 'baz'});
// {a: 'FOO', b: 'BAR', c: 'BAZ'}
```

---

# filter() Array

```js
const identity = x => x;
const filterArray = f => reduceArray([])(
  val => f(val) ? push(val): identity
);
```

**example:**

```js
const isEven = x => !x % 2;
filterArray(isEven)([1, 2, 3, 4]); // [2, 4]
```

---

# filter() Object

```js
const filterObject = f => reduceObjectWithKey({})(
  key => val => f(val) ? assign(key)(val): identity
);
```

**example:**

```js
filterObject(isEven)({a:1, b:2, c:3, d:4}); // {b:2, d:4}
```

---

# flatten() Array

```js
const concat = a => b => [...b, ...a];
const flattenArray = reduceArray([])(concat);
```

**example:**

```js
flattenArray([[1, 2], [3, 4]]); // [1, 2, 3, 4]
```

---

# flatten() Object

```js
const merge = a => b => Object.assign({}, b, a);
const flattenObject = reduceObject({})(merge);
```

**example:**

```js
flattenObject({ foo: {a:1, b:2}, bar: {c:3, d:4}});
// {a:1, b:2, c:3, d:4}
```

---

# flatMap()

```js
const flatMapArray = f => compose(flattenArray, mapArray(f));
const flatMapObject = f => compose(flattenObject, mapObject(f));
```

```js
const rangeFromArray = arr => from => to => from <= to ? (
  rangeFromArray([...arr, from])(from + 1)(to)
): arr;
const range = rangeFromArray([]);
mapArray(range(1))([1, 2, 3]); // [[1], [1, 2], [1, 2, 3]]
flatMapArray(range(1))([1, 2, 3]); // [1, 1, 2, 1, 2, 3]
```

---

# Functor

> Type that implement a `map()` method

-> Array

---

# Monad

> functor that implement a `flatMap()` method

-> Promises

```js
fetchUser()
  .then(x => x.id) // map()
  .then(fetchPostFromUserId) // flatMap()
```

---

# Libs
- [Ramda](https://github.com/hemanth/ramda/ramda)
- [ImmutableJS]()
- [Lodash/fp]()

---

# sources
- [Fantasy Land Specification](https://github.com/fantasyland/fantasy-land)
- [Functional Programming Jargon](https://github.com/hemanth/functional-programming-jargon)
- [funfunfunction]()
- @mpj youtube chanel
- ["So You Want to be a Functional Programmer" series by Charles Scalfani](https://medium.com/@cscalfani/so-you-want-to-be-a-functional-programmer-part-1-1f15e387e536#.dgvn1szf8)


---

# Thank you!
