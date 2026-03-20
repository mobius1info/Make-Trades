import{b as p}from"./supabase-B20INzPN.js";import{l as g}from"./content-loader-DIqOfzO6.js";import"./supabase-D6VhTj2z.js";let n=new URLSearchParams(window.location.search).get("lang")||"ru",i={};function r(e,t){return i[e]||t}async function u(e){n=e,document.documentElement.lang=e,document.querySelectorAll(".lang-btn").forEach(o=>o.classList.remove("active")),document.querySelector(`[data-lang="${e}"]`)?.classList.add("active");const t=new URL(window.location.href);t.searchParams.set("lang",e),window.history.replaceState({},"",t.toString()),i=await g(e),d(),m()}function d(){const e=(o,l,a)=>{const s=document.getElementById(o);s&&(s.textContent=r(l,a))};e("blogPageTitle","blog_page.title","MakeTrades Blog"),e("blogPageSubtitle","blog_page.subtitle","Useful articles about creating a brokerage company, trading strategies and managing financial platforms"),e("blogCopyright","footer.copyright","© 2026 MakeTrades. All rights reserved."),e("backHomeBtn","button.back_home","Home");const t=document.getElementById("backHomeBtn");t&&(t.href=`/?lang=${n}`)}function b(){return{ru:"ru-RU",en:"en-US",de:"de-DE",uk:"uk-UA",zh:"zh-CN"}[n]||"en-US"}async function m(){const e=document.getElementById("allBlogPosts");if(e){e.innerHTML=`<p style="text-align: center;">${r("blog_page.loading","Loading articles...")}</p>`;try{const{data:t,error:o}=await p.from("blog_posts").select("*").eq("language",n).eq("published",!0).eq("hidden_from_users",!1).order("created_at",{ascending:!1});if(o)throw o;if(!t||t.length===0){e.innerHTML=`<p style="text-align: center; color: var(--neutral-500);">${r("blog_page.empty","Articles coming soon")}</p>`;return}const l=r("blog_page.min_read","min");e.innerHTML=t.map(a=>`
      <a href="/blog-post.html?slug=${a.slug}&lang=${n}" class="blog-card fade-in" itemscope itemtype="https://schema.org/BlogPosting">
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
            <span>${a.reading_time||5} ${l}</span>
          </div>
        </div>
        <meta itemprop="url" content="https://maketrades.info/blog-post.html?slug=${a.slug}">
      </a>
    `).join("")}catch(t){console.error("Error loading blog posts:",t),e.innerHTML=`<p style="text-align: center; color: var(--error-500);">${r("blog.error","Error loading articles")}</p>`}}}async function c(){document.documentElement.lang=n,document.querySelectorAll(".lang-btn").forEach(e=>{e.classList.remove("active"),e.addEventListener("click",()=>{const t=e.getAttribute("data-lang");t&&u(t)})}),document.querySelector(`[data-lang="${n}"]`)?.classList.add("active"),i=await g(n),d(),m()}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",c):c();
