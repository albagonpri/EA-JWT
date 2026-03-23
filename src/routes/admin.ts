import express from 'express';
import { authenticateToken } from '../middleware/auth';
import { authorizeRoles } from '../middleware/roles';

const router = express.Router();

/**
 * @openapi
 * /admin/panel:
 *   get:
 *     summary: Recurso solo para administradores
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Acceso permitido
 *       401:
 *         description: No autenticado
 *       403:
 *         description: Prohibido
 */
router.get('/panel', authenticateToken, authorizeRoles('admin'), (req, res) => {
  return res.status(200).json({
    message: 'Bienvenido al panel de administración',
    secretData: {
      totalUsuariosVisible: true,
      gestionRolesVisible: true,
      auditoriaVisible: true
    }
  });
});

export default router;