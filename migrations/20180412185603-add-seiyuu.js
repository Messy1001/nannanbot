'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.runSql("CREATE TABLE `seiyuus` (`id` INTEGER PRIMARY KEY AUTOINCREMENT, `franchise` VARCHAR(255), `image_color` VARCHAR(255), `seiyuu_name` VARCHAR(255), `nickname` VARCHAR(255), `nick_query` VARCHAR(255), `artist_name` VARCHAR(255), `character` VARCHAR(255), `character_image` VARCHAR(255), `birthday` VARCHAR(255), `birthplace` VARCHAR(255), `twitter_account` VARCHAR(255), `other_media` VARCHAR(255), `other_media_url` VARCHAR(255), `blog` VARCHAR(255), `blog_url` VARCHAR(255), `website` VARCHAR(255), `website_url` VARCHAR(255), `agency` VARCHAR(255), `agency_url` VARCHAR(255), `mal_image` VARCHAR(255), `other_image` TEXT, `mal_page` VARCHAR(255), `skills` TEXT, `hobbies` TEXT, `fun_facts` TEXT)", callback)
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
