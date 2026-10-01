import json

walkthrough = json.load(open('src/data/walkthrough_100_data.json', encoding='utf-8'))
bosses = json.load(open('src/data/bosses.json', encoding='utf-8'))
boss_ids = set(b['id'] for b in bosses)
quests = json.load(open('src/data/sidequests.json', encoding='utf-8'))
quest_ids = set(q['id'] for q in quests)
diffComp = json.load(open('src/data/difficulty_comparison.json', encoding='utf-8'))

print(f"Total stages: {len(walkthrough)}")
print(f"Total bosses in db: {len(boss_ids)}")
print(f"Total quests in db: {len(quest_ids)}")
print(f"Total diffComp rows: {len(diffComp)}")

missing_bosses = []
for s in walkthrough:
    for b in s.get('bosses', []):
        if b['bossId'] not in boss_ids:
            missing_bosses.append((s['id'], b['bossId']))

print(f"Missing boss refs: {missing_bosses}")

missing_quests = []
for s in walkthrough:
    for q in s.get('sidequests', []):
        ref = q.get('questRefId')
        if ref and ref not in quest_ids:
            missing_quests.append((s['id'], q['id'], ref))

print(f"Missing quest refs: {missing_quests}")
