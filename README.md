# 📚 PDF Chat with Vector Search

A full-stack application that allows users to upload PDFs, automatically parse and embed them into a PostgreSQL vector database, and chat with an AI assistant about the PDF contents using semantic search.

## ✨ Features

- **📄 PDF Upload & Processing**: Upload PDFs with automatic text extraction and chunking
- **🤖 AI-Powered Chat**: Chat with an intelligent assistant about your PDF contents
- **🔍 Semantic Search**: Find relevant information using vector similarity search
- **💬 Chat History**: Persistent conversation history for each PDF
- **⚡ Streaming Responses**: Real-time AI responses for better user experience
- **📊 Performance Monitoring**: Built-in timing and performance logging

## 🏗️ Architecture

- **Backend**: Node.js + Express + TypeScript + Prisma
- **Frontend**: React 18 + TypeScript + Redux Toolkit + Tailwind CSS
- **Database**: PostgreSQL with pgvector extension for vector operations
- **AI Services**: OpenAI API for embeddings and chat completions
- **Vector Search**: HNSW indexing for efficient similarity search

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL 13+ with pgvector extension
- OpenAI API key

### 1. Clone the Repository

```bash
git clone https://github.com/codefa/pdf-chat-vector.git
cd pdf-chat-vector
```

### 2. Set Up Database

Install PostgreSQL and the pgvector extension:

```bash
# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo apt-get install postgresql-13-pgvector

# macOS with Homebrew
brew install postgresql
brew install pgvector
```

Create a database and enable the pgvector extension:

```sql
CREATE DATABASE pdf_chat;
\c pdf_chat
CREATE EXTENSION vector;
```

### 3. Environment Setup

Create a `.env` file `backend/`:

```bash
DATABASE_URL="postgresql://username:password@localhost:5432/pdf_chat"
OPENAI_API_KEY="your-openai-api-key-here"
PORT=5000
```

### 4. Install Dependencies

```bash
# Backend
cd backend
npm install

# Frontend (in another terminal)
cd frontend
npm install
```

### 5. Database Migration

```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### 6. Start the Application

```bash
# Backend (Terminal 1)
cd backend
npm run dev

# Frontend (Terminal 2)
cd frontend
npm run dev
```

The application will be available at:

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 📖 Usage

### 1. Upload a PDF

- Navigate to the home page
- Enter a title for your PDF
- Select a PDF file
- Click "Upload" to process the document

### 2. Chat with Your PDF

- Go to the PDFs list page
- Click "Chat" on any uploaded PDF
- Ask questions about the document content
- Get AI-powered responses based on semantic search

### 3. Manage PDFs

- View all uploaded PDFs
- Delete PDFs and related data
- Access chat history for each document

## 🗄️ API Endpoints

### PDF Routes

- `POST /api/pdf/upload` - Upload and process PDF
- `GET /api/pdf/list` - List all PDFs
- `DELETE /api/pdf/:id` - Delete PDF and related data

### Chat Routes

- `POST /api/chat/:pdfId` - Start/continue chat with streaming
- `GET /api/chat/history/:chatId` - Get chat history
- `GET /api/chat/bench/:pdfId` - Performance benchmarking

## 🗄️ Database Schema

```sql
-- PDF metadata
PDF (id, title, filename, createdAt)

-- Vector embeddings for text chunks
Embeddings (id, pdfId, chunk, embedding)

-- Chat sessions
Chat (id, pdfId, createdAt)

-- Conversation messages
Message (id, chatId, role, content, createdAt)
```

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL + pgvector
- **ORM**: Prisma
- **AI**: OpenAI API
- **File Processing**: pdf-parse

### Frontend

- **Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

## ⚙️ Configuration

### Vector Search Parameters

The application uses optimized HNSW indexing with configurable parameters:

```typescript
// In embeddings service
await tx.$executeRawUnsafe('SET LOCAL diskann.query_rescore = 400')
await tx.$executeRawUnsafe('SET LOCAL diskann.query_search_list_size = 100')
await tx.$executeRawUnsafe('SET LOCAL hnsw.ef_search = 50')
```

### AI Model Configuration

- **Embeddings**: `text-embedding-3-small`
- **Chat**: `gpt-4o-mini`
- **Temperature**: 0.2
- **Max Tokens**: 256

## 📊 Performance Features

- **Chunking Strategy**: ~1000 character chunks for optimal embedding
- **Top-K Retrieval**: Retrieves top 3 most relevant chunks
- **Streaming Responses**: Real-time AI responses
- **Performance Logging**: Built-in timing metrics

## 🚀 Deployment

### Docker (Recommended)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### Environment Variables for Production

```bash
NODE_ENV=production
DATABASE_URL="your-production-database-url"
OPENAI_API_KEY="your-production-openai-key"
PORT=5000
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain RESTful API design principles
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �� Acknowledgments

- [OpenAI](https://openai.com/) for AI services
- [pgvector](https://github.com/pgvector/pgvector) for PostgreSQL vector operations
- [Prisma](https://www.prisma.io/) for database management
- [Tailwind CSS](https://tailwindcss.com/) for styling

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/codefa/pdf-chat-vector/issues) page
2. Create a new issue with detailed information
3. Include your environment details and error logs

---

**Made with ❤️ for developers who love AI and vector search!**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-13+-blue.svg)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
