import {expectType} from 'tsd'

type PromiseValue<T> = T extends Promise<infer V> ? PromiseValue<V>  : T;

type p1 = Promise<string>
type p2 = Promise<p1>
type p3 = Promise<p2>

const p4: PromiseValue<p3> = '1'
// 所以这个递归的作用就是，取到Promise的值

type DeepPartial<T extends object> = {
    [K in keyof T]? : T[K] extends object ? DeepPartial<T[K]>:T[K]
}
// 递归地把对象的所有子项变成可选的

interface API {
    url: string,
    state: number,
    user: People
}
interface People {
    name: string,
    age: number
}
type ParticalAPI = DeepPartial<API>
const api1: ParticalAPI = {
    url: 'www.baidu.com'
}
const api2: ParticalAPI = {
    url: 'www.baidu.com',
    state: 404,
    user: {
        name: 'zhangsan'
    }
}// 显然，成为了递归的可选项

// 可以利用tsd来做验证
expectType<ParticalAPI>({
    user: {}
})
// expectType<ParticalAPI>({
//     user: {
//         name: 11
//     }
// })

type NonNullanle<T> = T extends null | undefined ? never : T;

//要怎么部分修饰属性呢？
// 举个例子，要让一个对象的三个属性变成可选的
type Flatten<T> = { [K in keyof T]: T[K] }

type particalOptional<T extends object, K extends keyof T = keyof T> = 
    Flatten<DeepPartial<Pick<T, K>> & Omit<T, K>>

type api3 = particalOptional<API, 'url'>


type FuncStruct = (...args: any[]) => any;
type Tmp<T extends object> = {
    [K in keyof T]: T[K] extends FuncStruct ? K : never;
  };
  
  type Res = Tmp<{
    foo: () => void;
    bar: () => number;
    baz: number;
  }>;
  
  type ResEqual = {
    foo: 'foo';
    bar: 'bar';
    baz: never;
  };

type resFuncName = Res[keyof Res] // 'foo'|'bar'
type WhatWillWeGetEqual1 = Res["foo" | "bar" | "baz"]; // 'foo'|'bar'


// 从对象中根据值得type提取key
type extractKey<T extends object, ExtractVal> = {
    [K in keyof T]-? : T[K] extends ExtractVal ? K : never
}[keyof T]
// -? 移除所有可选标记
type FuncWithNumber = (...args: any[]) => number
type Myres = extractKey<{
    func1: () => number,
    func2: () => string,
    a: 1
}, FuncWithNumber> // func1

// 从对象中根据value type来pick
type pickByValueType<T extends object, valueType> = Pick<T, extractKey<T, valueType>>
type Myres2 =pickByValueType<{
    func1: () => number,
    func2: () => string,
    a: 1
}, FuncWithNumber> // { func1: () => number, }

// 要一个type，某两个属性至少要有一个，但是又不能都有
type Without<T, U> = {
    [P in Exclude<keyof T, keyof U>]? : never
} // 消除公共的(去掉交集)
type XOR<T, U> = (Without<T, U> & U) | (Without<T, U> & T)


type PlainObjectType = Record<string, any>

/// 工具类型常见分类：属性修饰、结构、集合、模式匹配

export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? never : K;
}[keyof T];
// 原理：
type Required = {} extends { a: any } ? true : false // false
type Optional = {} extends { a?: any } ? true : false // true
