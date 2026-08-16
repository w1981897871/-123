@echo off
chcp 65001 >nul
title 更新首页轮播图片
cd /d "%~dp0"
echo 正在扫描 images 文件夹...
node update-images.js
echo.
pause
