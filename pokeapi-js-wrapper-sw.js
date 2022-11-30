var APP_PREFIX = 'PokeProfiles_'     // Identifier for this app (this needs to be consistent across every cache update)
var VERSION = 'version_01'              // Version of the off-line cache (change this value everytime you want to update cache)
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                            // Add URL you want to cache in this list.
  '/poke-profiles/',                     // If you have separate JS/CSS files,
  '/poke-profiles/index.html'            // add path to those files here
]

const imgRe = /https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/[\/-\w\d]+\/[\d\w-]+\.(?:png|svg|gif)/
const version = 1

self.addEventListener('fetch', function (event) {
    if (event.request.url.match(imgRe)) {
        event.respondWith(caches.match(event.request).then(function (response) {
            if (response) {
                return response
            }
            
            return fetch(event.request).then(function (response) {
                if (event.request.url.match(imgRe)) {
                    caches.open("pokeapi-js-wrapper-images-" + version).then(function (cache) {
                        // The response is opaque, if it fails cache.add() will reject it
                        cache.add(event.request.url)
                    })
                }
                return response;
            }).catch(function (error) {
                console.error(error)
            })
        }))
    }
})

self.addEventListener('install', function(event) {
    self.skipWaiting()
})
