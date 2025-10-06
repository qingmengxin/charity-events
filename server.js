const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./event_db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/events', (req, res) => {
  const isUpcoming = req.query.upcoming === 'true';
  db.getEvents(isUpcoming, (err, events) => {
    if (err) {
      console.error('查询活动出错:', err);
      return res.status(500).json({ error: '数据库查询失败' });
    }
    res.json(events);
  });
});

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

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});