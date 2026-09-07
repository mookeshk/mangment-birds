import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres")
    cur = conn.cursor()
    cur.execute('SELECT * FROM "__EFMigrationsHistory"')
    rows = cur.fetchall()
    print("Migrations applied:")
    for r in rows:
        print(r)
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
