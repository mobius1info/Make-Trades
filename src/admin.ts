import { supabase as sharedSupabase } from './supabase';
import type { SupabaseClient } from '@supabase/supabase-js';

let editingTranslationId: string | null = null;
let editingImageId: string | null = null;
let editingBlogId: string | null = null;

function getSupabase(): SupabaseClient {
  return sharedSupabase;
}

function showLoginError(msg: string) {
  const el = document.getElementById('loginError');
  if (el) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}

function hideLoginError() {
  const el = document.getElementById('loginError');
  if (el) {
    el.style.display = 'none';
  }
}

async function checkAuth() {
  try {
    const sb = getSupabase();
    const { data: { session } } = await sb.auth.getSession();

    if (!session) {
      showAuthForm();
      return false;
    }

    const { data: adminUser } = await sb
      .from('admin_users')
      .select('*')
      .eq('id', session.user.id)
      .maybeSingle();

    if (!adminUser) {
      await sb.auth.signOut();
      showLoginError('У вас нет прав доступа к админ-панели');
      showAuthForm();
      return false;
    }

    showAdminPanel();
    return true;
  } catch (err: any) {
    console.error('Auth check error:', err);
    showAuthForm();
    return false;
  }
}

function showAuthForm() {
  document.getElementById('authContainer')!.style.display = 'flex';
  document.getElementById('adminContent')!.classList.remove('active');
}

function showAdminPanel() {
  document.getElementById('authContainer')!.style.display = 'none';
  document.getElementById('adminContent')!.classList.add('active');
  loadAllData();
}

document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  e.stopPropagation();

  hideLoginError();

  const loginBtn = document.getElementById('loginBtn') as HTMLButtonElement;
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  if (!email || !password) {
    showLoginError('Введите email и пароль');
    return;
  }

  loginBtn.disabled = true;
  loginBtn.textContent = 'Вход...';

  try {
    const sb = getSupabase();
    const { error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
      showLoginError('Ошибка входа: ' + error.message);
      loginBtn.disabled = false;
      loginBtn.textContent = 'Войти';
      return;
    }

    await checkAuth();
  } catch (err: any) {
    showLoginError('Ошибка: ' + (err.message || 'попробуйте ещё раз'));
    loginBtn.disabled = false;
    loginBtn.textContent = 'Войти';
  }
});

document.getElementById('refreshBtn')?.addEventListener('click', async () => {
  const icon = document.getElementById('refreshIcon');
  const btn = document.getElementById('refreshBtn') as HTMLButtonElement;
  if (icon) icon.style.transform = 'rotate(360deg)';
  btn.disabled = true;
  try {
    await loadAllData();
  } finally {
    btn.disabled = false;
    setTimeout(() => { if (icon) icon.style.transform = ''; }, 600);
  }
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  try {
    const sb = getSupabase();
    await sb.auth.signOut();
  } catch (e) {}
  showAuthForm();
});

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const tabName = target.dataset.tab;

    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

    target.classList.add('active');
    document.getElementById(tabName!)?.classList.add('active');
  });
});

async function loadTranslations() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('translations')
    .select('*')
    .order('key');

  if (error) {
    console.error('Error loading translations:', error);
    return;
  }

  renderTranslations(data || []);
}

function renderTranslations(translations: any[]) {
  const tbody = document.getElementById('translationsTable')!;

  if (translations.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Нет переводов</td></tr>';
    return;
  }

  tbody.innerHTML = translations.map(t => `
    <tr>
      <td>${t.key}</td>
      <td><strong>${t.language.toUpperCase()}</strong></td>
      <td>${t.value}</td>
      <td>${t.category}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editTranslation('${t.id}')">Изменить</button>
        <button class="action-btn btn-delete" onclick="deleteTranslation('${t.id}')">Удалить</button>
      </td>
    </tr>
  `).join('');
}

async function loadImages() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('site_images')
    .select('*')
    .order('key');

  if (error) {
    console.error('Error loading images:', error);
    return;
  }

  renderImages(data || []);
}

function renderImages(images: any[]) {
  const tbody = document.getElementById('imagesTable')!;

  if (images.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem;">Нет картинок</td></tr>';
    return;
  }

  tbody.innerHTML = images.map(img => `
    <tr>
      <td>${img.key}</td>
      <td><a href="${img.url}" target="_blank">${img.url.substring(0, 50)}...</a></td>
      <td>${img.alt_text || '-'}</td>
      <td>${img.category}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editImage('${img.id}')">Изменить</button>
        <button class="action-btn btn-delete" onclick="deleteImage('${img.id}')">Удалить</button>
      </td>
    </tr>
  `).join('');
}

