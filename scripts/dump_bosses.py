import json

bosses = json.load(open('src/data/bosses.json', encoding='utf-8'))
with open('scripts/all_bosses_summary.txt', 'w', encoding='utf-8') as f:
    for b in bosses:
        f.write(f"{b['id']}: {b.get('trainer_name')} | {b.get('location')} | {b.get('category')} | {b.get('season')}\n")

print(f"Dumped {len(bosses)} bosses to scripts/all_bosses_summary.txt")
