<div align="center">
<img width="1200" height="475" alt="WhānauWell Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 🌿 WhānauWell – Community Wellbeing & Stress Insight Platform

WhānauWell is a professional full-stack SaaS-style community wellbeing platform developed as part of the **Master of Software Engineering (MSE800 Professional Software Engineering)** course.

The system allows community organisations to manage wellbeing programmes, track participation, and understand member stress levels in a secure and ethical way.

---

## 🚀 Run the Project Locally

### 📌 Prerequisites
- Node.js
- MongoDB (local or MongoDB Atlas)

---

### 1️⃣ Install Dependencies

```bash
npm install
```

If frontend is inside `client/` folder:

```bash
cd client
npm install
```

---

### 2️⃣ Create `.env` File

Create a `.env` file in the backend root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
TOKEN_EXPIRE=7d
ALLOWED_ORIGINS=http://localhost:5173
```

---

### 3️⃣ Run the Backend

```bash
npm run dev
```

### 4️⃣ Run the Frontend

```bash
cd client
npm run dev
```

Open your browser at:

```
http://localhost:5173
```

---

## 📚 Project Overview

WhānauWell is a multi-tenant platform designed for:

- Community organisations
- Schools and universities
- Cultural groups
- NGOs and wellbeing initiatives

Key features include:

✔ Multi-organisation SaaS architecture  
✔ Role-based access control  
✔ Programme management system  
✔ Stress assessment module  
✔ Consent-based data storage  
✔ Analytics dashboards  

The project emphasises ethical design and culturally informed teamwork aligned with Te Tiriti o Waitangi principles.

---

## 👨‍💻 Contributors

- Andre Luiz Santos Benedetti  
- Md. Jihad  

---

## 📄 License

This project is developed for academic and research purposes.
