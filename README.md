# WhānauWell - Community Wellbeing Platform

WhānauWell is a comprehensive, multi-tenant wellbeing platform designed to help organisations and communities monitor, support, and improve the mental health and overall wellbeing of their members.

## 🚀 Overview

The platform provides a secure environment for organisations (Hubs) to onboard their members, track wellbeing trends through interactive stress checks, and coordinate support programmes. It features a robust role-based access control system, ensuring that data is handled with the appropriate level of privacy and oversight.

## ✨ Key Features

### 🏢 Multi-Tenant Architecture
- **Organisations (Hubs)**: Independent spaces for different communities or companies.
- **Onboarding**: Simple invitation-based registration for members.

### 🔐 Role-Based Access Control (RBAC)
- **Super Admin**: Platform-wide orchestration, global insights, and system audit logs.
- **Organisation Admin**: Management of specific hubs, member oversight, and local reporting.
- **Coordinator**: Facilitation of wellbeing programmes and direct member support.
- **Member**: Personal wellbeing tracking and access to community resources.

### 📊 Wellbeing Tracking & Insights
- **Stress Check**: Interactive assessment tool for members to log their current state.
- **Global Insights**: Aggregated, anonymized data for admins to identify community-wide trends.
- **Audit Logs**: Comprehensive system logs for platform security and transparency.

### 📢 Communication & Coordination
- **Global Broadcasts**: Platform-wide announcements for critical updates.
- **Programme Registry**: Centralized hub for hosting and monitoring wellbeing initiatives.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **Charts**: Recharts / D3.js

## 📦 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/whanauwell.git
   cd whanauwell
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Configuration**:
   Create a `.env` file in the root directory and add your configuration:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   ADMIN_SECRET_CODE=your_admin_onboarding_code
   ```

4. **Run the application**:
   ```bash
   # For development
   npm run dev

   # For production
   npm run build
   npm start
   ```

## 📄 License

This project is licensed under the MIT License.
