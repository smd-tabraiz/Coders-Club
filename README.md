# CodersClub GPREC 🚀

CodersClub is a comprehensive event management and community platform designed for coding clubs. It provides role-based access control, real-time updates, event registrations, leaderboards, and administrative tools to manage the club efficiently.

## 🌟 Key Features

*   **Role-Based Access Control (RBAC):** Distinct dashboards and capabilities for:
    *   `Student`: Browse events, register, view leaderboards and notifications.
    *   `Club Member`: Read-only access to all club data, events, and analytics.
    *   `Admin`: Create events, approve/reject registrations, manage teams, and view analytics.
    *   `SuperAdmin`: Complete system control, user management, and global settings.
*   **Real-Time Capabilities (Socket.IO):** Instant notifications, live dashboard statistics, and immediate registration status updates without page refreshes.
*   **Event Management:** Admins can create events with constraints (e.g., allowed academic years, maximum 4th-year students per team).
*   **Team & Batch Organization:** Organize students into teams and manage them through batches.
*   **Dynamic Settings:** SuperAdmins can configure public-facing contact information and social links via the settings dashboard.

## 🛠️ Technology Stack

**Frontend:**
*   React (via Vite)
*   Tailwind CSS (Styling)
*   Framer Motion (Animations)
*   React Router (Routing)
*   Socket.IO Client (Real-time WebSockets)
*   Axios (API Requests)

**Backend:**
*   Node.js & Express.js
*   MongoDB (via Mongoose)
*   Socket.IO (Real-time WebSockets)
*   JSON Web Tokens (JWT) for Authentication
*   Bcryptjs (Password Hashing)
*   Multer & Cloudinary (File/Image Uploads)
*   Nodemailer (Email Service)

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   MongoDB Instance (Local or Atlas)
*   Cloudinary Account (for image uploads)

### 1. Clone the repository
```bash
git clone <repository-url>
cd Codersclub-demo
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory with the following variables:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:5173
```

Start the backend development server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory with the following variables:
```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

## 🌐 Deployment
For detailed deployment instructions for production environments (like Render and Vercel), please refer to the deployment documentation provided in the project.

## 📜 License
This project is proprietary and built for Coders Club GPREC.
