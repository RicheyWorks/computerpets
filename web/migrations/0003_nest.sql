alter table companion_pets add column if not exists genotype text;
alter table companion_pets add column if not exists departed_at timestamptz;
alter table companion_pets add column if not exists origin text not null default 'hatch';
alter table companion_pets add column if not exists parent_a text;
alter table companion_pets add column if not exists parent_b text;

create table if not exists companion_clutches (
  id          text primary key,
  user_id     text not null,
  species_key text not null,
  verb        text not null,
  parent_a    text,
  parent_b    text,
  due_at      timestamptz not null,
  resolved_at timestamptz,
  cost        integer not null,
  brood       text not null,
  created_at  timestamptz not null default now()
);

create index if not exists companion_clutches_user_id_idx on companion_clutches (user_id);
create index if not exists companion_pets_departed_idx on companion_pets (user_id, departed_at);
