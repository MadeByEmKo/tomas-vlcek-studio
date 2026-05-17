import json, os
manifest_path = 'assets/asset-manifest.json'
with open(manifest_path, encoding='utf-8') as f:
    data = json.load(f)
proj = None
for p in data.get('projects', []):
    if 'bytový' in p.get('folder','').lower() or 'domu pro mladou' in p.get('folder','').lower():
        proj = p
        break
if not proj:
    proj = data.get('projects', [])[12] if len(data.get('projects', []))>=13 else None
print('Manifest folder:', proj.get('folder'))
print('Manifest photos (first 10):')
for ph in proj.get('photos', [])[:30]:
    print('  ', repr(ph))

fs_dir = os.path.join('assets', proj.get('folder'))
print('\nFilesystem files:')
for fn in sorted(os.listdir(fs_dir)):
    print('  ', repr(fn))
