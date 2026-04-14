import{g as s}from"./post-images-h7br9HLS.js";import{t as n,p as c}from"./content-loader-DIGxRNSv.js";const d={ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"};function m(e){return d[e]||"en-US"}function o(e,t){const r=e.shared_image_seed||e.slug,a=s(e.image_url,r,"card");return`<img src="${a.src}"
             alt="${e.title}"
             class="blog-card-image"
             itemprop="image"
             data-post-slug="${r}"
             data-image-kind="card"
             width="${a.width}"
             height="${a.height}"
             ${a.srcset?`srcset="${a.srcset}"`:""}
             ${a.sizes?`sizes="${a.sizes}"`:""}
             loading="${t?"eager":"lazy"}"
             ${t?'fetchpriority="high"':""}
             decoding="async">`}function p(e,t,r={}){const a=r.minReadLabel||"min",i=r.prioritizeImage===!0;return`
      <a href="${n(e,t)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        ${o(e,i)}
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
              ${new Date(e.created_at).toLocaleDateString(m(t))}
            </time>
            <span>&bull;</span>
            <span>${e.reading_time||5} ${a}</span>
          </div>
        </div>
        <meta itemprop="url" content="${c(e,t)}">
      </a>
    `}export{m as g,p as r};
