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
    'typ realizace': 'kategorie',
    'typ realizace:': 'kategorie',
    'typ': 'kategorie',
    'typ:': 'kategorie',
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
    # Normalize photo filenames: if manifest candidate doesn't match an actual
    # file name (possible copies with prefixes/suffixes), try heuristics to
    # map to an existing filename so UI doesn't reference missing files.
    normalized = []
    for name in photos:
        candidate = folder / name
        if candidate.exists():
            normalized.append(name)
            continue
        # Try stripping leading underscores
        alt = name.lstrip('_')
        if (folder / alt).exists():
            normalized.append(alt)
            continue
        # Try removing ' kopie' (case-insensitive)
        alt2 = re.sub(r'\s+kopie', '', name, flags=re.I)
        if (folder / alt2).exists():
            normalized.append(alt2)
            continue
        # Try removing ' orez' or ' orez kopie'
        alt3 = re.sub(r'\s+orez', '', alt2, flags=re.I)
        if (folder / alt3).exists():
            normalized.append(alt3)
            continue
        # As a last resort, try removing leading underscore and any trailing ' kopie' markers
        alt4 = re.sub(r'^_+', '', name)
        alt4 = re.sub(r'\s+kopie', '', alt4, flags=re.I)
        if (folder / alt4).exists():
            normalized.append(alt4)
            continue
        # If nothing matched, keep original name (may result in broken link)
        normalized.append(name)
    photos = normalized
    text_file = next((f for f in files if f.suffix.lower() in TEXT_EXTENSIONS), None)
    meta = parse_text_file(text_file) if text_file else {}
    title = meta.get('title') or folder.name
    category = meta.get('kategorie') or ''
    # build photo objects with optional thumb candidate
    photo_objs = []
    for name in photos:
        base, ext = os.path.splitext(name)
        thumb_candidates = [
            f"{base}-scaled{ext}",
            f"{base}-small{ext}",
            f"{base}_small{ext}",
            f"{base}-thumb{ext}",
            f"{base}_thumb{ext}",
            f"{base} 2{ext}",
        ]
        thumb = None
        for t in thumb_candidates:
            if (folder / t).exists():
                thumb = t
                break
        photo_objs.append({'file': name, 'thumb': thumb})

    return {
        'folder': folder.name,
        'title': title,
        'category': category,
        'design': meta.get('design', ''),
        'realizace': meta.get('realizace', ''),
        'stavebniPriprava': meta.get('stavebniPriprava', ''),
        'vyroba': meta.get('vyroba', ''),
        'description': meta.get('description', ''),
        'photos': photo_objs,
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
            # Explicit inspirations keep their own bucket
            if 'inspirace' in name_lower:
                inspirations.append(build_album(entry))
                continue
            # Treat any folder that contains image files as a project (covers folders
            # like "14. Bytový dům" which don't include the word 'realizace')
            album = build_album(entry)
            if album.get('photos'):
                projects.append(album)

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
