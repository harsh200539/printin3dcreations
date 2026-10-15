"""
Sync local SQLite database with live PythonAnywhere backend.
Usage:
    python3 sync_from_live.py
"""

import os
import sys
import json
import urllib.request
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'print3d_backend.settings')

import django
django.setup()

from django.db import transaction
from api.models import Topic, Product

LIVE_API = "https://ayush1273.pythonanywhere.com/api"

INITIAL_BESTSELLERS = {'2-7', '2-2', '2-1', '3-3', '5-1', '4-1'}

def fetch_json(endpoint):
    url = f"{LIVE_API}/{endpoint}/"
    req = urllib.request.Request(url, headers={'User-Agent': 'PrintIn3D-Sync/1.0'})
    with urllib.request.urlopen(req, timeout=15) as res:
        return json.loads(res.read().decode('utf-8'))

def sync():
    print(f"--> Fetching live topics and products from {LIVE_API} ...")
    live_topics = fetch_json("topics")
    live_products = fetch_json("products")

    print(f"    Found {len(live_topics)} topics and {len(live_products)} products on live server.")

    with transaction.atomic():
        # Sync Topics
        live_topic_ids = set()
        for t in live_topics:
            tid = t['id']
            live_topic_ids.add(tid)
            Topic.objects.update_or_create(
                id=tid,
                defaults={
                    'title': t.get('title', ''),
                    'icon': t.get('icon', 'Palette'),
                    'desc': t.get('desc', ''),
                    'details': t.get('details', '') or '',
                    'image': t.get('image', '') or ''
                }
            )
        # Clean up stale topics not on live
        stale_topics = Topic.objects.exclude(id__in=live_topic_ids)
        if stale_topics.exists():
            print(f"    Removing {stale_topics.count()} stale topics...")
            stale_topics.delete()

        # Sync Products
        live_prod_ids = set()
        for p in live_products:
            pid = p['id']
            live_prod_ids.add(pid)
            
            # Check existing product to preserve is_bestseller if already toggled locally
            existing = Product.objects.filter(id=pid).first()
            if existing is not None:
                bestseller_val = existing.is_bestseller
            else:
                bestseller_val = p.get('product_id') in INITIAL_BESTSELLERS

            Product.objects.update_or_create(
                id=pid,
                defaults={
                    'product_id': p.get('product_id'),
                    'name': p.get('name', ''),
                    'price': p.get('price', 0),
                    'images': p.get('images', []),
                    'desc': p.get('desc', ''),
                    'full_details': p.get('full_details', '') or '',
                    'specs': p.get('specs', {}) or {},
                    'features': p.get('features', []) or [],
                    'has_colors': p.get('has_colors', False) or False,
                    'color_options': p.get('color_options', []) or [],
                    'has_sets': p.get('has_sets', False) or False,
                    'set_options': p.get('set_options', []) or [],
                    'customizable': p.get('customizable', False) or False,
                    'customization_label': p.get('customization_label', '') or '',
                    'customization_placeholder': p.get('customization_placeholder', '') or '',
                    'custom_letters_limit': p.get('custom_letters_limit', 50) or 50,
                    'topic_id': p.get('topic'),
                    'is_bestseller': bestseller_val
                }
            )

        # Clean up stale products
        stale_products = Product.objects.exclude(id__in=live_prod_ids)
        if stale_products.exists():
            print(f"    Removing {stale_products.count()} stale products...")
            stale_products.delete()

    print(f"✓ Successfully synced {len(live_topics)} topics and {len(live_products)} products into local SQLite database!")

if __name__ == '__main__':
    sync()
