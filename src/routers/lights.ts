const Router = require('koa-router');
const { settingsService } = require('../services');

export const router = new Router();

router.get('/ping', ctx => {
  ctx.body = 'hello world';
})

router.get('/', async ctx => {
  const lights = await settingsService.readFromSettings('lights');

  ctx.body = lights;
});

router.post('/', async ctx => {
  const {
    pin,
    name,
    plug = 0,
    description = '',
    status = 0,
    level = 100,
    dimmable = false,
  } = ctx.request.body;

  const lights = await settingsService.readFromSettings('lights');

  const newLights = [
    ...lights,
    {
      pin,
      name,
      plug,
      description,
      status,
      level,
      dimmable,
    }
  ]

  await settingsService.writeToSettings('lights', newLights);

  ctx.body = newLights;
});
