// window.onerror = (event, source, line, col, err) => {};
// 在上面的例子里，我们没有显示的定义类型，但是各个参数也已经获得了正确的类型
// 这个是因为onerror的类型声明已经内置了

type CustomerHandler = (name: string, age: number) => boolean;
const handler: CustomerHandler = (arg1, arg2) => true
// 可以看到正确的完成了推导  基于已定义的类型来规范开发者的使用

const handler2: CustomerHandler = (arg1) => true // 参数可以少
// const handler3: CustomerHandler = (arg1, arg2, arg3) => true // 参数不可以多

// Void
type CustomHandler = (name: string, age: number) => void;

const handler1: CustomHandler = (name, age) => true;
const _handler2: CustomHandler = (name, age) => 'linbudu';
const handler3: CustomHandler = (name, age) => null;
const handler4: CustomHandler = (name, age) => undefined;

const res1 = handler1('zhc', 80) // 这里的res1还是void
console.log(res1) // true
// 很奇怪是吧，首先CustomHandler定义的返回值是void，但是handler1给的true
// res1的类型推导出来时void，但是打印一看，还是true

function Myhandler(arg: string) {
    console.log(arg);
  }
  
  function useHandler(callback: (arg1: string, arg2: number) => void) {
    callback('linbudu', 599);
  }
  
  useHandler(Myhandler);
// Myhandler只需要一个入参，但是给他传了两个，不过并没有报错，第二个只是没有被消费罢了