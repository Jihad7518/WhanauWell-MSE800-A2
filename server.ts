
import express from "express";
import path from "path";
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

  let masterOrg: any = null;
  let superAdminId: any = null;

  const seedPlatformData = async () => {
    try {
      // Refresh masterOrg and superAdminId if needed
      masterOrg = await Organisation.findOne({ code: 'MASTER' });
      const masterOrgData = { 
        name: 'WhānauWell Global', 
        code: 'MASTER',
        description: 'WhānauWell Global is the central hub for the WhānauWell platform, providing oversight and support for all community hubs.',
        mission: 'To provide the digital infrastructure for community wellbeing across the globe.',
        history: 'WhānauWell was born out of a need for ethical, culturally appropriate wellbeing tools for indigenous and local communities.',
        trackRecord: 'Powering over 50 community hubs and supporting 10,000+ whānau members.',
        foundedAt: new Date('2023-01-01')
      };

      if (!masterOrg) {
        masterOrg = await Organisation.create(masterOrgData);
      } else {
        // Always ensure the name and other details are correct for the master org
        await Organisation.updateOne({ _id: masterOrg._id }, { $set: masterOrgData });
        masterOrg = await Organisation.findById(masterOrg._id);
      }

      let superAdmin = await User.findOne({ email: 'admin@whanauwell.org' });
      if (!superAdmin) {
        const passwordHash = await bcrypt.hash('WhanauWell2026!', 10);
        superAdmin = await User.create({
          name: 'System Administrator',
          email: 'admin@whanauwell.org',
          passwordHash,
          role: 'SUPER_ADMIN',
          organisationId: masterOrg._id
        });
      }
      superAdminId = superAdmin._id;

      // 1. Ensure Organisations exist and are updated
      const orgData = [
        { 
          name: 'Waitaha Health Hub', 
          code: 'WAITAHA-2026',
          description: 'Waitaha Health Hub is a community-led initiative dedicated to improving the wellbeing of whānau in the Canterbury region through holistic care and digital innovation.',
          mission: 'To empower whānau through accessible health services, community-driven support, and ethical data sovereignty.',
          history: 'Founded in 2020 by a group of local health practitioners and Māori community leaders, Waitaha Health Hub has grown to support over 2,000 members across the Canterbury region.',
          trackRecord: 'Successfully launched 15 community programmes, reduced local stress scores by 15% in 2025, and established a network of 50+ local health volunteers.',
          foundedAt: new Date('2020-01-01'),
          logo: 'https://images.unsplash.com/photo-1505751172107-5739a00723b5?auto=format&fit=crop&q=80&w=200&h=200'
        },
        { 
          name: 'Te Tai Tokerau Wellness', 
          code: 'TTT-WELL',
          description: 'Providing essential wellness services to the Northland community with a focus on Māori health outcomes and traditional healing practices.',
          mission: 'To provide accessible, culturally appropriate wellness services for all whānau in Te Tai Tokerau, grounded in Tikanga Māori.',
          history: 'Started as a small mobile clinic in 2021, we have expanded into a full-service wellness hub serving the entire Northland region with both digital and physical support.',
          trackRecord: 'Over 5,000 health checks performed, 50+ community workshops held, and recognised as a leading provider of rural health services in the North Island.',
          foundedAt: new Date('2021-03-15'),
          logo: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=200&h=200'
        },
        { 
          name: 'Auckland Community Care', 
          code: 'AKL-COMM',
          description: 'Auckland Community Care focuses on urban wellbeing, social support, and mental health for diverse communities in the greater Auckland region.',
          mission: 'Building stronger, healthier urban communities through connection, care, and innovative social support systems.',
          history: 'Established in 2018 to address the growing need for social support in Auckland\'s rapidly changing urban landscape, focusing on youth and migrant communities.',
          trackRecord: 'Recognised as a leading community provider with a 95% member satisfaction rate and over 10,000 successful community interventions.',
          foundedAt: new Date('2018-06-20'),
          logo: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&q=80&w=200&h=200'
        },
        { 
          name: 'Hutt Valley Whānau Trust', 
          code: 'HUTT-TRUST',
          description: 'The Hutt Valley Whānau Trust is committed to supporting families through education, health, and social services, bridging the gap between generations.',
          mission: 'Supporting whānau to thrive through integrated community services and lifelong learning opportunities.',
          history: 'A legacy organisation with over 20 years of experience in the Hutt Valley, the Trust digitised its operations through WhānauWell in 2024 to better serve the modern needs of our whānau.',
          trackRecord: 'Supported three generations of whānau, managed over 100 community projects, and awarded the Community Excellence Award in 2023.',
          foundedAt: new Date('2004-11-10'),
          logo: 'https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&q=80&w=200&h=200'
        },
        { 
          name: 'Andre Hub', 
          code: 'ANDRE-HUB',
          description: 'Andre Hub is a vibrant community centre dedicated to holistic wellbeing, cultural expression, and social connection through music, dance, and movement.',
          mission: 'To inspire joy, health, and belonging through the rhythmic arts and inclusive community connection.',
          history: 'Founded by Andre and a group of passionate community leaders in 2022, Andre Hub has quickly grown into a vital sanctuary for cultural expression and mental wellbeing in the region.',
          trackRecord: 'Successfully launched 15+ community programmes, supported over 500 whānau, and established a unique model for movement-based therapy.',
          foundedAt: new Date('2022-05-12'),
          logo: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=200&h=200'
        }
      ];

      const orgs: any = {};
      orgs['MASTER'] = masterOrg;

      for (const o of orgData) {
        const org = await Organisation.findOneAndUpdate(
          { code: o.code },
          { $set: o },
          { upsert: true, new: true }
        );
        if (org) {
          orgs[o.code] = org;
        }
      }

      // 2. Seed diverse users for each org
      const usersToSeed = [
        { name: 'Jihad Admin', email: 'jihad@waitaha.org', role: 'ORG_ADMIN', code: 'WAITAHA-2026' },
        { name: 'Sarah Coordinator', email: 'sarah@waitaha.org', role: 'COORDINATOR', code: 'WAITAHA-2026' },
        { name: 'John Member', email: 'john@waitaha.org', role: 'MEMBER', code: 'WAITAHA-2026' },
        { name: 'Hana Admin', email: 'hana@ttt.org', role: 'ORG_ADMIN', code: 'TTT-WELL' },
        { name: 'Mark Wilson', email: 'mark@akl.org', role: 'ORG_ADMIN', code: 'AKL-COMM' },
        { name: 'Elena Rodriguez', email: 'elena@hutt.org', role: 'COORDINATOR', code: 'HUTT-TRUST' },
        { name: 'Sam Taylor', email: 'sam@waitaha.org', role: 'MEMBER', code: 'WAITAHA-2026' },
        { name: 'Aroha Smith', email: 'aroha@ttt.org', role: 'MEMBER', code: 'TTT-WELL' },
        { name: 'David Chen', email: 'david@akl.org', role: 'MEMBER', code: 'AKL-COMM' },
        { name: 'Maria Garcia', email: 'maria@hutt.org', role: 'MEMBER', code: 'HUTT-TRUST' },
        { name: 'Andre Admin', email: 'andre@andrehub.org', role: 'ORG_ADMIN', code: 'ANDRE-HUB' }
      ];

      const seededUsers: any[] = [];
      for (const u of usersToSeed) {
        const hash = await bcrypt.hash('Password123!', 10);
        const user = await User.findOneAndUpdate(
          { email: u.email },
          { 
            $set: {
              name: u.name,
              role: u.role,
              organisationId: orgs[u.code]?._id,
              passwordHash: hash // Reset password to ensure it works
            }
          },
          { upsert: true, new: true }
        );
        if (user) {
          seededUsers.push(user);
        }
      }

      // 3. Seed Hub Requests
      await OrganisationApplication.create([
        { name: 'Wellington Whānau Trust', contactName: 'Wiremu Kingi', email: 'wiremu@wellington.org', reason: 'We want to provide digital wellbeing tools to our 200+ members in the Hutt Valley.', status: 'PENDING' },
        { name: 'South Island Support', contactName: 'Emma Smith', email: 'emma@sisupport.org', reason: 'Expanding our mental health services to rural communities.', status: 'PENDING' },
        { name: 'Otago Community Hub', contactName: 'David Miller', email: 'david@otago.org', reason: 'Supporting local youth with mental health resources.', status: 'PENDING' },
        { name: 'Hamilton Wellness', contactName: 'James Cook', email: 'james@hamilton.org', reason: 'Providing holistic care for local families.', status: 'PENDING' }
      ]);

      // 4. Seed Diverse Programmes for each org
      const programmesToSeed = [
        // Waitaha
        {
          title: 'Whānau Yoga & Mindfulness',
          publicSummary: 'A holistic yoga and mindfulness programme designed for all ages and abilities, focusing on stress reduction and physical wellbeing.',
          memberDetails: 'Sessions are held every Saturday at 9:00 AM. Please bring a mat and water. Location: North Hagley Park, near the band rotunda.',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Hagley Park, Christchurch',
          category: 'Physical Health',
          organisationId: orgs['WAITAHA-2026']?._id,
          coordinatorId: superAdminId
        },
        {
          title: 'Waitaha Mental Health Support',
          publicSummary: 'Confidential one-on-one and group support sessions for members dealing with stress, anxiety, or life transitions.',
          memberDetails: 'Bookings are essential. Private rooms are available at the Waitaha Centre. 24/7 crisis support line included for members.',
          visibility: 'ORG_ONLY',
          startDate: new Date(),
          location: 'Waitaha Centre',
          category: 'Mental Health',
          organisationId: orgs['WAITAHA-2026']?._id,
          coordinatorId: superAdminId
        },
        // TTT
        {
          title: 'Traditional Māori Nutrition',
          publicSummary: 'Learn about traditional Māori food practices and how to integrate them into a modern, healthy lifestyle for your whānau.',
          memberDetails: 'Includes hands-on cooking workshops, recipe books, and seasonal gardening guides. Held at the community kitchen.',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Community Kitchen',
          category: 'Nutrition',
          organisationId: orgs['TTT-WELL']?._id,
          coordinatorId: superAdminId
        },
        {
          title: 'Te Reo Māori for Wellbeing',
          publicSummary: 'Exploring the connection between language, culture, and mental health through immersive Te Reo Māori sessions.',
          memberDetails: 'Intensive weekend wānanga and daily digital practice guides. Open to all proficiency levels within the organisation.',
          visibility: 'ORG_ONLY',
          startDate: new Date(),
          location: 'Te Tai Tokerau Marae',
          category: 'Culture',
          organisationId: orgs['TTT-WELL']?._id,
          coordinatorId: superAdminId
        },
        // Auckland
        {
          title: 'Urban Youth Mentorship',
          publicSummary: 'A structured mentorship programme connecting urban youth with professional mentors to build career pathways and life skills.',
          memberDetails: 'Monthly networking events, weekly check-ins, and access to the Auckland Central Hub resource library.',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Auckland Central Hub',
          category: 'Community Support',
          organisationId: orgs['AKL-COMM']?._id,
          coordinatorId: superAdminId
        },
        {
          title: 'Migrant Support Network',
          publicSummary: 'Providing social connection and practical support for new migrants to the Auckland region, focusing on community integration.',
          memberDetails: 'Language support, legal advice clinics, and social mixers. Private forum access for members.',
          visibility: 'ORG_ONLY',
          startDate: new Date(),
          location: 'Auckland CBD',
          category: 'Social Support',
          organisationId: orgs['AKL-COMM']?._id,
          coordinatorId: superAdminId
        },
        // Hutt
        {
          title: 'Digital Empowerment for Kaumātua',
          publicSummary: 'Helping our elders navigate the digital world safely, from connecting with whānau online to accessing digital health services.',
          memberDetails: 'Small group sessions with patient tutors. Devices provided if needed. Held at the Hutt Valley Library.',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Hutt Valley Library',
          category: 'Education',
          organisationId: orgs['HUTT-TRUST']?._id,
          coordinatorId: superAdminId
        },
        // Andre Hub
        {
          title: 'Samba Dance for Wellbeing',
          publicSummary: 'Experience the joy and energy of Samba! A high-energy dance programme that improves cardiovascular health and boosts mood.',
          memberDetails: 'Weekly classes on Wednesdays at 6:00 PM. No experience necessary. Wear comfortable clothing.',
          visibility: 'PUBLIC',
          startDate: new Date(),
          location: 'Andre Hub Main Studio',
          category: 'Physical Health',
          organisationId: orgs['ANDRE-HUB']?._id,
          coordinatorId: superAdminId
        }
      ];

      for (const p of programmesToSeed) {
        if (!p.organisationId || !p.coordinatorId) {
          console.warn(`Skipping programme ${p.title} due to missing org or coordinator`);
          continue;
        }
        await Programme.findOneAndUpdate(
          { title: p.title, organisationId: p.organisationId },
          { $set: p },
          { upsert: true, new: true }
        );
      }
      console.log(`Ensured ${programmesToSeed.length} Programmes`);

      // 5. Seed Support Tickets
      const ticketsToSeed = [
        { subject: 'Unable to invite new members', userId: superAdminId, organisationId: orgs['WAITAHA-2026']?._id, priority: 'HIGH', status: 'OPEN', message: 'I am getting an error when trying to generate new invite codes.' },
        { subject: 'Feature Request: Mobile App', userId: superAdminId, organisationId: orgs['TTT-WELL']?._id, priority: 'LOW', status: 'OPEN', message: 'Our members are asking if there is a mobile app available.' },
        { subject: 'Login Issue', userId: superAdminId, organisationId: orgs['WAITAHA-2026']?._id, priority: 'URGENT', status: 'IN_PROGRESS', message: 'Some users are reporting they cannot log in after the last update.' }
      ];

      for (const t of ticketsToSeed) {
        await SupportTicket.findOneAndUpdate(
          { subject: t.subject, userId: t.userId },
          { $set: t },
          { upsert: true, new: true }
        );
      }

      // 6. Seed Membership Applications
      const applicationsToSeed = [
        { name: 'Alice Cooper', email: 'alice@example.com', organisationId: orgs['WAITAHA-2026']?._id, message: 'I would like to join the Waitaha Health Hub to access the yoga sessions.', status: 'PENDING' },
        { name: 'Bob Marley', email: 'bob@example.com', organisationId: orgs['TTT-WELL']?._id, message: 'Interested in the healthy cooking workshops.', status: 'PENDING' },
        { name: 'Test Applicant', email: 'test@example.com', phoneNumber: '027 111 2222', organisationId: orgs['ANDRE-HUB']?._id, howDidYouHear: 'Word of mouth', idType: 'Driver License', documentId: 'DL-54321', reason: 'I love samba and want to be part of the community hub.', status: 'PENDING' }
      ];

      for (const a of applicationsToSeed) {
        await MembershipApplication.findOneAndUpdate(
          { email: a.email, organisationId: a.organisationId },
          { $set: a },
          { upsert: true, new: true }
        );
      }

      await logEvent('SYSTEM_SEED', 'Platform data seeded successfully', 'SUCCESS', masterOrg?._id, superAdminId);

      const finalOrgs = await Organisation.countDocuments();
      const finalUsers = await User.countDocuments();
      const finalProgs = await Programme.countDocuments();
      
      console.log('Seeding complete. Final counts:', {
        organisations: finalOrgs,
        users: finalUsers,
        programmes: finalProgs
      });

      return { 
        success: true, 
        message: 'Platform data initialized successfully',
        counts: { organisations: finalOrgs, users: finalUsers, programmes: finalProgs }
      };
    } catch (error: any) {
      console.error("Seeding error:", error);
      await logEvent('SYSTEM_SEED_ERROR', error.message, 'ERROR');
      throw error;
    }
  };

  // Middleware
  app.use(express.json());
  app.use(cors());

  // Database Connection
  const mongoUri = process.env.MONGO_URI || 'mongodb+srv://whanauwll-admin-jihad:whanauwellmse800@cluster0.zkswhn8.mongodb.net/whanauwell?retryWrites=true&w=majority';
  
  try {
    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB successfully");
    
    // Seed an initial organisation if none exists
    masterOrg = await Organisation.findOne({ code: 'MASTER' });
    if (!masterOrg) {
      masterOrg = await Organisation.create({
        name: 'WhānauWell Global',
        code: 'MASTER',
        description: 'WhānauWell Global is the central hub for the WhānauWell platform, providing oversight and support for all community hubs.',
        mission: 'To provide the digital infrastructure for community wellbeing across the globe.',
        history: 'WhānauWell was born out of a need for ethical, culturally appropriate wellbeing tools for indigenous and local communities.',
        trackRecord: 'Powering over 50 community hubs and supporting 10,000+ whānau members.',
        foundedAt: new Date('2023-01-01')
      });
    }

    // Seed Super Admin
    const superAdmin = await User.findOne({ email: 'admin@whanauwell.org' });
    if (!superAdmin) {
      const passwordHash = await bcrypt.hash('WhanauWell2026!', 10);
      const newAdmin = await User.create({
        name: 'System Administrator',
        email: 'admin@whanauwell.org',
        passwordHash,
        role: 'SUPER_ADMIN',
        organisationId: masterOrg._id
      });
      superAdminId = newAdmin._id;
    } else {
      superAdminId = superAdmin._id;
    }

    // Always ensure sample data is up to date
    await seedPlatformData();
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "WhānauWell API is running" });
  });

  // Public Routes
  app.get("/api/public/organisations", async (req, res) => {
    try {
      // Filter out the MASTER hub from public partner list
      const organisations = await Organisation.find({ code: { $ne: 'MASTER' } }, 'name logo description trackRecord foundedAt');
      res.json({ success: true, data: organisations });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/public/organisations/:id", async (req, res) => {
    try {
      const organisation = await Organisation.findById(req.params.id);
      if (!organisation) return res.status(404).json({ success: false, message: 'Organisation not found' });
      
      const programmeCount = await Programme.countDocuments({ organisationId: organisation._id, visibility: 'PUBLIC' });
      const memberCount = await User.countDocuments({ organisationId: organisation._id });

      res.json({ 
        success: true, 
        data: {
          ...organisation.toObject(),
          programmeCount,
          memberCount
        } 
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

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
      const { name, email, organisationId, message, documentId, idType, reason } = req.body;
      const application = await MembershipApplication.create({
        name,
        email,
        organisationId,
        message,
        documentId,
        idType,
        reason,
        status: 'PENDING'
      });
      await logEvent('MEMBERSHIP_APPLIED', `New membership application from ${name} (${email})`, 'INFO', organisationId);
      
      res.json({ success: true, data: application });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Organisation Profile Routes (for Org Admins)
  app.get("/api/organisation/me", authMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR']), tenantMiddleware, async (req: any, res) => {
    try {
      const organisation = await Organisation.findById(req.tenantId);
      if (!organisation) return res.status(404).json({ success: false, message: 'Organisation not found' });
      res.json({ success: true, data: organisation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.patch("/api/organisation/me", authMiddleware, roleMiddleware(['ORG_ADMIN']), tenantMiddleware, async (req: any, res) => {
    try {
      const { name, description, mission, history, logo, impactStories, trackRecord, foundedAt } = req.body;
      const organisation = await Organisation.findByIdAndUpdate(
        req.tenantId,
        { name, description, mission, history, logo, impactStories, trackRecord, foundedAt },
        { new: true }
      );
      if (!organisation) return res.status(404).json({ success: false, message: 'Organisation not found' });
      
      await logEvent('ORG_PROFILE_UPDATED', `Organisation profile updated for ${organisation.name}`, 'SUCCESS', organisation._id, req.user.id);
      res.json({ success: true, data: organisation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Platform Admin Seeding
  app.post("/api/admin/seed-data", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const result = await seedPlatformData();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/my-programmes", authMiddleware, async (req: any, res) => {
    try {
      const programmes = await Programme.find({ participants: req.user.id })
        .populate('organisationId', 'name')
        .populate('coordinatorId', 'name')
        .sort({ startDate: 1 });
      res.json({ success: true, data: programmes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Hub Admin Application Management
  app.get("/api/admin/applications", authMiddleware, tenantMiddleware, roleMiddleware(['ORG_ADMIN']), async (req: any, res) => {
    try {
      const applications = await MembershipApplication.find({ organisationId: req.tenantId }).sort({ createdAt: -1 });
      res.json({ success: true, data: applications });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.put("/api/admin/applications/:id/approve", authMiddleware, tenantMiddleware, roleMiddleware(['ORG_ADMIN']), async (req: any, res) => {
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

  app.put("/api/admin/applications/:id/reject", authMiddleware, tenantMiddleware, roleMiddleware(['ORG_ADMIN']), async (req: any, res) => {
    try {
      const { reason } = req.body;
      const application = await MembershipApplication.findById(req.params.id);
      if (!application) return res.status(404).json({ success: false, message: 'Application not found' });
      
      application.status = 'REJECTED';
      application.rejectedReason = reason;
      await application.save();

      await logEvent('MEMBERSHIP_REJECTED', `Membership application for ${application.name} rejected`, 'INFO', application.organisationId, req.user.id);
      
      res.json({ success: true, message: 'Application rejected' });
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
      const application = await OrganisationApplication.findById(req.params.id);
      
      if (!application) {
        return res.status(404).json({ success: false, message: 'Application not found' });
      }

      application.status = status;
      await application.save();

      let createdOrg = null;
      if (status === 'APPROVED') {
        // Check if organisation already exists (excluding deleted ones)
        createdOrg = await Organisation.findOne({ name: application.name, status: { $ne: 'DELETED' } });
        
        const generateAdminCode = () => 'ADM-' + Math.random().toString(36).substring(2, 6).toUpperCase() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();

        if (!createdOrg) {
          // Create the organisation if it doesn't exist
          const orgCode = application.name.toUpperCase().replace(/\s+/g, '-').substring(0, 10) + '-' + Math.floor(1000 + Math.random() * 9000);
          const adminInviteCode = generateAdminCode();
          
          createdOrg = await Organisation.create({
            name: application.name,
            code: orgCode,
            adminInviteCode: adminInviteCode
          });

          await logEvent('ORG_CREATED', `Organisation ${application.name} created from approved application`, 'SUCCESS', createdOrg._id, req.user.id);
        } else if (!createdOrg.adminInviteCode) {
          // Ensure existing org has an admin invite code
          createdOrg.adminInviteCode = generateAdminCode();
          await createdOrg.save();
          await logEvent('ORG_UPDATED', `Organisation ${application.name} assigned new admin invite code on approval`, 'INFO', createdOrg._id, req.user.id);
        }

        // Handle user creation/update
        const existingUser = await User.findOne({ email: application.email });
        if (!existingUser) {
          const passwordHash = await bcrypt.hash('WhanauWell2026!', 10);
          await User.create({
            name: application.contactName,
            email: application.email,
            passwordHash,
            role: 'ORG_ADMIN',
            organisationId: createdOrg._id
          });
          console.log(`Created ORG_ADMIN user for ${application.email}`);
        } else {
          // Update existing user to ORG_ADMIN for this new org
          existingUser.role = 'ORG_ADMIN';
          existingUser.organisationId = createdOrg._id;
          await existingUser.save();
          console.log(`Updated existing user ${application.email} to ORG_ADMIN for ${createdOrg.name}`);
        }
      }

      await logEvent('ORG_APPLICATION_UPDATED', `Organisation application ${req.params.id} updated to ${status}`, 'INFO', null, req.user.id);
      
      res.json({ 
        success: true, 
        data: application, 
        organisation: createdOrg,
        adminSecret: createdOrg?.adminInviteCode || process.env.ADMIN_SECRET_CODE || 'WhanauAdmin2024'
      });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.get("/api/admin/organisations", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req, res) => {
    try {
      const organisations = await Organisation.find({ status: { $ne: 'DELETED' } });
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

  app.patch("/api/admin/organisations/:id/status", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const { status, reason, suspensionEnd } = req.body;
      const validStatuses = ['ACTIVE', 'SUSPENDED', 'BANNED', 'DELETED'];
      
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid status' });
      }

      const updateData: any = { 
        status, 
        statusReason: reason 
      };

      if (status === 'DELETED') {
        const org = await Organisation.findById(req.params.id);
        if (org) {
          if (!org.code.includes('-deleted-')) {
            updateData.code = `${org.code}-deleted-${Date.now()}`;
          }
          if (!org.name.includes('(Deleted)')) {
            updateData.name = `${org.name} (Deleted)`;
          }
          if (org.adminInviteCode && !org.adminInviteCode.includes('-deleted-')) {
            updateData.adminInviteCode = `${org.adminInviteCode}-deleted-${Date.now()}`;
          }
        }
      }

      if (status === 'SUSPENDED') {
        updateData.suspensionEnd = suspensionEnd ? new Date(suspensionEnd) : undefined;
      } else {
        updateData.suspensionEnd = undefined;
      }

      const organisation = await Organisation.findByIdAndUpdate(
        req.params.id,
        updateData,
        { new: true }
      );

      if (!organisation) {
        return res.status(404).json({ success: false, message: 'Organisation not found' });
      }

      await logEvent('ORG_STATUS_CHANGED', `Organisation ${organisation.name} status changed to ${status}. Reason: ${reason || 'N/A'}`, status === 'ACTIVE' ? 'SUCCESS' : 'WARNING', organisation._id, req.user.id);
      
      res.json({ success: true, data: organisation });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.delete("/api/admin/organisations/:id", authMiddleware, roleMiddleware(['SUPER_ADMIN']), async (req: any, res) => {
    try {
      const organisation = await Organisation.findById(req.params.id);
      if (!organisation) return res.status(404).json({ success: false, message: 'Organisation not found' });

      // Soft delete by changing status and freeing up the code, name, and invite code
      const oldCode = organisation.code;
      const oldName = organisation.name;
      const oldInviteCode = organisation.adminInviteCode;
      organisation.status = 'DELETED';
      organisation.code = `${oldCode}-deleted-${Date.now()}`;
      organisation.name = `${oldName} (Deleted)`;
      if (oldInviteCode) {
        organisation.adminInviteCode = `${oldInviteCode}-deleted-${Date.now()}`;
      }
      organisation.statusReason = 'Permanently deleted by Super Admin';
      await organisation.save();

      await logEvent('ORG_DELETED', `Organisation ${organisation.name} (formerly ${oldCode}) permanently deleted`, 'ERROR', organisation._id, req.user.id);
      
      res.json({ success: true, message: 'Organisation permanently deleted' });
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
      const settings = await GlobalSettings.findOneAndUpdate({}, { platformName, maintenanceMode, allowPublicRegistration, defaultStressCheckInterval }, { returnDocument: 'after', upsert: true });
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
      let role = 'MEMBER';
      const globalAdminSecret = process.env.ADMIN_SECRET_CODE || 'WhanauAdmin2024';

      // Check for unique admin invite code first
      if (adminCode) {
        const orgWithAdminCode = await Organisation.findOne({ adminInviteCode: adminCode });
        if (orgWithAdminCode) {
          organisation = orgWithAdminCode;
          role = 'ORG_ADMIN';
        } else if (adminCode === globalAdminSecret) {
          role = 'ORG_ADMIN';
          // If using global secret, we MUST have an orgCode to know which org to join
          if (orgCode) {
            organisation = await Organisation.findOne({ code: orgCode });
          }
        } else {
          return res.status(400).json({ success: false, message: 'Invalid admin security code.' });
        }
      }

      if (!organisation) {
        if (orgCode) {
          organisation = await Organisation.findOne({ code: orgCode });
          if (!organisation) {
            return res.status(400).json({ success: false, message: 'Invalid organisation invite code.' });
          }
        } else if (settings.allowPublicRegistration && role === 'MEMBER') {
          organisation = await Organisation.findOne({ code: 'MASTER' });
          if (!organisation) {
            organisation = await Organisation.create({ name: 'WhānauWell Global', code: 'MASTER' });
          }
        } else {
          return res.status(400).json({ success: false, message: 'Organisation code or valid admin invite is required.' });
        }
      }

      // 2. Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        // If user was pre-created during approval, we might want to allow them to "register" (set their password)
        // But for now, let's keep it simple and tell them to login
        return res.status(400).json({ success: false, message: 'User already exists with this email. Please try logging in.' });
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
    const { name, email, password, profilePicture } = req.body;
    try {
      const updates: any = {};
      if (name) updates.name = name;
      if (email) updates.email = email;
      if (password) updates.passwordHash = await bcrypt.hash(password, 10);
      if (profilePicture !== undefined) updates.profilePicture = profilePicture;

      const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-passwordHash');
      res.json({ success: true, data: user });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Promote member to coordinator
  app.patch("/api/members/:id/role", authMiddleware, tenantMiddleware, roleMiddleware(['ORG_ADMIN']), async (req: any, res) => {
    try {
      const { role } = req.body;
      if (!['MEMBER', 'COORDINATOR'].includes(role)) {
        return res.status(400).json({ success: false, message: 'Invalid role' });
      }

      const member = await User.findOneAndUpdate(
        { _id: req.params.id, organisationId: req.tenantId },
        { role },
        { returnDocument: 'after' }
      ).select('-passwordHash');

      if (!member) {
        return res.status(404).json({ success: false, message: 'Member not found' });
      }

      res.json({ success: true, data: member });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Programme Routes
  app.get("/api/programmes", authMiddleware, tenantMiddleware, async (req: any, res) => {
    try {
      const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
      
      if (isSuperAdmin) {
        const programmes = await Programme.find().populate('coordinatorId', 'name').populate('organisationId', 'name');
        return res.json({ success: true, data: programmes });
      }

      // For non-super admins:
      // 1. Their own organisation's programmes (all)
      // 2. Public programmes (all)
      // 3. Other organisations' private programmes (brief only)
      
      const programmes = await Programme.find({}).populate('coordinatorId', 'name').populate('organisationId', 'name');
      
      const filteredProgrammes = programmes.map(p => {
        const isOwnOrg = p.organisationId && (p.organisationId as any)._id.toString() === req.tenantId?.toString();
        const isPublic = p.visibility === 'PUBLIC' || p.visibility === 'GLOBAL';
        
        if (isOwnOrg || isPublic) {
          return p;
        } else {
          // It's a private programme from another org - return brief version
          const brief = p.toObject();
          delete brief.memberDetails;
          // Add a flag to indicate it's a brief view
          return { ...brief, isBrief: true };
        }
      });

      res.json({ success: true, data: filteredProgrammes });
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

  app.patch("/api/programmes/:id", authMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR']), tenantMiddleware, async (req: any, res) => {
    try {
      const { title, publicSummary, memberDetails, visibility, startDate, location, category } = req.body;
      const programme = await Programme.findOneAndUpdate(
        { _id: req.params.id, organisationId: req.tenantId },
        { title, publicSummary, memberDetails, visibility, startDate, location, category },
        { returnDocument: 'after' }
      );
      if (!programme) return res.status(404).json({ success: false, message: 'Programme not found or access denied' });
      res.json({ success: true, data: programme });
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
  app.get("/api/members", authMiddleware, tenantMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR', 'MEMBER']), async (req: any, res) => {
    try {
      if (req.isOrgRestricted) {
        return res.status(403).json({ success: false, message: `Organisation is ${req.orgStatus}. Member list restricted.` });
      }
      const members = await User.find({ organisationId: req.tenantId }).select('-passwordHash');
      res.json({ success: true, data: members });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  // Dashboard Stats
  app.get("/api/dashboard/stats", authMiddleware, tenantMiddleware, async (req: any, res) => {
    try {
      if (req.isOrgRestricted && req.user.role !== 'SUPER_ADMIN') {
        return res.status(403).json({ success: false, message: `Organisation is ${req.orgStatus}. Stats unavailable.` });
      }

      const isSuperAdmin = req.user.role === 'SUPER_ADMIN';
      const query = isSuperAdmin ? {} : { organisationId: req.tenantId };
      const progQuery = isSuperAdmin ? {} : { 
        $or: [
          { organisationId: req.tenantId },
          { visibility: 'PUBLIC' }
        ]
      };

      const programmesCount = await Programme.countDocuments(progQuery);
      const membersCount = await User.countDocuments(query);
      const organisationsCount = isSuperAdmin ? await Organisation.countDocuments({ code: { $ne: 'MASTER' } }) : 0;
      const stressRecords = await StressRecord.find(query);
      const stressStats = StressService.getAggregatedStats(stressRecords);

      // Recent activities
      const recentProgrammes = await Programme.find(progQuery).sort({ createdAt: -1 }).limit(3);
      const recentStress = await StressRecord.find(query).sort({ createdAt: -1 }).limit(3).populate('userId', 'name');

      // Participation trends (last 4 weeks)
      const fourWeeksAgo = new Date();
      fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);
      
      const matchQuery: any = { createdAt: { $gte: fourWeeksAgo } };
      if (!isSuperAdmin) {
        matchQuery.organisationId = new mongoose.Types.ObjectId(req.tenantId);
      }
      
      const weeklyParticipation = await StressRecord.aggregate([
        { $match: matchQuery },
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
          organisationsCount,
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
