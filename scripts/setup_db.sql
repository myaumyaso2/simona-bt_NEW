CREATE USER simona_app WITH PASSWORD 'SmBt_Staging_2026_PgPass!' CREATEDB;
CREATE DATABASE simona_staging OWNER simona_app;
GRANT ALL PRIVILEGES ON DATABASE simona_staging TO simona_app;
