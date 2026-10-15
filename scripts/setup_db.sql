CREATE USER simona_app WITH PASSWORD 'SmBt_Staging_2026_PgPass!' CREATEDB;
CREATE DATABASE simona_staging OWNER simona_app;
GRANT ALL PRIVILEGES ON DATABASE simona_staging TO simona_app;

-- Последовательность сквозной нумерации заказов (старт со старого сайта UMI.CMS: 15104)
\c simona_staging;
CREATE SEQUENCE IF NOT EXISTS order_number_seq START WITH 15104;
GRANT ALL PRIVILEGES ON SEQUENCE order_number_seq TO simona_app;
