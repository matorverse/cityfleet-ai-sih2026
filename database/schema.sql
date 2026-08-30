-- Postgres/PostGIS-compatible production schema. The demo server uses the same entity shape in memory.
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE TYPE severity AS ENUM ('low','medium','high','critical');
CREATE TYPE event_status AS ENUM ('unverified','confirmed','acknowledged','resolved');
CREATE TABLE routes (id text PRIMARY KEY, route_number text NOT NULL, name text NOT NULL, path geometry(LineString,4326) NOT NULL);
CREATE TABLE buses (id text PRIMARY KEY, registration_number text UNIQUE NOT NULL, route_id text REFERENCES routes(id), status text NOT NULL, latitude double precision NOT NULL, longitude double precision NOT NULL, speed real NOT NULL, heading real NOT NULL, last_seen timestamptz NOT NULL);
CREATE TABLE roads (id text PRIMARY KEY, name text NOT NULL, geometry geometry(LineString,4326) NOT NULL, health_score real NOT NULL CHECK (health_score BETWEEN 0 AND 100));
CREATE TABLE events (id text PRIMARY KEY, type text NOT NULL, location geometry(Point,4326) NOT NULL, detected_at timestamptz NOT NULL, bus_id text REFERENCES buses(id), road_id text REFERENCES roads(id), confidence real NOT NULL, severity severity NOT NULL, status event_status NOT NULL, evidence_ref text, metadata jsonb NOT NULL DEFAULT '{}');
CREATE TABLE event_confirmations (id text PRIMARY KEY, event_group_id text NOT NULL REFERENCES events(id), event_id text NOT NULL REFERENCES events(id), bus_id text REFERENCES buses(id), confidence real NOT NULL, detected_at timestamptz NOT NULL);
CREATE TABLE road_health_history (id bigserial PRIMARY KEY, road_id text REFERENCES roads(id), score real NOT NULL, captured_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE alerts (id text PRIMARY KEY, event_id text REFERENCES events(id), priority real NOT NULL, status text NOT NULL, created_at timestamptz NOT NULL, acknowledged_at timestamptz);
CREATE INDEX events_location_idx ON events USING gist(location);
