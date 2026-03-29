const express = require('express');
const cookieParser = require('cookie-parser');

const requireAuth = require('../middlewares/auth.middleware');
const requireAdmin = require('../middlewares/admin.middleware');
const { 
  getDashboard, 
  getUsers, 
  getEvents, 
  getReportsSummary, 
  getReports,
  getReportDetail,
  resolveReport,
  rejectReport,
  markReportUnderReview,
  getUserDetail,
  blockUser,
  unblockUser,
  deleteUser,
  getSettings,
  updateGeneralSettings,
  updateModerationSettings,
  updateNotificationSettings,
  getSystemStatus,
  clearCache,
  optimizeDatabase,
  downloadBackup
} = require('../controllers/admin.controller');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Administración
 *   description: Endpoints de administración (requieren permisos de admin)
 */

router.use(cookieParser());

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Obtener dashboard de administración
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del dashboard
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/dashboard', requireAuth, requireAdmin, getDashboard);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Listar todos los usuarios
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de usuarios
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/users', requireAuth, requireAdmin, getUsers);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   get:
 *     summary: Obtener detalles de un usuario
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles del usuario
 *       404:
 *         description: Usuario no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/users/:id', requireAuth, requireAdmin, getUserDetail);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   post:
 *     summary: Bloquear un usuario
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario bloqueado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autenticado o no autorizado
 */
router.post('/users/:id/block', requireAuth, requireAdmin, blockUser);

/**
 * @swagger
 * /api/admin/users/{id}/unblock:
 *   post:
 *     summary: Desbloquear un usuario
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario desbloqueado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autenticado o no autorizado
 */
router.post('/users/:id/unblock', requireAuth, requireAdmin, unblockUser);

/**
 * @swagger
 * /api/admin/users/{id}:
 *   delete:
 *     summary: Eliminar un usuario
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario eliminado exitosamente
 *       404:
 *         description: Usuario no encontrado
 *       403:
 *         description: No autenticado o no autorizado
 */
router.delete('/users/:id', requireAuth, requireAdmin, deleteUser);

/**
 * @swagger
 * /api/admin/events:
 *   get:
 *     summary: Listar todos los eventos
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de eventos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Event'
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/events', requireAuth, requireAdmin, getEvents);

/**
 * @swagger
 * /api/admin/reports/summary:
 *   get:
 *     summary: Obtener resumen de reportes
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resumen de reportes por categoría
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/reports/summary', requireAuth, requireAdmin, getReportsSummary);

/**
 * @swagger
 * /api/admin/reports:
 *   get:
 *     summary: Listar todos los reportes
 *     tags: [Administración]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filtrar por categoría (Contenido, Usuarios, Eventos)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de reportes
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/reports', requireAuth, requireAdmin, getReports);

/**
 * @swagger
 * /api/admin/reports/{id}:
 *   get:
 *     summary: Obtener detalles de un reporte
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del reporte
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Detalles del reporte
 *       404:
 *         description: Reporte no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.get('/reports/:id', requireAuth, requireAdmin, getReportDetail);

/**
 * @swagger
 * /api/admin/reports/{id}/resolve:
 *   post:
 *     summary: Resolver un reporte
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:\n *       required: true
 *       content:\n *         application/json:
/**
 * @swagger
 * /api/admin/reports/{id}/resolve:
 *   post:
 *     summary: Resolver un reporte
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               resolution:
 *                 type: string
 *               action:
 *                 type: string
 *                 enum: [none, ban]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte resuelto
 *       404:
 *         description: Reporte no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post('/reports/:id/resolve', requireAuth, requireAdmin, resolveReport);

/**
 * @swagger
 * /api/admin/reports/{id}/reject:
 *   post:
 *     summary: Rechazar un reporte
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte rechazado
 *       404:
 *         description: Reporte no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post('/reports/:id/reject', requireAuth, requireAdmin, rejectReport);

/**
 * @swagger
 * /api/admin/reports/{id}/review:
 *   post:
 *     summary: Marcar reporte como bajo revisión
 *     tags: [Administración]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Reporte marcado bajo revisión
 *       404:
 *         description: Reporte no encontrado
 *       401:
 *         description: No autenticado
 *       403:
 *         description: No autorizado
 */
router.post('/reports/:id/review', requireAuth, requireAdmin, markReportUnderReview);

/**
 * @swagger
 * /api/admin/settings:
 *   get:
 *     summary: Obtener configuración global
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Configuración global del sistema
 */
router.get('/settings', requireAuth, requireAdmin, getSettings);

/**
 * @swagger
 * /api/admin/settings/general:
 *   put:
 *     summary: Actualizar configuración general
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuración actualizada
 */
router.put('/settings/general', requireAuth, requireAdmin, updateGeneralSettings);

/**
 * @swagger
 * /api/admin/settings/moderation:
 *   put:
 *     summary: Actualizar políticas de moderación
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuración de moderación actualizada
 */
router.put('/settings/moderation', requireAuth, requireAdmin, updateModerationSettings);

/**
 * @swagger
 * /api/admin/settings/notifications:
 *   put:
 *     summary: Actualizar configuración de notificaciones
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Configuración de notificaciones actualizada
 */
router.put('/settings/notifications', requireAuth, requireAdmin, updateNotificationSettings);

/**
 * @swagger
 * /api/admin/system/status:
 *   get:
 *     summary: Obtener estado del sistema
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estado actual del sistema
 */
router.get('/system/status', requireAuth, requireAdmin, getSystemStatus);

/**
 * @swagger
 * /api/admin/system/cache:
 *   post:
 *     summary: Limpiar caché del sistema
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Caché limpiado
 */
router.post('/system/cache', requireAuth, requireAdmin, clearCache);

/**
 * @swagger
 * /api/admin/system/optimize:
 *   post:
 *     summary: Optimizar base de datos
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Base de datos optimizada
 */
router.post('/system/optimize', requireAuth, requireAdmin, optimizeDatabase);

/**
 * @swagger
 * /api/admin/backup:
 *   post:
 *     summary: Descargar respaldo de datos
 *     tags: [Administración]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Respaldo generado
 */
router.post('/backup', requireAuth, requireAdmin, downloadBackup);

module.exports = router;
