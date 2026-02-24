
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
import { StressService } from './backend/services/StressService.ts';
import { authMiddleware, tenantMiddleware, roleMiddleware } from './backend/middleware/auth.ts';

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
    const orgCount = await Organisation.countDocuments();
    if (orgCount === 0) {
      await Organisation.create({
        name: 'Waitaha Health Trust',
        code: 'WHANAU-01'
      });
      console.log("Seeded initial organisation: WHANAU-01");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "WhānauWell API is running" });
  });

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password, orgCode } = req.body;
    
    try {
      // 1. Validate invite code
      const organisation = await Organisation.findOne({ code: orgCode });
      if (!organisation) {
        return res.status(400).json({ success: false, message: 'Invalid organisation invite code.' });
      }

      // 2. Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ success: false, message: 'User already exists with this email.' });
      }

      // 3. Create user (Force role to MEMBER for public registration)
      const passwordHash = await bcrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role: 'MEMBER',
        organisationId: organisation._id
      });

      res.status(201).json({ success: true, message: 'Registration successful. Please login.' });
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
        process.env.JWT_SECRET || 'Jihadmse800secretkey',
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
      const programmes = await Programme.find({ organisationId: req.tenantId }).populate('coordinatorId', 'name');
      res.json({ success: true, data: programmes });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  });

  app.post("/api/programmes", authMiddleware, roleMiddleware(['ORG_ADMIN', 'COORDINATOR']), tenantMiddleware, async (req: any, res) => {
    try {
      const programme = await Programme.create({
        ...req.body,
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
      
      if (programme.participants.includes(req.user.id)) {
        return res.status(400).json({ success: false, message: 'Already enrolled' });
      }

      programme.participants.push(req.user.id);
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

      res.json({
        success: true,
        data: {
          programmesCount,
          membersCount,
          stressStats,
          recentActivities: [
            ...recentProgrammes.map(p => ({ type: 'programme', title: p.title, date: p.createdAt })),
            ...recentStress.map(s => ({ type: 'stress', title: `Check-in by ${(s.userId as any).name}`, date: s.createdAt }))
          ].sort((a: any, b: any) => b.date - a.date).slice(0, 5)
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
