/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 100121
Source Host           : localhost:3306
Source Database       : mydemo_node

Target Server Type    : MYSQL
Target Server Version : 100121
File Encoding         : 65001

Date: 2018-06-27 16:08:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for things
-- ----------------------------
DROP TABLE IF EXISTS `things`;
CREATE TABLE `things` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL,
  `message` varchar(200) DEFAULT NULL,
  `urgent` int(11) DEFAULT NULL,
  `time` varchar(10) DEFAULT NULL,
  `isdelete` int(11) DEFAULT NULL,
  `list_id` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of things
-- ----------------------------
INSERT INTO `things` VALUES ('34', '期末复习3', '数据库', '2', '2018-06-21', '1', '2');
INSERT INTO `things` VALUES ('36', 'qeqw', 'asfa', '1', '2018-06-20', '1', '1');
INSERT INTO `things` VALUES ('38', 'rthd', 'hdgd', '3', '2018-06-21', '0', '1');
INSERT INTO `things` VALUES ('40', '期末复习2', '毛概', '2', '2018-06-20', '1', '2');
INSERT INTO `things` VALUES ('41', 'web', '大作业', '3', '2018-06-20', '0', '2');
INSERT INTO `things` VALUES ('42', '期末复习2', '操作系统', '1', '2018-06-21', '0', '2');
INSERT INTO `things` VALUES ('43', '期末复习4', '数据库', '2', '2018-06-19', '0', '2');
