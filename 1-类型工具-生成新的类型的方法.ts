import { type } from "os";

const log = console.log

// 就是给传入的类型再扩展两种类型的操作罢了，T是个泛型，写成F,M,Hello啥的都行
type Factory<T> = T | number | string;

const foo: Factory<boolean> = true; // 其实一般不会这么去写的
log(foo) // true


type FactoryWithBool = Factory<boolean>;
const foo1: FactoryWithBool = true; // 这么写比较合理，还可以对这个Factory进一步扩展


// 接下来我们写一个函数，如果输入是Array则直接返回，否则包装成Array
type MaybeArray<T> = T | T[];
function ensureArray<T>(input: MaybeArray<T>): T[] {
  if (Array.isArray(input)) return input
  return [input];
}

let data = 'hello'
log(ensureArray(data)) // ['hello']

// 联合类型与交叉类型
type Uni = string | null | number
type jiaocha = string & number // never

type Struct1 = {
  primitiveProp: string;
  objectProp: {
    name: string;
  }
}

type Struct2 = {
  primitiveProp: number;
  objectProp: {
    age: number;
  }
}

type Composed = Struct1 & Struct2;

type PrimitivePropType = Composed['primitiveProp']; // never
type ObjectPropType = Composed['objectProp']; // { name: string; age: number; }

// 索引类型

// 索引签名类型

interface Mytypes {
  [key: string]: number
}
interface MytypesWithOthter {
  [key: string | symbol]: number | MytypesWithOthter | string
}
const foo2: Mytypes = {
  134: 3123,
  'fsaf': 432,
  // 'fas': 'fsdf' // 这种就不能写，会报错的
}
const foo3: MytypesWithOthter = {
  321: 4324,
  'fsad': 'hah',
  'f': {
    'fasd': 'fdsa',
    // 'fds': true, // 这个就会报错的
  }
}
//索引签名类型的一个常见场景是在重构 JavaScript 代码时，为内部属性较多的对象声明一个 any 的索引签名类型，
//以此来暂时支持对类型未明确属性的访问，并在后续一点点补全类型
interface AnyTypeObj {
  [ket: string]: any
}

// 索引类型查询
interface ToBeSelect {
  name: string,
  age: number
}
type SelectedKeys = keyof ToBeSelect; // 'name' | 'age'
type SelectedValues = ToBeSelect[keyof ToBeSelect]; // 'string' | 'number'


// 映射类型
// 直接看个例子吧
type Stringify<T> ={
  [key in keyof T]: string
}
interface OriginType {
  prop1: string,
  prop2: number,
  prop3: () => number
}
type StringifyOriginType = Stringify<OriginType>;
// 上面的式子就等价于下面：
interface OriginTypeString {
  prop1: string,
  prop2: string,
  prop3: string
}
// 你可能会想，上面的那个把所有属性的类型全部变成string有什么吊用啊？看看下面呢：
type Opearate<T> = {
  [key in keyof T]: T[key] | number
}
type MyType2 = Opearate<OriginType>
const foo5: MyType2 = {
  prop1: 'rew',
  prop2: 231,
  // prop3: 231  这个和下面那个就都不报错了
  prop3: () => {
    log('hh')
    return 12
  }
}