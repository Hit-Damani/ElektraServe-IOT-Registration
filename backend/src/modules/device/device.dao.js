const db = require('../../config/database');

function mapRow(row) {
  if (!row) return null;
  return {
    id: row.id,
    deviceIdentifier: row.device_identifier,
    deviceName: row.device_name,
    solutionType: row.solution_type,
    registrationStatus: row.registration_status,
    deviceStatus: row.device_status,
    lastSeenUtc: row.last_seen_utc,
    registrationError: row.registration_error,
    createdAtUtc: row.created_at_utc,
    updatedAtUtc: row.updated_at_utc,
  };
}

module.exports.findAll = (filters = {}) => {
  try {
    const conditions = [];
    const params = [];

    if (filters.q && filters.q.trim()) {
      const term = `%${filters.q.trim()}%`;
      conditions.push('(device_identifier LIKE ? OR device_name LIKE ?)');
      params.push(term, term);
    }

    if (filters.registrationStatus && filters.registrationStatus.trim()) {
      conditions.push('registration_status = ?');
      params.push(filters.registrationStatus.trim());
    }

    if (filters.deviceStatus && filters.deviceStatus.trim()) {
      conditions.push('device_status = ?');
      params.push(filters.deviceStatus.trim());
    }

    let sql = 'SELECT * FROM devices';
    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }
    sql += ' ORDER BY id ASC';

    const rows = db.prepare(sql).all(...params);
    return rows.map(mapRow);
  } catch (error) {
    throw error;
  }
};

module.exports.findById = (id) => {
  try {
    const row = db.prepare('SELECT * FROM devices WHERE id = ?').get(id);
    return mapRow(row);
  } catch (error) {
    throw error;
  }
};

module.exports.findByIdentifier = (identifier) => {
  try {
    const row = db
      .prepare('SELECT * FROM devices WHERE device_identifier = ? COLLATE NOCASE')
      .get(identifier.trim());
    return mapRow(row);
  } catch (error) {
    throw error;
  }
};

module.exports.create = (device) => {
  try {
    const stmt = db.prepare(`
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

    const result = stmt.run({
      deviceIdentifier: device.deviceIdentifier,
      deviceName: device.deviceName,
      solutionType: device.solutionType,
      registrationStatus: device.registrationStatus,
      deviceStatus: device.deviceStatus,
      lastSeenUtc: device.lastSeenUtc || null,
      registrationError: device.registrationError || null,
      createdAtUtc: device.createdAtUtc,
      updatedAtUtc: device.updatedAtUtc,
    });

    return module.exports.findById(result.lastInsertRowid);
  } catch (error) {
    throw error;
  }
};

module.exports.update = (id, updates) => {
  try {
    const setClauses = [];
    const params = [];

    const fieldMap = {
      deviceName: 'device_name',
      solutionType: 'solution_type',
      registrationStatus: 'registration_status',
      deviceStatus: 'device_status',
      lastSeenUtc: 'last_seen_utc',
      registrationError: 'registration_error',
      updatedAtUtc: 'updated_at_utc',
    };

    for (const [key, column] of Object.entries(fieldMap)) {
      if (updates[key] !== undefined) {
        setClauses.push(`${column} = ?`);
        params.push(updates[key]);
      }
    }

    if (setClauses.length === 0) {
      return module.exports.findById(id);
    }

    params.push(id);
    const sql = `UPDATE devices SET ${setClauses.join(', ')} WHERE id = ?`;
    db.prepare(sql).run(...params);

    return module.exports.findById(id);
  } catch (error) {
    throw error;
  }
};

module.exports.deleteById = (id) => {
  try {
    const result = db.prepare('DELETE FROM devices WHERE id = ?').run(id);
    return result.changes > 0;
  } catch (error) {
    throw error;
  }
};

module.exports.getSummaryCounts = () => {
  try {
    const sql = `
      SELECT
        COUNT(*) as total,
        COALESCE(SUM(CASE WHEN registration_status = 'Pending' THEN 1 ELSE 0 END), 0) as pending,
        COALESCE(SUM(CASE WHEN registration_status = 'Registered' THEN 1 ELSE 0 END), 0) as registered,
        COALESCE(SUM(CASE WHEN registration_status = 'Error' THEN 1 ELSE 0 END), 0) as error,
        COALESCE(SUM(CASE WHEN device_status = 'Online' THEN 1 ELSE 0 END), 0) as online,
        COALESCE(SUM(CASE WHEN device_status = 'Offline' THEN 1 ELSE 0 END), 0) as offline
      FROM devices
    `;

    const row = db.prepare(sql).get();
    return {
      total: Number(row.total) || 0,
      pending: Number(row.pending) || 0,
      registered: Number(row.registered) || 0,
      error: Number(row.error) || 0,
      online: Number(row.online) || 0,
      offline: Number(row.offline) || 0,
    };
  } catch (error) {
    throw error;
  }
};
