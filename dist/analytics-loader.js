(function () {
  var currentScript = document.currentScript;
  if (!currentScript) return;

  function parsePositiveNumber(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }

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
  var yandexId = parsePositiveNumber(currentScript.getAttribute('data-ym-id'));
  var googleIdleDelay = parsePositiveNumber(currentScript.getAttribute('data-google-idle-delay') || 12000);
  var yandexIdleDelay = parsePositiveNumber(currentScript.getAttribute('data-yandex-idle-delay') || 20000);
  var analyticsState =
    window.__makeTradesAnalytics ||
    (window.__makeTradesAnalytics = {
      configuredGoogleIds: {},
      queuedGoogleIds: {},
      googleJsInitialized: false,
      googleScriptRequested: false,
      googleScriptLoaded: false,
      initializedYandexIds: {},
      yandexScriptRequested: false,
      interactionBound: false,
      deferredScheduled: false,
      yandexCounterId: 0,
    });

  if (yandexId) analyticsState.yandexCounterId = yandexId;

  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  window.ym =
    window.ym ||
    function () {
      (window.ym.a = window.ym.a || []).push(arguments);
    };
  window.ym.l = window.ym.l || new Date().getTime();

  gtagIds.forEach(function (id) {
    analyticsState.queuedGoogleIds[id] = true;
  });

  function configureGoogleTags() {
    if (!analyticsState.googleJsInitialized) {
      analyticsState.googleJsInitialized = true;
      window.gtag('js', new Date());
    }

    Object.keys(analyticsState.queuedGoogleIds).forEach(function (id) {
      if (analyticsState.configuredGoogleIds[id]) return;
      analyticsState.configuredGoogleIds[id] = true;
      window.gtag('config', id);
    });
  }

  function loadGoogleTags() {
    if (!Object.keys(analyticsState.queuedGoogleIds).length) return;
    if (analyticsState.googleScriptLoaded) {
      configureGoogleTags();
      return;
    }
    if (analyticsState.googleScriptRequested) return;
    analyticsState.googleScriptRequested = true;

    var script = document.createElement('script');
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(Object.keys(analyticsState.queuedGoogleIds)[0]);
    script.async = true;
    script.onload = function () {
      analyticsState.googleScriptLoaded = true;
      configureGoogleTags();
    };
    document.head.appendChild(script);
  }

  function loadYandexMetrika() {
    if (!yandexId) return;

    if (!analyticsState.initializedYandexIds[yandexId]) {
      analyticsState.initializedYandexIds[yandexId] = true;

      window.ym(yandexId, 'init', {
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

    if (analyticsState.yandexScriptRequested || document.querySelector('script[data-analytics-vendor="yandex-metrika"]')) {
      analyticsState.yandexScriptRequested = true;
      return;
    }

    analyticsState.yandexScriptRequested = true;

    var script = document.createElement('script');
    script.async = true;
    script.src = 'https://mc.yandex.ru/metrika/tag.js';
    script.setAttribute('data-analytics-vendor', 'yandex-metrika');
    document.head.appendChild(script);
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
    if (analyticsState.deferredScheduled) return;
    analyticsState.deferredScheduled = true;

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

  if (!analyticsState.interactionBound) {
    analyticsState.interactionBound = true;

    ['pointerdown', 'keydown', 'scroll'].forEach(function (eventName) {
      window.addEventListener(eventName, loadAllAnalytics, {
        once: true,
        passive: eventName === 'scroll',
      });
    });
  }

  scheduleDeferredAnalytics();
})();
