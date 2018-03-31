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
  db.runSql("CREATE TABLE `botchannels` (`botchannel_id` VARCHAR(255) PRIMARY KEY, `server_id` VARCHAR(255) REFERENCES `servers` (`server_id`) ON DELETE CASCADE ON UPDATE CASCADE)", callback);
};

exports.down = function(db) {
  return null;
};

exports._meta = {
  "version": 1
};
