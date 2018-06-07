import Koa from 'koa';
import { Nuxt, Builder } from 'nuxt';
import bodyParser from 'koa-bodyparser';
import sf from 'snekfetch';
import gconfig from '../config';
import Security from './security';
import rethinkdbdash from 'rethinkdbdash';
import words from '../words.json';
import moment from 'moment';

async function start() {
  const privacy_version = 1;

  // TODO: use an actually good database
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

  function generateId() {
    let array = [];
    for (let i = 0; i < 4; i++) {
      let word = words[Math.floor(Math.random() * words.length)];
      word = word.substring(0, 1).toUpperCase() + word.substring(1);
      array.push(word);
    }
    return array.join('');
  }

  function formatOutput(obj, values) {
    if (Array.isArray(obj)) {
      for (let i = 0; i < obj.length; i++) {
        let t = formatOutput(obj[i], values);
        if (typeof obj[i] === 'string')
          obj[i] = t;
      }
    } else if (typeof obj === 'object') {
      for (const key in obj) {
        let t = formatOutput(obj[key], values);
        if (typeof obj[key] === 'string')
          obj[key] = t;
      }
    } else if (typeof obj === 'string') {
      let t = obj;
      for (const key in values) {
        t = t.replace(new RegExp('{{' + key + '}}', 'gi'), values[key]);
      }
      return t;
    }
    return obj;
  }

  function checkIfEmbedIsPopulated(embed) {
    return embed.title == ''
      && embed.description == ''
      && embed.url == ''
      && embed.author.name == ''
      && embed.author.icon_url == ''
      && embed.author.url == ''
      && embed.footer.text == ''
      && embed.footer.icon_url == ''
      && embed.image.url == ''
      && embed.image.thumbnail == ''
      && embed.fields.length === 0
      && embed.timestamp === false
      && embed.color === 0;
  }

  async function announceGiveaway({ ctx, event }) {
    if (!event.data.webhook.announceGiveaway.enabled)
      return;

    let embed = event.data.webhook.announceGiveaway.embed;
    if (checkIfEmbedIsPopulated(embed))
      event.data.webhook.announceGiveaway.embed = undefined;

    let output = formatOutput(event.data.webhook.announceGiveaway, {
      title: event.data.title,
      desc: event.data.description,
      entries: event.data.users.length,
      link: (gconfig.origin || 'https://giveaways.stupidcat.me')
        + '/giveaway/' + event.id
    });

    if (output.embed) {
      if (output.embed.timestamp)
        output.embed.timestamp = moment(event.data.timestamp);

      if (output.embed.color === 0)
        output.embed.color = undefined;

      output.embeds = [output.embed];
    }


    await sf.post(event.data.webhook.url)
      .send(output);
  }

  async function announceWinner({ ctx, event }) {
    if (!event.data.webhook.announceWinner.enabled)
      return;

    let embed = event.data.webhook.announceWinner.embed;
    if (checkIfEmbedIsPopulated(embed))
      event.data.webhook.announceWinner.embed = undefined;

    let output = formatOutput(event.data.webhook.announceWinner, {
      title: event.data.title,
      desc: event.data.description,
      entries: event.data.users.length,
      link: (gconfig.origin || 'https://giveaways.stupidcat.me')
        + '/giveaway/' + event.id,
      avatar: event.winner.avatarURL,
      id: event.winner.id,
      username: event.winner.username,
      discrim: event.winner.discriminator
    });

    if (output.embed) {
      if (output.embed.timestamp)
        output.embed.timestamp = moment(event.winner.timestamp);
      if (output.embed.color === 0)
        output.embed.color = undefined;

      output.embeds = [output.embed];
    }

    await sf.post(event.data.webhook.url)
      .send(output);
  }

  async function chooseWinner({ ctx, event }) {
    if (!event.winners)
      event.winners = [];
    // dont include past winners in the pool
    let users = event.data.users.filter(u => !event.winners.includes(u));
    if (users.length === 0) return;

    let winner = users[Math.floor(Math.random() * users.length)];

    event.winners.push(winner);
    try {
      let res = await sf.get('https://discordapp.com/api/v6/users/' + winner)
        .set({
          Authorization: 'Bot ' + gconfig.token
        });

      event.winner = res.body;
      event.winner.avatarURL = 'https://cdn.discordapp.com/avatars/'
        + event.winner.id + '/' + event.winner.avatar + '.'
        + (event.winner.avatar.startsWith('a_') ? 'gif' : 'png');

      event.winner.timestamp = Date.now();

      await r.table('giveaway').get(event.id).update({
        winners: event.winners,
        winner: event.winner
      });
      await announceWinner({ ctx, event });
    } catch (err) {
      console.error(err);
      if (ctx)
        ctx.throw(500);
    }
  }

  let eventInterval = setInterval(async () => {
    let events = await r.table('giveaway').between(r.minval, Date.now(), { index: 'timestamp' });
    for (const event of events) {
      await chooseWinner({ event });
    }
  }, 1000 * 60);

  const routes = {
    async create_giveaway({ ctx, next, path }) {
      ctx.assert(ctx.method === 'POST', 405);
      let id = Security.validateToken(ctx.req.headers.authorization);
      ctx.assert(id !== null, 403);
      id = id.id;

      let giveawayId;
      let event;
      do {
        giveawayId = generateId();;
        event = await r.table('giveaway').get(giveawayId);
      } while (event);
      let data = ctx.request.body;

      data.id = giveawayId;
      data.owner = id;
      await r.table('giveaway').insert(data);
      await announceGiveaway({ ctx, event: data });

      ctx.body = giveawayId;
    },
    async giveaway({ ctx, next, path }) {
      let id = Security.validateToken(ctx.req.headers.authorization);
      ctx.assert(id !== null, 403);
      id = id.id;

      console.log(ctx.method, ctx.path);

      switch (ctx.method) {
        case 'GET': {
          ctx.assert(path.length === 2, 404, 'Endpoint not found');
          let giveawayId = path[1];
          let event = await r.table('giveaway').get(giveawayId);
          if (!event) ctx.throw(404, 'Event not found');

          if (event.data.timestamp <= Date.now()) {
            await chooseWinner({ ctx, event });
          }
          event.data.entries = event.data.users.length;
          event.data.viableEntries = event.data.entries - ((event.winners || []).length);
          event.data.entered = event.data.users.includes(id);
          event.data.password = undefined;
          event.data.webhook = undefined;
          event.data.users = undefined;
          ctx.body = JSON.stringify(event);
          break;
        }
        case 'POST': {
          console.log('post');
          ctx.assert(path.length === 3, 400, 'Endpoint not provided');
          let giveawayId = path[1];
          let event = await r.table('giveaway').get(giveawayId);
          ctx.assert(event, 404, 'Event not found');
          switch (path[2].toLowerCase()) {
            case 'enter': {
              ctx.assert(event.owner !== id, 400, 'You cannot enter your own giveaway');
              ctx.assert(!event.data.users.includes(id), 400, 'You have already entered the giveaway');
              let { password } = ctx.request.body;
              if (password === event.data.password) {
                event.data.users.push(id);
                await r.table('giveaway').get(giveawayId).update({
                  data: {
                    users: event.data.users
                  }
                });
                ctx.body = "true";
              } else ctx.body = "false";

              console.log(ctx.body);
              break;
            }
            case 'draw': {
              ctx.assert(id === event.owner, 403, 'You do not own this event');
              await chooseWinner({ ctx, event });
              ctx.body = JSON.stringify({
                winner: event.winner,
                winners: event.winners,
                users: event.data.users,
                noWinner: event.noWinner
              });
              break;
            }
            case 'announce': {
              console.log('announce');
              ctx.assert(id === event.owner, 403, 'You do not own this event');
              if (event.winner)
                await announceWinner({ ctx, event });
              else
                await announceGiveaway({ ctx, event });
              break;
            }
            default:
              ctx.throw(404, 'Endpoint not found');
              break;
          }
          break;
        }
        default:
          ctx.throw(405);
          break;
      }
    },
    async privacy_version({ ctx, next }) {
      ctx.assert(ctx.method === 'GET', 405);
      ctx.body = privacy_version;
    },
    async login({ ctx, next }) {
      ctx.assert(ctx.method === 'POST', 405, 'Must login using POST');
      let { code, redirect_uri } = ctx.request.body;
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
