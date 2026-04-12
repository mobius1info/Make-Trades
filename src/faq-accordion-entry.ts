import { initFaqAccordion } from './faq-accordion';

function initFaqAccordions() {
  initFaqAccordion(document.getElementById('faqList'));
  initFaqAccordion(document.getElementById('allFAQItems'));
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFaqAccordions, { once: true });
} else {
  initFaqAccordions();
}
