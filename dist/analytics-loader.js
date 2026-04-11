(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  var gtagIds = Array.from(
    new Set(
      (currentScript.getAttribute('data-gtag-ids') || '')
        .split(',')
        .map(function (value) {
          return value.trim();
        })
        .filter(Boolean)
    )
  );
  var yandexId = currentScript.getAttribute('data-ym-id');
  var googleIdleDelay = Number(currentScript.getAttribute('data-google-idle-delay') || 12000);
  var yandexIdleDelay = Number(currentScript.getAttribute('data-yandex-idle-delay') || 20000);

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };

  var googleLoaded = false;
  var yandexLoaded = false;

  function loadGoogleTags() {
    if (googleLoaded || !gtagIds.length) return;
    googleLoaded = true;

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
    if (yandexLoaded || !yandexId) return;
    yandexLoaded = true;

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

  function loadAllAnalytics() {
    loadGoogleTags();
    loadYandexMetrika();
  }

  function scheduleIdleTask(task, delay) {
    var scheduleTimeout = function () {
      window.setTimeout(task, delay);
    };

    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(scheduleTimeout, { timeout: delay + 3000 });
      return;
    }

    scheduleTimeout();
  }

  function scheduleDeferredAnalytics() {
    var start = function () {
      scheduleIdleTask(loadGoogleTags, googleIdleDelay);
      scheduleIdleTask(loadYandexMetrika, yandexIdleDelay);
    };

    if (document.readyState === 'complete') {
      start();
      return;
    }

    window.addEventListener('load', start, { once: true });
  }

  ['pointerdown', 'keydown', 'scroll'].forEach(function (eventName) {
    window.addEventListener(eventName, loadAllAnalytics, {
      once: true,
      passive: eventName === 'scroll',
    });
  });

  scheduleDeferredAnalytics();
})();
