const pool = require('../config/db');

// Helper: convert DB row -> frontend event object
function mapEventRow(row) {
    // Format tags: DB stores string "AI;ML,Python" -> ['AI','ML','Python']
    const tagsArray = row.tags
        ? row.tags
            .split(/[;,]/)
            .map(t => t.trim())
            .filter(Boolean)
        : [];

    // Date text: prefer date_text, else build from start/end
    let niceDate = row.date_text;
    if (!niceDate && row.start_date && row.end_date) {
        const start = row.start_date.toISOString().slice(0, 10);
        const end = row.end_date.toISOString().slice(0, 10);
        niceDate = `${start} → ${end}`;
    }

    // Status fallback
    const status = row.status || 'upcoming';

    return {
        id: row.id,
        type: row.type,
        title: row.title,
        organizer: row.organizer || 'FixedHack Host',
        date: niceDate || 'Date TBA',
        status,
        location: row.location || 'Online',
        duration: row.duration || 'N/A',
        prize: row.prize || 'N/A',
        participants: row.participants || 'N/A',
        description: row.description_short || row.description_full || '',
        tags: tagsArray,
        registrations: row.registrations || 0,
        views: row.views || 0,
        // keep raw fields too (useful later)
        apply_link: row.apply_link,
        created_by: row.created_by,
        created_at: row.created_at,
        updated_at: row.updated_at,
        start_date: row.start_date,
        end_date: row.end_date,
        date_text: row.date_text
    };
}

// GET /api/events  – public list for site & host dashboard
exports.getEvents = async (req, res) => {
    try {
        const [rows] = await pool.query(
            'SELECT * FROM events ORDER BY created_at DESC'
        );

        const events = rows.map(mapEventRow);
        return res.json(events);
    } catch (err) {
        console.error('[GET /events][ERR]', err);
        return res.status(500).json({ message: 'Server error fetching events' });
    }
};

// GET /api/events/:id – single event (for details page / registrations)
exports.getEventById = async (req, res) => {
    const { id } = req.params;

    try {
        const {rows} = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Event not found' });
        }

        return res.json(mapEventRow(rows[0]));
    } catch (err) {
        console.error('[GET /events/:id][ERR]', err);
        return res.status(500).json({ message: 'Server error fetching event' });
    }
};

// POST /api/events – host/admin creates an event
// Requires auth middleware to set req.user (host/admin)
exports.createEvent = async (req, res) => {
    const user = req.user || {};
    const createdBy = user.id || null; // if auth present

    try {
        const {
            title,
            type,
            // frontend-specific:
            date_text,
            location,
            duration,
            prize,
            participants,
            status,
            apply_link,
            description_full,
            description_short,
            tags
        } = req.body;

        if (!title || !type || !apply_link) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const fullDesc = description_full || description_short || '';
        const shortDesc =
            description_short || fullDesc.substring(0, 200);

        const participantsText =
            participants || 'N/A';

        const [result] = await pool.query(
            `
            INSERT INTO events
            (title, description_full, description_short,
             start_date, end_date,
             type, apply_link, organizer, tags,
             created_by,
             location, duration, prize, participants,
             views, registrations, date_text, status)
            VALUES
            (?, ?, ?,
             NULL, NULL,
             ?, ?, ?, ?,
             ?,
             ?, ?, ?, ?,
             0, 0, ?, ?)
            `,
            [
                title,
                fullDesc,
                shortDesc,
                type,
                apply_link,
                // organizer: simple label; can change later
                user.organization || user.name || user.email || 'FixedHack Host',
                tags || '',
                createdBy,
                location || 'Online',
                duration || 'N/A',
                prize || 'N/A',
                participantsText,
                date_text || null,
                status || 'upcoming'
            ]
        );

        const newId = result.insertId;

        const {rows} = await pool.query('SELECT * FROM events WHERE id = ?', [
            newId
        ]);

        const saved = mapEventRow(rows[0]);

        return res.status(201).json({
            message: 'Event created',
            event: saved
        });
    } catch (err) {
        console.error('[POST /events][ERR]', err);
        return res.status(500).json({ message: 'Server error creating event' });
    }
};

