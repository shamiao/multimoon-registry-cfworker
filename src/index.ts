/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.toml`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

import { registry } from "./registry";
import { check, update } from "./update";

function matches(url: URL, patt: String): Boolean {
	let patt_use
	if (patt != '/' && patt.endsWith("/")) {
		patt_use = patt.substring(0, patt.length - 1)
	} else {
		patt_use = patt
	}
	return url.pathname == patt_use || url.pathname == `${patt_use}/`
}

async function fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
	const url = new URL(request.url);
	if (matches(url, '/macos_aarch64') && request.method == 'GET') {
		return await registry('macos_aarch64', request, env, ctx);
	} else if (matches(url, '/macos_amd64') && request.method == 'GET') {
		return await registry('macos_amd64', request, env, ctx);
	} else if (matches(url, '/ubuntu_amd64') && request.method == 'GET') {
		return await registry('ubuntu_amd64', request, env, ctx);
	} else if (matches(url, '/windows_x64') && request.method == 'GET') {
		return await registry('windows_x64', request, env, ctx);
	} else if (matches(url, '/update/check') && request.method == 'POST') {
		return await check(request, env, ctx);
	} else if (matches(url, '/update') && request.method == 'POST') {
		return await update(request, env, ctx);
	}

	return new Response("not found\n", { status: 404 });
}

export default {
	fetch	
};
