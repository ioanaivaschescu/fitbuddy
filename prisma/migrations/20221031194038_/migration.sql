/*
  Warnings:

  - A unique constraint covering the columns `[stripe_customer]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `stripe_customer` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users_stripe_customer_key` ON `users`(`stripe_customer`);
