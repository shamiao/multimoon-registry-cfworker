-- Migration number: 0002 	 2024-05-17T06:48:16.405Z

PRAGMA defer_foreign_keys=TRUE;
CREATE TABLE IF NOT EXISTS [files] (
    "id" integer PRIMARY KEY,
    "type" text,
    "toolchain" text,
    "arch" text,
    "filename" text,
    "downloadname" text,
    "checksum" text
);
