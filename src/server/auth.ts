/**
 * Authentication and RBAC Middleware
 * Handles JWT signing, token verification, and role-based route protection.
 */
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRole } from './db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'sms_super_secret_jwt_key_school_mgmt_portal';

export interface AuthUserPayload {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthUserPayload;
}

/**
 * Generate signed JWT token
 */
export function generateToken(payload: AuthUserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

/**
 * Middleware: Verify JWT Bearer Token
 */
export function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({
      error: 'Unauthorized',
      message: 'Access token is missing or malformed. Please log in.',
    });
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid or expired token. Please log in again.',
      });
      return;
    }
    req.user = decoded as AuthUserPayload;
    next();
  });
}

/**
 * Middleware: Enforce Role-Based Access Control (RBAC)
 * Returns standard 403 Forbidden error if role mismatch.
 */
export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Access denied. Your role '${req.user.role}' is not authorized to access this resource. Required role(s): [${allowedRoles.join(', ')}].`,
      });
      return;
    }

    next();
  };
}
