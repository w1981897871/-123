/* ============================================================
   🌇 网站配置文件 · site-config.js
   ============================================================
   ⭐ 这是你唯一需要修改的文件！
   网站的所有文字、链接、技能、音乐、表单都在下面。
   用记事本或 VS Code 打开本文件，改引号里的内容即可，
   保存后刷新网页就能看到变化。

   提示：
   - 文字：改成你自己的内容（中文随便写）
   - 链接：换成你真实的网址
   - 百分比：0 ~ 100 的数字
   - 数组 [ ... ] 里的项用英文逗号隔开，每项用引号包住
   ============================================================ */

window.SITE_CONFIG = {

    /* ========== ① 基本信息 ========== */
    shortName: "夕阳西下",                     // 导航栏和页脚的品牌名
    fullName: "夕阳西下，煮一碗清粥",           // 首页大标题（会自动加上渐变效果）
    greeting: "你好，我是",                     // 大标题上方的小字
    typingLabel: "我是一名",                   // 打字机效果前面的固定文字
    typingPhrases: [                           // 打字机轮播的短语（每行一个）
        "全栈开发者",
        "热爱技术的程序员",
        "持续学习者",
        "清粥爱好者 🍲"
    ],
    heroDesc: "热爱技术的开发者，专注于用代码解决问题，也喜欢在夕阳西下时煮一碗清粥，认真生活。",
    heroBtn1: { text: "看看随笔", href: "#life" },      // 首页第一个按钮
    heroBtn2: { text: "联系我", href: "#contact" },     // 首页第二个按钮
    heroImages: [
        "images/photo10.jpg",
        "images/photo11.jpg",
        "images/photo12.jpg",
        "images/photo13.jpg",
        "images/photo14.jpg",
        "images/photo15.jpg",
        "images/photo16.jpg",
        "images/photo17.jpg",
        "images/photo18.jpg",
        "images/photo19.jpg",
        "images/photo20.jpg",
        "images/photo4.jpg",
        "images/photo5.jpg",
        "images/photo6.jpg",
        "images/photo7.jpg",
        "images/photo8.jpg",
        "images/photo9.jpg"
    ],

    /* ========== ② 关于我 ========== */
    aboutTitle: "一名普通但认真的开发者",       // 关于我的小标题
    aboutParagraphs: [                          // 关于我的介绍（每行一段）
        "你好，我是「夕阳西下，煮一碗清粥」。白天和代码打交道，构建稳定、好用的产品；傍晚则回到厨房，煮一碗清粥，享受慢下来的时光。我相信技术与生活并不冲突——好的代码应当像一碗清粥：简单、温暖、有营养。",
        "我的技术之路从网页前端开始，逐渐延伸到后端与数据分析，目前关注现代 Web 技术、自动化工具与人工智能应用。喜欢把复杂的事情做简单，把简单的事情做到位。"
    ],
    aboutFacts: [                               // 个人信息卡片（标签：内容）
        { label: "姓名", value: "夕阳西下，煮一碗清粥" },
        { label: "身份", value: "开发者 / 程序员" },
        { label: "方向", value: "Web 全栈 · 自动化 · AI 应用" },
        { label: "爱好", value: "写代码 · 煮粥 · 阅读 · 摄影" },
        { label: "邮箱", value: "wang_1981897871@foxmail.com" },
        { label: "状态", value: "🟢 正在持续学习与输出" }
    ],
    aboutBtn1: { text: "与我交流", href: "#contact" },
    aboutBtn2: { text: "获取简历", href: "mailto:wang_1981897871@foxmail.com?subject=简历请求" },

    /* ========== ③ 技能 ========== */
    skills: [                                   // 技能分类（可增删分类，图标用 emoji）
        {
            name: "前端开发",
            icon: "⚛️",
            items: [                            // 技能条目：名称 + 熟练度（0~100）
                { name: "HTML5 / CSS3", level: 90 },
                { name: "JavaScript / TypeScript", level: 85 },
                { name: "Vue / React", level: 80 },
                { name: "Vite / 工程化", level: 75 }
            ]
        },
        {
            name: "后端开发",
            icon: "🖥️",
            items: [
                { name: "Node.js", level: 85 },
                { name: "Python", level: 80 },
                { name: "MySQL / MongoDB", level: 75 },
                { name: "RESTful API 设计", level: 80 }
            ]
        },
        {
            name: "工具与运维",
            icon: "🛠️",
            items: [
                { name: "Git / GitHub", level: 90 },
                { name: "Linux / Shell", level: 70 },
                { name: "Docker", level: 65 },
                { name: "AI 工具链", level: 80 }
            ]
        }
    ],

    /* ========== ④ 生活随笔 ========== */
    lifeFeatured: "夕阳西下，煮一碗清粥。世界很大，而幸福往往很小——小到一碗热粥、一抹晚霞，就足够让这一天变得温柔。",
    lifeAuthor: "—— 夕阳西下，煮一碗清粥",
    lifeQuotes: [                               // 随笔卡片（每行一句，可增删）
        "夕阳不是一天的结束，而是天空把温柔的颜色都留给了傍晚，好让赶路的人歇一歇脚。",
        "煮粥急不得：等水开，等米烂，等香气慢慢飘满屋子。生活也是，慢慢来，反而更快。",
        "代码是白天的诗，清粥是傍晚的梦。把热爱写进工作，把温柔留给生活。",
        "愿你眼里有光，心中有暖，手边有一碗冒着热气的清粥——这就是普通日子里最好的礼物。",
        "认真做一件事，慢慢走一段路，世界就会在某个不经意的黄昏，把答案轻轻递到你面前。",
        "所谓美好，不过是：白天有人并肩前行，傍晚有人问一句“粥煮好了，回来吃吗？”"
    ],

    /* ========== ⑤ 联系方式 ========== */
    email: "wang_1981897871@foxmail.com",       // 你的邮箱（联系卡片 + 页脚都会用到）
    location: "中国 · 地球 🌍",                 // 坐标
    social: [                                   // 社交链接（第一个是主图标，会在首页显示）
        { key: "github", label: "GitHub", url: "https://github.com/" },
        { key: "juejin", label: "掘金", url: "https://juejin.cn/" },
        { key: "csdn", label: "CSDN", url: "https://blog.csdn.net/" }
    ],
    contactLinks: [                             // 联系卡片区显示的链接（可增删）
        { icon: "📧", title: "邮箱", value: "wang_1981897871@foxmail.com", url: "mailto:wang_1981897871@foxmail.com" },
        { icon: "🐙", title: "GitHub", value: "github.com/你的用户名", url: "https://github.com/" },
        { icon: "✍️", title: "技术博客", value: "掘金 · 个人主页", url: "https://juejin.cn/" },
        { icon: "📍", title: "坐标", value: "中国 · 地球 🌍", url: "" }
    ],

    /* ========== ⑥ 背景音乐 ==========
       把音乐文件放进 music/ 文件夹，然后在下面的 files 里写上文件名
       （每行一个，格式如 "暧昧.mp3"），网站会自动随机选一首循环播放。 */
    music: {
        files: [                             // music/ 文件夹里的所有音乐文件名
            "1..mp3",
            "2..mp3",
            "3..mp3",
            "4..mp3",
            "5..mp3",
            "6..mp3",
            "山雀..mp3",
            "暧昧.mp3"
        ],
        random: true,                        // true=随机选歌 false=按列表顺序播放
        loopIntro: false,                    // false=整曲循环 true=只循环前奏
        introEnd: 30,                        // 前奏结束秒数（仅前奏循环模式用）
        volume: 0.7                          // 音量（0~1）
    },

    /* ========== ⑦ 联系表单（Web3Forms） ========== */
    form: {
        endpoint: "https://api.web3forms.com/submit",  // 发送接口（一般不用改）
        accessKey: "5692e1e7-3618-4c22-b850-3d7ace1f747f"  // 你的 Access Key
    },

    /* ========== ⑨ 作者编辑权限 ==========
       只有输入正确密码才能编辑网站内容（其他访客不可编辑，也看不到编辑按钮）。
       密码本身不存明文，只存它的 SHA-256 哈希，访客查看源码也无法得到密码。

       当前密码：asdfghjkl1532104
       修改密码方法（README 有详细说明）：
       1. 命令行进入本文件夹，运行：
          node -e "const c=require('crypto');console.log(c.createHash('sha256').update(encodeURIComponent('你的新密码')).digest('hex'))"
       2. 把输出的 64 位哈希替换下面 passwordHash 的值
       3. 在网站上 ✏️ 保存一次，让云端同步新哈希 */
    admin: {
        passwordHash: "75ea278c7393415531c75bf5c0a5ae941d1c0a7f0e84f1aa2affc864629aae23"
    },

    /* ========== ⑧ 云端配置（可选，强烈推荐） ==========
       填上之后，就可以在"网站端直接修改"内容，保存后所有访客刷新即可看到，
       不需要再重新上传文件！
       两种免费服务任选其一：

       ① Pantry（推荐，无需注册邮箱，30 秒搞定）：
         1. 打开 https://getpantry.cloud ，点 "Create New Pantry"，名字随意
         2. 得到一串 pantryID（形如 abcdef123456...）
         3. 把下面的 url 改成：
            https://getpantry.cloud/apiv1/pantry/你的pantryID/basket/site-config

       ② KVdb（需邮箱验证）：
         1. 打开 https://kvdb.io ，输入邮箱创建 bucket，去邮箱点确认
         2. 得到 bucket ID（形如 4b3f8a2c1d...）
         3. 把下面的 url 改成： https://kvdb.io/你的bucketID/site-config

       说明：保存的配置会覆盖本文件的默认内容；想回到默认内容，清空 url 并在
       云端删除对应的 key/篮子即可。 */
    remote: {
        url: "https://getpantry.cloud/apiv1/pantry/e32e82a0-e262-469f-b598-9dd8347e0b27/basket/site-config"   // 云端配置地址（Pantry 或 KVdb）
    }
};
