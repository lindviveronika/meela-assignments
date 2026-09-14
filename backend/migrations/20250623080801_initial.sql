CREATE TABLE onboarding_submissions (
    id              TEXT PRIMARY KEY,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'submitted')),
    answers         TEXT NOT NULL DEFAULT '{}',
    current_step    TEXT
);
