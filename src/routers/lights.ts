const Router = require('koa-router');
const { v4: uuid } = require('uuid');

const { settingsService } = require('../services');

export const router = new Router();

const paramsWhitelist = new Set([
  'pin',
  'name',
  'plug',
  'description',
  'status',
  'level',
  'dimmable',
]);

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
  const id = uuid();

  const newLights = {
    ...lights,
    [id]: {
      id,
      pin,
      name,
      plug,
      description,
      status,
      level,
      dimmable,
    }
  };

  await settingsService.writeToSettings('lights', newLights);

  ctx.body = newLights;
});

router.put('/:lightId/', async ctx => {
  const { lightId } = ctx.params;

  const data = ctx.request.body;
  const lights = await settingsService.readFromSettings('lights');
  const lightToUpdate = lights[lightId];

  Object.entries(data).forEach(([key, value]) => {
    if (paramsWhitelist.has(key)) {
      lightToUpdate[key] = value;
    }
  })

  const updatedLights = {
    ...lights,
    [lightToUpdate.id]: lightToUpdate,
  };

  await settingsService.writeToSettings('lights', updatedLights);

  ctx.body = updatedLights;
})

router.delete('/:lightId/', async ctx => {
  const { lightId } = ctx.params;

  const lights = await settingsService.readFromSettings('lights');

  delete lights[lightId];

  await settingsService.writeToSettings('lights', lights);

  ctx.body = lights;
})
