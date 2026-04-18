const express = require('express');
const router = express.Router();

const { verifyToken, requireAdmin } = require('../middlewares/auth');

const {
  createEvent,
  getEvents,
  notifyEvent,
  getEventById,
  registerForEvent,
  unregisterForEvent,
  deleteEvent,
  viewEvent,
  getStudentRegistrations,
  getStudentViews
} = require('../controllers/eventsController');

// Public: all events
router.get('/events', getEvents);

// Public: single event
router.get('/events/:id', getEventById);

// Host/Admin: create event
router.post('/events', verifyToken, requireAdmin, createEvent);

// Host/Admin: delete event
router.delete('/events/:id', verifyToken, requireAdmin, deleteEvent);

// Host/Admin: trigger notifications
router.post('/events/:id/notify', verifyToken, requireAdmin, notifyEvent);

// Student: register / unregister
router.post('/events/:id/register', verifyToken, registerForEvent);
router.delete('/events/:id/register', verifyToken, unregisterForEvent);

// Student: record view
router.post('/events/:id/view', verifyToken, viewEvent);

// Student-specific dashboards
router.get('/student/registrations', verifyToken, getStudentRegistrations);
router.get('/student/views', verifyToken, getStudentViews);

module.exports = router;

