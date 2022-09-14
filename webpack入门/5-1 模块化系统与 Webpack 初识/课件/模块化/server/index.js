const Koa = require('koa')
const Router = require('koa-router')

const app = new Koa()
const router = new Router

router.get('/data', ctx => {
	ctx.body = 10
})
router.get('/data2', ctx => {
	ctx.body = 20
})

app.use(router.routes())
app.listen(3000)
