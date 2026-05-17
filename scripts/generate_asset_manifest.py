import json
import os
import re
from pathlib import Path

ASSETS_DIR = Path(__file__).resolve().parent.parent / 'assets'
MANIFEST_PATH = ASSETS_DIR / 'asset-manifest.json'
IMAGE_EXTENSIONS = {'.png', '.jpg', '.jpeg', '.webp', '.gif'}
TEXT_EXTENSIONS = {'.txt'}

HEADING_MAP = {
    'název projektu': 'title',
    'název': 'title',
    'název projektu:': 'title',
    'název:': 'title',
    'návrh': 'design',
    'realizace': 'realizace',
    'stavební příprava': 'stavebniPriprava',
    'stavební připrava': 'stavebniPriprava',
    'výroba nábytkových částí': 'vyroba',
    'výroba': 'vyroba',
    'popis projektu': 'description',
    'popis': 'description',
    'kategorie': 'kategorie',
}


def natural_key(value: str):
    parts = re.split(r'(\d+)', value)
    return [int(p) if p.isdigit() else p.lower() for p in parts]


def parse_text_file(path: Path):
    data = {}
    lines = [line.rstrip() for line in path.read_text(encoding='utf-8').splitlines()]
    current = None
    for raw in lines:
        line = raw.strip()
        if not line:
            continue
        if ':' in line:
            prefix, rest = line.split(':', 1)
            key = prefix.strip().lower()
            if key in HEADING_MAP:
                current = HEADING_MAP[key]
                value = rest.strip()
                if value:
                    data[current] = value
                elif current not in data:
                    data[current] = ''
                continue
        key = line.lower()
        if key in HEADING_MAP:
            current = HEADING_MAP[key]
            data.setdefault(current, '')
            continue
        if current:
            if data.get(current):
                data[current] += '\n' + line
            else:
                data[current] = line
    return data


def build_album(folder: Path):
    files = sorted(folder.iterdir(), key=lambda x: natural_key(x.name))
    photos = [f.name for f in files if f.suffix.lower() in IMAGE_EXTENSIONS]
    text_file = next((f for f in files if f.suffix.lower() in TEXT_EXTENSIONS), None)
    meta = parse_text_file(text_file) if text_file else {}
    title = meta.get('title') or folder.name
    category = meta.get('kategorie') or ''
    return {
        'folder': folder.name,
        'title': title,
        'category': category,
        'design': meta.get('design', ''),
        'realizace': meta.get('realizace', ''),
        'stavebniPriprava': meta.get('stavebniPriprava', ''),
        'vyroba': meta.get('vyroba', ''),
        'description': meta.get('description', ''),
        'photos': photos,
        'textFile': text_file.name if text_file else None,
    }


def main():
    if not ASSETS_DIR.exists():
        raise FileNotFoundError(f'Assets directory not found: {ASSETS_DIR}')

    projects = []
    inspirations = []

    for entry in sorted(ASSETS_DIR.iterdir(), key=lambda x: natural_key(x.name)):
        if not entry.is_dir():
            continue
        name_lower = entry.name.lower()
        if 'realizace' in name_lower:
            projects.append(build_album(entry))
        elif 'inspirace' in name_lower:
            inspirations.append(build_album(entry))

    # assign stable ids and num values for projects
    for idx, project in enumerate(projects, start=1):
        project['id'] = idx
        if project['folder'][0].isdigit():
            num_match = re.match(r'(\d+)', project['folder'])
            project['num'] = num_match.group(1).zfill(2) if num_match else str(idx).zfill(2)
        else:
            project['num'] = str(idx).zfill(2)

    manifest = {
        'projects': projects,
        'inspirations': inspirations,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
    print(f'Generated {MANIFEST_PATH} with {len(projects)} projects and {len(inspirations)} inspirations.')


if __name__ == '__main__':
    main()
