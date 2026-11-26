CREATE TABLE `dashboard_access` (
    `userId` VARCHAR(191) NOT NULL,
    `permissions` JSON NOT NULL,
    PRIMARY KEY (`userId`),
    CONSTRAINT `dashboard_access_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
