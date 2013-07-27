# --- Created by Ebean DDL
# To stop Ebean DDL generation, remove this comment and start using Evolutions

# --- !Ups

create table linked_account (
  id                        bigint not null,
  user_id                   bigint,
  provider_user_id          varchar(255),
  provider_key              varchar(255),
  constraint pk_linked_account primary key (id))
;

create table token_action (
  id                        bigint not null,
  token                     varchar(255),
  target_user_id            bigint,
  type                      varchar(2),
  created                   timestamp,
  expires                   timestamp,
  constraint ck_token_action_type check (type in ('EV','PR')),
  constraint uq_token_action_token unique (token),
  constraint pk_token_action primary key (id))
;

create table user (
  id                        bigint not null,
  name                      varchar(255),
  email                     varchar(255),
  active                    boolean,
  last_login                timestamp,
  email_validated           boolean,
  first_name                varchar(255),
  last_name                 varchar(255),
  address                   varchar(255),
  lat                       varchar(255),
  lon                       varchar(255),
  recycled_items            varchar(255),
  has_registered            boolean,
  constraint pk_user primary key (id))
;

create sequence linked_account_seq;

create sequence token_action_seq;

create sequence user_seq;

alter table linked_account add constraint fk_linked_account_user_1 foreign key (user_id) references user (id) on delete restrict on update restrict;
create index ix_linked_account_user_1 on linked_account (user_id);
alter table token_action add constraint fk_token_action_targetUser_2 foreign key (target_user_id) references user (id) on delete restrict on update restrict;
create index ix_token_action_targetUser_2 on token_action (target_user_id);



# --- !Downs

SET REFERENTIAL_INTEGRITY FALSE;

drop table if exists linked_account;

drop table if exists token_action;

drop table if exists user;

SET REFERENTIAL_INTEGRITY TRUE;

drop sequence if exists linked_account_seq;

drop sequence if exists token_action_seq;

drop sequence if exists user_seq;

