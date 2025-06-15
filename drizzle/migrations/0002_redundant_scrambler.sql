CREATE TABLE `notes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`note` text DEFAULT '',
	`created_at` text DEFAULT '2025-06-15T21:58:37.944Z',
	`updated_at` text DEFAULT '2025-06-15T21:58:37.944Z'
);
--> statement-breakpoint
CREATE TABLE `subtasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`parentId` integer NOT NULL,
	`title` text DEFAULT '',
	`completed` text DEFAULT 'false',
	FOREIGN KEY (`parentId`) REFERENCES `tasks`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`estimate` integer DEFAULT 0,
	`progress` integer DEFAULT 0,
	`completed` text DEFAULT 'false',
	`description` text DEFAULT '',
	`archived` text DEFAULT 'false',
	`created_at` text DEFAULT '2025-06-15T21:58:37.936Z',
	`updated_at` text DEFAULT '2025-06-15T21:58:37.937Z',
	`task_list_id` integer DEFAULT 0,
	`tags` text DEFAULT '[]',
	`priority` text DEFAULT 'none',
	`additionalData` text DEFAULT '{}'
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "title", "estimate", "progress", "completed", "description", "archived", "created_at", "updated_at", "task_list_id", "tags", "priority", "additionalData") SELECT "id", "title", "estimate", "progress", "completed", "description", "archived", "created_at", "updated_at", "task_list_id", "tags", "priority", "additionalData" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
PRAGMA foreign_keys=ON;