// POST /api/events/:id/register – student registers
exports.registerForEvent = async (req, res) => {
    const eventId = req.params.id;
    const userId = req.user && req.user.id;

    if (!userId) {
        return res.status(401).json({ message: 'Not authenticated' });
    }

    try {
        // Try to create registration
        const [regResult] = await pool.query(
            'INSERT INTO event_registrations (event_id, user_id) VALUES (?, ?)',
            [eventId, userId]
        );

        // Increment event registrations counter
        await pool.query(
            'UPDATE events SET registrations = registrations + 1 WHERE id = ?',
            [eventId]
        );

        console.log(`[REGISTER] user ${userId} -> event ${eventId}`);

        return res.json({ message: 'Registered for event' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res
                .status(400)
                .json({ message: 'You are already registered for this event' });
        }
        console.error('[POST /events/:id/register][ERR]', err);
        return res
            .status(500)
            .json({ message: 'Server error registering for event' });
    }
};


// POST /api/events/:id/notify – stub for notifications
exports.notifyEvent = async (req, res) => {
    const { id } = req.params;
    console.log(`[NOTIFY] Would send email/SMS for event id=${id}`);
    // later you can integrate nodemailer / SMS here
    return res.json({ message: 'Notification triggered (demo only)' });
};

exports.deleteEvent = async (req, res) => {
    try {
        const id = req.params.id;

        const [result] = await pool.query(
            "DELETE FROM events WHERE id = ?",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ message: "Event deleted" });

    } catch (err) {
        console.error("[DELETE EVENT ERR]", err);
        res.status(500).json({ message: "Server error deleting event" });
    }
};

// POST /api/events/:id/view – record that student viewed an event
exports.viewEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user && req.user.id;

        if (!userId) {
            return res.status(401).json({ message: 'Not authenticated' });
        }

        // Upsert row into event_views
        await pool.query(
            `
            INSERT INTO event_views (event_id, user_id)
            VALUES (?, ?)
            ON DUPLICATE KEY UPDATE viewed_at = CURRENT_TIMESTAMP
            `,
            [eventId, userId]
        );

        // (Simple version) increment global views
        await pool.query(
            'UPDATE events SET views = views + 1 WHERE id = ?',
            [eventId]
        );

        console.log(`[VIEW] user ${userId} viewed event ${eventId}`);

        res.json({ message: 'View recorded' });
    } catch (err) {
        console.error('[POST /events/:id/view][ERR]', err);
        res
            .status(500)
            .json({ message: 'Server error recording view' });
    }
};


// DELETE /api/events/:id/register – student unregisters
exports.unregisterForEvent = async (req, res) => {
    try {
        const eventId = req.params.id;
        const userId = req.user.id;

        // Delete registration row
        const [result] = await pool.query(
            'DELETE FROM event_registrations WHERE event_id = ? AND user_id = ?',
            [eventId, userId]
        );

        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ message: 'You are not registered for this event' });
        }

        // Decrement registrations count
        await pool.query(
            'UPDATE events SET registrations = registrations - 1 WHERE id = ?',
            [eventId]
        );

        console.log(`[UNREGISTER] user ${userId} removed from event ${eventId}`);

        res.json({ message: 'Unregistered successfully' });
    } catch (err) {
        console.error('[UNREGISTER][ERR]', err);
        res
            .status(500)
            .json({ message: 'Server error during unregistration' });
    }
};

// GET /api/student/registrations – events current student has registered for
exports.getStudentRegistrations = async (req, res) => {
    try {
        const userId = req.user.id;

        const {rows} = await pool.query(
            `
            SELECT e.*
            FROM events e
            INNER JOIN event_registrations r ON r.event_id = e.id
            WHERE r.user_id = ?
            ORDER BY r.registered_at DESC
            `,
            [userId]
        );

        const events = rows.map(mapEventRow);
        res.json(events);
    } catch (err) {
        console.error('[GET /student/registrations][ERR]', err);
        res
            .status(500)
            .json({ message: 'Server error fetching registered events' });
    }
};

// GET /api/student/views – events current student has viewed
exports.getStudentViews = async (req, res) => {
    try {
        const userId = req.user.id;

        const {rows} = await pool.query(
            `
            SELECT e.*
            FROM events e
            INNER JOIN event_views v ON v.event_id = e.id
            WHERE v.user_id = ?
            ORDER BY v.viewed_at DESC
            `,
            [userId]
        );

        const events = rows.map(mapEventRow);
        res.json(events);
    } catch (err) {
        console.error('[GET /student/views][ERR]', err);
        res
            .status(500)
            .json({ message: 'Server error fetching viewed events' });
    }
};
