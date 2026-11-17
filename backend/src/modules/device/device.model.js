const db = require('../../config/database');

/**
 * Initializes the SQLite Device schema, constraints, and indexes
 */
function initializeDeviceModel() {
  const ddl = `
    CREATE TABLE IF NOT EXISTS devices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      device_identifier TEXT NOT NULL COLLATE NOCASE UNIQUE,
      device_name TEXT NOT NULL,
      solution_type TEXT NOT NULL,
      registration_status TEXT NOT NULL,
      device_status TEXT NOT NULL,
      last_seen_utc TEXT,
      registration_error TEXT,
      created_at_utc TEXT NOT NULL,
      updated_at_utc TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_devices_registration_status 
      ON devices(registration_status);

    CREATE INDEX IF NOT EXISTS idx_devices_device_status 
      ON devices(device_status);
  `;

  db.exec(ddl);
}

module.exports = {
  initializeDeviceModel,
};
