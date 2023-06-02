// 条件类型的语法类似于三元表达式
// TypeA extends TypeB ? Result1 : Result2 
// 条件类型多用于泛型中

import { type } from "os";

type LiteralType<T> = T extends string ? "string" : "other"
type res1 = LiteralType<'hello'> // "string"
type res2 = LiteralType<12> // "other"


type Func = (...args: any[]) => any;
type FunctionTypeCondition<T extends Func> = T extends (...args: any[]) => string ?
                    'A string func' : 'A not string Func'

type StringRes = FunctionTypeCondition<() => string>
type BooleRes = FunctionTypeCondition<() => boolean> // A not string Func

// 如果我们要拿到的是FunctionTypeCondition接受到的函数的返回值类型呢
type FunctionReturnType<T extends Func> = T extends (...args: any[]) => infer R ? R : never

type Func1Return = FunctionReturnType<() => string> // string

type SwapType<T extends any[]> = T extends [infer A, infer B] ? [B, A] : T
type Swap1 = SwapType<[string, number]> // [number, string]
type SwapStartAndEnd<T extends any[]> = T extends [
  infer start,
  ...infer Other,
  infer end
] ? [end, ...Other, start] : T

type ArrayItemType<T> = T extends Array<infer ElementType> ? ElementType : never;

type ArrayItemTypeResult1 = ArrayItemType<[]>; // never
type ArrayItemTypeResult2 = ArrayItemType<string[]>; // string
type ArrayItemTypeResult3 = ArrayItemType<[string, number]>; // string | number
// 原理即是这里的 [string, number] 实际上等价于 (string | number)[]。

type PromiseValue<T> = T extends Promise<infer V> ? V : T

type p = PromiseValue<Promise<number>> // number

