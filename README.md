# 🎓 Student Copilot

An AI-powered study assistant that transforms PDF notes into interactive learning experiences using **RAG (Retrieval-Augmented Generation)**, **Google Gemini AI**, and **MongoDB Vector Search**.

Students can upload lecture notes, ask questions about their documents, generate AI summaries, flashcards, quizzes, and monitor their study progress through a dashboard.

---

## 🚀 Features

### 🔐 Authentication

- JWT Authentication
- Access & Refresh Token Architecture
- Refresh Token Rotation
- Hashed Refresh Tokens
- Protected Routes
- Zod Validation
- Rate Limiting

---

### 📄 Notes

- Upload PDF Notes
- Automatic PDF Text Extraction
- Chunking Large Documents
- Generate Vector Embeddings
- Store Embeddings in MongoDB
- Search Notes
- Delete Notes

---

### 🤖 AI Features

- Ask Questions using RAG
- AI Generated Summaries
- AI Flashcards
- AI Quizzes
- Recent AI Conversations

---

### 📊 Dashboard

Displays

- Total Notes
- Total Questions Asked
- Total Flashcards
- Total Quizzes
- Recent Uploaded Notes

---

### 🧠 Retrieval Augmented Generation (RAG)

Workflow

```
Upload PDF
      │
      ▼
Extract Text
      │
      ▼
Chunk Text
      │
      ▼
Generate Embeddings
      │
      ▼
Store in MongoDB
      │
      ▼
User asks Question
      │
      ▼
Vector Search
      │
      ▼
Top Relevant Chunks
      │
      ▼
Gemini AI
      │
      ▼
Final Answer
```

---

# 🏗️ Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Axios
- React Hot Toast

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Zod

---

## AI

- Google Gemini 2.5 Flash
- Google Embedding API

---

## Testing

- Jest
- Supertest
- MongoDB Memory Server

Backend Test Coverage

- **83% Statements**
- **70% Branches**
- **73% Functions**
- **82% Lines**

---

## DevOps

- Docker
- Docker Compose
- GitHub Actions CI

---

# 📂 Project Structure

```
student-copilot
│
├── frontend
│   ├── src
│   ├── Dockerfile
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── tests
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/student-copilot.git

cd student-copilot
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker

Build and start both services

```bash
docker compose up --build
```

Application

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:5000
```

---

# 🧪 Running Tests

Backend

```bash
cd backend

npm test
```

Coverage

```bash
npm run test:coverage
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=5000

MONGO_URI=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

GEMINI_API_KEY=

FRONTEND_URL=http://localhost:3000
```

---

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# 🔒 Security

- Password Hashing (bcrypt)
- HTTP-only Cookies
- Refresh Token Rotation
- Hashed Refresh Tokens
- Route Protection
- Rate Limiting
- Input Validation
- Secure Authentication Flow

---

# 📈 CI/CD

GitHub Actions automatically

- Install Dependencies
- Build Backend
- Run Jest Tests
- Build Frontend
- Validate Every Pull Request

---

# 📸 Screenshots

## Landing Page

_Add Screenshot_

---

## Dashboard

_Add Screenshot_

---

## Chat

_Add Screenshot_

---

## Flashcards

_Add Screenshot_

---

## Quiz

_Add Screenshot_

---

# 🚀 Future Improvements

- Google OAuth
- Redis Caching
- Swagger API Documentation
- Email Verification
- Password Reset
- AI Study Planner
- AI Note Recommendations
- Deployment Pipeline
- Kubernetes

---

# 👨‍💻 Author

**Vishal Tanwar**

- GitHub: https://github.com/# 🎓 Student Copilot

An AI-powered study assistant that transforms PDF notes into interactive learning experiences using **RAG (Retrieval-Augmented Generation)**, **Google Gemini AI**, and **MongoDB Vector Search**.

Students can upload lecture notes, ask questions about their documents, generate AI summaries, flashcards, quizzes, and monitor their study progress through a dashboard.

---

## 🚀 Features

### 🔐 Authentication

- JWT Authentication
- Access & Refresh Token Architecture
- Refresh Token Rotation
- Hashed Refresh Tokens
- Protected Routes
- Zod Validation
- Rate Limiting