async function loadBlogPosts() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading blog posts:', error);
    return;
  }

  renderBlogPosts(data || []);
}

function renderBlogPosts(posts: any[]) {
  const tbody = document.getElementById('blogTable')!;

  if (posts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 2rem;">Нет статей</td></tr>';
    return;
  }

  tbody.innerHTML = posts.map(post => `
    <tr>
      <td>${post.title}</td>
      <td><strong>${post.language.toUpperCase()}</strong></td>
      <td>${post.published ? 'Да' : 'Нет'}</td>
      <td>${new Date(post.publish_date).toLocaleDateString('ru-RU')}</td>
      <td>${post.views}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editBlogPost('${post.id}')">Изменить</button>
        <button class="action-btn btn-delete" onclick="deleteBlogPost('${post.id}')">Удалить</button>
      </td>
    </tr>
  `).join('');
}

let allLeads: any[] = [];

async function loadLeads() {
  const sb = getSupabase();
  const { data, error } = await sb
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading leads:', error);
    return;
  }

  allLeads = data || [];
  const newCount = allLeads.filter(l => l.is_new).length;
  const demoCount = allLeads.filter(l => l.source === 'demo').length;
  const contactCount = allLeads.filter(l => l.source === 'contact').length;

  const badge = document.getElementById('leadsBadge');
  if (badge) {
    badge.textContent = String(newCount);
    badge.classList.toggle('visible', newCount > 0);
  }

  const totalEl = document.getElementById('leadsTotal');
  const newEl = document.getElementById('leadsNew');
  const demoEl = document.getElementById('leadsDemo');
  const contactEl = document.getElementById('leadsContact');
  if (totalEl) totalEl.textContent = String(allLeads.length);
  if (newEl) newEl.textContent = String(newCount);
  if (demoEl) demoEl.textContent = String(demoCount);
  if (contactEl) contactEl.textContent = String(contactCount);

  filterAndRenderLeads();
}

function filterAndRenderLeads() {
  const search = (document.getElementById('leadsSearch') as HTMLInputElement)?.value?.toLowerCase() || '';
  const sourceFilter = (document.getElementById('leadsSourceFilter') as HTMLSelectElement)?.value || '';

  let filtered = allLeads;

  if (sourceFilter) {
    filtered = filtered.filter(l => l.source === sourceFilter);
  }

  if (search) {
    filtered = filtered.filter(l =>
      (l.name && l.name.toLowerCase().includes(search)) ||
      (l.email && l.email.toLowerCase().includes(search)) ||
      (l.telegram && l.telegram.toLowerCase().includes(search)) ||
      (l.message && l.message.toLowerCase().includes(search)) ||
      (l.referral_source && l.referral_source.toLowerCase().includes(search))
    );
  }

  renderLeads(filtered);
}

const referralLabels: Record<string, string> = {
  google: 'Google',
  social_media: 'Соц. сети',
  recommendation: 'Рекомендация',
  ads: 'Реклама',
  other: 'Другое',
};

function renderLeads(leads: any[]) {
  const container = document.getElementById('leadsContainer')!;

  if (leads.length === 0) {
    container.innerHTML = `
      <div class="empty-leads">
        <div class="empty-leads-icon">--</div>
        <p>Заявок пока нет</p>
      </div>`;
    return;
  }

  container.innerHTML = leads.map(lead => {
    const date = new Date(lead.created_at).toLocaleString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
    const sourceLabel = lead.source === 'demo' ? 'Demo' : 'Contact';
    const sourceClass = lead.source === 'demo' ? 'demo' : 'contact';
    const brokerExp = lead.broker_experience === true ? 'Да' : lead.broker_experience === false ? 'Нет' : '-';
    const referral = lead.referral_source ? (referralLabels[lead.referral_source] || escapeHtml(lead.referral_source)) : '';

    return `
      <div class="lead-card ${lead.is_new ? 'is-new' : ''}">
        <div class="lead-card-header">
          <span class="lead-name">${escapeHtml(lead.name || 'Без имени')}</span>
          <span class="lead-source ${sourceClass}">${sourceLabel}</span>
        </div>
        <div class="lead-info-grid">
          <div class="lead-info-item">
            <span class="lead-info-label">Email</span>
            <span class="lead-info-value">${escapeHtml(lead.email)}</span>
          </div>
          <div class="lead-info-item">
            <span class="lead-info-label">Telegram</span>
            <span class="lead-info-value ${!lead.telegram ? 'lead-info-empty' : ''}">${lead.telegram ? escapeHtml(lead.telegram) : 'Не указан'}</span>
          </div>
          <div class="lead-info-item">
            <span class="lead-info-label">Опыт брокера</span>
            <span class="lead-info-value">${brokerExp}</span>
          </div>
          <div class="lead-info-item">
            <span class="lead-info-label">Откуда узнал</span>
            <span class="lead-info-value ${!referral ? 'lead-info-empty' : ''}">${referral || '-'}</span>
          </div>
          <div class="lead-info-item">
            <span class="lead-info-label">Дата</span>
            <span class="lead-info-value">${date}</span>
          </div>
          <div class="lead-info-item">
            <span class="lead-info-label">Язык</span>
            <span class="lead-info-value">${lead.language ? lead.language.toUpperCase() : '-'}</span>
          </div>
        </div>
        ${lead.message ? `<div class="lead-message">${escapeHtml(lead.message)}</div>` : ''}
        <div class="lead-actions">
          ${lead.is_new ? `<button class="action-btn btn-edit" onclick="markLeadRead('${lead.id}')">Прочитано</button>` : ''}
          <button class="action-btn btn-delete" onclick="deleteLead('${lead.id}')">Удалить</button>
        </div>
      </div>`;
  }).join('');
}

