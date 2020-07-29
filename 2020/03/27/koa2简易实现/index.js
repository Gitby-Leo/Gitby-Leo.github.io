const myKoa = require('./mykoa')

// cnpm install -g  nodemon
// 监听修改代码自动重启node服务: nodemon app.js
const $port = 3000;

const app = new myKoa()
app.use(async (ctx, next) => {
    ctx.body = '- -1'
    await next()
})
app.use(async (ctx, next) => {
    ctx.body = '- -2'
    await next()
})
app.use(async (ctx, next) => {
    ctx.body = '富士山'
    await next()
})
app.listen($port)
console.log(`Server running at http://localhost:${$port}/`);

// app.use(async (ctx, next) => {
//     try{
//         await next()
//     }catch(err){
//         // 异常结构化
//         // 异常分类
//         // 异常级别
//         // 异常上报
//         console.log('first app error===')
//         console.log(err)
//     }
// })