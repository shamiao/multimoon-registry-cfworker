-- Migration number: 0001 	 2024-05-17T06:37:54.752Z

PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS [toolchains] ("id" integer PRIMARY KEY,"arch" text,"name" text,"last_modified" integer,"data" blob);

ALTER TABLE `toolchains` ADD COLUMN `moonver` TEXT AFTER `name`;
ALTER TABLE `toolchains` ADD COLUMN `installer` TEXT AFTER `moonver`;
