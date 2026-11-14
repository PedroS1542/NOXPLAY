-- Execute no SQL Editor do seu projeto Supabase.
create table if not exists public.admins (user_id uuid primary key references auth.users(id) on delete cascade);
create table if not exists public.titles (id uuid primary key, data jsonb not null, created_at timestamptz not null default now());
alter table public.admins enable row level security;
alter table public.titles enable row level security;
create policy "admin reads own membership" on public.admins for select to authenticated using (user_id = (select auth.uid()));
create policy "anyone reads catalog" on public.titles for select to anon, authenticated using (true);
create policy "admin inserts titles" on public.titles for insert to authenticated with check (exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
create policy "admin updates titles" on public.titles for update to authenticated using (exists(select 1 from public.admins a where a.user_id=(select auth.uid()))) with check (exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
create policy "admin deletes titles" on public.titles for delete to authenticated using (exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
grant select on public.titles to anon, authenticated;
grant insert, update, delete on public.titles to authenticated;
grant select on public.admins to authenticated;
insert into storage.buckets (id,name,public,file_size_limit,allowed_mime_types) values ('subtitles','subtitles',true,2097152,array['text/vtt']) on conflict(id) do nothing;
create policy "public reads subtitles" on storage.objects for select to anon, authenticated using (bucket_id='subtitles');
create policy "admin uploads subtitles" on storage.objects for insert to authenticated with check (bucket_id='subtitles' and exists(select 1 from public.admins a where a.user_id=(select auth.uid())));
-- Depois de criar seu usuário em Authentication > Users, substitua o UUID abaixo e execute SEPARADAMENTE:
-- insert into public.admins(user_id) values ('UUID_DO_SEU_USUARIO');
