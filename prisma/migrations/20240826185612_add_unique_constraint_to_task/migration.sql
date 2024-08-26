/*
  Warnings:

  - A unique constraint covering the columns `[title,userId]` on the table `Task` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Task_title_userId_key` ON `Task`(`title`, `userId`);
