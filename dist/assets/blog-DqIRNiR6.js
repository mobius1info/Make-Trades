import"./supabase-config-BoXvj6LB.js";import{g as l,h as b,j as y,k as $,l as p,a as w,d as L,m as v}from"./seo-urls-D_FPW2ox.js";import{s,g as P}from"./post-images-Cr8VZ4Jy.js";let o=l(window.location.pathname)||new URLSearchParams(window.location.search).get("lang")||"ru",c={},m=!1;function r(e,t){return c[e]||t}function d(){return!!document.querySelector("#allBlogPosts .blog-card")}function B(){return!!l(window.location.pathname)&&d()}async function k(){m||(c=await p(o),m=!0,h())}async function E(e){if(l(window.location.pathname)||b()){window.location.assign(y(e));return}o=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(t=>t.classList.remove("active")),document.querySelector(`[data-lang="${e}"]`)?.classList.add("active"),window.history.replaceState({},"",$(e)),c=await p(e),h(),await f(!0)}function h(){const e=(a,n,i)=>{const g=document.getElementById(a);g&&(g.textContent=r(n,i))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=o==="ru"?"/":`/?lang=${o}`)}function S(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[o]||"en-US"}function _(e,t=!1){const a=P(e.image_url,e.slug,"card");return`<img src="${a.src}"
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
             decoding="async">`}function I(e,t){const a=r("blog_page.min_read","min");e.innerHTML=t.map((n,i)=>`
      <a href="${L(n,o)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        ${_(n,i===0)}
        <div class="blog-card-content">
          <div class="blog-card-category">${n.category||""}</div>
          <h3 itemprop="headline">${n.title}</h3>
          <p itemprop="description">${n.excerpt}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${n.author}</span>
            </span>
            <span>&bull;</span>
            <time itemprop="datePublished" datetime="${n.created_at}">
              ${new Date(n.created_at).toLocaleDateString(S())}
            </time>
            <span>&bull;</span>
            <span>${n.reading_time||5} ${a}</span>
          </div>
        </div>
        <meta itemprop="url" content="${v(n,o)}">
      </a>
    `).join(""),s(e)}async function f(e=!1){const t=document.getElementById("allBlogPosts");if(t){if(!e&&d()){s(t);return}t.innerHTML=`<p style="text-align: center;">${r("blog_page.loading","Loading articles...")}</p>`;try{const a=await w(o);if(!a||a.length===0){t.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${r("blog_page.empty","Articles coming soon")}</p>`;return}I(t,a)}catch(a){console.error("Error loading blog posts:",a),t.innerHTML=`<p style="text-align: center; color: var(--error-500);">${r("blog.error","Error loading articles")}</p>`}}}async function u(){document.documentElement.lang=o,document.querySelectorAll(".lang-btn").forEach(t=>{t.classList.remove("active"),t.addEventListener("click",()=>{const a=t.getAttribute("data-lang");a&&E(a)})}),document.querySelector(`[data-lang="${o}"]`)?.classList.add("active"),B()||await k();const e=document.getElementById("allBlogPosts");e&&d()&&s(e),await f()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{u()}):u();