function escapeHtml(text: string): string {
  const d = document.createElement('div');
  d.textContent = text;
  return d.innerHTML;
}

(window as any).markLeadRead = async (id: string) => {
  try {
    const sb = getSupabase();
    const { error } = await sb.from('leads').update({ is_new: false }).eq('id', id);

    if (error) {
      console.error('Error marking lead as read:', error);
      alert('Ошибка обновления: ' + error.message);
      return;
    }

    await loadLeads();
  } catch (err: any) {
    console.error('Error in markLeadRead:', err);
    alert('Ошибка: ' + (err.message || 'Не удалось обновить заявку'));
  }
};

(window as any).deleteLead = async (id: string) => {
  if (!confirm('Удалить эту заявку?')) return;

  try {
    const sb = getSupabase();
    const { error } = await sb.from('leads').delete().eq('id', id);

    if (error) {
      console.error('Error deleting lead:', error);
      alert('Ошибка удаления: ' + error.message);
      return;
    }

    await loadLeads();
  } catch (err: any) {
    console.error('Error in deleteLead:', err);
    alert('Ошибка: ' + (err.message || 'Не удалось удалить заявку'));
  }
};

document.getElementById('markAllReadBtn')?.addEventListener('click', async () => {
  try {
    const sb = getSupabase();
    const { error } = await sb.from('leads').update({ is_new: false }).eq('is_new', true);

    if (error) {
      console.error('Error marking all leads as read:', error);
      alert('Ошибка обновления всех заявок: ' + error.message);
      return;
    }

    await loadLeads();
  } catch (err: any) {
    console.error('Error in markAllReadBtn:', err);
    alert('Ошибка: ' + (err.message || 'Не удалось обновить заявки'));
  }
});

document.getElementById('leadsSearch')?.addEventListener('input', () => {
  filterAndRenderLeads();
});

document.getElementById('leadsSourceFilter')?.addEventListener('change', () => {
  filterAndRenderLeads();
});

function loadAllData() {
  loadLeads();
  loadTranslations();
  loadImages();
  loadBlogPosts();
}

document.getElementById('addTranslationBtn')?.addEventListener('click', () => {
  editingTranslationId = null;
  document.getElementById('translationModalTitle')!.textContent = 'Добавить перевод';
  (document.getElementById('translationForm') as HTMLFormElement).reset();
  document.getElementById('translationModal')!.classList.add('active');
});

document.getElementById('closeTranslationModal')?.addEventListener('click', () => {
  document.getElementById('translationModal')!.classList.remove('active');
});

document.getElementById('translationForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const key = (document.getElementById('translationKey') as HTMLInputElement).value;
  const language = (document.getElementById('translationLanguage') as HTMLSelectElement).value;
  const value = (document.getElementById('translationValue') as HTMLTextAreaElement).value;
  const category = (document.getElementById('translationCategory') as HTMLSelectElement).value;

  const data = { key, language, value, category };
  const sb = getSupabase();

  if (editingTranslationId) {
    const { error } = await sb
      .from('translations')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingTranslationId);

    if (error) {
      alert('Ошибка обновления: ' + error.message);
      return;
    }
  } else {
    const { error } = await sb
      .from('translations')
      .insert([data]);

    if (error) {
      alert('Ошибка добавления: ' + error.message);
      return;
    }
  }

  document.getElementById('translationModal')!.classList.remove('active');
  loadTranslations();
});

