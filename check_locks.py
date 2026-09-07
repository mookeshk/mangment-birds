import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres")
    cur = conn.cursor()
    cur.execute("SELECT * FROM pg_stat_activity WHERE wait_event IS NOT NULL")
    rows = cur.fetchall()
    for r in rows:
        print(r)
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
