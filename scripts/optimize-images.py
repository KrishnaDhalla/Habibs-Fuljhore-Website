"""Converts the original design images into responsive WebP files.

Usage: python3 scripts/optimize-images.py <folder with original images>
Writes <name>-<width>.webp files into public/images/.
"""
import sys, os
from PIL import Image

SRC = sys.argv[1] if len(sys.argv) > 1 else 'original-images'
OUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
os.makedirs(OUT, exist_ok=True)

# name -> widths to generate (never upscaled past the original)
PLAN = {
    'home-hero': [960, 1600],
    'cat-hair': [640, 1200], 'cat-beauty': [640, 1200], 'cat-bridal': [640, 1200],
    'bride': [640, 1200], 'groom': [640, 1200],
    'page-hair': [800, 1400], 'page-beauty': [800, 1400],
    'history-1968': [400], 'history-1984': [400], 'history-1987a': [400],
    'history-1987b': [400], 'history-1990': [400], 'history-today': [440],
    'habibs-logo-red': [400], 'habibs-logo-white': [400],
}

for name, widths in PLAN.items():
    src = next((os.path.join(SRC, name + ext) for ext in ('.png', '.jpg', '.jpeg', '.webp')
                if os.path.exists(os.path.join(SRC, name + ext))), None)
    if not src:
        print('missing', name); continue
    im = Image.open(src)
    keep_alpha = im.mode in ('RGBA', 'LA')
    im = im.convert('RGBA' if keep_alpha else 'RGB')
    for w in widths:
        w2 = min(w, im.width)
        h2 = round(im.height * w2 / im.width)
        out = im.resize((w2, h2), Image.LANCZOS) if w2 != im.width else im
        path = os.path.join(OUT, f'{name}-{w}.webp')
        out.save(path, 'WEBP', quality=80 if not keep_alpha else 90, method=6)
        print(f'{name}-{w}.webp {w2}x{h2} {os.path.getsize(path)//1024}KB')