document.getElementById('addImageBtn')?.addEventListener('click', () => {
  editingImageId = null;
  document.getElementById('imageModalTitle')!.textContent = 'Добавить картинку';
  (document.getElementById('imageForm') as HTMLFormElement).reset();
  document.getElementById('imageModal')!.classList.add('active');
});

document.getElementById('closeImageModal')?.addEventListener('click', () => {
  document.getElementById('imageModal')!.classList.remove('active');
});

document.getElementById('imageForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const key = (document.getElementById('imageKey') as HTMLInputElement).value;
  const url = (document.getElementById('imageUrl') as HTMLInputElement).value;
  const alt_text = (document.getElementById('imageAlt') as HTMLInputElement).value;
  const category = (document.getElementById('imageCategory') as HTMLSelectElement).value;

  const data = { key, url, alt_text, category };
  const sb = getSupabase();

  if (editingImageId) {
    const { error } = await sb
      .from('site_images')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingImageId);

    if (error) {
      alert('Ошибка обновления: ' + error.message);
      return;
    }
  } else {
    const { error } = await sb
      .from('site_images')
      .insert([data]);

    if (error) {
      alert('Ошибка добавления: ' + error.message);
      return;
    }
  }

  document.getElementById('imageModal')!.classList.remove('active');
  loadImages();
});

document.getElementById('addBlogBtn')?.addEventListener('click', () => {
  editingBlogId = null;
  document.getElementById('blogModalTitle')!.textContent = 'Добавить статью';
  (document.getElementById('blogForm') as HTMLFormElement).reset();
  document.getElementById('blogModal')!.classList.add('active');
});

document.getElementById('closeBlogModal')?.addEventListener('click', () => {
  document.getElementById('blogModal')!.classList.remove('active');
});

document.getElementById('blogForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();

  const title = (document.getElementById('blogTitle') as HTMLInputElement).value;
  const slug = (document.getElementById('blogSlug') as HTMLInputElement).value;
  const language = (document.getElementById('blogLanguage') as HTMLSelectElement).value;
  const excerpt = (document.getElementById('blogExcerpt') as HTMLTextAreaElement).value;
  const content = (document.getElementById('blogContent') as HTMLTextAreaElement).value;
  const image_url = (document.getElementById('blogImageUrl') as HTMLInputElement).value;
  const published = (document.getElementById('blogPublished') as HTMLSelectElement).value === 'true';
  const publish_date = (document.getElementById('blogPublishDate') as HTMLInputElement).value;

  const data = {
    title,
    slug,
    language,
    excerpt,
    content,
    image_url,
    published,
    publish_date,
    author: 'MakeTrades Team',
    category: 'Trading',
    tags: ['trading'],
    reading_time: 5,
    meta_title: title,
    meta_description: excerpt,
    views: 0
  };

  const sb = getSupabase();

  if (editingBlogId) {
    const { error } = await sb
      .from('blog_posts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingBlogId);

    if (error) {
      alert('Ошибка обновления: ' + error.message);
      return;
    }
  } else {
    const { error } = await sb
      .from('blog_posts')
      .insert([data]);

    if (error) {
      alert('Ошибка добавления: ' + error.message);
      return;
    }
  }

  document.getElementById('blogModal')!.classList.remove('active');
  loadBlogPosts();
});

(window as any).editTranslation = async (id: string) => {
  const sb = getSupabase();
  const { data } = await sb
    .from('translations')
    .select('*')
    .eq('id', id)
    .single();

  if (data) {
    editingTranslationId = id;
    (document.getElementById('translationKey') as HTMLInputElement).value = data.key;
    (document.getElementById('translationLanguage') as HTMLSelectElement).value = data.language;
    (document.getElementById('translationValue') as HTMLTextAreaElement).value = data.value;
    (document.getElementById('translationCategory') as HTMLSelectElement).value = data.category;
    document.getElementById('translationModalTitle')!.textContent = 'Изменить перевод';
    document.getElementById('translationModal')!.classList.add('active');
  }
};

(window as any).deleteTranslation = async (id: string) => {
  if (!confirm('Удалить этот перевод?')) return;

  const sb = getSupabase();
  const { error } = await sb
    .from('translations')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Ошибка удаления: ' + error.message);
    return;
  }

  loadTranslations();
};

(window as any).editImage = async (id: string) => {
  const sb = getSupabase();
  const { data } = await sb
    .from('site_images')
    .select('*')
    .eq('id', id)
    .single();

  if (data) {
    editingImageId = id;
    (document.getElementById('imageKey') as HTMLInputElement).value = data.key;
    (document.getElementById('imageUrl') as HTMLInputElement).value = data.url;
    (document.getElementById('imageAlt') as HTMLInputElement).value = data.alt_text || '';
    (document.getElementById('imageCategory') as HTMLSelectElement).value = data.category;
    document.getElementById('imageModalTitle')!.textContent = 'Изменить картинку';
    document.getElementById('imageModal')!.classList.add('active');
  }
};

