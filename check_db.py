import psycopg2
import os

url = 'postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres'
conn = psycopg2.connect(url)
cur = conn.cursor()

cur.execute('SELECT "Id", "Identifier", "Status", "CageId" FROM "Birds"')
rows = cur.fetchall()
for r in rows:
    print(r)
