class Stack<T> {

  lastIndex: number;
  stack: any;

  constructor() {
    this.stack = {};
    this.lastIndex = 0;
  }

  push(item: T): Stack<T> {
    this.stack[this.lastIndex] = item;
    this.lastIndex++;
    return this.stack;
  }

  pop(): T {
    this.lastIndex--
    const item = this.stack[this.lastIndex];
    delete this.stack[this.lastIndex];
    return item;
  }

  peek(): T {
    return this.stack[this.lastIndex - 1];
  }

  count(): number {
    return this.lastIndex;
  }

  print(): string {
    return this.stack;
  }
};

function run() {

  const myStack = new Stack();
  myStack.push({ A: 1, B: 'B', C: false });
  console.log('Printing', myStack.count(), myStack.print());

  myStack.push({ A: 2, B: 'B', C: false });
  console.log('Printing', myStack.count(), myStack.print());

  myStack.push({ A: 3, B: 'B', C: false });
  console.log('Printing', myStack.count(), myStack.print());

  console.log('Peek', myStack.peek());
  console.log('Pop', myStack.pop())
  console.log('Printing', myStack.count(), myStack.print());
}

run()