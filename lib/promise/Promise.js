// https://www.jianshu.com/p/c633a22f9e8c

function resolvePromise(promise2, res, resolve, reject) {
    // 循环引用报错
    if (res === promise2) {
        // reject 报错抛出
        return reject(new TypeError('Chaining cycle detected for promise'));
    }
    // 锁，防止多次调用
    let called;
    // x 不是 null 且 x 是对象或者函数
    if (res != null && (typeof res === 'object' || typeof res === 'function')) {
        try {
            // A+ 规定，声明then = x的then方法
            let then = res.then;

            // 如果then是函数，就默认是promise了
            if (typeof then === 'function') {
                // then 执行 第一个参数是 this 后面是成功的回调 和 失败的回调
                then.call(res, y => {
                    // 成功和失败只能调用一个
                    if (called) return;
                    called = true;

                    // 核心点2：resolve 的结果依旧是 promise 那就继续递归执行
                    resolvePromise(promise2, y, resolve, reject);
                }, err => {
                    // 成功和失败只能调用一个
                    if (called) return;
                    called = true;
                    reject(err);// 失败了就失败了
                })
            } else {
                resolve(res); // 直接成功即可
            }
        } catch (e) { // 走到 catch 也属于失败
            if (called) return;
            called = true;
            // 取then出错了那就不要在继续执行了
            reject(e);
        }
    } else {
        resolve(res);
    }

}

let id = 1;
function getId() {
    return id++
}

class Promise {
    constructor(executor) {
        this.status = "pending";
        this.value = null;
        this.error = null;
        this.resolveQueue = [];
        this.rejectQueue = [];
        this.id = getId();

        const resolve = value => {
            if (this.status === "pending") {
                this.status = "resolved";
                this.value = value;
                this.resolveQueue.forEach(fn => fn());
            }

        };

        const reject = error => {
            if (this.status === "pending") {
                this.status = "rejected";
                this.error = error;
                this.rejectQueue.forEach(fn => fn());
            }
        }

        executor(resolve, reject);
    }


    then(onFullfilled, onRejected) {
        let promise2;

        if (onFullfilled && this.status === "resolved") {
            promise2 = new Promise((resolve, reject) => {
                let x = onFullfilled(this.value);
                resolvePromise(promise2, x, resolve, reject);
            })

        }

        if (onRejected && this.status === "rejected") {
            promise2 = new Promise((resolve, reject) => {
                let x = onRejected(this.value);
                resolvePromise(promise2, x, resolve, reject);
            })
        }

        // 处理异步情况, setTimeout, setInterval, XMLHttpRequest, Fetch等
        if (this.status === "pending") {
            promise2 = new Promise((resolve, reject) => {
                this.resolveQueue.push(() => {
                    let x = onFullfilled(this.value);
                    resolvePromise(promise2, x, resolve, reject);
                })
                this.rejectQueue.push(() => {
                    let x = onRejected(this.error);
                    resolvePromise(promise2, x, resolve, reject);
                })

                console.log(`Promise - ${this.id}`, this.resolveQueue.length, this.rejectQueue.length)
            })
        }

        return promise2;
    }

    catch(onRejected) {
        return this.then(null, onRejected)
    }
}

if (window) {
    window.Promise = Promise;
}