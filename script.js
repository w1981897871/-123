/* ============================================================
   深色现代风个人网站 · script.js
   功能：进度条 / 导航 / 打字效果 / 滚动动画 / 表单提示等
   ============================================================ */
(function () {
    'use strict';

    /* ---------- 工具函数 ---------- */
    const $ = (sel, ctx) => (ctx || document).querySelector(sel);
    const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    /* ---------- 表单配置：接入 Web3Forms 真实发送 ----------
       1. 打开 https://web3forms.com ，输入你的邮箱，点击 "Create Access Key"
       2. 去邮箱点确认链接，复制 Access Key
       3. 粘贴到下面，替换 "在此填入你的 Access Key"
       免费版每月可接收 250 封消息。 */
    const FORM_CONFIG = {
        ENDPOINT: 'https://api.web3forms.com/submit',
        ACCESS_KEY: '5692e1e7-3618-4c22-b850-3d7ace1f747f',
    };

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
        const phrases = [
            '全栈开发者',
            '热爱技术的程序员',
            '持续学习者',
            '清粥爱好者 🍲',
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let deleting = false;

        function type() {
            const current = phrases[phraseIndex];
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

    /* ---------- 6. 滚动进入动画 + 技能条动画 ---------- */
    const revealEls = $$('.reveal');
    const skillFills = $$('.skill-bar-fill');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver(
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
        revealEls.forEach((el) => revealObserver.observe(el));

        // 技能条进入视口时从 0 动画到目标宽度
        const skillObserver = new IntersectionObserver(
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
        skillFills.forEach((fill) => skillObserver.observe(fill));
    } else {
        // 旧浏览器直接显示
        revealEls.forEach((el) => el.classList.add('visible'));
        skillFills.forEach((fill) => (fill.style.width = fill.dataset.width || '0%'));
    }

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

    /* ---------- 9. 背景音乐：薛之谦《暧昧》整曲循环 ----------
       使用说明：
       1. 把《暧昧》的音频文件（合法渠道获取，如网易云/QQ音乐购买下载）放到 music/ 文件夹
       2. 文件名与下方 MUSIC.SRC 保持一致（默认 music/暧昧.mp3）
       3. LOOP_INTRO = false 时音乐从头播到尾，再自动从头开始，一直循环播放 */
    const MUSIC = {
        SRC: 'music/暧昧.mp3',   // 音频文件路径
        INTRO_END: 30,           // 仅当前奏循环模式（LOOP_INTRO=true）时生效
        LOOP_INTRO: false,       // false = 播放整曲并一直循环；true = 只循环前奏
        VOLUME: 0.7,             // 音量 0 ~ 1
    };

    const bgAudio = $('#bgMusic');
    const musicToggle = $('#musicToggle');
    const musicPlayer = $('#musicPlayer');
    const musicMode = $('#musicMode');
    const musicHint = $('#musicHint');

    function initMusic() {
        if (!bgAudio) return;

        bgAudio.src = MUSIC.SRC;
        bgAudio.volume = MUSIC.VOLUME;
        bgAudio.loop = !MUSIC.LOOP_INTRO;

        // 前奏循环：播放到前奏结束位置时回到开头
        bgAudio.addEventListener('timeupdate', () => {
            if (MUSIC.LOOP_INTRO && bgAudio.currentTime >= MUSIC.INTRO_END) {
                bgAudio.currentTime = 0;
            }
        });

        // 音频文件缺失时友好提示
        bgAudio.addEventListener('error', () => {
            if (musicMode) musicMode.textContent = '未找到音频';
            showToast('未找到音乐文件 ' + MUSIC.SRC + '，请参考 README 放置音频 🎧', 'error', 5000);
        });

        if (musicToggle) {
            musicToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                toggleMusic();
            });
        }

        // 提示条点击也可开启
        if (musicHint) {
            musicHint.addEventListener('click', () => {
                toggleMusic(true);
                hideMusicHint();
            });
        }

        // 打开网页即尝试自动播放
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
})();
