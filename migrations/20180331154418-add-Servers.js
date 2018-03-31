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
  db.runSql("CREATE TABLE `servers` (`server_id` VARCHAR(255) PRIMARY KEY, `announcement_channel` VARCHAR(255), `announcement_type` TEXT)", callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
