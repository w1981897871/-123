/* ============================================================
   深色现代风个人网站 · script.js
   功能：进度条 / 导航 / 打字效果 / 滚动动画 / 表单提示等
   ============================================================ */
(function () {
    'use strict';

    /* ---------- 工具函数 ---------- */
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    /* ---------- 全局配置：从 site-config.js 读取 ----------
       注意：使用 let，因为云端配置加载后会整体替换 CFG */
    let CFG = window.SITE_CONFIG || {};

    /* ---------- 表单配置（Web3Forms） ----------
       Access Key 在 site-config.js 的 form.accessKey 中修改 */
    let FORM_CONFIG = {
        ENDPOINT: (CFG.form && CFG.form.endpoint) || 'https://api.web3forms.com/submit',
        ACCESS_KEY: (CFG.form && CFG.form.accessKey) || '',
    };

    /* ---------- 0. 配置渲染：把 site-config.js 的内容填进页面 ---------- */
    function getPath(obj, path) {
        return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
    }

    const SOCIAL_ICONS = {
        github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.17-.02-2.12-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.75 2.69 1.25 3.35.95.1-.74.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.1 11.1 0 0 1 2.89-.39c.98 0 1.97.13 2.89.39 2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.55A10.52 10.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5z"/></svg>',
        juejin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 0 1.2 6v12L12 24l10.8-6V6L12 0zm0 2.4 8.6 4.78-3.36 1.87L12 6.14 6.76 9.05 3.4 7.18 12 2.4zm0 4.03 3.68 2.04L12 10.5 8.32 8.47 12 6.43zM12 12.5l3.68-2.04 3.36 1.86-7.04 3.91-7.04-3.91 3.36-1.86L12 12.5zm-8.6 3.79L12 19.76l8.6-3.47v3.71L12 23.47l-8.6-3.47v-3.71z"/></svg>',
        csdn: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm4.7 13.1c-.2.5-.7.9-1.3 1.1-1 .3-2.1.4-3.3.4-1.5 0-2.8-.2-3.8-.6-.6-.3-.9-.7-1-1.2-.1-.3 0-.6.2-.8.2-.3.5-.4.8-.4.5 0 .9.2 1.3.4.6.2 1.4.4 2.5.4 1.2 0 2.1-.2 2.7-.5.4-.2.6-.5.6-.9 0-.2-.1-.4-.2-.5-.2-.1-.5-.3-1-.4l-1.4-.3c-1.2-.3-2.1-.6-2.7-1.1-.6-.5-.9-1.2-.9-2.1 0-.6.2-1.2.5-1.7.3-.5.8-.9 1.4-1.2.6-.3 1.3-.4 2.2-.4.9 0 1.7.1 2.4.3.6.2 1.2.4 1.6.6.6.3.9.7 1 1.2.1.3.1.6-.1.9-.1.3-.4.5-.7.6-.3.1-.6.1-.8 0-.5-.2-1-.4-1.6-.5-.8-.2-1.5-.2-2.1 0-.4.1-.6.3-.6.6 0 .2.1.4.3.5.2.1.6.3 1.1.4l1.3.3c1.3.3 2.2.7 2.9 1.2.7.5 1 1.3 1 2.3 0 .6-.1 1.2-.4 1.7z"/></svg>',
        mail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.24-8 5.33-8-5.33V6.5l8 5.33 8-5.33V8.24z"/></svg>',
    };

    // 转义 HTML，防止配置内容破坏页面结构
    function esc(str) {
        const div = document.createElement('div');
        div.textContent = String(str == null ? '' : str);
        return div.innerHTML;
    }

    function renderText() {
        document.querySelectorAll('[data-cfg]').forEach((el) => {
            const v = getPath(CFG, el.dataset.cfg);
            if (typeof v === 'string') el.textContent = v;
        });
        document.querySelectorAll('[data-cfg-href]').forEach((el) => {
            const v = getPath(CFG, el.dataset.cfgHref);
            if (typeof v === 'string') {
                el.href = el.dataset.cfgHref === 'email' && !v.startsWith('mailto:')
                    ? 'mailto:' + v
                    : v;
            }
        });
        // 同步浏览器标题
        if (CFG.fullName) document.title = CFG.fullName + ' · 个人主页';
    }

    function renderSkills() {
        const box = $('[data-render="skills"]');
        if (!box || !Array.isArray(CFG.skills)) return;
        box.innerHTML = CFG.skills.map((g) => {
            const bars = (g.items || []).map((it) =>
                '<div class="skill-bar">' +
                    '<div class="skill-bar-info"><span>' + esc(it.name) + '</span><span>' + Number(it.level) + '%</span></div>' +
                    '<div class="skill-bar-track"><div class="skill-bar-fill" data-width="' + Number(it.level) + '%"></div></div>' +
                '</div>'
            ).join('');
            return '<div class="skill-card reveal">' +
                '<div class="skill-head">' +
                    '<span class="skill-icon">' + esc(g.icon || '✨') + '</span>' +
                    '<h3>' + esc(g.name) + '</h3>' +
                '</div>' +
                '<div class="skill-bars">' + bars + '</div>' +
            '</div>';
        }).join('');
    }

    function renderAbout() {
        const pBox = $('[data-render="aboutParagraphs"]');
        if (pBox && Array.isArray(CFG.aboutParagraphs)) {
            pBox.innerHTML = CFG.aboutParagraphs.map((p) => '<p>' + esc(p) + '</p>').join('');
        }
        const fBox = $('[data-render="aboutFacts"]');
        if (fBox && Array.isArray(CFG.aboutFacts)) {
            fBox.innerHTML = CFG.aboutFacts.map((f) =>
                '<li><span class="fact-label">' + esc(f.label) + '</span>' + esc(f.value) + '</li>'
            ).join('');
        }
    }

    function renderLife() {
        const box = $('[data-render="lifeQuotes"]');
        if (!box || !Array.isArray(CFG.lifeQuotes)) return;
        box.innerHTML = CFG.lifeQuotes.map((q) =>
            '<blockquote class="quote-card reveal"><p>' + esc(q) + '</p></blockquote>'
        ).join('');
    }

    /* ---------- 生活随笔大引言：每 20 秒随机播放一条 ----------
       轮播池 = 大引言（lifeFeatured）+ 所有随笔句子（lifeQuotes），
       在编辑面板里输入的所有随笔都会保存并参与随机轮播。 */
    let quoteTimer = null;
    let quoteIndex = -1;

    function buildQuotePool() {
        const pool = [];
        if (CFG.lifeFeatured) pool.push(CFG.lifeFeatured);
        if (Array.isArray(CFG.lifeQuotes)) pool.push.apply(pool, CFG.lifeQuotes);
        return pool;
    }

    function startQuoteRotation() {
        const el = $('#lifeFeaturedText');
        if (!el) return;
        const pool = buildQuotePool();
        if (pool.length < 2) return; // 少于两条时不轮播
        stopQuoteRotation();
        quoteTimer = setInterval(function () {
            let next = Math.floor(Math.random() * pool.length);
            if (next === quoteIndex) next = (next + 1) % pool.length;
            quoteIndex = next;
            el.textContent = pool[next];
            el.classList.remove('quote-fade');
            void el.offsetWidth; // 强制重排，重启动画
            el.classList.add('quote-fade');
        }, 20000);
    }

    function stopQuoteRotation() {
        if (quoteTimer) {
            clearInterval(quoteTimer);
            quoteTimer = null;
        }
    }

    // 鼠标悬停时暂停轮播，移开后继续
    (function bindQuoteHover() {
        const box = $('.life-featured');
        if (!box) return;
        box.addEventListener('mouseenter', stopQuoteRotation);
        box.addEventListener('mouseleave', startQuoteRotation);
    })();

    // 根据社交平台标签匹配品牌图标（编辑面板里只填"平台|链接"也能显示正确图标）
    function iconKeyFor(label) {
        const l = String(label).toLowerCase();
        if (l.indexOf('github') >= 0) return 'github';
        if (l.indexOf('掘金') >= 0 || l.indexOf('juejin') >= 0) return 'juejin';
        if (l.indexOf('csdn') >= 0 || l.indexOf('博客') >= 0 || l.indexOf('blog') >= 0) return 'csdn';
        if (l.indexOf('邮箱') >= 0 || l.indexOf('mail') >= 0 || l.indexOf('邮件') >= 0) return 'mail';
        return '';
    }

    function renderSocial() {
        const box = $('[data-render="social"]');
        if (!box) return;
        const items = (CFG.social || []).slice();
        items.push({ key: 'mail', label: '邮箱', url: 'mailto:' + (CFG.email || '') });
        box.innerHTML = items.map((s) => {
            const icon = SOCIAL_ICONS[iconKeyFor(s.label)] || SOCIAL_ICONS[s.key] || '🔗';
            return '<a href="' + esc(s.url) + '" target="_blank" rel="noopener" aria-label="' + esc(s.label) + '" title="' + esc(s.label) + '">' +
                icon +
                '</a>';
        }).join('');
    }

    function renderContact() {
        const box = $('[data-render="contactLinks"]');
        if (!box || !Array.isArray(CFG.contactLinks)) return;
        box.innerHTML = CFG.contactLinks.map((c) => {
            const link = c.url
                ? '<p><a href="' + esc(c.url) + '"' + (c.url.indexOf('http') === 0 ? ' target="_blank" rel="noopener"' : '') + '>' + esc(c.value) + '</a></p>'
                : '<p>' + esc(c.value) + '</p>';
            return '<div class="contact-item">' +
                '<span class="contact-icon">' + esc(c.icon || '📌') + '</span>' +
                '<div><h3>' + esc(c.title) + '</h3>' + link + '</div>' +
            '</div>';
        }).join('');
    }

    function buildCarousel(images) {
        const track = $('#carouselTrack');
        if (!track) return;
        if (!images.length) {
            track.classList.remove('running');
            track.innerHTML = '<div class="carousel-empty">🖼️ 请把照片放进 images/ 文件夹，<br>然后运行 update-images.bat 并刷新网页</div>';
            return;
        }
        const items = images.concat(images).map((src) =>
            '<img src="' + esc(src) + '" alt="轮播图片" loading="lazy">'
        ).join('');
        track.innerHTML = items;
        track.classList.toggle('running', images.length > 1);
        // 轮播速度：每张图片展示约 8 秒（数字越小滚得越快）
        track.style.animationDuration = images.length > 1 ? (images.length * 8) + 's' : '';
        sizeCarousel();
    }

    // 从 images/manifest.json 自动选图（扫描 images/ 文件夹），配置 heroImages 兜底
    function renderCarousel() {
        const track = $('#carouselTrack');
        if (!track) return;
        fetch('images/manifest.json', { cache: 'no-store' })
            .then(function (r) { return r.ok ? r.json() : null; })
            .then(function (manifest) {
                const list = (manifest && Array.isArray(manifest.images) && manifest.images.length)
                    ? manifest.images
                    : ((CFG.heroImages && CFG.heroImages.length) ? CFG.heroImages : []);
                buildCarousel(list);
            })
            .catch(function () {
                buildCarousel((CFG.heroImages && CFG.heroImages.length) ? CFG.heroImages : []);
            });
    }

    // 图片尺寸自适应容器（容器宽度变化时同步）
    function sizeCarousel() {
        const box = $('.hero-carousel');
        const track = $('#carouselTrack');
        if (!box || !track) return;
        const w = box.clientWidth;
        const h = box.clientHeight;
        if (!w || !h) return;
        $$('#carouselTrack img').forEach((img) => {
            img.style.width = w + 'px';
            img.style.height = h + 'px';
        });
    }

    window.addEventListener('resize', sizeCarousel);

    function applyConfig() {
        renderText();
        renderSkills();
        renderAbout();
        renderLife();
        renderSocial();
        renderContact();
        renderCarousel();
    }

    // 在收集动画元素之前先渲染配置内容
    applyConfig();

    /* ---------- 1. 滚动进度条 + 导航栏样式 ---------- */
    const progressBar = $('#progressBar');
    const navbar = $('#navbar');
    const scrollTopBtn = $('#scrollTop');

    function onScroll() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressBar) progressBar.style.width = progress + '%';
        if (navbar) navbar.classList.toggle('scrolled', scrollTop > 40);
        if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollTop > 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ---------- 2. 返回顶部 ---------- */
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ---------- 3. 移动端菜单 ---------- */
    const menuToggle = $('#menuToggle');
    const navLinks = $('#navLinks');

    function closeMenu() {
        if (menuToggle) menuToggle.classList.remove('active');
        if (navLinks) navLinks.classList.remove('active');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
        });

        // 点击导航链接后自动关闭菜单
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') closeMenu();
        });

        // 点击页面其他区域关闭菜单
        document.addEventListener('click', (e) => {
            if (navLinks.classList.contains('active') &&
                !navLinks.contains(e.target) &&
                !menuToggle.contains(e.target)) {
                closeMenu();
            }
        });

        // Esc 关闭菜单
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMenu();
        });
    }

    /* ---------- 4. 滚动高亮当前导航项 ---------- */
    const navAnchors = $$('.nav-links a');
    const sections = navAnchors
        .map((a) => $(a.getAttribute('href')))
        .filter(Boolean);

    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    const id = '#' + entry.target.id;
                    navAnchors.forEach((a) => {
                        a.classList.toggle('active', a.getAttribute('href') === id);
                    });
                });
            },
            { rootMargin: '-45% 0px -50% 0px' }
        );
        sections.forEach((s) => spy.observe(s));
    }

    /* ---------- 5. 打字机效果 ---------- */
    const typedEl = $('#typedText');
    if (typedEl) {
        // 短语从配置读取，支持云端更新后动态生效
        function getPhrases() {
            return (CFG.typingPhrases && CFG.typingPhrases.length)
                ? CFG.typingPhrases
                : ['全栈开发者', '热爱技术的程序员', '持续学习者', '清粥爱好者 🍲'];
        }
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function type() {
            const phrases = getPhrases();
            const current = phrases[phraseIndex % phrases.length];
            if (!deleting) {
                charIndex++;
                typedEl.textContent = current.slice(0, charIndex);
                if (charIndex === current.length) {
                    deleting = true;
                    setTimeout(type, 1800);
                    return;
                }
                setTimeout(type, 90);
            } else {
                charIndex--;
                typedEl.textContent = current.slice(0, charIndex);
                if (charIndex === 0) {
                    deleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    setTimeout(type, 400);
                    return;
                }
                setTimeout(type, 45);
            }
        }
        setTimeout(type, 600);
    }

    /* ---------- 6. 滚动进入动画 + 技能条动画 ----------
       封装为函数：配置内容（云端）加载/更新后可以重新绑定动画 */
    let revealObserver = null;
    let skillObserver = null;

    if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );
        skillObserver = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const fill = entry.target;
                        fill.style.width = fill.dataset.width || '0%';
                        obs.unobserve(fill);
                    }
                });
            },
            { threshold: 0.3 }
        );
    }

    function setupAnimations() {
        const revealEls = $$('.reveal');
        const skillFills = $$('.skill-bar-fill');
        if (revealObserver && skillObserver) {
            revealEls.forEach((el) => revealObserver.observe(el));
            skillFills.forEach((fill) => skillObserver.observe(fill));
        } else {
            // 旧浏览器直接显示
            revealEls.forEach((el) => el.classList.add('visible'));
            skillFills.forEach((fill) => (fill.style.width = fill.dataset.width || '0%'));
        }
    }

    setupAnimations();

    /* ---------- 7. 联系表单（Web3Forms 真实发送） ---------- */
    const form = $('#contactForm');
    const toast = $('#toast');

    function showToast(message, type = 'success', duration = 3400) {
        if (!toast) return;
        toast.textContent = message;
        toast.classList.remove('show', 'success', 'error');
        // 强制重排，确保连续消息能重新播放动画
        void toast.offsetWidth;
        toast.classList.add('show', type);
        clearTimeout(showToast._timer);
        showToast._timer = setTimeout(() => toast.classList.remove('show'), duration);
    }

    if (form) {
        const submitBtn = form.querySelector('button[type="submit"]');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = $('#cfName').value.trim();
            const email = $('#cfEmail').value.trim();
            const message = $('#cfMessage').value.trim();

            if (!name || !email || !message) {
                showToast('请填写完整的信息后再发送 😊', 'error');
                return;
            }
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('邮箱格式似乎不太对，请检查一下 📧', 'error');
                return;
            }
            if (FORM_CONFIG.ACCESS_KEY.includes('在此填入')) {
                showToast('还未配置 Access Key：请按 script.js 顶部注释获取后填入 ✍️', 'error');
                return;
            }

            // 防止重复提交
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = '发送中…';

            try {
                const response = await fetch(FORM_CONFIG.ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        access_key: FORM_CONFIG.ACCESS_KEY,
                        name: name,
                        email: email,
                        message: message,
                        subject: '来自个人网站「夕阳西下，煮一碗清粥」的联系消息',
                    }),
                });

                const data = await response.json();

                if (data.success) {
                    showToast('消息已成功发送！我会尽快回复你 🎉', 'success');
                    form.reset();
                } else {
                    const reason = data.message || '服务端返回异常，请稍后重试';
                    showToast('发送失败：' + reason, 'error');
                }
            } catch (err) {
                showToast('网络异常，消息发送失败，请稍后重试 🌧️', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }

    /* ---------- 8. 页脚年份 ---------- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = String(new Date().getFullYear());

    /* ---------- 9. 背景音乐：从 music/ 文件夹随机选歌循环播放 ----------
       使用说明：
       1. 把音乐文件（合法渠道获取）放到 music/ 文件夹
       2. 在 site-config.js 的 music.files 里写上文件名（每行一个）
       3. 网站启动时随机选一首，整曲循环播放；点 ⏭ 可随机切歌 */
    const bgAudio = $('#bgMusic');
    const musicToggle = $('#musicToggle');
    const musicPlayer = $('#musicPlayer');
    const musicTitle = $('#musicTitle');
    const musicMode = $('#musicMode');
    const musicNext = $('#musicNext');
    const musicHint = $('#musicHint');

    let musicFiles = (CFG.music && Array.isArray(CFG.music.files) && CFG.music.files.length)
        ? CFG.music.files.slice()
        : ['暧昧.mp3'];
    let currentTrack = 0;

    function musicLoopIntro() {
        return !!(CFG.music && CFG.music.loopIntro);
    }

    function musicIntroEnd() {
        return (CFG.music && CFG.music.introEnd) || 30;
    }

    function musicVolume() {
        return (CFG.music && CFG.music.volume) || 0.7;
    }

    function currentFile() {
        if (!musicFiles.length) return '暧昧.mp3';
        return musicFiles[currentTrack % musicFiles.length];
    }

    function trackTitle(file) {
        return file.replace(/\.(mp3|m4a|wav|ogg|flac|aac)$/i, '').trim();
    }

    function refreshMusicList() {
        if (CFG.music && Array.isArray(CFG.music.files) && CFG.music.files.length) {
            musicFiles = CFG.music.files.slice();
            if (currentTrack >= musicFiles.length) currentTrack = 0;
        }
    }

    function loadTrack() {
        if (!bgAudio) return;
        const file = currentFile();
        bgAudio.src = 'music/' + file;
        if (musicTitle) musicTitle.textContent = trackTitle(file);
        bgAudio.load();
        if (!bgAudio.paused) {
            const p = bgAudio.play();
            if (p && p.catch) p.catch(() => {});
        }
    }

    function initMusic() {
        if (!bgAudio) return;

        bgAudio.volume = musicVolume();
        bgAudio.loop = !musicLoopIntro();
        if (musicMode) musicMode.textContent = musicLoopIntro() ? '前奏循环' : '整曲循环';
        if (musicTitle) musicTitle.textContent = trackTitle(currentFile());

        // 前奏循环：播放到前奏结束位置时回到开头
        bgAudio.addEventListener('timeupdate', () => {
            if (musicLoopIntro() && bgAudio.currentTime >= musicIntroEnd()) {
                bgAudio.currentTime = 0;
            }
        });

        // 音频加载失败：有多首则自动切下一首，只有一首则提示
        bgAudio.addEventListener('error', () => {
            if (musicFiles.length > 1) {
                currentTrack = (currentTrack + 1) % musicFiles.length;
                loadTrack();
            } else {
                if (musicMode) musicMode.textContent = '未找到音频';
                showToast('未找到音乐文件 music/' + currentFile() + '，请参考 README 放置音频 🎧', 'error', 5000);
            }
        });

        if (musicToggle) {
            musicToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMusic();
            });
        }

        // 下一首：随机切换（避免与当前重复）
        if (musicNext) {
            musicNext.addEventListener('click', (e) => {
                e.stopPropagation();
                if (musicFiles.length > 1) {
                    let next = currentTrack;
                    while (next === currentTrack) {
                        next = Math.floor(Math.random() * musicFiles.length);
                    }
                    currentTrack = next;
                }
                loadTrack();
                const p = bgAudio.play();
                if (p && p.catch) p.catch(() => {});
                setPlayingState(true);
            });
        }

        // 提示条点击也可开启
        if (musicHint) {
            musicHint.addEventListener('click', () => {
                toggleMusic(true);
                hideMusicHint();
            });
        }

        // 加载第一首（随机）并尝试自动播放
        if (CFG.music && CFG.music.random && musicFiles.length > 1) {
            currentTrack = Math.floor(Math.random() * musicFiles.length);
        }
        loadTrack();
        tryAutoPlay();
    }

    function tryAutoPlay() {
        const p = bgAudio.play();
        if (p && p.catch) {
            p.then(() => setPlayingState(true)).catch(() => {
                // 浏览器拦截了自动播放 → 等待用户首次交互
                showMusicHint();
                const start = () => {
                    toggleMusic(true);
                    hideMusicHint();
                    document.removeEventListener('pointerdown', start);
                    document.removeEventListener('keydown', startKey);
                };
                const startKey = (e) => {
                    if (e.key === 'Enter' || e.key === ' ') start();
                };
                document.addEventListener('pointerdown', start, { once: true });
                document.addEventListener('keydown', startKey);
            });
        }
    }

    function toggleMusic(forcePlay) {
        if (!bgAudio) return;
        if (bgAudio.paused) {
            bgAudio.currentTime = 0;
            const p = bgAudio.play();
            if (p && p.catch) p.catch(() => {});
            setPlayingState(true);
        } else if (!forcePlay) {
            bgAudio.pause();
            setPlayingState(false);
        }
    }

    function setPlayingState(isPlaying) {
        if (musicPlayer) musicPlayer.classList.toggle('playing', isPlaying);
        if (musicToggle) musicToggle.setAttribute('aria-pressed', String(isPlaying));
    }

    function showMusicHint() {
        if (musicHint) musicHint.classList.add('show');
    }

    function hideMusicHint() {
        if (musicHint) musicHint.classList.remove('show');
    }

    // 键盘快捷键 M：播放 / 暂停音乐
    // 用 e.code（物理按键码）判断，避免中文输入法等场景下 e.key 为 undefined 导致崩溃
    document.addEventListener('keydown', (e) => {
        if (e.code === 'KeyM' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            toggleMusic();
        }
    });

    initMusic();

    /* ---------- 10. 云端配置：加载与保存 ----------
       若 site-config.js 的 remote.url 已填写：
       - 页面加载时自动拉取云端配置并覆盖本地默认
       - 在编辑面板保存时，内容会 PUT 到云端，所有访客刷新即可看到 */
    const LS_KEY = 'my-site-config-v1';

    function currentRemoteUrl() {
        return (CFG.remote && CFG.remote.url) || '';
    }

    // 配置更新后：重设 CFG / 表单 / 音乐列表，并重新渲染页面
    function refreshFromConfig() {
        CFG = window.SITE_CONFIG || {};
        FORM_CONFIG = {
            ENDPOINT: (CFG.form && CFG.form.endpoint) || 'https://api.web3forms.com/submit',
            ACCESS_KEY: (CFG.form && CFG.form.accessKey) || '',
        };
        refreshMusicList();
        applyConfig();
        setupAnimations();
        startQuoteRotation();
        initComments();
        if (musicMode) musicMode.textContent = musicLoopIntro() ? '前奏循环' : '整曲循环';
        if (musicTitle) musicTitle.textContent = trackTitle(currentFile());
        if (yearEl) yearEl.textContent = String(new Date().getFullYear());
    }

    function loadLocalFallback() {
        try {
            const saved = localStorage.getItem(LS_KEY);
            if (saved) {
                const data = JSON.parse(saved);
                if (data && typeof data === 'object') {
                    window.SITE_CONFIG = data;
                    refreshFromConfig();
                }
            }
        } catch (e) { /* 忽略损坏的缓存 */ }
    }

    function loadRemoteConfig() {
        const url = currentRemoteUrl();
        if (url) {
            fetch(url, { cache: 'no-store' })
                .then((r) => {
                    if (!r.ok) throw new Error('HTTP ' + r.status);
                    return r.json();
                })
                .then((data) => {
                    if (data && typeof data === 'object') {
                        window.SITE_CONFIG = data;
                        refreshFromConfig();
                    }
                })
                .catch(() => loadLocalFallback());
        } else {
            loadLocalFallback();
        }
    }

    /* ---------- 11. 网站端编辑面板 ---------- */
    const editBtn = $('#editBtn');
    const editorOverlay = $('#editorOverlay');
    const editorClose = $('#editorClose');
    const editorCancel = $('#editorCancel');
    const editorSave = $('#editorSave');

    /* ---------- 12. 作者编辑权限 ----------
       访客看不到 ✏️ 按钮；作者访问 网站?edit 并输入正确密码后才能编辑。
       密码只以 SHA-256 哈希形式存在配置里，访客查看源码也无法得到明文。 */
    const AUTH_KEY = 'site-editor-auth';

    // 纯 JS SHA-256（crypto.subtle 不可用时的兜底；输入为 ASCII 编码后的字符串）
    function sha256Hex(ascii) {
        function rightRotate(value, amount) {
            return (value >>> amount) | (value << (32 - amount));
        }
        const mathPow = Math.pow;
        const maxWord = mathPow(2, 32);
        let result = '';
        const words = [];
        const asciiBitLength = ascii.length * 8;
        let hash = sha256Hex.h = sha256Hex.h || [];
        const k = sha256Hex.k = sha256Hex.k || [];
        let primeCounter = k.length;
        const isComposite = {};
        for (let candidate = 2; primeCounter < 64; candidate++) {
            if (!isComposite[candidate]) {
                for (let i = 0; i < 313; i += candidate) {
                    isComposite[i] = candidate;
                }
                hash[primeCounter] = (mathPow(candidate, .5) * maxWord) | 0;
                k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
            }
        }
        ascii += '\x80';
        while (ascii.length % 64 - 56) ascii += '\x00';
        for (let i = 0; i < ascii.length; i++) {
            const j = ascii.charCodeAt(i);
            if (j >> 8) return ''; // 只支持 ASCII（调用前已 encodeURIComponent）
            words[i >> 2] |= j << ((3 - i) % 4) * 8;
        }
        words[words.length] = ((asciiBitLength / maxWord) | 0);
        words[words.length] = asciiBitLength;
        for (let j = 0; j < words.length;) {
            const w = words.slice(j, j += 16);
            const oldHash = hash;
            hash = hash.slice(0, 8);
            for (let i = 0; i < 64; i++) {
                const w15 = w[i - 15];
                const w2 = w[i - 2];
                const a = hash[0];
                const e = hash[4];
                const temp1 = hash[7]
                    + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25))
                    + ((e & hash[5]) ^ ((~e) & hash[6]))
                    + k[i]
                    + (w[i] = (i < 16) ? w[i] : (
                        w[i - 16]
                        + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3))
                        + w[i - 7]
                        + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))
                    ) | 0);
                const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22))
                    + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
                hash = [(temp1 + temp2) | 0].concat(hash);
                hash[4] = (hash[4] + temp1) | 0;
            }
            for (let i = 0; i < 8; i++) {
                hash[i] = (hash[i] + oldHash[i]) | 0;
            }
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 3; j + 1; j--) {
                const b = (hash[i] >> (j * 8)) & 255;
                result += ((b < 16) ? 0 : '') + b.toString(16);
            }
        }
        return result;
    }

    async function hashPassword(pw) {
        const text = encodeURIComponent(pw); // 统一编码，与 node 端生成哈希一致
        if (window.crypto && crypto.subtle) {
            try {
                const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
                return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
            } catch (e) { /* 继续用兜底实现 */ }
        }
        return sha256Hex(text);
    }

    async function verifyPassword(input) {
        const expected = (CFG.admin && CFG.admin.passwordHash) || '';
        if (!expected || !input) return false;
        const h = await hashPassword(input);
        return h === expected.toLowerCase();
    }

    function isEditorAuthed() {
        try { return sessionStorage.getItem(AUTH_KEY) === '1'; } catch (e) { return false; }
    }

    function updateEditBtn() {
        if (!editBtn) return;
        const hasEditParam = new URLSearchParams(location.search).has('edit');
        editBtn.style.display = (isEditorAuthed() || hasEditParam) ? '' : 'none';
    }

    // 密码验证弹窗
    const authOverlay = $('#authOverlay');
    const authPassword = $('#authPassword');
    const authError = $('#authError');
    const authCancel = $('#authCancel');
    const authSubmit = $('#authSubmit');

    function openAuth() {
        if (authOverlay) authOverlay.hidden = false;
        if (authPassword) { authPassword.value = ''; authPassword.focus(); }
        if (authError) authError.hidden = true;
    }

    function closeAuth() {
        if (authOverlay) authOverlay.hidden = true;
    }

    async function submitAuth() {
        const v = authPassword ? authPassword.value : '';
        if (await verifyPassword(v)) {
            try { sessionStorage.setItem(AUTH_KEY, '1'); } catch (e) { /* 忽略 */ }
            closeAuth();
            updateEditBtn();
            openEditor();
        } else {
            if (authError) authError.hidden = false;
            if (authPassword) authPassword.select();
        }
    }

    if (authCancel) authCancel.addEventListener('click', closeAuth);
    if (authSubmit) authSubmit.addEventListener('click', submitAuth);
    if (authPassword) {
        authPassword.addEventListener('keydown', (e) => {
            if (e.code === 'Enter') submitAuth();
        });
    }
    if (authOverlay) {
        authOverlay.addEventListener('click', (e) => {
            if (e.target === authOverlay) closeAuth();
        });
    }

    // 多行文本 → 数组（去掉空行）
    function lineArray(text) {
        return String(text || '').split('\n').map((s) => s.trim()).filter(Boolean);
    }

    function fillEditor() {
        const set = (id, v) => { const el = $('#' + id); if (el) el.value = v == null ? '' : String(v); };
        const setCheck = (id, v) => { const el = $('#' + id); if (el) el.checked = !!v; };

        set('e-shortName', CFG.shortName);
        set('e-fullName', CFG.fullName);
        set('e-greeting', CFG.greeting);
        set('e-typingLabel', CFG.typingLabel);
        set('e-typingPhrases', (CFG.typingPhrases || []).join('\n'));
        set('e-heroDesc', CFG.heroDesc);
        set('e-aboutTitle', CFG.aboutTitle);
        set('e-aboutParagraphs', (CFG.aboutParagraphs || []).join('\n'));
        set('e-aboutFacts', (CFG.aboutFacts || []).map((f) => f.label + '=' + f.value).join('\n'));

        const skillText = (CFG.skills || []).map((g) => {
            const head = '#' + g.name + '|' + (g.icon || '✨');
            const items = (g.items || []).map((it) => it.name + '=' + it.level);
            return [head].concat(items).join('\n');
        }).join('\n');
        set('e-skills', skillText);

        set('e-lifeFeatured', CFG.lifeFeatured);
        set('e-lifeAuthor', CFG.lifeAuthor);
        set('e-lifeQuotes', (CFG.lifeQuotes || []).join('\n'));
        set('e-email', CFG.email);
        set('e-location', CFG.location);
        set('e-social', (CFG.social || []).map((s) => s.label + '|' + s.url).join('\n'));
        set('e-contactLinks', (CFG.contactLinks || []).map((c) => [c.icon, c.title, c.value, c.url].join('|')).join('\n'));
        set('e-musicFiles', ((CFG.music && CFG.music.files) || []).join('\n'));
        setCheck('e-musicRandom', !!(CFG.music && CFG.music.random));
        setCheck('e-musicLoop', !(CFG.music && CFG.music.loopIntro));
        set('e-musicVolume', (CFG.music && CFG.music.volume) || 0.7);
        set('e-remoteUrl', currentRemoteUrl());
    }

    function collectEditor() {
        const get = (id) => { const el = $('#' + id); return el ? el.value.trim() : ''; };
        const getCheck = (id) => { const el = $('#' + id); return !!(el && el.checked); };

        // 技能文本解析：以 #分类名|图标 开头，后面每行 技能名=百分比
        const skills = [];
        let current = null;
        lineArray(get('e-skills')).forEach((line) => {
            if (line.charAt(0) === '#') {
                const head = line.slice(1).split('|');
                current = { name: head[0].trim() || '技能', icon: (head[1] || '✨').trim(), items: [] };
                skills.push(current);
            } else if (current) {
                const idx = line.indexOf('=');
                if (idx > 0) {
                    current.items.push({
                        name: line.slice(0, idx).trim(),
                        level: Math.min(100, Math.max(0, parseInt(line.slice(idx + 1), 10) || 0)),
                    });
                }
            }
        });

        const facts = lineArray(get('e-aboutFacts')).map((line) => {
            const idx = line.indexOf('=');
            return idx > 0
                ? { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
                : { label: '', value: line };
        });

        const social = lineArray(get('e-social')).map((line) => {
            const idx = line.indexOf('|');
            return idx > 0
                ? { key: '', label: line.slice(0, idx).trim(), url: line.slice(idx + 1).trim() }
                : { key: '', label: line, url: '#' };
        });

        const contactLinks = lineArray(get('e-contactLinks')).map((line) => {
            const parts = line.split('|');
            return {
                icon: (parts[0] || '📌').trim(),
                title: (parts[1] || '').trim(),
                value: (parts[2] || parts[1] || '').trim(),
                url: (parts[3] || '').trim(),
            };
        });

        return Object.assign({}, CFG, {
            shortName: get('e-shortName'),
            fullName: get('e-fullName'),
            greeting: get('e-greeting'),
            typingLabel: get('e-typingLabel'),
            typingPhrases: lineArray(get('e-typingPhrases')),
            heroDesc: get('e-heroDesc'),
            aboutTitle: get('e-aboutTitle'),
            aboutParagraphs: lineArray(get('e-aboutParagraphs')),
            aboutFacts: facts,
            skills: skills,
            lifeFeatured: get('e-lifeFeatured'),
            lifeAuthor: get('e-lifeAuthor'),
            lifeQuotes: lineArray(get('e-lifeQuotes')),
            email: get('e-email'),
            location: get('e-location'),
            social: social,
            contactLinks: contactLinks,
            music: Object.assign({}, CFG.music || {}, {
                files: lineArray(get('e-musicFiles')),
                random: getCheck('e-musicRandom'),
                loopIntro: !getCheck('e-musicLoop'),
                volume: parseFloat(get('e-musicVolume')) || 0.7,
            }),
            remote: { url: get('e-remoteUrl') },
        });
    }

    function openEditor() {
        fillEditor();
        if (editorOverlay) editorOverlay.hidden = false;
        document.body.style.overflow = 'hidden';
    }

    function closeEditor() {
        if (editorOverlay) editorOverlay.hidden = true;
        document.body.style.overflow = '';
    }

    // 向云端写入配置：自动适配存储服务
    // - Pantry（getpantry.cloud）：用 POST 写入篮子
    // - KVdb 等其余服务：用 PUT 写入
    function writeRemote(url, cfg) {
        const method = url.indexOf('getpantry.cloud') >= 0 ? 'POST' : 'PUT';
        return fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cfg),
        });
    }

    async function saveEditor() {
        // 权限校验：只有通过作者验证才能保存
        if (!isEditorAuthed()) {
            showToast('无编辑权限，请先通过作者验证 🔒', 'error');
            closeEditor();
            return;
        }
        const cfg = collectEditor();
        const url = cfg.remote.url;

        // 无论如何先缓存到本机（离线也能保留修改）
        try { localStorage.setItem(LS_KEY, JSON.stringify(cfg)); } catch (e) { /* 忽略 */ }

        if (url) {
            const btn = editorSave;
            if (btn) { btn.disabled = true; btn.textContent = '保存中…'; }
            try {
                const resp = await writeRemote(url, cfg);
                if (!resp.ok) throw new Error('HTTP ' + resp.status);
                showToast('已保存到云端，正在刷新生效… 🎉');
                closeEditor();
                setTimeout(() => location.reload(), 900);
            } catch (err) {
                if (btn) { btn.disabled = false; btn.textContent = '保存并生效'; }
                showToast('云端保存失败：' + err.message + '（已保存在本机浏览器）', 'error', 5500);
            }
        } else {
            // 无云端地址：仅保存到本机浏览器并立即生效
            window.SITE_CONFIG = cfg;
            refreshFromConfig();
            closeEditor();
            showToast('已保存到本机浏览器（仅当前设备可见）。填写云端地址后可全局生效 💡', 'success', 5000);
        }
    }

    // 编辑入口：已通过验证直接打开编辑面板，否则先弹出密码验证
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            if (isEditorAuthed()) openEditor();
            else openAuth();
        });
    }
    if (editorClose) editorClose.addEventListener('click', closeEditor);
    if (editorCancel) editorCancel.addEventListener('click', closeEditor);
    if (editorOverlay) {
        editorOverlay.addEventListener('click', (e) => {
            if (e.target === editorOverlay) closeEditor();
        });
    }
    if (editorSave) editorSave.addEventListener('click', saveEditor);

    // 初始化：仅作者（已验证或访问 ?edit）显示编辑按钮
    updateEditBtn();

    // 启动生活随笔 20 秒随机轮播
    startQuoteRotation();

    /* ---------- 13. 深色/浅色主题切换 ---------- */
    const THEME_KEY = 'my-site-theme';
    const themeToggle = $('#themeToggle');

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') || 'dark';
    }

    function applyTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* 忽略 */ }
    }

    function toggleTheme() {
        applyTheme(currentTheme() === 'dark' ? 'light' : 'dark');
        initComments(); // 评论区跟随主题重载
    }

    if (themeToggle) themeToggle.addEventListener('click', toggleTheme);
    applyTheme(currentTheme()); // 同步按钮图标

    /* ---------- 14. 留言区（giscus 评论区） ---------- */
    function initComments() {
        const box = $('#giscusContainer');
        if (!box) return;
        const g = CFG.giscus;
        if (!g || !g.enabled || !g.repo || !g.repoId || !g.categoryId) {
            box.innerHTML = '<div class="giscus-placeholder">💬 评论区尚未启用。<br>在 site-config.js 的 giscus 配置中填入仓库与分类 ID 后即可开启（详见 README）。</div>';
            return;
        }
        box.innerHTML = '';
        const s = document.createElement('script');
        s.src = 'https://giscus.app/client.js';
        s.setAttribute('data-repo', g.repo);
        s.setAttribute('data-repo-id', g.repoId);
        s.setAttribute('data-category', g.category);
        s.setAttribute('data-category-id', g.categoryId);
        s.setAttribute('data-mapping', 'pathname');
        s.setAttribute('data-strict', '0');
        s.setAttribute('data-reactions-enabled', '1');
        s.setAttribute('data-emit-metadata', '0');
        s.setAttribute('data-input-position', 'bottom');
        s.setAttribute('data-theme', currentTheme() === 'light' ? 'light' : 'dark');
        s.setAttribute('data-lang', 'zh-CN');
        s.crossOrigin = 'anonymous';
        s.async = true;
        box.appendChild(s);
    }

    // 页面加载完成后尝试拉取云端配置
    loadRemoteConfig();
    initComments();
})();
