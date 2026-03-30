/*
  Warnings:

  - A unique constraint covering the columns `[enrollment_number]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[professional_registration]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cpf` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `enrollment_number` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professional_registration` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workplace` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "enrollment_number" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "professional_registration" TEXT NOT NULL,
ADD COLUMN     "workplace" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "users_enrollment_number_key" ON "users"("enrollment_number");

-- CreateIndex
CREATE UNIQUE INDEX "users_professional_registration_key" ON "users"("professional_registration");

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");
