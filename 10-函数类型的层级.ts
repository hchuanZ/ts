class Animal { // 动物
    asPet() {}
}

class Dog extends Animal { // 狗
    bark() {}
}

class Corgi extends Dog { // 柯基
    cute() {}
}
// 显然，上面的三个类是有层级关系的
type DogFactory = (args: Dog) => Dog; //Dog -> Dog
// 但是，还有很多别的呀，比如Dog -> Corgi，难道挨个去写吗，不科学的

function makeDogBark(dog: Dog) {
    dog.bark()
}
// 对于makeDogBark，可以传入的只能是Dog或者他的子类型

// 随着某一个量的变化，随之变化一致的即称为协变，而变化相反的即称为逆变。
// 如果有A < B （A 是B的子类型），如果Wraper(A) < Wraper(B), 这就是协变
// 若是Wraper(B) < Wraper(A), 这就是逆变。 变化（Wrapper）即指从单个类型到函数类型的包装过程

type AsFuncArgType<T> = (arg: T) => void;
type AsFuncReturnType<T> = (arg: unknown) => T;

type CheckReturnType = AsFuncReturnType<Corgi> extends AsFuncReturnType<Dog> // 1
  ? 1
  : 2;

type CheckArgType = AsFuncArgType<Dog> extends AsFuncArgType<Animal> ? 1 : 2; // 2
// 上面的，如果没有启用这个strictFunctionTypes，那就不是2，而是1
// 在没有strictFunctionTypes的情况下，对于函数的检查用的是双变：即协变和逆变都是被接受的~

// 函数参数：逆变比较，函数返回值：协变比较


function fn(dog: Dog) {
    dog.bark()
} 
type CorgiFunc = (input: Corgi) => void
type AnimalFunc = (input: Animal) => void

const func1: CorgiFunc = fn
// const func2: AnimalFunc = fn  // 这个赋值不成立，说明fn类型不是AnimalFunc的子类型



// method 声明
interface T1 {
    func(arg: string): number;
  }
  
  // property 声明
  interface T2 {
    func: (arg: string) => number;
  }
// 对于 property 声明，才能在开启严格函数类型检查的情况下享受到基于逆变的参数类型检查。

// 在大部分情况下，我们确实希望方法参数类型的检查可以是双变的，这也是为什么它们的声明中类型结构使用 method 方式来声明：
interface Array<T> {
    push(...items: T[]): number;
}