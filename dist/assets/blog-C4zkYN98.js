import{c as p}from"./index-D488pGsG.js";import{l as g}from"./content-loader-C4ub3CoC.js";const u="https://vhahxcmzpaxosthlorfm.supabase.co",b="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWh4Y216cGF4b3N0aGxvcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NjQwMDMsImV4cCI6MjA4NTI0MDAwM30.N7xuauIevwt0lI2jbeyQdby9vTPa20IsaqnQg2xRUWo",h=p(u,b);let o=new URLSearchParams(window.location.search).get("lang")||"ru",s={};function l(e,t){return s[e]||t}async function y(e){var n;o=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(r=>r.classList.remove("active")),(n=document.querySelector(`[data-lang="${e}"]`))==null||n.classList.add("active");const t=new URL(window.location.href);t.searchParams.set("lang",e),window.history.replaceState({},"",t.toString()),s=await g(e),d(),m()}function d(){const e=(n,r,a)=>{const i=document.getElementById(n);i&&(i.textContent=l(r,a))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=`/?lang=${o}`)}function f(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[o]||"en-US"}async function m(){const e=document.getElementById("allBlogPosts");if(e){e.innerHTML=`<p style="text-align: center;">${l("blog_page.loading","Loading articles...")}</p>`;try{const{data:t,error:n}=await h.from("blog_posts").select("*").eq("language",o).eq("published",!0).eq("hidden_from_users",!1).order("created_at",{ascending:!1});if(n)throw n;if(!t||t.length===0){e.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${l("blog_page.empty","Articles coming soon")}</p>`;return}const r=l("blog_page.min_read","min");e.innerHTML=t.map(a=>`
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
              ${new Date(a.created_at).toLocaleDateString(f())}
            </time>
            <span>&bull;</span>
            <span>${a.reading_time||5} ${r}</span>
          </div>
        </div>
        <meta itemprop="url" content="https://maketrades.space/blog-post.html?slug=${a.slug}">
      </a>
    `).join("")}catch(t){console.error("Error loading blog posts:",t),e.innerHTML=`<p style="text-align: center; color: var(--error-500);">${l("blog.error","Error loading articles")}</p>`}}}async function c(){var e;document.documentElement.lang=o,document.querySelectorAll(".lang-btn").forEach(t=>{t.classList.remove("active"),t.addEventListener("click",()=>{const n=t.getAttribute("data-lang");n&&y(n)})}),(e=document.querySelector(`[data-lang="${o}"]`))==null||e.classList.add("active"),s=await g(o),d(),m()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c();
