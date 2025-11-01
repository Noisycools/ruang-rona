-- AlterTable
ALTER TABLE `exercise_progress` ADD COLUMN `exerciseRecommendationId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `exercise_progress_exerciseRecommendationId_idx` ON `exercise_progress`(`exerciseRecommendationId`);

-- AddForeignKey
ALTER TABLE `exercise_progress` ADD CONSTRAINT `exercise_progress_exerciseRecommendationId_fkey` FOREIGN KEY (`exerciseRecommendationId`) REFERENCES `ExerciseRecommendation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
