-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `reg_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `role` ENUM('USER', 'ADMIN') NOT NULL,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserDetail` (
    `user_id` INTEGER NOT NULL,
    `gender` ENUM('MALE', 'FEMALE') NULL,
    `birthday` VARCHAR(191) NULL,
    `age` INTEGER NULL,
    `medical_History` VARCHAR(191) NULL,
    `headshot` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `updateAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Session` (
    `user_id` INTEGER NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `expired_time` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `HurtForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `fill_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `neck` INTEGER NOT NULL DEFAULT 0,
    `right_upper_arm` INTEGER NOT NULL DEFAULT 0,
    `right_shoulder` INTEGER NOT NULL DEFAULT 0,
    `right_lower_arm` INTEGER NOT NULL DEFAULT 0,
    `right_hand` INTEGER NOT NULL DEFAULT 0,
    `left_upper_arm` INTEGER NOT NULL DEFAULT 0,
    `left_shoulder` INTEGER NOT NULL DEFAULT 0,
    `left_lower_arm` INTEGER NOT NULL DEFAULT 0,
    `left_lower_leg` INTEGER NOT NULL DEFAULT 0,
    `left_hand` INTEGER NOT NULL DEFAULT 0,
    `left_upper_leg` INTEGER NOT NULL DEFAULT 0,
    `left_ankle` INTEGER NOT NULL DEFAULT 0,
    `left_feet` INTEGER NOT NULL DEFAULT 0,
    `left_knee` INTEGER NOT NULL DEFAULT 0,
    `right_lower_leg` INTEGER NOT NULL DEFAULT 0,
    `right_ankle` INTEGER NOT NULL DEFAULT 0,
    `right_upper_leg` INTEGER NOT NULL DEFAULT 0,
    `right_feet` INTEGER NOT NULL DEFAULT 0,
    `right_knee` INTEGER NOT NULL DEFAULT 0,
    `abdomen` INTEGER NOT NULL DEFAULT 0,
    `lower_body` INTEGER NOT NULL DEFAULT 0,
    `upper_body` INTEGER NOT NULL DEFAULT 0,
    `right_ear` INTEGER NOT NULL DEFAULT 0,
    `left_ear` INTEGER NOT NULL DEFAULT 0,
    `head` INTEGER NOT NULL DEFAULT 0,
    `right_eye` INTEGER NOT NULL DEFAULT 0,
    `mouth` INTEGER NOT NULL DEFAULT 0,
    `left_eye` INTEGER NOT NULL DEFAULT 0,
    `nose` INTEGER NOT NULL DEFAULT 0,
    `back_head` INTEGER NOT NULL DEFAULT 0,
    `back_neck` INTEGER NOT NULL DEFAULT 0,
    `left_elbow` INTEGER NOT NULL DEFAULT 0,
    `right_elbow` INTEGER NOT NULL DEFAULT 0,
    `lower_back` INTEGER NOT NULL DEFAULT 0,
    `back` INTEGER NOT NULL DEFAULT 0,
    `butt` INTEGER NOT NULL DEFAULT 0,
    `right_upper_shoulder` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `YearForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `fill_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `neck` BOOLEAN NOT NULL DEFAULT false,
    `right_upper_arm` BOOLEAN NOT NULL DEFAULT false,
    `right_shoulder` BOOLEAN NOT NULL DEFAULT false,
    `right_lower_arm` BOOLEAN NOT NULL DEFAULT false,
    `right_hand` BOOLEAN NOT NULL DEFAULT false,
    `left_upper_arm` BOOLEAN NOT NULL DEFAULT false,
    `left_shoulder` BOOLEAN NOT NULL DEFAULT false,
    `left_lower_arm` BOOLEAN NOT NULL DEFAULT false,
    `left_lower_leg` BOOLEAN NOT NULL DEFAULT false,
    `left_hand` BOOLEAN NOT NULL DEFAULT false,
    `left_upper_leg` BOOLEAN NOT NULL DEFAULT false,
    `left_ankle` BOOLEAN NOT NULL DEFAULT false,
    `left_feet` BOOLEAN NOT NULL DEFAULT false,
    `left_knee` BOOLEAN NOT NULL DEFAULT false,
    `right_lower_leg` BOOLEAN NOT NULL DEFAULT false,
    `right_ankle` BOOLEAN NOT NULL DEFAULT false,
    `right_upper_leg` BOOLEAN NOT NULL DEFAULT false,
    `right_feet` BOOLEAN NOT NULL DEFAULT false,
    `right_knee` BOOLEAN NOT NULL DEFAULT false,
    `abdomen` BOOLEAN NOT NULL DEFAULT false,
    `lower_body` BOOLEAN NOT NULL DEFAULT false,
    `upper_body` BOOLEAN NOT NULL DEFAULT false,
    `right_ear` BOOLEAN NOT NULL DEFAULT false,
    `left_ear` BOOLEAN NOT NULL DEFAULT false,
    `head` BOOLEAN NOT NULL DEFAULT false,
    `right_eye` BOOLEAN NOT NULL DEFAULT false,
    `mouth` BOOLEAN NOT NULL DEFAULT false,
    `left_eye` BOOLEAN NOT NULL DEFAULT false,
    `nose` BOOLEAN NOT NULL DEFAULT false,
    `back_head` BOOLEAN NOT NULL DEFAULT false,
    `back_neck` BOOLEAN NOT NULL DEFAULT false,
    `left_elbow` BOOLEAN NOT NULL DEFAULT false,
    `right_elbow` BOOLEAN NOT NULL DEFAULT false,
    `lower_back` BOOLEAN NOT NULL DEFAULT false,
    `back` BOOLEAN NOT NULL DEFAULT false,
    `butt` BOOLEAN NOT NULL DEFAULT false,
    `right_upper_shoulder` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WeekForm` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `fill_time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `neck` BOOLEAN NOT NULL DEFAULT false,
    `right_upper_arm` BOOLEAN NOT NULL DEFAULT false,
    `right_shoulder` BOOLEAN NOT NULL DEFAULT false,
    `right_lower_arm` BOOLEAN NOT NULL DEFAULT false,
    `right_hand` BOOLEAN NOT NULL DEFAULT false,
    `left_upper_arm` BOOLEAN NOT NULL DEFAULT false,
    `left_shoulder` BOOLEAN NOT NULL DEFAULT false,
    `left_lower_arm` BOOLEAN NOT NULL DEFAULT false,
    `left_lower_leg` BOOLEAN NOT NULL DEFAULT false,
    `left_hand` BOOLEAN NOT NULL DEFAULT false,
    `left_upper_leg` BOOLEAN NOT NULL DEFAULT false,
    `left_ankle` BOOLEAN NOT NULL DEFAULT false,
    `left_feet` BOOLEAN NOT NULL DEFAULT false,
    `left_knee` BOOLEAN NOT NULL DEFAULT false,
    `right_lower_leg` BOOLEAN NOT NULL DEFAULT false,
    `right_ankle` BOOLEAN NOT NULL DEFAULT false,
    `right_upper_leg` BOOLEAN NOT NULL DEFAULT false,
    `right_feet` BOOLEAN NOT NULL DEFAULT false,
    `right_knee` BOOLEAN NOT NULL DEFAULT false,
    `abdomen` BOOLEAN NOT NULL DEFAULT false,
    `lower_body` BOOLEAN NOT NULL DEFAULT false,
    `upper_body` BOOLEAN NOT NULL DEFAULT false,
    `right_ear` BOOLEAN NOT NULL DEFAULT false,
    `left_ear` BOOLEAN NOT NULL DEFAULT false,
    `head` BOOLEAN NOT NULL DEFAULT false,
    `right_eye` BOOLEAN NOT NULL DEFAULT false,
    `mouth` BOOLEAN NOT NULL DEFAULT false,
    `left_eye` BOOLEAN NOT NULL DEFAULT false,
    `nose` BOOLEAN NOT NULL DEFAULT false,
    `back_head` BOOLEAN NOT NULL DEFAULT false,
    `back_neck` BOOLEAN NOT NULL DEFAULT false,
    `left_elbow` BOOLEAN NOT NULL DEFAULT false,
    `right_elbow` BOOLEAN NOT NULL DEFAULT false,
    `lower_back` BOOLEAN NOT NULL DEFAULT false,
    `back` BOOLEAN NOT NULL DEFAULT false,
    `butt` BOOLEAN NOT NULL DEFAULT false,
    `right_upper_shoulder` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserDetail` ADD CONSTRAINT `UserDetail_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Session` ADD CONSTRAINT `Session_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `HurtForm` ADD CONSTRAINT `HurtForm_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YearForm` ADD CONSTRAINT `YearForm_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WeekForm` ADD CONSTRAINT `WeekForm_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
