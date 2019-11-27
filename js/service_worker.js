'use strict';


const CACHE_NAME = 'carros-cache-v1';

const FILES_TO_CACHE = [
    "/js/bootstrap.min.js",
    "/js/init.js",
    "/js/jquery-3.3.1.min.js",
    "/js/menu.js",
    "/js/popper.min.js",
    "/js/utils.js",
    "/css/styles.css",
    "/css/bootstrap.min.css",
    "/img/offline.jpg",
    "/img/logo.png",
    "/icons/128.png",
	"/icons/144.png",
	"/icons/152.png",
	"/icons/180.png",
	"/icons/256.png",
	"/icons/512.png"
];

//Gravando arquivos arquivos estáticos - Somente para montar Front-end

self.addEventListener('install', evt =>{

    console.log("[Service Worker] Instalando caches estáticos");

    
    evt.waitUntil(


        caches.open(CACHE_NAME).then((cache) => {
            
            return cache.addAll(FILES_TO_CACHE);

        })
        
    );

    self.skipWaiting();

});

//Ativando o Service Worker e removendo cache antigo


self.addEventListener('activate', (evt) => {

    console.log("[Service Worker] Ativando e removendo cache antigo");

    evt.waitUntil(

        caches.keys().then((keyList) => {

            return Promise.all(keyList.map((key) =>{

                if(key !== CACHE_NAME){

                    return caches.delete(key);
    
                }

            }));

        })        
    );  
    self.clients.claim();
});

//Respondendo a página offline

self.addEventListener('fetch', function(event) {

    event.respondWith(
      caches.match(event.request).then(function(resp) {
        return resp || fetch(event.request).then(function(response) {
          caches.open(CACHE_NAME).then(function(cache) {
            //cache.put(event.request, response.clone());
          });
          return response;
        });
      }).catch(function() {
        return caches.match('/offline.html');
      })
    );
  });