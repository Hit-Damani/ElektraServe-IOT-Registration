const db = require('../config/database');
const { RegistrationStatus, DeviceStatus, SolutionType } = require('../modules/device/device.constants');

function seedDevices(force = false) {
  const countRow = db.prepare('SELECT COUNT(*) as count FROM devices').get();

  if (countRow.count > 0 && !force) {
    return false;
  }

  if (force) {
    db.prepare('DELETE FROM devices').run();
    try {
      db.prepare("DELETE FROM sqlite_sequence WHERE name = 'devices'").run();
    } catch {
      // sqlite_sequence table may not exist yet
    }
  }

  const now = new Date();
  const recentUtc = new Date(now.getTime() - 15 * 60 * 1000).toISOString();
  const olderUtc = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const createdUtc = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  const demoDevices = [
    {
      deviceIdentifier: 'DEMO-1001',
      deviceName: 'Rooftop Solar 01',
      solutionType: SolutionType.SOLAR,
      registrationStatus: RegistrationStatus.REGISTERED,
      deviceStatus: DeviceStatus.ONLINE,
      lastSeenUtc: recentUtc,
      registrationError: null,
      createdAtUtc: createdUtc,
      updatedAtUtc: recentUtc,
    },
    {
      deviceIdentifier: 'DEMO-1002',
      deviceName: 'Pump Starter 02',
      solutionType: SolutionType.PUMP,
      registrationStatus: RegistrationStatus.PENDING,
      deviceStatus: DeviceStatus.OFFLINE,
      lastSeenUtc: null,
      registrationError: null,
      createdAtUtc: createdUtc,
      updatedAtUtc: createdUtc,
    },
    {
      deviceIdentifier: 'DEMO-1003',
      deviceName: 'AC Panel 03',
      solutionType: SolutionType.AC,
      registrationStatus: RegistrationStatus.ERROR,
      deviceStatus: DeviceStatus.OFFLINE,
      lastSeenUtc: null,
      registrationError: 'Connection timeout during handshake',
      createdAtUtc: createdUtc,
      updatedAtUtc: createdUtc,
    },
    {
      deviceIdentifier: 'DEMO-1004',
      deviceName: 'Solar Meter 04',
      solutionType: SolutionType.SOLAR,
      registrationStatus: RegistrationStatus.REGISTERED,
      deviceStatus: DeviceStatus.OFFLINE,
      lastSeenUtc: olderUtc,
      registrationError: null,
      createdAtUtc: createdUtc,
      updatedAtUtc: olderUtc,
    },
    {
      deviceIdentifier: 'DEMO-1005',
      deviceName: 'Compressor 05',
      solutionType: SolutionType.COMPRESSOR,
      registrationStatus: RegistrationStatus.PENDING,
      deviceStatus: DeviceStatus.OFFLINE,
      lastSeenUtc: null,
      registrationError: null,
      createdAtUtc: createdUtc,
      updatedAtUtc: createdUtc,
    },
    {
      deviceIdentifier: 'DEMO-1006',
      deviceName: 'LTDB Panel 06',
      solutionType: SolutionType.LTDB,
      registrationStatus: RegistrationStatus.REGISTERED,
      deviceStatus: DeviceStatus.ONLINE,
      lastSeenUtc: recentUtc,
      registrationError: null,
      createdAtUtc: createdUtc,
      updatedAtUtc: recentUtc,
    },
  ];

  const insertStmt = db.prepare(`
    INSERT INTO devices (
      device_identifier,
      device_name,
      solution_type,
      registration_status,
      device_status,
      last_seen_utc,
      registration_error,
      created_at_utc,
      updated_at_utc
    ) VALUES (
      @deviceIdentifier,
      @deviceName,
      @solutionType,
      @registrationStatus,
      @deviceStatus,
      @lastSeenUtc,
      @registrationError,
      @createdAtUtc,
      @updatedAtUtc
    )
  `);

  db.exec('BEGIN TRANSACTION;');
  try {
    for (const device of demoDevices) {
      insertStmt.run(device);
    }
    db.exec('COMMIT;');
  } catch (err) {
    db.exec('ROLLBACK;');
    throw err;
  }

  return true;
}

module.exports = {
  seedDevices,
};
