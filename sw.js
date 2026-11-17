const CACHE='nursing-offline-v1';
const FILES=['./','./index.html','./app.js','./data.js','./offline.js','./manifest.webmanifest','./icon-192.png','./icon-512.png','./apple-touch-icon.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(FILES);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('nursing-offline-')&&key!==CACHE)await caches.delete(key);await self.clients.claim()})()));
self.addEventListener('fetch',event=>{if(event.request.method!=='GET')return;event.respondWith((async()=>{const c=await caches.open(CACHE);const hit=await c.match(event.request,{ignoreSearch:true});if(hit)return hit;if(event.request.mode==='navigate')return await c.match('./index.html');return new Response('Offline resource unavailable',{status:503})})())});
self.addEventListener('message',event=>{if(event.data==='VERIFY_CACHE')event.waitUntil((async()=>{const c=await caches.open(CACHE);const ready=(await Promise.all(FILES.map(f=>c.match(f)))).every(Boolean);event.ports[0]?.postMessage({ready})})())});
