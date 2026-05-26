const CACHE = 'radioonko-v8';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './questions_database.json',
  './Comparison_PDD_Photon_Electron_Proton.png',
  './Electron_PDD_increasing_energy.png',
  './Kerma_vs_Dose_PDD.png',
  './Linac_Aufbau.png',
  './Linac_Head_Components_Flattening_Filter.png',
  './Photon_PDD_increasing_SSD.png',
  './Photon_PDD_increasing_field_size.png',
  './Photon_beam_horizontal_profile.png',
  './Photons_PDD_increasing_energy.png',
  './Proton_PDD_SOBP.png',
  './Roentgen_Roehre.png',
  './Use_of_wegdes.png',
  './survival_curve_alpha_beta.png'
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
