const Router = require('koa-router');
const fs = require('fs');
const path = require('path');

export const router = new Router();

router.get('/ping', ctx => {
  ctx.body = 'hello world';
})

router.get('/', async ctx => {
  const lights = await fs.readFileSync(
    path.join(__dirname, '../../settings/lights.json'),
    'utf8',
    (err, data) => {
      if (err) throw err;

      return JSON.parse(data);
    }
  );

  ctx.body = lights;
});

router.post('/new', async ctx => {
  const {
    pin,
    name,
    plug = 0,
    description = '',
    status = 0,
    level = 100,
    dimmable = false,
  } = ctx.request.body;

  const lights = await fs.readFileSync(
    path.join(__dirname, '../../settings/lights.json'),
    'utf8',
    (err, data) => {
      if (err) throw err;

      return data;
    }
  );

  const jsonLights = JSON.parse(lights);
  const newLights = [
    ...jsonLights,
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

  const data = JSON.stringify(newLights, null, 2);

  await fs.writeFileSync(
    path.join(__dirname, '../../settings/lights.json'),
    data,
    (err => { if (err) throw err; })
  );


  ctx.body = newLights;
});
