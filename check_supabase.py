import psycopg2

try:
    conn = psycopg2.connect("postgresql://postgres.lkifembpsutcnoipuogn:MoKeshk%40161109@aws-1-eu-west-1.pooler.supabase.com:6543/postgres")
    cur = conn.cursor()
    cur.execute("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'")
    tables = cur.fetchall()
    print("Tables in Supabase:")
    for t in tables:
        print(t[0])
    cur.close()
    conn.close()
except Exception as e:
    print(f"Error: {e}")
