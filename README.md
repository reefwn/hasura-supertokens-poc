## Insert Mock Data

1. connect to postgres container
```
docker exec -it {postgres-container} bash
```

2. connect to postgres server
```
psql -U postgres
```

3. list databases
```
\l
```

4. connect to database
```
\c {database}
```

5. execute DDL queries provided in mock folder

6. check if table is created
```
\dt
```

7. execute DML queries provided in mock folder

8. check if records are inserted
```
SELECT * from {table}
```