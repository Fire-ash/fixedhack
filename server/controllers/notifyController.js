const pool = require('../config/db');
const senders = require('../lib/senders');

exports.notifyOpportunity = async (req, res) => {
  const oppId = req.params.id;
  const adminId = req.user && req.user.id;
  if (!oppId) return res.status(400).json({ message: 'Missing opportunity id' });
  try {
    const [users] = await pool.query('SELECT id, email FROM users WHERE is_verified = 1');
    const created = [];
    for (const u of users) {
      const {r} = await pool.query(
        'INSERT INTO notifications (user_id, opportunity_id, status, created_at) VALUES (?, ?, ?, NOW())',
        [u.id, oppId, 'pending']
      );
      console.log(`Notify stub: to=${u.email} notificationId=${r.insertId}`);
      await senders.sendEmailToUser(u.email, `New opportunity ${oppId}`, `See opportunity ${oppId}`);
      await pool.query('UPDATE notifications SET status = ? WHERE id = ?', ['sent', r.insertId]);
      created.push({ user: u.email, notificationId: r.insertId });
    }
    console.log(`Notify triggered by admin=${adminId} for opp=${oppId} count=${created.length}`);
    res.json({ message: 'Notifications enqueued', created });
  } catch (err) {
    console.error('notifyOpportunity error:', err && err.stack ? err.stack : err);
    res.status(500).json({ message: 'Server error' });
  }
};
