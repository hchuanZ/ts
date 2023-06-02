type Version = `${number}.${number}.${number}`;

const v1: Version = '1.1.0';

// X 类型 "1.0" 不能赋值给类型 `${number}.${number}.${number}`
// const v2: Version = '1.0';

// 或者这种商品描述：
type Brand = 'iphone' | 'xiaomi' | 'honor';
type Memory = '16G' | '64G';
type ItemType = 'official' | 'second-hand';

type SKU = `${Brand}-${Memory}-${ItemType}`; // 利用模板字符串类型来自动排列组合联合类型

// 这种自动分发还可以借助泛型~
type SizeRecord<S extends string> = `${S}-Record`
type Size = 'Big' | 'Normal' | 'Small'
type GoodsSizeRecord = SizeRecord<Size>


// 再看一个有意思的
interface Foo {
    age: number,
    name: string,
    version: Version
}

type ChangeListener<T extends Record<string, any>> = {
    on: (change: `${string & keyof T}Changed`) => void
}

declare let listener: ChangeListener<Foo>
// listener.on()   已经有类型提示啦

// 先考虑一下我们以前是怎么做的Copy
type Copy<T extends object> = {
    [K in keyof T]: T[K]
}
// 那现在，我需要对这个映射进行修改，要怎么办呢？比如我要把name换成modified_name 
type Modified = 'modified_'
type Copy2<T extends object, U extends string> = {
    [K in keyof T as `${U}${K & string}`]: T[K]
}
type NewFoo = Copy2<Foo, Modified>