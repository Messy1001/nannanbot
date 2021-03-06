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
  db.runSql("CREATE TABLE `users` (`user_id` VARCHAR(255) PRIMARY KEY, `balance` INTEGER NOT NULL DEFAULT 0)", callback)
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
