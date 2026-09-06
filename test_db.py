import psycopg2

conn = psycopg2.connect("postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres")
cur = conn.cursor()
cur.execute("SELECT count(*) FROM information_schema.tables WHERE table_schema='public';")
print("Tables in public schema:", cur.fetchone()[0])

try:
    cur.execute('SELECT "Email" FROM "AspNetUsers";')
    users = cur.fetchall()
    print("Users in DB:", users)
except Exception as e:
    print("Error querying users:", e)

conn.close()
