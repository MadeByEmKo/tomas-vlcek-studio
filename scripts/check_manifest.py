import os,time
p='assets/asset-manifest.json'
print('mtime:', time.ctime(os.path.getmtime(p)))
print('size:', os.path.getsize(p))
with open(p, encoding='utf-8') as f:
    s=f.read()
print('starts with:', s[:120])
