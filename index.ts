const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const fs = 'fs';
const PORT = 3000;
const Router = require('koa-router');
const router = new Router();

import { router as sensorsRouter } from './src/routers/sensors'
import { router as usersRouter } from './src/routers/users'
import { router as lightsRouter } from './src/routers/lights'
import { router as heatersRouter } from './src/routers/heaters'
import { router as tanksRouter } from './src/routers/tanks'
import { router as pumpsRouter } from './src/routers/pumps'
import { router as miscRouter } from './src/routers/misc'

app.use(koaBody({
  formidable: {
    uploadDir: './uploads',
    keepExtension: true,
  },    //This is where the files would come
  multipart: true,
  urlencoded: true,
  formLimit: 50000
}));

app.use(async (ctx, next) => {
  console.log('Route: ', ctx.request.url);
  console.log('method: ', ctx.request.method);
  console.log('body: ', ctx.request.body);

  await next();

  console.log('Response Status: ', ctx.response.status);
  console.log('Response Message: ', ctx.response.message);
});


router.use(
  '/sensors',
  sensorsRouter.routes(),
  sensorsRouter.allowedMethods(),
);

router.use(
  '/users',
  usersRouter.routes(),
  usersRouter.allowedMethods(),
);

router.use(
  '/lights',
  lightsRouter.routes(),
  lightsRouter.allowedMethods(),
);

router.use(
  '/heaters',
  heatersRouter.routes(),
  heatersRouter.allowedMethods(),
);

router.use(
  '/tanks',
  tanksRouter.routes(),
  tanksRouter.allowedMethods(),
);

router.use(
  '/pumps',
  pumpsRouter.routes(),
  pumpsRouter.allowedMethods(),
);

router.use(
  '/misc',
  miscRouter.routes(),
  miscRouter.allowedMethods(),
);

app
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(PORT, () => {
  console.log(`Server listening on port: ${PORT}`);
});

module.exports = server;