import"./supabase-config-xHiB1oM8.js";import{g as l,h as b,j as y,k as L,l as u,a as v,d as P,m as w}from"./seo-urls-5s0aF7KY.js";import{s as i,n as B}from"./post-images-7Nrqfzrs.js";let o=l(window.location.pathname)||new URLSearchParams(window.location.search).get("lang")||"ru",s={},g=!1;function r(e,t){return s[e]||t}function c(){return!!document.querySelector("#allBlogPosts .blog-card")}function $(){return!!l(window.location.pathname)&&c()}async function E(){g||(s=await u(o),g=!0,p())}async function S(e){if(l(window.location.pathname)||b()){window.location.assign(y(e));return}o=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(t=>t.classList.remove("active")),document.querySelector(`[data-lang="${e}"]`)?.classList.add("active"),window.history.replaceState({},"",L(e)),s=await u(e),p(),await f(!0)}function p(){const e=(n,a,h)=>{const d=document.getElementById(n);d&&(d.textContent=r(a,h))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=o==="ru"?"/":`/?lang=${o}`)}function k(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[o]||"en-US"}function _(e,t){const n=r("blog_page.min_read","min");e.innerHTML=t.map(a=>`
      <a href="${P(a,o)}" class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${B(a.image_url,a.slug)}"
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
              ${new Date(a.created_at).toLocaleDateString(k())}
            </time>
            <span>&bull;</span>
            <span>${a.reading_time||5} ${n}</span>
          </div>
        </div>
        <meta itemprop="url" content="${w(a,o)}">
      </a>
    `).join(""),i(e)}async function f(e=!1){const t=document.getElementById("allBlogPosts");if(t){if(!e&&c()){i(t);return}t.innerHTML=`<p style="text-align: center;">${r("blog_page.loading","Loading articles...")}</p>`;try{const n=await v(o);if(!n||n.length===0){t.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${r("blog_page.empty","Articles coming soon")}</p>`;return}_(t,n)}catch(n){console.error("Error loading blog posts:",n),t.innerHTML=`<p style="text-align: center; color: var(--error-500);">${r("blog.error","Error loading articles")}</p>`}}}async function m(){document.documentElement.lang=o,document.querySelectorAll(".lang-btn").forEach(t=>{t.classList.remove("active"),t.addEventListener("click",()=>{const n=t.getAttribute("data-lang");n&&S(n)})}),document.querySelector(`[data-lang="${o}"]`)?.classList.add("active"),$()||await E();const e=document.getElementById("allBlogPosts");e&&c()&&i(e),await f()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",()=>{m()}):m();
