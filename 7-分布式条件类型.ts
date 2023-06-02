type IsNever<T> = T extends never ? 'true' : 'false';
type res1 = IsNever<'never'> // false
type res2 = IsNever<never> // never

type IsBool<T> = T extends boolean ? 'true' : 'false';
type res3 = IsBool<boolean | string> // 'true' | 'false'
// 怎么返回了一个联合类型啊？是不是不完全符合预期呢，这就是分布式条件类型捣鬼的
// 如何避免？
type NoDistribute<T> = T & {}
type IsBool2<T> = NoDistribute<T> extends boolean ? 'true' : 'false'
type res4 = IsBool2<boolean | string> // 'false'
// 除此之外还可以用[]给泛型包裹一层
// 我们再看never的例子
type IsNever2<T> = [T] extends [never] ? 'true' : 'false'
type res5 = IsNever2<never> //true
// 或者bool的例子
type Wrapped<T> = [T] extends [boolean] ? "Y" : "N";
type res6 = Wrapped<number | boolean>; // N

// 彩蛋： IsAny怎么实现？
type IsAny<T> = 0 extends 1 & T ? true : false;

type IsUnknown<T> = unknown extends T
  ? IsAny<T> extends true
    ? false
    : true
  : false;