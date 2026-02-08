import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

let currentUser: any = null;
let editingTranslationId: string | null = null;
let editingImageId: string | null = null;
let editingBlogId: string | null = null;

async function checkAuth() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    showAuthForm();
    return false;
  }

  const { data: adminUser } = await supabase
    .from('admin_users')
    .select('*')
    .eq('id', session.user.id)
    .maybeSingle();

  if (!adminUser) {
    await supabase.auth.signOut();
    alert('У вас нет прав доступа к админ-панели');
    showAuthForm();
    return false;
  }

  currentUser = session.user;
  showAdminPanel();
  return true;
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
  const email = (document.getElementById('email') as HTMLInputElement).value;
  const password = (document.getElementById('password') as HTMLInputElement).value;

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    alert('Ошибка входа: ' + error.message);
    return;
  }

  await checkAuth();
});

document.getElementById('logoutBtn')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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
  const { data, error } = await supabase
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

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
      <td>${post.published ? '✅ Да' : '❌ Нет'}</td>
      <td>${new Date(post.publish_date).toLocaleDateString('ru-RU')}</td>
      <td>${post.views}</td>
      <td>
        <button class="action-btn btn-edit" onclick="editBlogPost('${post.id}')">Изменить</button>
        <button class="action-btn btn-delete" onclick="deleteBlogPost('${post.id}')">Удалить</button>
      </td>
    </tr>
  `).join('');
}

function loadAllData() {
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

  if (editingTranslationId) {
    const { error } = await supabase
      .from('translations')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingTranslationId);

    if (error) {
      alert('Ошибка обновления: ' + error.message);
      return;
    }
  } else {
    const { error } = await supabase
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

  if (editingImageId) {
    const { error } = await supabase
      .from('site_images')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingImageId);

    if (error) {
      alert('Ошибка обновления: ' + error.message);
      return;
    }
  } else {
    const { error } = await supabase
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

  if (editingBlogId) {
    const { error } = await supabase
      .from('blog_posts')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', editingBlogId);

    if (error) {
      alert('Ошибка обновления: ' + error.message);
      return;
    }
  } else {
    const { error } = await supabase
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
  const { data } = await supabase
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

  const { error } = await supabase
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
  const { data } = await supabase
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

  const { error } = await supabase
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
  const { data } = await supabase
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

  const { error } = await supabase
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

  let query = supabase.from('translations').select('*');

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
  const { data } = await supabase.from('site_images').select('*');
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

  let query = supabase.from('blog_posts').select('*').limit(100);

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
