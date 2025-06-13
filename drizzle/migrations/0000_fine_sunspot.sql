CREATE TABLE `tasks` (
	`id` integer,
	`title` text NOT NULL,
	`estimate` integer DEFAULT 0,
	`progress` integer DEFAULT 0,
	`completed` text DEFAULT 'false',
	`description` text DEFAULT '',
	`archived` text DEFAULT 'false',
	`created_at` text DEFAULT '2025-06-13T08:23:37.841Z',
	`updated_at` text DEFAULT '2025-06-13T08:23:37.841Z',
	`task_list_id` integer DEFAULT 0,
	`tags` text DEFAULT '[]',
	`priority` text DEFAULT 'none',
	`additionalData` text DEFAULT '{}'
);
