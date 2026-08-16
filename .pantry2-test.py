# -*- coding: utf-8 -*-
"""测试 Pantry 写入与读取（带浏览器 UA，尝试绕过 Cloudflare 拦截）。"""
import json
import urllib.request

URL = 'https://getpantry.cloud/apiv1/pantry/e32e82a0-e262-469f-b598-9dd8347e0b27/basket/site-config'
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36'

with open('.kvdb-config.json', 'rb') as f:
    payload = f.read()

# 1) POST 写入篮子
req = urllib.request.Request(URL, data=payload,
                             headers={'Content-Type': 'application/json', 'User-Agent': UA},
                             method='POST')
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode('utf-8', errors='replace')
        print('写入状态:', resp.status)
        print('写入响应:', body[:300])
except urllib.error.HTTPError as e:
    print('写入 HTTP错误:', e.code)
    print(e.read().decode('utf-8', errors='replace')[:300])
except Exception as e:
    print('写入异常:', type(e).__name__, e)

# 2) GET 读回验证
req2 = urllib.request.Request(URL, headers={'User-Agent': UA})
try:
    with urllib.request.urlopen(req2, timeout=30) as resp:
        raw = resp.read().decode('utf-8')
        data = json.loads(raw)
        print('读回状态:', resp.status)
        print('读回字段数:', len(data))
        print('fullName =', data.get('fullName'))
except urllib.error.HTTPError as e:
    print('读回 HTTP错误:', e.code)
    print(e.read().decode('utf-8', errors='replace')[:300])
except Exception as e:
    print('读回异常:', type(e).__name__, e)
