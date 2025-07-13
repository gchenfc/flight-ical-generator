/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 * 
 * - Use `cd amadeus-proxy; wrangler deploy` to deploy to Cloudflare.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

const ALLOWED_ORIGINS = [
  'https://gchenfc.github.io',
  'https://gerry-chen.com',
  // 'null', // Uncomment this for local testing with file:// URLs
];

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    if (url.pathname !== "/token") {
      return new Response("Not Found", { status: 404 });
    }

    const origin = request.headers.get("Origin");
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : "";
    if (!allowOrigin) {
      return new Response("Blocked by CORS", {
        status: 403,
        headers: {
          "Access-Control-Allow-Origin": allowOrigin,
          "Vary": "Origin"
        }
      });
    }

    const res = await fetch("https://test.api.amadeus.com/v1/security/oauth2/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        client_id: env.AMADEUS_CLIENT_ID,
        client_secret: env.AMADEUS_CLIENT_SECRET
      })
    });

    const data = await res.json();

    return new Response(JSON.stringify(data), {
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": allowOrigin,
        "Vary": "Origin"
      }
    });
  }
};
