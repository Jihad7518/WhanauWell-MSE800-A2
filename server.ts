
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './backend/models/User.ts';
import Organisation from './backend/models/Organisation.ts';
import Programme from './backend/models/Programme.ts';
import StressRecord from './backend/models/StressRecord.ts';
import Broadcast from './backend/models/Broadcast.ts';
import SystemLog from './backend/models/SystemLog.ts';
import SupportTicket from './backend/models/SupportTicket.ts';
import GlobalSettings from './backend/models/GlobalSettings.ts';
import MembershipApplication from './backend/models/MembershipApplication.ts';
import OrganisationApplication from './backend/models/OrganisationApplication.ts';
import { StressService } from './backend/services/StressService.ts';
import { authMiddleware, tenantMiddleware, roleMiddleware } from './backend/middleware/auth.ts';

// Helper for System Logging
const logEvent = async (event: string, details: string, type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS' = 'INFO', organisationId?: any, userId?: any) => {
  try {
    await SystemLog.create({ event, details, type, organisationId, userId });
  } catch (err) {
    console.error('Logging failed:', err);
  }
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Database Connection
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://whanauwll-admin-jihad:whanauwellmse800@cluster0.zkswhn8.mongodb.net/whanauwell?retryWrites=true&w=majority';
  
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
    
    // Seed an initial organisation if none exists
    let masterOrg = await Organisation.findOne({ code: 'MASTER' });
    if (!masterOrg) {
      masterOrg = await Organisation.create({
        name: 'WhānauWell Global',
        code: 'MASTER'
      });
      console.log("Seeded MASTER organisation");
    }

    // Seed Super Admin
    const superAdmin = await User.findOne({ email: 'admin@whanauwell.org' });
    if (!superAdmin) {
      const passwordHash = await bcrypt.hash('WhanauWell2026!', 10);
      await User.create({
        name: 'System Administrator',
        email: 'admin@whanauwell.org',
        passwordHash,
        role: 'SUPER_ADMIN',
        organisationId: masterOrg._id
      });
      console.log("Seeded Super Admin: admin@whanauwell.org");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "WhānauWell API is running" });
  });

  // Public Routes
  app.get("/api/public/programmes", async (req, res) => {
    try {
      const programmes = await Programme.find({ visibility: 'PUBLIC' }).populate('organisationId', 'name');
      res.json({ success: true, data: programmes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/public/programmes/:id", async (req, res) => {
    try {
      const programme = await Programme.findById(req.params.id).populate('organisationId', 'name');
      if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
      
      if (programme.visibility !== 'PUBLIC') {
        return res.status(403).json({ success: false, message: 'Private programme' });
      }

      // Strip member-only details for public view
      const publicData = programme.toObject();
      delete publicData.memberDetails;
      
      res.json({ success: true, data: publicData });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/public/settings", async (req, res) => {
    try {
      const settings = await GlobalSettings.findOne() || { platformName: 'WhānauWell', allowPublicRegistration: true };
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/public/apply-org", async (req, res) => {
    try {
      const { name, contactName, email, reason } = req.body;
      const application = await OrganisationApplication.create({
        name,
        contactName,
        email,
        reason,
        status: 'PENDING'
      });
      await logEvent('ORG_APPLICATION_SUBMITTED', `New organisation application from ${name}`, 'INFO');
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/public/apply", async (req, res) => {
    try {
      const { name, email, organisationId, message } = req.body;
      const application = await MembershipApplication.create({
        name,
        email,
        organisationId,
        message,
        status: 'PENDING'
      });
      await logEvent('MEMBERSHIP_APPLIED', `New membership application from ${name} (${email})`, 'INFO', organisationId);
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Hub Admin Application Management
  app.get("/api/admin/applications", authMiddleware, roleMiddleware(['ORG_ADMIN']), async (req: any, res) => {
    try {
      const applications = await MembershipApplication.find({ organisationId: req.user.organisationId }).sort({ createdAt: -1 });
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/admin/applications/:id/approve", authMiddleware, roleMiddleware(['ORG_ADMIN']), async (req: any, res) => {
    try {
      const application = await MembershipApplication.findById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
      
      const organisation = await Organisation.findById(application.organisationId);
      if (!organisation) return res.status(404).json({ success: false, message: 'Organisation not found' });

      application.status = 'APPROVED';
      application.inviteCodeSent = organisation.code;
      await application.save();

      await logEvent('MEMBERSHIP_APPROVED', `Membership application for ${application.name} approved`, 'SUCCESS', organisation._id, req.user.id);
      
      res.json({ success: true, message: 'Application approved and code assigned', code: organisation.code });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Super Admin Routes
  app.get("/api/admin/org-applications", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const applications = await OrganisationApplication.find().sort({ createdAt: -1 });
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/admin/org-applications/:id", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const { status } = req.body;
      const application = await OrganisationApplication.findByIdAndUpdate(req.params.id, { status }, { new: true });
      await logEvent('ORG_APPLICATION_UPDATED', `Organisation application ${req.params.id} updated to ${status}`, 'INFO', null, req.user.id);
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/seed-data", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      // Create some sample organisations
      const orgs = [
        { name: 'Waitaha Health Hub', code: 'WAITAHA-2026' },
        { name: 'Te Tai Tokerau Wellness', code: 'TTT-WELL' },
        { name: 'Auckland Community Care', color: 'AKL-CARE' }
      ];

      for (const orgData of orgs) {
        await Organisation.findOneAndUpdate({ code: orgData.code }, orgData, { upsert: true });
      }

      const waitaha = await Organisation.findOne({ code: 'WAITAHA-2026' });
      const ttt = await Organisation.findOne({ code: 'TTT-WELL' });

      // Create sample programmes
      const sampleProgs = [
        {
          title: 'Yoga in the Park',
          publicSummary: 'Join us for a relaxing yoga session every Saturday morning at Hagley Park. Open to all levels.',
          memberDetails: 'Meeting point: North Hagley Park, near the band rotunda. Bring your own mat. Zoom backup link: https://zoom.us/j/yoga-park',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Hagley Park, Christchurch',
          category: 'Physical Health',
          organisationId: waitaha?._id,
          coordinatorId: req.user.id
        },
        {
          title: 'Mindfulness Workshop',
          publicSummary: 'A 4-week intensive workshop on mindfulness and stress reduction techniques.',
          memberDetails: 'Exclusive resources for members: [Mindfulness Guide PDF](https://example.com/guide). Weekly sessions on Tuesdays at 6 PM.',
          visibility: 'ORG_ONLY',
          startDate: new Date(),
          location: 'Online / Whānau Centre',
          category: 'Mental Health',
          organisationId: waitaha?._id,
          coordinatorId: req.user.id
        },
        {
          title: 'Healthy Cooking for Families',
          publicSummary: 'Learn how to cook nutritious and affordable meals for your whānau.',
          memberDetails: 'Recipe book and meal planner available in the members portal.',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Community Kitchen',
          category: 'Nutrition',
          organisationId: ttt?._id,
          coordinatorId: req.user.id
        }
      ];

      for (const progData of sampleProgs) {
        await Programme.findOneAndUpdate({ title: progData.title }, progData, { upsert: true });
      }

      await logEvent('DATA_SEEDED', 'Sample data seeded by Super Admin', 'SUCCESS', null, req.user.id);
      res.json({ success: true, message: 'Sample data seeded successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/organisations", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const organisations = await Organisation.find();
      const orgsWithStats = await Promise.all(organisations.map(async (org) => {
        const userCount = await User.countDocuments({ organisationId: org._id });
        const programmeCount = await Programme.countDocuments({ organisationId: org._id });
        return {
          ...org.toObject(),
          userCount,
          programmeCount
        };
      }));
      res.json({ success: true, data: orgsWithStats });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/users", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const users = await User.find().populate('organisationId', 'name code').select('-passwordHash');
      res.json({ success: true, data: users });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/programmes", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const programmes = await Programme.find()
        .populate('organisationId', 'name code')
        .populate('coordinatorId', 'name email');
      res.json({ success: true, data: programmes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/programmes", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const { title, publicSummary, memberDetails, visibility, startDate, location, category, targetOrganisationId } = req.body;
      
      const programme = await Programme.create({
        title,
        publicSummary,
        memberDetails,
        visibility: visibility || 'GLOBAL',
        startDate,
        location,
        category,
        organisationId: targetOrganisationId || req.user.organisationId,
        coordinatorId: req.user.id
      });
      await logEvent('PROGRAMME_CREATED', `New programme: ${title}`, 'SUCCESS', programme.organisationId, req.user.id);
      res.status(201).json({ success: true, data: programme });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/organisations", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const { name, code } = req.body;
      const existing = await Organisation.findOne({ code });
      if (existing) return res.status(400).json({ success: false, message: 'Organisation code already exists' });
      
      const organisation = await Organisation.create({ name, code });
      await logEvent('ORG_CREATED', `New organisation: ${name} (${code})`, 'SUCCESS', organisation._id);
      res.status(201).json({ success: true, data: organisation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/stats", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const totalUsers = await User.countDocuments();
      const totalOrgs = await Organisation.countDocuments();
      const totalProgrammes = await Programme.countDocuments();
      const totalAssessments = await StressRecord.countDocuments();
      
      res.json({
        success: true,
        data: { totalUsers, totalOrgs, totalProgrammes, totalAssessments }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/admin/broadcast", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const { message, type } = req.body;
      const broadcast = await Broadcast.create({
        message,
        type: type || 'ANNOUNCEMENT',
        authorId: req.user.id
      });
      await logEvent('BROADCAST_CREATED', `New global broadcast: ${message.substring(0, 30)}...`, 'SUCCESS', null, req.user.id);
      res.json({ success: true, data: broadcast });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/admin/broadcasts/:id", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const { message, type, isActive } = req.body;
      const broadcast = await Broadcast.findByIdAndUpdate(req.params.id, { message, type, isActive }, { new: true });
      await logEvent('BROADCAST_UPDATED', `Broadcast updated: ${message.substring(0, 30)}...`, 'INFO', null, req.user.id);
      res.json({ success: true, data: broadcast });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/logs", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(100).populate('userId', 'name email').populate('organisationId', 'name');
      res.json({ success: true, data: logs });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/admin/logs", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      await SystemLog.deleteMany({});
      await logEvent('LOGS_CLEARED', 'All system logs were cleared by Super Admin', 'WARNING', null, req.user.id);
      res.json({ success: true, message: 'Logs cleared' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/wellbeing-insights", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      // Aggregated stress data
      const insights = await StressRecord.aggregate([
        {
          $group: {
            _id: "$organisationId",
            avgStress: { $avg: "$score" },
            count: { $sum: 1 },
            maxStress: { $max: "$score" },
            minStress: { $min: "$score" }
          }
        },
        {
          $lookup: {
            from: "organisations",
            localField: "_id",
            foreignField: "_id",
            as: "org"
          }
        },
        { $unwind: "$org" }
      ]);
      res.json({ success: true, data: insights });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Support Ticket Routes
  app.get("/api/admin/tickets", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const tickets = await SupportTicket.find().sort({ createdAt: -1 }).populate('userId', 'name email').populate('organisationId', 'name');
      res.json({ success: true, data: tickets });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/admin/tickets/:id", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const { status, priority } = req.body;
      const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, { status, priority }, { new: true });
      await logEvent('TICKET_UPDATED', `Ticket ${req.params.id} updated to ${status}`, 'INFO', null, req.user.id);
      res.json({ success: true, data: ticket });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Global Settings Routes
  app.get("/api/admin/settings", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      let settings = await GlobalSettings.findOne();
      if (!settings) settings = await GlobalSettings.create({});
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/admin/settings", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const { platformName, maintenanceMode, allowPublicRegistration, defaultStressCheckInterval } = req.body;
      const settings = await GlobalSettings.findOneAndUpdate({}, { platformName, maintenanceMode, allowPublicRegistration, defaultStressCheckInterval }, { new: true, upsert: true });
      await logEvent('SETTINGS_UPDATED', `Global platform settings updated`, 'WARNING', null, req.user.id);
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // System Health Simulation
  app.get("/api/admin/health", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      // Simulated health metrics
      const health = {
        cpu: Math.floor(Math.random() * 40) + 10, // 10-50%
        memory: Math.floor(Math.random() * 30) + 20, // 20-50%
        uptime: process.uptime(),
        database: 'Connected',
        apiLatency: Math.floor(Math.random() * 100) + 50, // 50-150ms
        activeConnections: Math.floor(Math.random() * 50) + 10
      };
      res.json({ success: true, data: health });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/broadcasts", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const broadcasts = await Broadcast.find().sort({ createdAt: -1 });
      res.json({ success: true, data: broadcasts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/admin/broadcasts/:id", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      await Broadcast.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Broadcast deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/broadcasts", authMiddleware, async (req, res) => {
    try {
      const broadcasts = await Broadcast.find({ isActive: true }).sort({ createdAt: -1 }).limit(3);
      res.json({ success: true, data: broadcasts });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });
  app.get("/api/admin/audit-report", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const orgs = await Organisation.find();
      const users = await User.find().select('name email role createdAt');
      
      let csv = 'Type,Name,Identifier,Created At\n';
      orgs.forEach((o: any) => csv += `Organisation,${o.name},${o.code},${o.createdAt}\n`);
      users.forEach((u: any) => csv += `User,${u.name},${u.email},${u.createdAt}\n`);
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=whanauwell_audit_report.csv');
      res.status(200).send(csv);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, orgCode, adminCode } = req.body;
    
    try {
      const settings = await GlobalSettings.findOne() || { allowPublicRegistration: true };
      
      // 1. Validate invite code or check public registration
      let organisation;
      if (orgCode) {
        organisation = await Organisation.findOne({ code: orgCode });
        if (!organisation) {
          return res.status(400).json({ success: false, message: 'Invalid organisation invite code.' });
        }
      } else if (settings.allowPublicRegistration) {
        organisation = await Organisation.findOne({ code: 'MASTER' });
        if (!organisation) {
          organisation = await Organisation.create({ name: 'WhānauWell Global', code: 'MASTER' });
        }
      } else {
        return res.status(400).json({ success: false, message: 'Invite code is required for registration.' });
      }

      // 2. Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      // 3. Determine role
      let role = 'MEMBER';
      const adminSecret = process.env.ADMIN_SECRET_CODE || 'WhanauAdmin2024';
      if (adminCode && adminCode === adminSecret) {
        role = 'ORG_ADMIN';
      }

      // 4. Create user
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role,
        organisationId: organisation._id
      });
      await logEvent('USER_REGISTERED', `${name} joined ${organisation.name}`, 'SUCCESS', organisation._id, user._id);
      res.status(201).json({ success: true, message: `Registration successful as ${role.replace('_', ' ')}. Please login.` });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password, orgCode } = req.body;
    
    try {
      const user = await User.findOne({ email }).populate('organisationId');
      if (!user) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Invalid credentials.' });
      }

      const org = user.organisationId as any;
      if (orgCode && org.code !== orgCode) {
        return res.status(401).json({ success: false, message: 'Invalid organisation code for this user.' });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role, organisationId: org._id },
        process.env.JWT_SECRET || 'WhanauWellSecret2026',
        { expiresIn: process.env.TOKEN_EXPIRE || '1d' }
      );

      res.json({
        success: true,
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          organisationId: org._id
        },
        organisation: {
          id: org._id,
          name: org.name,
          code: org.code
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Profile Routes
  app.get("/api/me", authMiddleware, async (req: any, res) => {
    try {
      const user = await User.findById(req.user.id).select('-passwordHash').populate('organisationId');
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.patch("/api/me", authMiddleware, async (req: any, res) => {
    const { name, email, password } = req.body;
    try {
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (password) updates.passwordHash = await bcrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Programme Routes
  app.get("/api/programmes", authMiddleware, tenantMiddleware, async (req: any, res) => {
    try {
      const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
      
      const query = isSuperAdmin ? {} : {
        $or: [
          { organisationId: req.tenantId },
          { visibility: 'PUBLIC' }
        ]
      };

      const programmes = await Programme.find(query).populate('coordinatorId', 'name').populate('organisationId', 'name');
      res.json({ success: true, data: programmes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/programmes/:id", authMiddleware, async (req: any, res) => {
    try {
      const programme = await Programme.findById(req.params.id).populate('coordinatorId', 'name').populate('organisationId', 'name');
      if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
      
      const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
      const isSameOrg = programme.organisationId?._id?.toString() === req.user.organisationId?.toString();
      const isPublic = programme.visibility === 'PUBLIC';

      if (!isSameOrg && !isPublic && !isSuperAdmin) {
        return res.status(403).json({ success: false, message: 'Access denied' });
      }

      res.json({ success: true, data: programme });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/programmes", authMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR']), tenantMiddleware, async (req: any, res) => {
    try {
      const { title, publicSummary, memberDetails, visibility, startDate, location, category } = req.body;
      const programme = await Programme.create({
        title,
        publicSummary,
        memberDetails,
        visibility: visibility || 'ORG_ONLY',
        startDate,
        location,
        category,
        organisationId: req.tenantId,
        coordinatorId: req.user.id
      });
      res.status(201).json({ success: true, data: programme });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/programmes/:id/join", authMiddleware, async (req: any, res) => {
    try {
      const programme = await Programme.findById(req.params.id);
      if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
      
      if (programme.participants.some(p => p.toString() === req.user.id)) {
        return res.status(400).json({ success: false, message: 'Already enrolled' });
      }

      programme.participants.push(new mongoose.Types.ObjectId(req.user.id) as any);
      await programme.save();
      res.json({ success: true, data: programme });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/programmes/:id/leave", authMiddleware, async (req: any, res) => {
    try {
      const programme = await Programme.findById(req.params.id);
      if (!programme) return res.status(404).json({ success: false, message: 'Programme not found' });
      
      programme.participants = programme.participants.filter(p => p.toString() !== req.user.id);
      await programme.save();
      res.json({ success: true, data: programme });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/programmes/:id", authMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR']), async (req: any, res) => {
    try {
      await Programme.findByIdAndDelete(req.params.id);
      res.json({ success: true, message: 'Programme deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Stress Assessment Routes
  app.get("/api/stress/questions", (req, res) => {
    res.json({ success: true, data: StressService.questions });
  });

  app.post("/api/stress/assess", authMiddleware, tenantMiddleware, async (req: any, res) => {
    const { responses, consentGiven } = req.body;
    if (!consentGiven) return res.status(400).json({ success: false, message: 'Consent required' });

    try {
      const result = StressService.calculateStress(responses);
      const record = await StressRecord.create({
        userId: req.user.id,
        organisationId: req.tenantId,
        responses,
        score: result.score,
        classification: result.classification,
        explanation: result.explanation,
        consentGiven
      });

      res.json({
        success: true,
        data: {
          ...result,
          id: record._id
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Members Routes
  app.get("/api/members", authMiddleware, tenantMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR']), async (req: any, res) => {
    try {
      const members = await User.find({ organisationId: req.tenantId }).select('-passwordHash');
      res.json({ success: true, data: members });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", authMiddleware, tenantMiddleware, async (req: any, res) => {
    try {
      const programmesCount = await Programme.countDocuments({ organisationId: req.tenantId });
      const membersCount = await User.countDocuments({ organisationId: req.tenantId });
      const stressRecords = await StressRecord.find({ organisationId: req.tenantId });
      const stressStats = StressService.getAggregatedStats(stressRecords);

      // Recent activities
      const recentProgrammes = await Programme.find({ organisationId: req.tenantId }).sort({ createdAt: -1 }).limit(3);
      const recentStress = await StressRecord.find({ organisationId: req.tenantId }).sort({ createdAt: -1 }).limit(3).populate('userId', 'name');

      // Participation trends (last 4 weeks)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      
      const weeklyParticipation = await StressRecord.aggregate([
        { 
          $match: { 
            organisationId: new mongoose.Types.ObjectId(req.tenantId), 
            createdAt: { $gte: fourWeeksAgo } 
          } 
        },
        {
          $group: {
            _id: { $week: "$createdAt" },
            count: { $sum: 1 },
            date: { $first: "$createdAt" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      const participationTrend = weeklyParticipation.map(w => ({
        week: `Week ${w._id}`,
        count: w.count,
        date: w.date
      }));

      res.json({
        success: true,
        data: {
          programmesCount,
          membersCount,
          stressStats,
          participationTrend,
          recentActivities: [
            ...recentProgrammes.map(p => ({ type: 'programme', title: p.title, date: p.createdAt })),
            ...recentStress.map(s => ({ type: 'stress', title: `Check-in by ${(s.userId as any).name}`, date: s.createdAt }))
          ].sort((a: any, b: any) => b.date.getTime() - a.date.getTime()).slice(0, 5)
        }
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
