-- CreateTable
CREATE TABLE `project_reactions` (
    `user_id` INTEGER NOT NULL,
    `project_id` INTEGER NOT NULL,
    `reaction` VARCHAR(20) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `FK_project_reactions_projects`(`project_id`),
    INDEX `FK_project_reactions_users`(`user_id`),
    PRIMARY KEY (`user_id`, `project_id`, `reaction`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `project_reactions` ADD CONSTRAINT `FK_project_reactions_projects` FOREIGN KEY (`project_id`) REFERENCES `projects`(`project_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `project_reactions` ADD CONSTRAINT `FK_project_reactions_users` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

