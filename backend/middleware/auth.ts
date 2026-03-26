
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Organisation from '../models/Organisation.ts';

export const authMiddleware = (req: any, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'WhanauWellSecret2026');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ success: false, message: 'Invalid token.' });
  }
};

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
 * Also checks if the organisation is ACTIVE
 */
export const tenantMiddleware = async (req: any, res: Response, next: NextFunction) => {
  if (req.user && req.user.organisationId) {
    try {
      const org = await Organisation.findById(req.user.organisationId);
      
      if (!org) {
        console.warn(`Organisation not found for ID: ${req.user.organisationId}`);
        return res.status(404).json({ success: false, message: 'Organisation not found.' });
      }

      // Super Admins can always access
      if (req.user.role === 'SUPER_ADMIN') {
        req.tenantId = req.user.organisationId;
        return next();
      }

      req.tenantId = req.user.organisationId;
      req.isOrgRestricted = false;
      req.orgStatus = org.status;

      if (org.status === 'DELETED') {
        req.isOrgRestricted = true;
      } else if (org.status === 'BANNED') {
        req.isOrgRestricted = true;
      } else if (org.status === 'SUSPENDED') {
        const now = new Date();
        if (org.suspensionEnd && now < org.suspensionEnd) {
          req.isOrgRestricted = true;
        } else if (!org.suspensionEnd) {
          req.isOrgRestricted = true;
        }
      }

      next();
    } catch (error: any) {
      console.error('Tenant middleware error:', error);
      res.status(500).json({ success: false, message: 'Error verifying organisation status: ' + error.message });
    }
  } else {
    // If Super Admin has no org ID, that's fine for some routes, but tenantMiddleware expects it
    if (req.user && req.user.role === 'SUPER_ADMIN') {
      return next();
    }
    res.status(403).json({ success: false, message: 'No organisation context found.' });
  }
};
