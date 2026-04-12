import{g as s}from"./post-images-Cr8VZ4Jy.js";import{d as n,o as c}from"./content-loader-BLupssgK.js";const d={ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"};function o(e){return d[e]||"en-US"}function m(e,t){const a=s(e.image_url,e.slug,"card");return`<img src="${a.src}"
             alt="${e.title}"
             class="blog-card-image"
             itemprop="image"
             data-post-slug="${e.slug}"
             data-image-kind="card"
             width="${a.width}"
             height="${a.height}"
             ${a.srcset?`srcset="${a.srcset}"`:""}
             ${a.sizes?`sizes="${a.sizes}"`:""}
             loading="${t?"eager":"lazy"}"
             ${t?'fetchpriority="high"':""}
             decoding="async">`}function p(e,t,a={}){const r=a.minReadLabel||"min",i=a.prioritizeImage===!0;return`
      <a href="${n(e,t)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        ${m(e,i)}
        <div class="blog-card-content">
          <div class="blog-card-category">${e.category||""}</div>
          <h3 itemprop="headline">${e.title}</h3>
          <p itemprop="description">${e.excerpt||""}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${e.author||"MakeTrades Team"}</span>
            </span>
            <span>&bull;</span>
            <time itemprop="datePublished" datetime="${e.created_at}">
              ${new Date(e.created_at).toLocaleDateString(o(t))}
            </time>
            <span>&bull;</span>
            <span>${e.reading_time||5} ${r}</span>
          </div>
        </div>
        <meta itemprop="url" content="${c(e,t)}">
      </a>
    `}export{o as g,p as r};
