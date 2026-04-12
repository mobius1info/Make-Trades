export const FAQ_ACCORDION_OPEN_EVENT = 'maketrades:faq-opened';

interface FaqAccordionOpenDetail {
  faqId: string | null;
}

function syncFaqAnswerState(item: HTMLElement) {
  const answer = item.querySelector<HTMLElement>('.faq-answer');
  if (!answer) return;

  const isActive = item.classList.contains('active');
  answer.style.maxHeight = isActive ? `${answer.scrollHeight}px` : '0px';
  answer.style.marginTop = isActive ? '1rem' : '0';
  answer.style.opacity = isActive ? '1' : '0';
}

function updateFaqItemState(item: HTMLElement) {
  item.setAttribute('role', 'button');
  item.tabIndex = 0;
  item.setAttribute('aria-expanded', item.classList.contains('active') ? 'true' : 'false');
  syncFaqAnswerState(item);
}

function prepareFaqItems(container: HTMLElement) {
  container.querySelectorAll<HTMLElement>('.faq-item').forEach(updateFaqItemState);
}

function dispatchFaqOpen(item: HTMLElement) {
  document.dispatchEvent(
    new CustomEvent<FaqAccordionOpenDetail>(FAQ_ACCORDION_OPEN_EVENT, {
      detail: {
        faqId: item.getAttribute('data-faq-id'),
      },
    })
  );
}

function toggleFaqItem(container: HTMLElement, target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return;

  const item = target.closest<HTMLElement>('.faq-item');
  if (!item || !container.contains(item)) return;

  const wasActive = item.classList.contains('active');
  item.classList.toggle('active');
  updateFaqItemState(item);

  if (!wasActive) {
    dispatchFaqOpen(item);
  }
}

export function initFaqAccordion(container: HTMLElement | null) {
  if (!container) return;

  prepareFaqItems(container);

  if (container.dataset.faqAccordionReady === 'true') {
    return;
  }

  container.dataset.faqAccordionReady = 'true';

  container.addEventListener('click', event => {
    toggleFaqItem(container, event.target);
  });

  container.addEventListener('keydown', event => {
    if (event.key !== 'Enter' && event.key !== ' ') return;

    const target = event.target;
    if (!(target instanceof HTMLElement) || !target.closest('.faq-item')) return;

    event.preventDefault();
    toggleFaqItem(container, target);
  });

  const observer = new MutationObserver(() => {
    prepareFaqItems(container);
  });

  observer.observe(container, {
    childList: true,
    subtree: true,
  });

  window.addEventListener('resize', () => {
    prepareFaqItems(container);
  });
}
