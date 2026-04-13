import type { PublicBlogPost } from './public-api';
import { getPostImageAttributes } from './post-images';
import { articleAbsoluteUrl, articleHref } from './seo-urls';

const BLOG_LOCALES: Record<string, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  de: 'de-DE',
  uk: 'uk-UA',
  zh: 'zh-CN',
};

interface RenderBlogCardOptions {
  minReadLabel?: string;
  prioritizeImage?: boolean;
}

export function getBlogLocale(language: string): string {
  return BLOG_LOCALES[language] || 'en-US';
}

function renderBlogCardImage(post: PublicBlogPost, prioritizeImage: boolean): string {
  const imageSeed = post.shared_image_seed || post.slug;
  const image = getPostImageAttributes(post.image_url, imageSeed, 'card');

  return `<img src="${image.src}"
             alt="${post.title}"
             class="blog-card-image"
             itemprop="image"
             data-post-slug="${imageSeed}"
             data-image-kind="card"
             width="${image.width}"
             height="${image.height}"
             ${image.srcset ? `srcset="${image.srcset}"` : ''}
             ${image.sizes ? `sizes="${image.sizes}"` : ''}
             loading="${prioritizeImage ? 'eager' : 'lazy'}"
             ${prioritizeImage ? 'fetchpriority="high"' : ''}
             decoding="async">`;
}

export function renderBlogCard(
  post: PublicBlogPost,
  language: string,
  options: RenderBlogCardOptions = {}
): string {
  const minReadLabel = options.minReadLabel || 'min';
  const prioritizeImage = options.prioritizeImage === true;

  return `
      <a href="${articleHref(post, language)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        ${renderBlogCardImage(post, prioritizeImage)}
        <div class="blog-card-content">
          <div class="blog-card-category">${post.category || ''}</div>
          <h3 itemprop="headline">${post.title}</h3>
          <p itemprop="description">${post.excerpt || ''}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${post.author || 'MakeTrades Team'}</span>
            </span>
            <span>&bull;</span>
            <time itemprop="datePublished" datetime="${post.created_at}">
              ${new Date(post.created_at).toLocaleDateString(getBlogLocale(language))}
            </time>
            <span>&bull;</span>
            <span>${post.reading_time || 5} ${minReadLabel}</span>
          </div>
        </div>
        <meta itemprop="url" content="${articleAbsoluteUrl(post, language)}">
      </a>
    `;
}
