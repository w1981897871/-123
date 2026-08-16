/* ============================================================
   图片清单生成脚本 · update-images.js
   ============================================================
   功能：扫描 images/ 文件夹里的所有图片，生成 images/manifest.json
   网站首页轮播会自动读取这个清单，从图片文件夹里选图播放。

   使用方法：往 images/ 文件夹添加/删除图片后，双击运行
   update-images.bat（或命令行执行 node update-images.js），
   然后刷新网页即可看到新的轮播图片。
   ============================================================ */
'use strict';

const fs = require('fs');
const path = require('path');

const IMG_DIR = path.join(__dirname, 'images');
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

const manifest = {
    updated: new Date().toISOString(),
    images: files.map(function (f) { return 'images/' + f; })
};

fs.writeFileSync(
    path.join(IMG_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2),
    'utf8'
);

console.log('✅ 扫描完成：images/ 文件夹共 ' + files.length + ' 张图片');
console.log('   已生成 images/manifest.json，刷新网页即可看到轮播效果。');
if (files.length === 0) {
    console.log('   （当前没有图片，把图片放进 images/ 文件夹后重新运行本脚本）');
}
