use kc_adventure_db;

CREATE TABLE `bookings` (
  `id` int(11) NOT NULL,
  `property_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `time_slot` datetime NOT NULL,
  `is_approved` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `properties` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `location` varchar(50) NOT NULL,
  `rent_amount` int(11) NOT NULL,
  `advance_amount` int(11) NOT NULL,
  `is_available` tinyint(1) NOT NULL,
  `owner_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `is_owner` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `bookings` ADD PRIMARY KEY (`id`);
ALTER TABLE `properties` ADD PRIMARY KEY (`id`);
ALTER TABLE `users` ADD PRIMARY KEY (`id`), ADD UNIQUE KEY `username` (`username`);
ALTER TABLE `bookings` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
ALTER TABLE `properties` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
ALTER TABLE `users` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

COMMIT;