import"./supabase-config-7zaN7sv0.js";import{g,l as d,h as b,j as h,k as y,a as f,d as v,m as L}from"./seo-urls-Dh3fCl5r.js";import{s as l,n as P}from"./post-images-yKu82Hi5.js";let n=g(window.location.pathname)||new URLSearchParams(window.location.search).get("lang")||"ru",i={};function r(e,t){return i[e]||t}function $(){return!!document.querySelector("#allBlogPosts .blog-card")}async function w(e){if(g(window.location.pathname)||b()){window.location.assign(h(e));return}n=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(t=>t.classList.remove("active")),document.querySelector(`[data-lang="${e}"]`)?.classList.add("active"),window.history.replaceState({},"",y(e)),i=await d(e),m(),await u(!0)}function m(){const e=(o,a,p)=>{const s=document.getElementById(o);s&&(s.textContent=r(a,p))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=n==="ru"?"/":`/?lang=${n}`)}function B(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[n]||"en-US"}function k(e,t){const o=r("blog_page.min_read","min");e.innerHTML=t.map(a=>`
      <a href="${v(a,n)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${P(a.image_url,a.slug)}"
             alt="${a.title}"
             class="blog-card-image"
             itemprop="image"
             data-post-slug="${a.slug}"
             loading="lazy"
             decoding="async">
        <div class="blog-card-content">
          <div class="blog-card-category">${a.category||""}</div>
          <h3 itemprop="headline">${a.title}</h3>
          <p itemprop="description">${a.excerpt}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${a.author}</span>
            </span>
            <span>&bull;</span>
            <time itemprop="datePublished" datetime="${a.created_at}">
              ${new Date(a.created_at).toLocaleDateString(B())}
            </time>
            <span>&bull;</span>
            <span>${a.reading_time||5} ${o}</span>
          </div>
        </div>
        <meta itemprop="url" content="${L(a,n)}">
      </a>
    `).join(""),l(e)}async function u(e=!1){const t=document.getElementById("allBlogPosts");if(t){if(!e&&$()){l(t);return}t.innerHTML=`<p style="text-align: center;">${r("blog_page.loading","Loading articles...")}</p>`;try{const o=await f(n);if(!o||o.length===0){t.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${r("blog_page.empty","Articles coming soon")}</p>`;return}k(t,o)}catch(o){console.error("Error loading blog posts:",o),t.innerHTML=`<p style="text-align: center; color: var(--error-500);">${r("blog.error","Error loading articles")}</p>`}}}async function c(){document.documentElement.lang=n,document.querySelectorAll(".lang-btn").forEach(e=>{e.classList.remove("active"),e.addEventListener("click",()=>{const t=e.getAttribute("data-lang");t&&w(t)})}),document.querySelector(`[data-lang="${n}"]`)?.classList.add("active"),i=await d(n),m(),l(),await u()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{c()}):c();
