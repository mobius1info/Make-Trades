import{c as i}from"./index-Cfu0LHQK.js";const d="https://vhahxcmzpaxosthlorfm.supabase.co",g="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoYWh4Y216cGF4b3N0aGxvcmZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NjQwMDMsImV4cCI6MjA4NTI0MDAwM30.N7xuauIevwt0lI2jbeyQdby9vTPa20IsaqnQg2xRUWo",p=i(d,g);let n="ru",o="all";function u(t){var e;n=t,document.querySelectorAll(".lang-btn").forEach(r=>{r.classList.remove("active")}),(e=document.querySelector(`[data-lang="${t}"]`))==null||e.classList.add("active"),s()}async function s(){const t=document.getElementById("allBlogPosts");if(t){t.innerHTML='<p style="text-align: center;">Загрузка статей...</p>';try{let e=p.from("blog_posts").select("*").eq("language",n).eq("published",!0);o!=="all"&&(e=e.eq("category",o)),e=e.order("created_at",{ascending:!1});const{data:r,error:c}=await e;if(c)throw c;if(!r||r.length===0){t.innerHTML='<p style="text-align: center; color: var(--neutral-500);">Статьи скоро появятся</p>';return}t.innerHTML=r.map(a=>`
      <a href="/blog-post.html?slug=${a.slug}" class="blog-card fade-in" itemscope itemtype="https://schema.org/BlogPosting">
        <img src="${a.image_url||"https://images.pexels.com/photos/6801648/pexels-photo-6801648.jpeg?auto=compress&cs=tinysrgb&w=400"}"
             alt="${a.title}"
             class="blog-card-image"
             itemprop="image"
             loading="lazy">
        <div class="blog-card-content">
          <div class="blog-card-category">${a.category||"Статьи"}</div>
          <h3 itemprop="headline">${a.title}</h3>
          <p itemprop="description">${a.excerpt}</p>
          <div class="blog-card-meta">
            <span itemprop="author" itemscope itemtype="https://schema.org/Person">
              <span itemprop="name">${a.author}</span>
            </span>
            <span>•</span>
            <time itemprop="datePublished" datetime="${a.created_at}">
              ${new Date(a.created_at).toLocaleDateString(n==="ru"?"ru-RU":n==="en"?"en-US":n==="de"?"de-DE":n==="uk"?"uk-UA":n==="zh"?"zh-CN":"en-US")}
            </time>
            <span>•</span>
            <span>${a.reading_time||5} мин</span>
          </div>
        </div>
        <meta itemprop="url" content="https://maketrades.space/blog-post.html?slug=${a.slug}">
      </a>
    `).join("")}catch(e){console.error("Error loading blog posts:",e),t.innerHTML='<p style="text-align: center; color: var(--error-500);">Ошибка загрузки статей</p>'}}}function m(){document.querySelectorAll(".lang-btn").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-lang");e&&u(e)})})}function h(){document.querySelectorAll(".filter-btn").forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-category");e&&(o=e,document.querySelectorAll(".filter-btn").forEach(r=>r.classList.remove("active")),t.classList.add("active"),s())})})}function l(){m(),h(),s()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",l):l();
