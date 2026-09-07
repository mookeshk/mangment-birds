import psycopg2
import os

url = 'postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres'
conn = psycopg2.connect(url)
cur = conn.cursor()

cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema='public'")
rows = cur.fetchall()
print(rows)

for t in rows:
    if 'Bird' in t[0] or 'bird' in t[0]:
        cur.execute(f'SELECT "Id", "Identifier", "Status", "CageId" FROM "{t[0]}"')
        print(cur.fetchall())
