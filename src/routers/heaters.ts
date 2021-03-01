const Router = require('koa-router');
const { v4: uuid } = require('uuid');

const { settingsService } = require('../services');

export const router = new Router();

type Heater = {
  id: number;
  pin: number;
  name: string;
  plug: number;
  description: string;
  status: 0 | 1;
}

type Heaters = { [key: string]: Heater };

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
  const heaters: Heaters = await settingsService.readFromSettings('heaters');

  ctx.body = heaters;
});

router.post('/', async ctx => {
  const {
    pin,
    name,
    plug = 0,
    description = '',
    status = 0,
  } = ctx.request.body;

  const heaters: Heaters = await settingsService.readFromSettings('heaters');
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
    }
  };

  await settingsService.writeToSettings('heaters', newHeaters);

  ctx.body = newHeaters;
});

router.put('/:heaterId/', async ctx => {
  const { heaterId } = ctx.params;

  const data = ctx.request.body;
  const heaters: Heaters = await settingsService.readFromSettings('heaters');
  const heaterToUpdate = heaters[heaterId];

  Object.entries(data).forEach(([key, value]) => {
    if (paramsWhitelist.has(key)) {
      heaterToUpdate[key] = value;
    }
  })

  const updatedheaters = {
    ...heaters,
    [heaterToUpdate.id]: heaterToUpdate,
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
