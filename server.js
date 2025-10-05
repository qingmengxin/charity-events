const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./event_db');

const app = express();
const PORT = 3000;

// 中间件配置
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// 1. 获取活动（修复：传递isUpcoming参数，与event_db.js匹配）
app.get('/api/events', (req, res) => {
  // 解析前端的upcoming参数（true/false），默认false（返回所有活动）
  const isUpcoming = req.query.upcoming === 'true';
  // 传递2个参数：筛选条件isUpcoming + 回调函数
  db.getEvents(isUpcoming, (err, events) => {
    if (err) {
      console.error('查询活动出错:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }
    res.json(events);
  });
});

// 2. 搜索活动（无需修改，参数匹配）
app.get('/api/search', (req, res) => {
  const filters = {
    date: req.query.date,
    city: req.query.city,
    category: req.query.category
  };

  db.searchEvents(filters, (err, results) => {
    if (err) {
      console.error('搜索出错:', err);
      return res.status(500).json({ error: '数据库搜索失败' });
    }
    res.json(results);
  });
});

// 3. 获取活动详情（无需修改，参数匹配）
app.get('/api/events/:id', (req, res) => {
  const eventId = req.params.id;

  db.getEventById(eventId, (err, event) => {
    if (err) {
      console.error('查询详情出错:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }
    if (!event) return res.status(404).json({ error: '未找到该活动' });
    res.json(event);
  });
});

// 启动服务
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});