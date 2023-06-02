// 在TS中，我们不仅需要去生成新的类型，也需要对类型安全做保障
// 这里主要介绍两种用于类型安全的类型工具：
/// 类型查询操作符合类型守卫

// 类型查询操作符：typeof
// 在TS中存在两种不同的typeof，一个是JS中的，返回string。例如：'string','number'这些
// 还有一种TS中的，返回一个TS的type，eg：
const Myname = 'hello'
type S  = string | number | boolean
const a: S = 1
type nameType =  typeof Myname // "hello"
type s = typeof a; // number
// 在逻辑代码中用typeof一定是JS的，类型代码中的一定是TS的
// 类型查询操作符后面是不允许跟表达式的,eg:
const isInputValid = (input: string) => {
  return input.length > 10
}
// let isValid: typeof isInputValid('hello');
// 上方的那个操作就是被禁止的


// TS会随着代码逻辑不断尝试收窄类型（类型推导）
// 但是这样的推导可能会在某些封装中失效
function isString(input: unknown): boolean {
  return typeof input === "string";
}

function foo(input: string | number) {
  if (isString(input)) {
    // 类型“string | number”上不存在属性“replace”。
    // (input).replace("linbudu", "linbudu599")
  }
  if (typeof input === 'number') { }
  // ...
}
// 观察上面的代码，明明做了isString，为啥input在分支内部还是string | number ?
// TS的类型控制流分析做不到跨函数上下文的类型信息收集，那我们要怎么告诉它，这个时候的input就该是string呢？
// 可以用is关键字

// 这儿的isString2函数称为类型守卫，is string就是is+预期类型，如果函数返回值为true，那么input所在域就被类型控制分析流收集为string
function isString2(input: unknown): input is string {
  return typeof input === "string";
}
function foo2(input: string | number) {
  if (isString2(input)) {
    (input).replace("linbudu", "linbudu599") // 发现不报错了
  }
  if (typeof input === 'number') { }
  // ...
}

// 一些可能常见的守卫：
export type Falsy = false | "" | 0 | null | undefined;

export const isFalsy = (val: unknown): val is Falsy => !val;

// 不包括不常用的 symbol 和 bigint
export type Primitive = string | number | boolean | undefined;

export const isPrimitive = (val: unknown): val is Primitive => ['string', 'number', 'boolean' , 'undefined'].includes(typeof val);