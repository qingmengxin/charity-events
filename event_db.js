const mysql = require('mysql2');

// 数据库配置（替换为你的本地信息）
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'l13930084448',  // 你的MySQL密码
  database: 'charityevents_db'
});

// 连接数据库
connection.connect((err) => {
  if (err) {
    console.error('❌ 数据库连接失败:', err.stack);
    return;
  }
  console.log('✅ 数据库连接成功，ID:', connection.threadId);
});

// 1. 获取活动（接收2个参数：isUpcoming筛选条件 + callback回调）
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

  // 若筛选“即将到来”的活动，添加时间条件
  if (isUpcoming) {
    sql += ' WHERE e.start_datetime > NOW()';
  }
  // 按开始时间升序排序
  sql += ' ORDER BY e.start_datetime ASC';

  connection.query(sql, params, (err, results) => {
    if (err) return callback(err, null);
    callback(null, results);
  });
};

// 2. 获取活动详情（接收2个参数：eventId + callback）
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

// 3. 搜索活动（接收2个参数：filters + callback）
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

  // 动态拼接筛选条件
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