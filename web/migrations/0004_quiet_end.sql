alter table companion_pets add column if not exists health integer not null default 92;
alter table companion_pets add column if not exists hygiene integer not null default 86;
alter table companion_pets add column if not exists floor_since timestamptz;
