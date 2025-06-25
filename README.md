# 🧠 IntelliBlog

**IntelliBlog** is a smart, full-stack blogging platform that integrates AI-based writing assistance using OpenAI, with secure authentication, real-time features, and a clean modern UI.

---

##  Features

-  Create, edit, and delete blog posts
-  JWT-based authentication (Register, Login, Forgot/Reset Password via email)
-  AI-powered content suggestions using ChatGPT (OpenAI API)
-  Real-time comment section (via Socket.IO)
-  Email password reset using NodeMailer
-  User profile management
-  Responsive design using Tailwind CSS
- 💻 Admin dashboard (multi-user ready)

---

## 🛠️ Tech Stack

### Frontend:
- React.js (with React Router)
- Tailwind CSS
- Axios
- React Toastify

### Backend:
- Node.js + Express.js
- MongoDB with Mongoose
- JWT for Authentication
- bcryptjs for Password Hashing
- Nodemailer for Emails
- OpenAI API Integration

---

## ⚙️etup Instructions

###  Backend

1. Navigate to the backend folder:
   ```bash
   cd backend

2. Install dependencies:
   ```bash
    npm install

3. Create a .env file in backend/ and add:
   ```ini
   MONGO_URI=mongodb://127.0.0.1:27017/intelliblog
   JWT_SECRET=your_secret_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   OPENAI_API_KEY=your_openai_key

4. Start backend server:
   ```npm run dev

### Frontend

1. Navigate to the frontend folder:
   ```bash
   npm install

2. Install dependencies:
   ```bash
   npm install

3. Start frontend:
   ```bash
   npm start

Author
Aman Bijarnia – https://github.com/techie-wrb


---

###  Now Save It:

1. Run:
   ```bash
   nano README.md

