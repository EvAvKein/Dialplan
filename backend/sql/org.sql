CREATE TABLE IF NOT EXISTS Org (
    id UUID PRIMARY KEY,
    name TEXT,
    color CHAR(6),
    timezone TEXT,
    availability JSONB
);

CREATE TABLE IF NOT EXISTS Agent (
    id UUID PRIMARY KEY,
    orgId UUID REFERENCES Org(id),
    name TEXT,
    department TEXT,
    countryCode VARCHAR(3),
    internals JSON -- consider changing JSONs to JSONB if operation perf becomes more of an issue than input/output perf
);