/* ============================================================
   图片清单生成脚本 · update-images.js
   ============================================================
   功能：扫描 images/ 文件夹里的所有图片，并同步更新两处：
   1. images/manifest.json   —— 线上（http/https）自动轮播用
   2. site-config.js 的 heroImages —— 本地 file:// 打开时的兜底

   使用方法：往 images/ 文件夹添加/删除图片后，双击运行
   update-images.bat（或命令行执行 node update-images.js），
   然后刷新网页即可看到新的轮播图片。
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'images');
const CONFIG_FILE = path.join(__dirname, 'site-config.js');
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.bmp'];

let files = [];
try {
    files = fs.readdirSync(IMG_DIR)
        .filter(function (f) {
            return EXTS.indexOf(path.extname(f).toLowerCase()) !== -1;
        })
        .sort();
} catch (e) {
    console.log('未找到 images 文件夹，已创建。');
    fs.mkdirSync(IMG_DIR, { recursive: true });
}

// 1) 更新 manifest.json
const manifest = {
    updated: new Date().toISOString(),
    images: files.map(function (f) { return 'images/' + f; })
};
fs.writeFileSync(path.join(IMG_DIR, 'manifest.json'), JSON.stringify(manifest, null, 2), 'utf8');
console.log('✅ 已更新 images/manifest.json（' + files.length + ' 张）');

// 2) 同步更新 site-config.js 的 heroImages（本地打开时兜底用）
if (fs.existsSync(CONFIG_FILE)) {
    let cfg = fs.readFileSync(CONFIG_FILE, 'utf8');
    const list = files.map(function (f) { return '        "' + 'images/' + f + '"'; }).join(',\n');
    const newBlock = 'heroImages: [\n' + list + '\n    ],';
    const re = /heroImages:\s*\[[\s\S]*?\],/;
    if (re.test(cfg)) {
        cfg = cfg.replace(re, newBlock);
        fs.writeFileSync(CONFIG_FILE, cfg, 'utf8');
        console.log('✅ 已同步更新 site-config.js 的 heroImages（' + files.length + ' 张）');
    } else {
        console.log('⚠️ 未在 site-config.js 中找到 heroImages，请手动检查');
    }
}

if (files.length === 0) {
    console.log('   （当前没有图片，把图片放进 images/ 文件夹后重新运行本脚本）');
}
