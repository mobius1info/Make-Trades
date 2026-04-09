import{b as h}from"./supabase-B20INzPN.js";import{g as d,l as m,i as f,d as y,e as L,b as $,h as v}from"./seo-urls-BSXOgbGu.js";import{s as u,n as c}from"./image-fallbacks-DnX0w8R_.js";import"./supabase-D6VhTj2z.js";let n=d(window.location.pathname)||new URLSearchParams(window.location.search).get("lang")||"ru",i={};function r(e,t){return i[e]||t}async function w(e){n=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(o=>o.classList.remove("active")),document.querySelector(`[data-lang="${e}"]`)?.classList.add("active");const t=new URL(window.location.href);d(t.pathname)||f()?window.history.replaceState({},"",y(e)):window.history.replaceState({},"",L(e)),i=await m(e),p(),b()}function p(){const e=(o,l,a)=>{const s=document.getElementById(o);s&&(s.textContent=r(l,a))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=n==="ru"?"/":`/?lang=${n}`)}function _(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[n]||"en-US"}async function b(){const e=document.getElementById("allBlogPosts");if(e){e.innerHTML=`<p style="text-align: center;">${r("blog_page.loading","Loading articles...")}</p>`;try{const{data:t,error:o}=await h.from("blog_posts").select("*").eq("language",n).eq("published",!0).eq("hidden_from_users",!1).order("created_at",{ascending:!1});if(o)throw o;if(!t||t.length===0){e.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${r("blog_page.empty","Articles coming soon")}</p>`;return}const l=r("blog_page.min_read","min");e.innerHTML=t.map(a=>`
      <a href="${$(a.slug,n)}" class="blog-card fade-in" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${c(a.image_url,a.slug)}"
             alt="${a.title}"
             class="blog-card-image"
             itemprop="image"
             data-fallback-image="${c(null,a.slug)}"
             loading="lazy">
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
              ${new Date(a.created_at).toLocaleDateString(_())}
            </time>
            <span>&bull;</span>
            <span>${a.reading_time||5} ${l}</span>
          </div>
        </div>
        <meta itemprop="url" content="${v(a.slug,n)}">
      </a>
    `).join(""),u(e)}catch(t){console.error("Error loading blog posts:",t),e.innerHTML=`<p style="text-align: center; color: var(--error-500);">${r("blog.error","Error loading articles")}</p>`}}}async function g(){document.documentElement.lang=n,document.querySelectorAll(".lang-btn").forEach(e=>{e.classList.remove("active"),e.addEventListener("click",()=>{const t=e.getAttribute("data-lang");t&&w(t)})}),document.querySelector(`[data-lang="${n}"]`)?.classList.add("active"),i=await m(n),p(),u(),b()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",g):g();