(window as any).deleteImage = async (id: string) => {
  if (!confirm('Удалить эту картинку?')) return;

  const sb = getSupabase();
  const { error } = await sb
    .from('site_images')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Ошибка удаления: ' + error.message);
    return;
  }

  loadImages();
};

(window as any).editBlogPost = async (id: string) => {
  const sb = getSupabase();
  const { data } = await sb
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (data) {
    editingBlogId = id;
    (document.getElementById('blogTitle') as HTMLInputElement).value = data.title;
    (document.getElementById('blogSlug') as HTMLInputElement).value = data.slug;
    (document.getElementById('blogLanguage') as HTMLSelectElement).value = data.language;
    (document.getElementById('blogExcerpt') as HTMLTextAreaElement).value = data.excerpt;
    (document.getElementById('blogContent') as HTMLTextAreaElement).value = data.content;
    (document.getElementById('blogImageUrl') as HTMLInputElement).value = data.image_url;
    (document.getElementById('blogPublished') as HTMLSelectElement).value = data.published.toString();
    (document.getElementById('blogPublishDate') as HTMLInputElement).value = data.publish_date.replace('Z', '').substring(0, 16);
    document.getElementById('blogModalTitle')!.textContent = 'Изменить статью';
    document.getElementById('blogModal')!.classList.add('active');
  }
};

(window as any).deleteBlogPost = async (id: string) => {
  if (!confirm('Удалить эту статью?')) return;

  const sb = getSupabase();
  const { error } = await sb
    .from('blog_posts')
    .delete()
    .eq('id', id);

  if (error) {
    alert('Ошибка удаления: ' + error.message);
    return;
  }

  loadBlogPosts();
};

document.getElementById('translationSearch')?.addEventListener('input', async (e) => {
  const search = (e.target as HTMLInputElement).value.toLowerCase();
  const langFilter = (document.getElementById('translationLangFilter') as HTMLSelectElement).value;
  const categoryFilter = (document.getElementById('translationCategoryFilter') as HTMLSelectElement).value;

  const sb = getSupabase();
  let query = sb.from('translations').select('*');

  if (langFilter) query = query.eq('language', langFilter);
  if (categoryFilter) query = query.eq('category', categoryFilter);

  const { data } = await query;
  const filtered = (data || []).filter(t =>
    t.key.toLowerCase().includes(search) ||
    t.value.toLowerCase().includes(search)
  );

  renderTranslations(filtered);
});

document.getElementById('translationLangFilter')?.addEventListener('change', () => {
  const event = new Event('input');
  document.getElementById('translationSearch')?.dispatchEvent(event);
});

document.getElementById('translationCategoryFilter')?.addEventListener('change', () => {
  const event = new Event('input');
  document.getElementById('translationSearch')?.dispatchEvent(event);
});

document.getElementById('imageSearch')?.addEventListener('input', async (e) => {
  const search = (e.target as HTMLInputElement).value.toLowerCase();
  const sb = getSupabase();
  const { data } = await sb.from('site_images').select('*');
  const filtered = (data || []).filter(img =>
    img.key.toLowerCase().includes(search) ||
    (img.category && img.category.toLowerCase().includes(search))
  );

  renderImages(filtered);
});

document.getElementById('blogSearch')?.addEventListener('input', async (e) => {
  const search = (e.target as HTMLInputElement).value.toLowerCase();
  const langFilter = (document.getElementById('blogLangFilter') as HTMLSelectElement).value;
  const publishedFilter = (document.getElementById('blogPublishedFilter') as HTMLSelectElement).value;

  const sb = getSupabase();
  let query = sb.from('blog_posts').select('*');

  if (langFilter) query = query.eq('language', langFilter);
  if (publishedFilter) query = query.eq('published', publishedFilter === 'true');

  const { data } = await query;
  const filtered = (data || []).filter(post =>
    post.title.toLowerCase().includes(search)
  );

  renderBlogPosts(filtered);
});

document.getElementById('blogLangFilter')?.addEventListener('change', () => {
  const event = new Event('input');
  document.getElementById('blogSearch')?.dispatchEvent(event);
});

document.getElementById('blogPublishedFilter')?.addEventListener('change', () => {
  const event = new Event('input');
  document.getElementById('blogSearch')?.dispatchEvent(event);
});

checkAuth();
