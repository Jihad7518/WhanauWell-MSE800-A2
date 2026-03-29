
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Authentication Middleware
export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

// Role-Based Access Control Middleware
export const roleMiddleware = (roles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Permission denied. Insufficient privileges.' 
      });
    }
    next();
  };
};

/**
 * Tenant Isolation Middleware
 * Ensures queries are locked to the user's organisationId
 */
export const tenantMiddleware = (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.organisationId) {
    req.tenantId = req.user.organisationId;
    next();
  } else {
    res.status(403).json({ success: false, message: 'No organisation context found.' });
  }
};
