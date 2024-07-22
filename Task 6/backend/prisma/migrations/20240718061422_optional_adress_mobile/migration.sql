/*
  Warnings:

  - Made the column `firstName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `lastName` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `dob` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` MODIFY `firstName` VARCHAR(255) NOT NULL,
    MODIFY `lastName` VARCHAR(255) NOT NULL,
    MODIFY `dob` DATE NOT NULL,
    MODIFY `address` VARCHAR(255) NULL,
    MODIFY `mobile` VARCHAR(255) NULL;
