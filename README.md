[![Student Copilot CI](https://github.com/Vishalnerd/student-copilot/actions/workflows/ci.yml/badge.svg)](https://github.com/Vishalnerd/student-copilot/actions/workflows/ci.yml)

# 🎓 Student Copilot

An AI-powered study assistant that transforms PDF notes into interactive learning experiences using **Retrieval-Augmented Generation (RAG)**, **Google Gemini AI**, **MongoDB Atlas Vector Search**, **Redis**, and **BullMQ**.

Students can upload lecture notes, chat with their PDFs using AI, generate summaries, flashcards, quizzes, and track learning progress through an interactive dashboard.

---

# ✨ Features

## 🔐 Authentication

- JWT Authentication
- Access & Refresh Token Architecture
- Refresh Token Rotation
- Hashed Refresh Tokens
- HTTP-only Cookies
- Protected Routes
- Zod Validation
- Rate Limiting

---

## 📄 PDF Processing

- Upload PDF Notes
- Background PDF Processing (BullMQ)
- Automatic PDF Text Extraction
- Intelligent Text Chunking
- AI Embedding Generation
- MongoDB Atlas Vector Storage
- Real-time Processing Progress (SSE)
- Search Notes
- Delete Notes

---

## 🤖 AI Features

- AI Chat with PDFs
- Streaming AI Responses (SSE)
- Retrieval-Augmented Generation (RAG)
- MongoDB Atlas Vector Search
- AI Summaries
- AI Flashcards
- AI Quizzes
- Recent AI Conversations

---

## ⚡ Performance Optimizations

- Redis Embedding Cache
- MongoDB Atlas Vector Search
- Background Job Processing
- Streaming Responses
- Axios Token Refresh Queue
- Parallel-safe Refresh Token Handling

---

## 📊 Dashboard

- Total Notes
- Total AI Questions
- Total Flashcards
- Total Quizzes
- Recently Uploaded Notes

---

# 🧠 RAG Pipeline

```text
                Upload PDF
                     │
                     ▼
          Background Worker (BullMQ)
                     │
                     ▼
            Extract PDF Text
                     │
                     ▼
            Smart Text Chunking
                     │
                     ▼
       Generate Embeddings (Gemini)
                     │
                     ▼
      Store Vectors (MongoDB Atlas)
                     │
──────────────────────────────────────────
                     │
              User asks question
                     │
                     ▼
         Generate Question Embedding
                     │
                     ▼
       MongoDB Atlas Vector Search
                     │
                     ▼
          Retrieve Relevant Chunks
                     │
                     ▼
          Build RAG Prompt
                     │
                     ▼
        Gemini 2.5 Flash Streaming
                     │
                     ▼
         Stream AI Response (SSE)
```

---

# ⚙️ System Architecture

```text
                 Next.js Frontend
                        │
                        ▼
              Express + TypeScript API
                        │
     ┌──────────────────┼─────────────────┐
     ▼                  ▼                 ▼
 MongoDB Atlas       Redis Cache       BullMQ
(Vector Search)     (Embeddings)    (Background Jobs)
     │                                   │
     └──────────────► Gemini AI ◄────────┘
```

---

# 🛠 Tech Stack

## Frontend

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Axios
- React Hot Toast
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- TypeScript
- MongoDB Atlas
- Mongoose
- JWT
- bcrypt
- Multer
- Zod

---

## AI

- Google Gemini 2.5 Flash
- Gemini Embedding API
- Retrieval-Augmented Generation (RAG)

---

## Infrastructure

- Redis
- BullMQ
- Server-Sent Events (SSE)
- MongoDB Atlas Vector Search

---

## Testing

- Jest
- Supertest
- MongoDB Memory Server

### Backend Test Coverage

- ✅ Statements: **83%**
- ✅ Branches: **70%**
- ✅ Functions: **73%**
- ✅ Lines: **82%**

---

## DevOps

- Docker
- Docker Compose
- GitHub Actions CI

---

# 📂 Project Structure

```text
student-copilot
│
├── frontend
│   ├── src
│   ├── Dockerfile
│   └── package.json
│
├── backend
│   ├── src
│   │
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   │   ├── ai
│   │   ├── cache
│   │   └── bullmq
│   │
│   ├── jobs
│   ├── utils
│   ├── tests
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md
```

---

# 🚀 Installation

Clone the repository

```bash
git clone https://github.com/Vishalnerd/student-copilot.git

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

```bash
docker compose up --build
```

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

NODE_ENV=development

MONGO_URI=

JWT_ACCESS_SECRET=

JWT_REFRESH_SECRET=

GEMINI_API_KEY=

REDIS_URL=

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
- JWT Authentication
- Refresh Token Rotation
- Hashed Refresh Tokens
- Protected Routes
- Rate Limiting
- Input Validation
- Secure Authentication Flow

---

# 📸 Screenshots

## Landing Page

<img width="1901" height="852" alt="landing_page" src="https://github.com/user-attachments/assets/745e5666-5a55-44e4-84d8-c71320db1371" />

---

## Dashboard

<img width="1901" height="858" alt="dashboard" src="https://github.com/user-attachments/assets/e73b328a-7193-413e-b225-92f4e4f4d52f" />

---

## AI Chat

<img width="1912" height="875" alt="chat" src="https://github.com/user-attachments/assets/3a197bea-1217-461d-a8ee-6d6fd1924dc5" />

---

## Flashcards

<img width="1913" height="856" alt="flashcards" src="https://github.com/user-attachments/assets/14d626f2-ea85-4629-924c-f0a2ad40dd68" />

---

## Quiz

<img width="1917" height="863" alt="quiz" src="https://github.com/user-attachments/assets/5ce36278-ceff-4350-a4db-a3a8751e5e23" />

---

# 🚀 Roadmap

- Cloudinary/S3 PDF Storage
- Hybrid Search (BM25 + Vector Search)
- Conversation Memory
- AI Study Planner
- Email Verification
- Password Reset
- Swagger API Documentation
- Deployment Pipeline
- Kubernetes

---

# 👨‍💻 Author

**Vishal Tanwar**

- GitHub: https://github.com/Vishalnerd
- LinkedIn: https://linkedin.com/in/vishal-tanwar-a7076a286/

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.
