(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var gtagIds = (currentScript.getAttribute('data-gtag-ids') || '')
    .split(',')
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean);
  var yandexId = currentScript.getAttribute('data-ym-id');

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  var analyticsLoaded = false;

  function loadGoogleTags() {
    if (!gtagIds.length) return;

    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gtagIds[0]);
    script.async = true;
    script.onload = function () {
      window.gtag('js', new Date());
      gtagIds.forEach(function (id) {
        window.gtag('config', id);
      });
    };
    document.head.appendChild(script);
  }

  function loadYandexMetrika() {
    if (!yandexId) return;

    (function (m, e, t, r, i, k, a) {
      m[i] =
        m[i] ||
        function () {
          (m[i].a = m[i].a || []).push(arguments);
        };
      m[i].l = 1 * new Date();
      k = e.createElement(t);
      a = e.getElementsByTagName(t)[0];
      k.async = 1;
      k.src = r;
      a.parentNode.insertBefore(k, a);
    })(window, document, 'script', 'https://mc.yandex.ru/metrika/tag.js?id=' + encodeURIComponent(yandexId), 'ym');

    window.ym(Number(yandexId), 'init', {
      ssr: true,
      webvisor: true,
      clickmap: true,
      ecommerce: 'dataLayer',
      referrer: document.referrer,
      url: location.href,
      accurateTrackBounce: true,
      trackLinks: true,
    });
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    loadGoogleTags();
    loadYandexMetrika();
  }

  function scheduleIdleLoad() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(
        function () {
          window.setTimeout(loadAnalytics, 800);
        },
        { timeout: 4000 }
      );
      return;
    }

    window.addEventListener(
      'load',
      function () {
        window.setTimeout(loadAnalytics, 2000);
      },
      { once: true }
    );
  }

  ['pointerdown', 'keydown', 'scroll'].forEach(function (eventName) {
    window.addEventListener(eventName, loadAnalytics, {
      once: true,
      passive: eventName === 'scroll',
    });
  });

  scheduleIdleLoad();
})();
