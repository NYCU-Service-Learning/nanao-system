-- CreateTable
CREATE TABLE `MentalForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `fill_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `problem1` INTEGER NOT NULL,
    `problem2` INTEGER NOT NULL,
    `problem3` INTEGER NOT NULL,
    `problem4` INTEGER NOT NULL,
    `problem5` INTEGER NOT NULL,
    `problem6` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MentalForm` ADD CONSTRAINT `MentalForm_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
