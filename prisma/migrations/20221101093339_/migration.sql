/*
  Warnings:

  - A unique constraint covering the columns `[subscription_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `subscription_id` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_subscription_id_key` ON `users`(`subscription_id`);
