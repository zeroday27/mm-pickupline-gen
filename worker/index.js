import { Container, getContainer } from '@cloudflare/containers';

export class PickupApi extends Container {
  defaultPort = 3000;
  sleepAfter = '10m';
  envVars = {
    NODE_ENV: 'production',
    WORKER_PROXY: '1',
    MONGODB_URI: this.env.MONGODB_URI,
    ADMIN_USERNAME: this.env.ADMIN_USERNAME,
    ADMIN_PASSWORD: this.env.ADMIN_PASSWORD
  };
}

export default {
  async fetch(request, env) {
    const path = new URL(request.url).pathname;
    if (path !== '/api' && !path.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!env.MONGODB_URI || !env.ADMIN_USERNAME || !env.ADMIN_PASSWORD) {
      return Response.json({ error: 'API configuration incomplete' }, { status: 503 });
    }

    const upstream = new Request(request);
    upstream.headers.set('X-Forwarded-For', request.headers.get('CF-Connecting-IP') || '127.0.0.1');
    return getContainer(env.API, 'pickup-api').fetch(upstream);
  }
};
