const CACHE = 'radioonko-v4';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './questions_database.json',
  './images/Kerma_vs_Dose_PDD.png',
  './images/Comparison_PDD_Photon_Electron_Proton.png',
  './images/Proton_PDD_SOBP.png',
  './images/Electron_PDD_increasing_energy.png',
  './images/Photon_PDD_increasing_SSD.png',
  './images/Photon_PDD_increasing_field_size.png',
  './images/Photons_PDD_increasing_energy.png',
  './images/Use_of_wegdes.png',
  './images/Photon_beam_horizontal_profile.png',
  './images/Linac_Head_Components_Flattening_Filter.png',
  './images/Linac_Aufbau.png',
  './images/Roentgen_Roehre.png',
  './images/survival_curve_alpha_beta.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(e.request, copy));
        }
        return res;
      });
    }).catch(() => caches.match('./index.html'))
  );
});
