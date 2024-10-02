# Setup

```
npm i
cp env.example .env
```

## run db

```
docker run -d \
--name test-koliko \
-e POSTGRES_PASSWORD=postgres \
-e POSTGRES_USER=postgres \
-e POSTGRES_DB=test-koliko \
-p 5432:5432 \
postgres
```

## seed

### connect to db

```
docker exec -it {container_identifier} psql -h localhost -p 5432 -U postgres -d test-koliko
```

### seed data
```
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  balance BIGINT, -- stored in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT into users (balance) values (10000); -- 100.00
```

# Run

```
npx tsx index
```