/*! coi-serviceworker v0.1.7 | MIT License | https://github.com/gzuidhof/coi-serviceworker */
if (typeof window === 'undefined') {
    self.addEventListener("install", () => self.skipWaiting());
    self.addEventListener("activate", (event) => event.waitUntil(self.clients.claim()));
    self.onmessage = (ev) => { if (ev.data && ev.data.type === "deregister") { self.registration.unregister().then(() => { ev.ports[0].postMessage("done"); }); } };
    self.addEventListener("fetch", (event) => {
        if (event.request.cache === "only-if-cached" && event.request.mode !== "same-origin") return;
        event.respondWith(
            fetch(event.request).then((response) => {
                if (response.status === 0) return response;
                const newHeaders = new Headers(response.headers);
                newHeaders.set("Cross-Origin-Embedder-Policy", "require-corp");
                newHeaders.set("Cross-Origin-Opener-Policy", "same-origin");
                return new ImageResponse(response.body, { status: response.status, statusText: response.statusText, headers: newHeaders });
            }).catch((e) => console.error(e))
        );
    });
}
