// 如果说TS是一门对类型进行编程的语言，那么泛型就是这么语言中的(函数)参数

import { type } from "os";

type Factory<T> = T | number | string | boolean;
// 其实就等价于：只不过所编程的内容不是数据而是类型
// function Factory(typeArg) {
//   return [typeArg, number, string, boolean]
// }

// 我们提前看一个TS内置的工具类型的实现：
type Partical<T> = {
  [P in keyof T]?: T[P]
}
// 这个东西干了什么？为所有的属性添加可选


interface MustChoose {
  name: string,
  age: number,
  skill: string[]
}

type MaybeChoose = Partical<MustChoose>

const Zhangsan: MustChoose = {
  name: 'zs',
  age: 18,
  skill: ['唱', '跳', 'rap', '篮球'],
} // 必须全部属性都有。不然报错

const Lisi: MaybeChoose = {
  name: 'lisi',
} // 可以只做部分实现


// 泛型还可以用作条件类型
type IsEqual<T> = T extends true ? 1 : 2;
type A = IsEqual<true> // 1
type B = IsEqual<'aba aba aba'> // 2

// 可以给泛型设置默认值, 是的，泛型也是可以约定默认值的
type Factory2<T = boolean> = T | number;
const foo: Factory2 = false;

// 泛型约束
// 即：可以要求传入某个工具类型的泛型必须符合某些条件，否则就拒绝执行后面的逻辑

// 函数处理：
function add(source: number, add: number): number {
  if (typeof source !== 'number' || typeof add !== 'number') {
    throw new Error('Invalid arguments of add function!')
  }
  return source + add
}
// 在泛型中，可以用extends关键字来约束传入的泛型参数必须符合要求
// extends的直接意思就是 子类型  a extends b， 即a需要是b的子类型

type ResStatus<T extends number> = T extends 200 | 201 | 204 ? 'success' : 'fail'

type Res1 = ResStatus<204> // success
type Res2 = ResStatus<404> // fail
// type Res3 = ResStatus<'500'> // 报错


// 多泛型关联  可以同时传入多个泛型参数，还可以让他们之间存在联系
type Conditional<Type, Condition, TruthyResult, FalsyResult> =
  Type extends Condition ? TruthyResult : FalsyResult;
//  "passed!"
type Result1 = Conditional<'hchuanz', string, 'passed!', 'rejected!'>;
// "rejected!"
type Result2 = Conditional<'hchuanz', boolean, 'passed!', 'rejected!'>;

// 上面的例子表明，多泛型参数其实像是多个参数的函数一样
// 多泛型关联在一些复杂的工具类型中非常常见


// 对象类型中的泛型,我们先看个例子：
interface IResponse<T = unknown> {
  code: number,
  err?: string,
  data: T
}
// 上面是一个非常常见的响应体的基本结构，预留了实际响应数据的坑位

interface IUserProfileRes {
  name: string,
  homePage: string,
  avatar: string
}
// function fetchUserProfile(): Promise<IResponse<IUserProfileRes>> {} 


// 至此，泛型看起来就只是一个类型别名的参数，泛型的另一面：类型的自动提取  

// 函数中的泛型

// 假设一种需求场景：有一个函数，传入字符串则截取，传入数字则乘N，传入对象则stringify
function handle<T extends string | number | object>(input: T): T {
  if (typeof input === 'number') {
    return 2 * input as T;
  } else if (typeof input === 'string') {
    return input[0] as T;
  }else {
    return JSON.stringify(input) as T;
  }
}
let num1: number = 5
let obj: object = {name: 'zs', age: 18}
let str: string = 'fadsf'
const ans1 = handle(num1); // number
const ans2 = handle(obj) // object
const ans3 = handle(str) // string
console.log(ans1, ans2, ans3)

// 再看一个swap
function swap([start, end]) { // 非严格模式才可以这么写
  return [end, start]
}
function swap2<U, T>([start, end]: [U, T]): [T, U] {
  return [end, start]
}
// 1、不管start和end是什么类型，都可以swap
// 2、swap没有any，swap后的类型不变
const val1: string = 'hello';
const val2: number = 2008;
const [res1, res2] = swap2([val1, val2]) // res1为number， res2为string
const [res3, res4] = swap([val1, val2]) // 两个any


// 实现一个pick函数
const objs = { 'a': 1, 'b': 2, 'c': 3, 'd': 4};
console.log(pick(objs, ['a', 'd']), objs)
function pick<T extends object, U extends keyof T>(objs: T, params: U[]): Partical<T>{
  let res: Partical<T> = {}
  params.forEach((value) => {
    if (value in objs) res[value] = objs[value] 
  })
  return res
}

// 泛型特性：在调用时被填充
function handle2<T extends any>(payload: T): Promise<[T]> {
  return new Promise<[T]>((res, rej) => {
    res([payload]);
  });
}

function handle3(payload): Promise<[any]> {
  return new Promise((res, rej) => {
    res([payload]);
  });
}

// Promise中的泛型
function p() {
  return new Promise<boolean>((res, rej) => {
    res(true)
  })
}
// 填充了boolean，resolve方法自动填充了boolean

// react中也有泛型坑位
// const [state, setState] = useState<number[]>([]);
// 其实vue3可以用泛型来接props也是一个体现