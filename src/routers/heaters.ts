const Router = require('koa-router');

export const router = new Router();

router.get('/ping', ctx => {
  ctx.body = 'hello world';
})