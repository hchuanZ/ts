// 好，先看代码
class Cat {
  eat() { 
    console.log('CAT EAT')
  }
}

class Dog {
  eat() {
    console.log('DOG EAT')
   }
}

function feedCat(cat: Cat) {
  cat.eat();
 }

feedCat(new Dog()) // DOG EAT
// 咋个回事呢？我们不是对feedCat函数的参数做了类型限制吗，怎么上面代码没有报错呢？
// 实际上这就是TS类型系统的一个特性：结构化类型系统
// 与之对应的是标称类型系统

// 所以说，TS比较两个类型并不是通过这两个类型的名称，而是通过两个类型上的方法和属性
// 在前面的例子中，Cat的属性也都存在于Dog中，因此被视为结构一致。
// 另一种描述：如果你看到一只鸟走起来像鸭子，游泳像鸭子，叫得也像鸭子，那么这只鸟就是鸭子。


// 下一个例子
type USD = number;
type CNY = number;

const count1: CNY = 2000
const count2: USD = 100
function addCNY(n1: CNY, n2: CNY): CNY{
  return n1 + n2
}
console.log(addCNY(count1, count2))
// 这个就迷惑了，这凭啥要让他加，应该直接报错啊。这就是结构化类型系统的一个局限性了


// 在标称类型系统中，就不会有上面的问题，那么我们要怎么让TS实现标称类型系统呢？
// 改法1
class CNY1 {
  private _tag!:void;
  constructor(public value: number) {}
}
class USD1 {
  private _tag!:void;
  constructor(public value: number) {}
}
const cny = new CNY1(2000)
const usd = new USD1(100)
function addUSD(n1: USD1, n2: USD1) {
  return n1.value + n2.value
}
// addUSD(cny, usd) // 报错
addUSD(usd, usd) // 不报错
// 改法2
export declare class TagProtector<T extends string> {
  protected __tag__: T;
}
export type Nominal<T, Name extends string> = T & TagProtector<Name>
// 这里就定义了一种工具类型Nominal，接受两个类型参数，第一个是真正想定义的，第二个是取名
type CNY2 = Nominal<number, 'CNY'>
type USD2 = Nominal<number, 'USD'>
const cny2 = 2000 as CNY2
const usd2 = 100 as USD2
 
function addMoneny<T extends number>(source: T, input: T ) {
  return source + input
}
addMoneny(cny2, cny2) // ok
// addMoneny(cny2, usd2) // error
