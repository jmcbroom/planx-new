INSERT INTO public.teams (name, slug, theme, settings) VALUES ('Open Systems Lab', 'opensystemslab', '{}', '{"externalPlanningSite": {"url": "https://www.planningportal.co.uk/", "name": "Planning Portal"}, "supportEmail": "enquiries@opensystemslab.io"}');
INSERT INTO public.teams (name, slug, theme, settings) VALUES ('Canterbury', 'canterbury', '{"logo": "https://raw.githubusercontent.com/theopensystemslab/planx-team-logos/main/canterbury.svg", "primary": "#331035"}', '{"homepage": "https://www.canterbury.gov.uk/", "externalPlanningSite": {"url": "https://www.planningportal.co.uk/", "name": "Planning Portal"}}');
INSERT INTO public.teams (name, slug, theme) VALUES ('Southwark', 'southwark', '{}'); 
INSERT INTO public.teams (name, slug, theme, settings) VALUES ('Lambeth', 'lambeth', '{"logo":"https://raw.githubusercontent.com/theopensystemslab/planx-team-logos/main/lambeth.svg","primary":"#006360"}', '{"externalPlanningSite":{"url":"https://www.planningportal.co.uk/","name":"Planning Portal"}}')
INSERT INTO public.users (id, first_name, last_name, email, is_admin) VALUES (1, 'John', 'Rees', 'john@opensystemslab.io', true);
INSERT INTO public.users (id, first_name, last_name, email, is_admin) VALUES (2, 'Alastair', 'Parvin', 'alastair@opensystemslab.io', true);
INSERT INTO public.users (id, first_name, last_name, email, is_admin) VALUES (6, 'Gunar', 'Gessner', 'gunargessner@gmail.com', true);
INSERT INTO public.users (id, first_name, last_name, email, is_admin) VALUES (13, 'Sarah', 'Scott', 'sarah@opensystemslab.io', true);
INSERT INTO public.users (id, first_name, last_name, email, is_admin) VALUES (20, 'Jessica', 'McInchak', 'jessica@opensystemslab.io', true);
INSERT INTO public.users (id, first_name, last_name, email, is_admin) VALUES (33, 'Dafydd', 'Pearson', 'dafydd@opensystemslab.io', true);
SELECT setval('users_id_seq', max(id)) FROM users;