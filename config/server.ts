import { url } from "inspector";

export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 5000),
  url: env('SERVER_URL'),
  proxy: true,
  app: {
    keys: env.array('APP_KEYS'),
  },
  admin: {
    url: env('SERVER_URL') ? `${env('SERVER_URL')}/admin` : '/admin',
    autoOpen: false,
  },
  webhooks: {
    populate: {
      headers: true,
    },
  },
});
