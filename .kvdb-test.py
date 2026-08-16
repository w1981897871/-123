# -*- coding: utf-8 -*-
"""一次性测试脚本：向 KVdb 写入网站配置并读回验证。"""
import json
import urllib.request

URL = 'https://kvdb.io/W8SrVNHH73aZpYhwmRvN8k/site-config'

with open('.kvdb-config.json', 'rb') as f:
    payload = f.read()

print('准备写入', len(payload), 'bytes')

# 1) PUT 写入
req = urllib.request.Request(URL, data=payload,
                             headers={'Content-Type': 'application/json'},
                             method='PUT')
try:
    with urllib.request.urlopen(req, timeout=30) as resp:
        body = resp.read().decode('utf-8', errors='replace')
        print('PUT 状态:', resp.status)
        print('PUT 响应:', body[:300])
except urllib.error.HTTPError as e:
    print('PUT HTTP错误:', e.code)
    print(e.read().decode('utf-8', errors='replace')[:300])
except Exception as e:
    print('PUT 异常:', type(e).__name__, e)

# 2) GET 读回验证
try:
    with urllib.request.urlopen(URL, timeout=30) as resp:
        raw = resp.read().decode('utf-8')
        data = json.loads(raw)
        print('GET 状态:', resp.status)
        print('GET 读回成功，字段数:', len(data))
        print('fullName =', data.get('fullName'))
        print('music.files =', data.get('music', {}).get('files'))
        print('remote.url =', data.get('remote', {}).get('url'))
        print('form.accessKey 前缀 =', data.get('form', {}).get('accessKey', '')[:8])
except urllib.error.HTTPError as e:
    print('GET HTTP错误:', e.code)
    print(e.read().decode('utf-8', errors='replace')[:300])
except Exception as e:
    print('GET 异常:', type(e).__name__, e)
