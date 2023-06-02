// 类型层级是TS的类型系统中重要的概念之一
// 类型层级实际上指的是TS的所以类型的兼容关系（有种链状关系）

import { type } from "os";

// A extends B 成立，那么说明A是B的子类型
// A = B 成立，说明 B的类型 extends A的类型

// 字面量类型是对应的原始类型的子类型

type t1 = 'hello' extends string|number|boolean ? 1: 2 // 1
type t2 = 'string'|number|boolean extends string|number|boolean ? 1: 2 // 1
// 字面量类型 < 包含此字面量类型的联合类型，原始类型< 包含此原始类型的联合类型。
type t3 = '1' | '2' | 'hello' extends string ? 1: 2 // 1
// 同一基础类型的字面量联合类型 < 此基础类型。

// 装箱类型们：
type Result14 = string extends String ? 1 : 2; // 1
type Result15 = String extends {} ? 1 : 2; // 1
type Result16 = {} extends object ? 1 : 2; // 1
type Result18 = object extends Object ? 1 : 2; // 1
// 那么上面看起来是不是构成了一个链式的关系 string - String - {} - object - Object?
type t4 = string extends object ? 1 : 2 // 2
// 艹，打脸了？

// 还有啊，为啥String 是 {}的子类型啊

// {}这个东西很奇特，既可以被认为是一个object的字面量类型
// {}又可以被看做一个一无所有的空对象，几乎可以被视作是所有类型的基类

// Object 包含了所有除 Top Type 以外的类型（基础类型、函数类型等），
// object 包含了所有非原始类型的类型，即数组、对象与函数类型，这就导致了你中有我、我中有你的神奇现象
type o1 = object extends Object ? 1: 2 // 1
type o2 = Object extends object ? 1: 2 // 1

type n1 = never extends void ? 1 : 2;
type n2 = never extends '123' ? 1 : 2;
type n3 = never extends null ? 1 : 2;
type n4 = never extends 123 ? 1 : 2;
// 上面的4个式子全都是1，在TS中never就是最底层的仔

