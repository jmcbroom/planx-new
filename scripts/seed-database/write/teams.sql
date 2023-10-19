-- insert teams skipping conflicts
CREATE TEMPORARY TABLE sync_teams (
  id integer,
  name text,
  slug text,
  theme jsonb,
  created_at timestamptz,
  updated_at timestamptz,
  settings jsonb,
  notify_personalisation jsonb,
  domain text,
  submission_email text,
  boundary jsonb
);

\copy sync_teams FROM '/tmp/teams.csv' WITH (FORMAT csv, DELIMITER ';');

INSERT INTO teams (
  id,
  name,
  slug,
  theme,
  settings,
  notify_personalisation,
  boundary
)
SELECT
  id,
  name,
  slug,
  theme,
  settings,
  notify_personalisation,
  boundary
FROM sync_teams
ON CONFLICT (id) DO UPDATE;

SELECT setval('teams_id_seq', max(id)) FROM teams;
