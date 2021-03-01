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
]);

router.get('/ping', ctx => {
  ctx.body = 'hello world';
})

router.get('/', async ctx => {
  const heaters = await settingsService.readFromSettings('heaters');

  ctx.body = heaters;
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

  const heaters = await settingsService.readFromSettings('heaters');
  const id = uuid();

  const newHeaters = {
    ...heaters,
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

  await settingsService.writeToSettings('heaters', newHeaters);

  ctx.body = newHeaters;
});

router.put('/:heaterId/', async ctx => {
  const { heaterId } = ctx.params;

  const data = ctx.request.body;
  const heaters = await settingsService.readFromSettings('heaters');
  const lightToUpdate = heaters[heaterId];

  Object.entries(data).forEach(([key, value]) => {
    if (paramsWhitelist.has(key)) {
      lightToUpdate[key] = value;
    }
  })

  const updatedheaters = {
    ...heaters,
    [lightToUpdate.id]: lightToUpdate,
  };

  await settingsService.writeToSettings('heaters', updatedheaters);

  ctx.body = updatedheaters;
})

router.delete('/:heaterId/', async ctx => {
  const { heaterId } = ctx.params;

  const heaters = await settingsService.readFromSettings('heaters');

  delete heaters[heaterId];

  await settingsService.writeToSettings('heaters', heaters);

  ctx.body = heaters;
})
