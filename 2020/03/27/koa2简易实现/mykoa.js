const http = require('http');

class Application {
    constructor() {
        this.middlewares = []
    }
    listen(...args) {
        const server = http.createServer(async (req, res) => {
            const ctx = new Context(req, res);

            // 对中间件回调函数串联，洋葱模型
            const fn = compose(this.middlewares);
            // 执行这个compose所返回的函数
            await fn(ctx);

            ctx.res.end(ctx.body);
        });
        server.listen(...args);
    }
    // use 保存每项中间件
    use(middleware) {
        this.middlewares.push(middleware)
    }
}
// 实例化ctx对象，含有req,res属性
class Context {
    constructor(req, res) {
        this.req = req;
        this.res = res;
    }
}
// 传入中间件数组，返回一个函数
// 函数执行时对传入的中间件数组执行递归，取第一项执行完毕后执行下一项中间件
// 执行下一项的回调函数时机由外部决定，方法内只是定义了callback，
// 函数外部有对内部的引用，闭包
function compose(middlewares) {
    return ctx => {
        const dispatch = (i) => {
            const middleware = middlewares[i];
            if (i === middlewares.length) {
                return;
            }
            // 外部await执行方法next，这个函数执行callback,返回的是被封装的promise
            // await的结果放入微任务， 然后执行下一个中间件的方法
            // 等最后一个中间件执行完毕，说明同步宏任务已完成，执行微任务
            // 由于中间件的执行过程是嵌套的，所以最内层函数的await优先级高于父层，所以先顺序后逆序
            return middleware(ctx, () => {
                dispatch(i + 1)
            })
        }
        return dispatch(0)
    }
}
module.exports = Application