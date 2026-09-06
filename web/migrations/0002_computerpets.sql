create table if not exists pet_keepers (
  user_id    text primary key,
  ember      integer not null default 12,
  hatches    integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists companion_pets (
  id          text primary key,
  user_id     text not null,
  species_key text not null,
  name        text not null,
  token_id    text not null,
  rarity      text not null,
  hunger      integer not null default 72,
  mood        integer not null default 72,
  energy      integer not null default 72,
  eyes        text not null,
  mark        text not null,
  aura        text not null,
  last_tick   timestamptz not null default now(),
  hatched_at  timestamptz not null default now(),
  is_active   boolean not null default false
);

create index if not exists companion_pets_user_id_idx on companion_pets (user_id);
create unique index if not exists companion_pets_token_id_idx on companion_pets (token_id);
