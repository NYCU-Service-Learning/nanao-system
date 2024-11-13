/*
  Warnings:

  - You are about to drop the column `email` on the `userdetail` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `email` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `userdetail` DROP COLUMN `email`;

-- CreateIndex
CREATE UNIQUE INDEX `User_email_key` ON `User`(`email`);
