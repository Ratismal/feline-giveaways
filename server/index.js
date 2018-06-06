import Koa from 'koa';
import { Nuxt, Builder } from 'nuxt';
import bodyParser from 'koa-bodyparser';
import sf from 'snekfetch';
import gconfig from '../config';
import Security from './security';
import rethinkdbdash from 'rethinkdbdash';

async function start() {
  const r = rethinkdbdash({
    host: gconfig.r.host,
    db: gconfig.r.database,
    password: gconfig.r.password,
    user: gconfig.r.user,
    port: gconfig.r.port,
    max: 50,
    buffer: 5,
    timeoutError: 10000
  });

  const app = new Koa();
  const host = process.env.HOST || '127.0.0.1';
  const port = process.env.PORT || 8102;

  // Import and Set Nuxt.js options
  let config = require('../nuxt.config.js');
  config.dev = !(app.env === 'production');

  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }


  const routes = {
    async login({ ctx, next }) {
      ctx.assert(ctx.method === 'POST', 405, 'Must login using POST');
      let { code, redirect_uri } = ctx.request.body;
      console.log(code, redirect_uri);
      let res = await sf.post('https://discordapp.com/api/oauth2/token')
        .set({
          'Content-Type': 'application/x-www-form-urlencoded'
        })
        .send({
          client_id: gconfig.client.id,
          client_secret: gconfig.client.secret,
          grant_type: 'authorization_code',
          code,
          redirect_uri,
          scope: 'identify'
        });

      let token = res.body;

      res = await sf.get('https://discordapp.com/api/v6/users/@me')
        .set({
          Authorization: token.token_type + ' ' + token.access_token
        });
      let user = res.body;

      let data = {
        token: Security.generatedToken(user.id)
      };

      ctx.body = JSON.stringify(data);
    },
    async privacy({ ctx, next }) {
      let id = Security.validateToken(ctx.req.headers.authorization);
      ctx.assert(id, 403, 'Unauthorized');

      let { accept } = ctx.request.body;
      accept = accept === true;
      await r.table('user').get(id.id).update({
        privacyAccept: accept
      });
    },
    async users({ ctx, next, path }) {
      if (path[1].toLowerCase() === '@me') {
        let id = Security.validateToken(ctx.req.headers.authorization);
        ctx.assert(id, 403, 'Unauthorized');
        let res = await sf.get('https://discordapp.com/api/v6/users/' + id.id)
          .set({
            Authorization: 'Bot ' + gconfig.token
          });

        let u = await r.table('user').get(id.id);
        if (!u) {
          u = { id: id.id, privacyAccept: false };
          await r.table('user').insert(u);
        }
        ctx.body = JSON.stringify(Object.assign({}, res.body, u));
      } else {
        ctx.throw(404);
      }
    }
  };

  app.use(bodyParser());

  app.use(async (ctx, next) => {
    await next();
    ctx.status = 200; // koa defaults to 404 when it sees that status is unset

    if (ctx.path.startsWith('/api/')) {
      console.log(ctx.method);
      let path = ctx.path.split('/').slice(2);
      let route = routes[path[0].toLowerCase()];
      if (route) {
        await route({ ctx, next, path });
      } else ctx.throw(404);
    } else
      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve);
        ctx.res.on('finish', resolve);
        nuxt.render(ctx.req, ctx.res, promise => {
          // nuxt.render passes a rejected promise into callback on error.
          promise.then(resolve).catch(reject);
        });
      });
  });

  app.listen(port, host);
  console.log('Server listening on ' + host + ':' + port); // eslint-disable-line no-console
}

start();
