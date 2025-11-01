/*
  Warnings:

  - You are about to drop the `exerciserecommendation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `exerciserecommendation`;

-- CreateTable
CREATE TABLE `exercise_recommendations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `exercise_recommendations_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `exerciseRecommendationId` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `slug` VARCHAR(191) NOT NULL,
    `content` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `modules_slug_key`(`slug`),
    INDEX `modules_exerciseRecommendationId_idx`(`exerciseRecommendationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `modules` ADD CONSTRAINT `modules_exerciseRecommendationId_fkey` FOREIGN KEY (`exerciseRecommendationId`) REFERENCES `exercise_recommendations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
