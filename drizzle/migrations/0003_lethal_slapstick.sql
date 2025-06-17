PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`estimate` integer DEFAULT 0,
	`progress` integer DEFAULT 0,
	`completed` text DEFAULT 'false',
	`description` text DEFAULT '',
	`archived` text DEFAULT 'false',
	`created_at` text DEFAULT '2025-06-17T22:08:35.260Z',
	`updated_at` text DEFAULT '2025-06-17T22:08:35.261Z',
	`task_list_id` integer DEFAULT 0,
	`tags` text DEFAULT '[]',
	`priority` text DEFAULT 'none',
	`additionalData` text DEFAULT '{}'
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "estimate", "progress", "completed", "description", "archived", "created_at", "updated_at", "task_list_id", "tags", "priority", "additionalData") SELECT "id", "title", "estimate", "progress", "completed", "description", "archived", "created_at", "updated_at", "task_list_id", "tags", "priority", "additionalData" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`note` text DEFAULT '',
	`created_at` text DEFAULT '2025-06-17T22:08:35.274Z',
	`updated_at` text DEFAULT '2025-06-17T22:08:35.274Z'
);
--> statement-breakpoint
INSERT INTO `__new_notes`("id", "note", "created_at", "updated_at") SELECT "id", "note", "created_at", "updated_at" FROM `notes`;--> statement-breakpoint
DROP TABLE `notes`;--> statement-breakpoint
ALTER TABLE `__new_notes` RENAME TO `notes`;