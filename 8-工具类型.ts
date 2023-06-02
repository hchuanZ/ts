interface Person {
  name: string;
  age: number;
  job?: string;
  readonly shengao?: number;
}

// Partial： 提取部分
const Bob: Partial<Person> = {
  name: 'Bob',
}
const Jam: Required<Person> = {
  name: 'Jam',
  age: 16,
  job: 'FE', //这里的job和身高变成了必选项
  shengao: 180
}

// Jam.shengao = 16  // 不可以，因为readonly


type Mutable<T> = { // 移除readonly
  -readonly [P in keyof T]: T[P];
};

const Jams: Partial<Mutable<Person>> = { // 还可以嵌套
  name: 'Jam',
  shengao: 180
}
Jams.shengao = 1 // 因为Mutable移除了readonly，就可以修改了 

// 上面的工具类型都是属性修饰工具类型

// 而结构工具类型分为结构声明和结构处理，结构声明用于快速声明一个结构
type MyRecord<K extends keyof any, T> = { // Record的写法
  [P in K]: T;
};
type Record1 = Record<string, boolean>
const obj1: Record1 = {
  // 'aha': 1, // 报错
  // true: 1 
  nihao: true, 
}
// 其中，Record<string, unknown> 和 Record<string, any> 是日常使用较多的形式，
// 通常我们使用这两者来代替 object 。

// 结构处理：常见的是Pick和Omit
interface Foo {
  name: string,
  age: number,
  son: Foo
}
type PickFoo = Pick<Foo, "name" | 'age'>
type OmitFoo = Omit<Foo, "son">
// 上面的结果其实两个是等价的
type a = OmitFoo extends PickFoo ? 'true' : 'false' // true

type OmitFoo2 = Omit<Foo, "ali">
// Omit的第二个参数并没有严格限制必须与Foo有交集，没有交集其实返回的就是Foo
type StandardOmit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
type StrictOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;


// 集合类型工具
// 交集、差集、并集、补集

// 并集
export type Concurrence<A, B> = A | B;

// 交集
export type Intersection<A, B> = A extends B ? A : never;

// 差集
export type Difference<A, B> = A extends B ? never : A;

// 补集
export type Complement<A, B extends A> = Difference<A, B>;