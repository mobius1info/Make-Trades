import{b as u}from"./supabase-BKCL4Eps.js";import{l as g}from"./content-loader-Bs0FwDnX.js";let o=new URLSearchParams(window.location.search).get("lang")||"ru",i={};function l(e,t){return i[e]||t}async function p(e){var n;o=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(r=>r.classList.remove("active")),(n=document.querySelector(`[data-lang="${e}"]`))==null||n.classList.add("active");const t=new URL(window.location.href);t.searchParams.set("lang",e),window.history.replaceState({},"",t.toString()),i=await g(e),d(),m()}function d(){const e=(n,r,a)=>{const s=document.getElementById(n);s&&(s.textContent=l(r,a))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=`/?lang=${o}`)}function b(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[o]||"en-US"}async function m(){const e=document.getElementById("allBlogPosts");if(e){e.innerHTML=`<p style="text-align: center;">${l("blog_page.loading","Loading articles...")}</p>`;try{const{data:t,error:n}=await u.from("blog_posts").select("*").eq("language",o).eq("published",!0).eq("hidden_from_users",!1).order("created_at",{ascending:!1});if(n)throw n;if(!t||t.length===0){e.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${l("blog_page.empty","Articles coming soon")}</p>`;return}const r=l("blog_page.min_read","min");e.innerHTML=t.map(a=>`
      <a href="/blog-post.html?slug=${a.slug}&lang=${o}" class="blog-card fade-in" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${a.image_url||"https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400"}"
             alt="${a.title}"
             class="blog-card-image"
             itemprop="image"
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
              ${new Date(a.created_at).toLocaleDateString(b())}
            </time>
            <span>&bull;</span>
            <span>${a.reading_time||5} ${r}</span>
          </div>
        </div>
        <meta itemprop="url" content="https://maketrades.info/blog-post.html?slug=${a.slug}">
      </a>
    `).join("")}catch(t){console.error("Error loading blog posts:",t),e.innerHTML=`<p style="text-align: center; color: var(--error-500);">${l("blog.error","Error loading articles")}</p>`}}}async function c(){var e;document.documentElement.lang=o,document.querySelectorAll(".lang-btn").forEach(t=>{t.classList.remove("active"),t.addEventListener("click",()=>{const n=t.getAttribute("data-lang");n&&p(n)})}),(e=document.querySelector(`[data-lang="${o}"]`))==null||e.classList.add("active"),i=await g(o),d(),m()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c();
