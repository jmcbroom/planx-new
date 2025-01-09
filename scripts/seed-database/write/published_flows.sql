-- insert published_flows overwriting conflicts
CREATE TEMPORARY TABLE sync_published_flows (
  id int,
  data jsonb,
  flow_id uuid,
  summary text,
  publisher_id int,
  created_at timestamptz
  );

\copy sync_published_flows (id, data, flow_id, summary, publisher_id, created_at) FROM '/tmp/published_flows.csv' (FORMAT csv, DELIMITER ';');

INSERT INTO published_flows (
  id,
  data,
  flow_id,
  summary,
  publisher_id,
  created_at
  )
SELECT
  id,
  data,
  flow_id,
  summary,
  publisher_id,
  created_at
FROM sync_published_flows
ON CONFLICT (id) DO UPDATE
SET
  data = EXCLUDED.data,
  flow_id = EXCLUDED.flow_id,
  summary = EXCLUDED.summary,
  publisher_id = EXCLUDED.publisher_id,
  created_at = EXCLUDED.created_at;