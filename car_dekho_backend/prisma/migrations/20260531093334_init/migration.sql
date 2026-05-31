-- CreateTable
CREATE TABLE `Car` (
    `id` VARCHAR(191) NOT NULL,
    `maker` VARCHAR(191) NOT NULL,
    `model` VARCHAR(191) NOT NULL,
    `varient` VARCHAR(191) NOT NULL,
    `bodyType` VARCHAR(191) NOT NULL,
    `fuelType` VARCHAR(191) NOT NULL,
    `year` INTEGER NULL,
    `transmission` VARCHAR(191) NOT NULL,
    `exShowRoomPrice` DOUBLE NULL,
    `mileage` DOUBLE NULL,
    `engineCC` DOUBLE NULL,
    `powerBhp` DOUBLE NULL,
    `torqueNm` DOUBLE NULL,
    `seatCapacity` INTEGER NULL,
    `safetyRating` DOUBLE NULL,
    `imageUrl` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `Car_maker_idx`(`maker`),
    INDEX `Car_model_idx`(`model`),
    INDEX `Car_bodyType_idx`(`bodyType`),
    INDEX `Car_fuelType_idx`(`fuelType`),
    INDEX `Car_exShowRoomPrice_idx`(`exShowRoomPrice`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `CarFeature` (
    `id` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Review` (
    `id` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,
    `reviewerName` VARCHAR(191) NOT NULL,
    `rating` DOUBLE NULL,
    `reviewText` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Review_carId_idx`(`carId`),
    INDEX `Review_rating_idx`(`rating`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Recommendation` (
    `id` VARCHAR(191) NOT NULL,
    `searchId` VARCHAR(191) NOT NULL,
    `aiReasoning` VARCHAR(191) NOT NULL,
    `confidenceScore` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Recommendation_searchId_idx`(`searchId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecommendationCars` (
    `id` VARCHAR(191) NOT NULL,
    `recommendationId` VARCHAR(191) NOT NULL,
    `carId` VARCHAR(191) NOT NULL,
    `rank` VARCHAR(191) NULL,
    `Score` DOUBLE NULL,

    UNIQUE INDEX `RecommendationCars_recommendationId_carId_key`(`recommendationId`, `carId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserSearch` (
    `id` VARCHAR(191) NOT NULL,
    `sessionId` VARCHAR(191) NOT NULL,
    `budget` INTEGER NULL,
    `familySize` INTEGER NULL,
    `fuelPreference` ENUM('PETROL', 'DIESEL', 'ELECTRIC', 'CNG', 'HYBRID') NULL,
    `bodyPreference` ENUM('HATCHBACK', 'SEDAN', 'SUV', 'MUV', 'COUPE', 'CONVERTIBLE') NULL,
    `transmissionPreference` ENUM('MANUAL', 'AUTOMATIC') NULL,
    `usageType` ENUM('CITY', 'HIGHWAY', 'MIXED') NULL,
    `priority` ENUM('MILEAGE', 'SAFETY', 'PERFORMANCE', 'COMFORT', 'LOW_MAINTAINANCE', 'RESALE_VALUE') NULL,
    `userPrompt` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `UserSearch_sessionId_idx`(`sessionId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CarFeature` ADD CONSTRAINT `CarFeature_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Review` ADD CONSTRAINT `Review_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Recommendation` ADD CONSTRAINT `Recommendation_searchId_fkey` FOREIGN KEY (`searchId`) REFERENCES `UserSearch`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecommendationCars` ADD CONSTRAINT `RecommendationCars_recommendationId_fkey` FOREIGN KEY (`recommendationId`) REFERENCES `Recommendation`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecommendationCars` ADD CONSTRAINT `RecommendationCars_carId_fkey` FOREIGN KEY (`carId`) REFERENCES `Car`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
