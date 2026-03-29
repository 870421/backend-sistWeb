const User = require('../models/User');
const Event = require('../models/Event');

async function getDashboard(req, res) {
  try {
    const [totalUsers, activeEvents, blockedUsers, totalEvents] = await Promise.all([
      User.countDocuments(),
      Event.countDocuments({ status: 'active' }),
      User.countDocuments({ isBlocked: true }),
      Event.countDocuments()
    ]);

    const upcomingEventsRaw = await Event.find({
      startDate: { $ne: null, $gte: new Date() }
    })
      .sort({ startDate: 1 })
      .limit(5)
      .select('title startDate status');

    const upcomingEvents = upcomingEventsRaw.map((event) => ({
      id: event._id,
      name: event.title,
      date: event.startDate,
      status: event.status,
      enrolled: 0
    }));

    return res.status(200).json({
      stats: {
        totalUsers,
        activeEvents,
        pendingModeration: blockedUsers,
        totalRegistrations: totalEvents
      },
      upcomingEvents
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener dashboard de admin' });
  }
}

async function getUsers(req, res) {
  try {
    const users = await User.find()
      .sort({ createdAt: -1 })
      .select('name email role isBlocked createdAt');

    const mappedUsers = users.map((user) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
      createdAt: user.createdAt
    }));

    return res.status(200).json({ users: mappedUsers });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener usuarios de admin' });
  }
}

async function getEvents(req, res) {
  try {
    const events = await Event.find()
      .sort({ startDate: -1 })
      .select('title description category startDate status enrolled');

    const mappedEvents = events.map((event) => ({
      id: event._id,
      name: event.title,
      description: event.description,
      category: event.category || 'General',
      date: event.startDate,
      status: event.status === 'active' ? 'active' : 'pending',
      enrolled: event.enrolled || 0
    }));

    return res.status(200).json({ events: mappedEvents });
  } catch (error) {
    return res.status(500).json({ message: 'Error al obtener eventos de admin' });
  }
}

module.exports = {
  getDashboard,
  getUsers,
  getEvents
};
