SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

DROP TABLE IF EXISTS `Event`;
CREATE TABLE `Event` (
    `eid` varchar(128) NOT NULL,
    `Title` varchar(128) NOT NULL,
    `description` varchar(256) NOT NULL,
    `date` datetime NOT NULL,
    `PosX` float NOT NULL,
    `PosY` float NOT NULL,
    PRIMARY KEY (`uid`),

) ENGINE=InnoDB DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `Comment`;
CREATE TABLE `Comment` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `uid` varchar(128)  NOT NULL,
    `eid` varchar(128)  NOT NULL,
    `content` varchar(256) NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`uid`) REFERENCES `Account`(`uid`),
    FOREIGN KEY (`eid`) REFERENCES `Event`(`eid`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;