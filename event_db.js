const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'l13930084448',  
  database: 'charityevents_db'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.stack);
    return;
  }
  console.log('✅ 数据库连接成功，ID:', connection.threadId);
});

exports.getEvents = (isUpcoming, callback) => {
  let sql = `
    SELECT 
      e.event_id,
      e.name,
      e.start_datetime,
      e.end_datetime,
      e.location,
      e.city,
      e.status,
      CAST(e.ticket_price AS DECIMAL(10,2)) AS ticket_price,
      e.short_description,
      e.image_url,
      c.name AS category,
      o.name AS organisation
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.org_id = o.org_id
  `;
  const params = [];

  if (isUpcoming) {
    sql += ' WHERE e.start_datetime > NOW()';
  }
  sql += ' ORDER BY e.start_datetime ASC';

  connection.query(sql, params, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

exports.getEventById = (eventId, callback) => {
  const sql = `
    SELECT 
      e.event_id,
      e.name,
      e.start_datetime,
      e.end_datetime,
      e.location,
      e.city,
      e.status,
      CAST(e.ticket_price AS DECIMAL(10,2)) AS ticket_price,
      CAST(e.goal_amount AS DECIMAL(12,2)) AS goal_amount,
      CAST(e.raised_amount AS DECIMAL(12,2)) AS raised_amount,
      e.short_description,
      e.full_description,
      e.image_url,
      c.name AS category,
      o.name AS organisation,
      o.contact_email,
      o.contact_phone
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    JOIN organisations o ON e.org_id = o.org_id
    WHERE e.event_id = ?
  `;

  connection.query(sql, [eventId], (err, results) => {
    if (err) return callback(err, null);
    callback(null, results[0] || null);
  });
};

exports.searchEvents = (filters, callback) => {
  let sql = `
    SELECT 
      e.event_id,
      e.name,
      e.start_datetime,
      e.location,
      e.city,
      e.status,
      CAST(e.ticket_price AS DECIMAL(10,2)) AS ticket_price,
      c.name AS category
    FROM events e
    JOIN categories c ON e.category_id = c.category_id
    WHERE 1=1
  `;
  const params = [];

  if (filters.date) {
    sql += ' AND DATE(e.start_datetime) = ?';
    params.push(filters.date);
  }
  if (filters.city) {
    sql += ' AND e.city = ?';
    params.push(filters.city);
  }
  if (filters.category) {
    sql += ' AND c.name = ?';
    params.push(filters.category);
  }

  sql += ' ORDER BY e.start_datetime ASC';
  connection.query(sql, params, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};