---

### 📄 Notes

- Upload PDF Notes
- Automatic PDF Text Extraction
- Chunking Large Documents
- Generate Vector Embeddings
- Store Embeddings in MongoDB
- Search Notes
- Delete Notes

---

### 🤖 AI Features

- Ask Questions using RAG
- AI Generated Summaries
- AI Flashcards
- AI Quizzes
- Recent AI Conversations

---

### 📊 Dashboard

Displays

- Total Notes
- Total Questions Asked
- Total Flashcards
- Total Quizzes
- Recent Uploaded Notes

---

### 🧠 Retrieval Augmented Generation (RAG)

Workflow

```
Upload PDF
      │
      ▼
Extract Text
      │
      ▼
Chunk Text
      │
      ▼
Generate Embeddings
      │
      ▼
Store in MongoDB
      │
      ▼
User asks Question
      │
      ▼
Vector Search
      │
      ▼
Top Relevant Chunks
      │
      ▼
Gemini AI
      │
      ▼
Final Answer
```

---

# 🏗️ Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- TailwindCSS
- Axios
- React Hot Toast

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose
- JWT
- bcrypt
- Multer
- Zod

---

## AI

- Google Gemini 2.5 Flash
- Google Embedding API

---

## Testing

- Jest
- Supertest
- MongoDB Memory Server

Backend Test Coverage

- **83% Statements**
- **70% Branches**
- **73% Functions**
- **82% Lines**

---

## DevOps

- Docker
- Docker Compose
- GitHub Actions CI

---

# 📂 Project Structure

```
student-copilot
│
├── frontend
│   ├── src
│   ├── Dockerfile
│   └── package.json
│
├── backend
│   ├── src
│   │   ├── controllers
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── tests
│   │
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# ⚙️ Installation

Clone the repository

```bash
git clone https://github.com/<your-username>/student-copilot.git

cd student-copilot
```

---

## Backend

```bash
cd backend

npm install

npm run dev
```

---

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🐳 Docker

Build and start both services

```bash
docker compose up --build
```

Application

Frontend

```
http://localhost:3000
```

Backend

```
http://localhost:5000
```

---

# 🧪 Running Tests

Backend

```bash
cd backend

npm test
```

Coverage

```bash
npm run test:coverage
```

---

# 🔑 Environment Variables

## Backend

```env
PORT=5000

MONGO_URI=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

GEMINI_API_KEY=

FRONTEND_URL=http://localhost:3000
```

---

## Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

---

# 🔒 Security

- Password Hashing (bcrypt)
- HTTP-only Cookies
- Refresh Token Rotation
- Hashed Refresh Tokens
- Route Protection
- Rate Limiting
- Input Validation
- Secure Authentication Flow

---

# 📈 CI/CD

GitHub Actions automatically

- Install Dependencies
- Build Backend
- Run Jest Tests
- Build Frontend
- Validate Every Pull Request

---

# 📸 Screenshots

## Landing Page

<div align="center">
  <img src="/frontend/public/landing_page.png" alt="Landing Page Screenshot" />
</div>

---

## Dashboard

<div align="center>
    <img src="/frontend/public/dashboard.png" alt="Dashboard Screenshot" />
</div>
---

## Chat

<div align="center>
    <img src="/frontend/public/chat.png" alt="Chat Screenshot" />
</div>

---

## Flashcards

<div align="center>
    <img src="/frontend/public/flashcards.png" alt="Flashcards Screenshot" />
</div>

---

## Quiz

<div align="center>
    <img src="/frontend/public/quiz.png" alt="Quiz Screenshot" />
</div>

---

# 🚀 Future Improvements

- Google OAuth
- Redis Caching
- Swagger API Documentation
- Email Verification
- Password Reset
- AI Study Planner
- AI Note Recommendations
- Deployment Pipeline
- Kubernetes

---

# 👨‍💻 Author

**Vishal Tanwar**

- GitHub: https://github.com/Vishalnerd
- LinkedIn:https://linkedin.com/in/vishal-tanwar-a7076a286/

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

- LinkedIn: https://linkedin.com/in/vishal-tanwar-a7076a286/
- GitHub: https://github.com/Vishalnerd

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
