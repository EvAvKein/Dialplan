CREATE TABLE IF NOT EXISTS "Org" (
    "id" UUID PRIMARY KEY NOT NULL,
    "name" TEXT NOT NULL,
    "color" CHAR(6) NOT NULL,
    "timezone" TEXT NOT NULL
    -- "availability" JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS "Agent" (
    "id" UUID PRIMARY KEY NOT NULL,
    "orgId" UUID REFERENCES "Org"("id") NOT NULL,
    "name" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "countryCode" VARCHAR(3) NOT NULL,
    "internals" JSON NOT NULL -- consider changing JSONs to JSONB if operation perf becomes more of an issue than input/output perf
);