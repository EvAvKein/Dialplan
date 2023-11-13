CREATE TABLE IF NOT EXISTS Invite (
    id UUID PRIMARY KEY,
    orgId UUID REFERENCES Org(id),
    agentId UUID REFERENCES Agent(id),
    recipient JSON,
    callDuration SMALLINT,
    expiry TIMESTAMP,
    notes JSON
);

CREATE TABLE IF NOT EXISTS Call (
    id UUID PRIMARY KEY,
    orgId UUID REFERENCES Org(id),
    agentId UUID REFERENCES Agent(id),
    recipient JSON,
    time TSRANGE,
    notes JSON
);