// sw.js — met en cache l'application pour un usage hors ligne.
// Changer VERSION à chaque mise à jour des règles ou du code.
const VERSION = "2026-10-24-4";
const CACHE = "cotation-" + VERSION;
const FICHIERS = ["./", "./index.html", "./app.css", "./ui.js", "./moteur.js", "./regles.js", "./manifest.webmanifest", "./icone.svg"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => { e.respondWith(caches.match(e.request, { ignoreSearch: true }).then((r) => r || fetch(e.request))); });
