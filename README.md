# 🤖 AI Investment Research Agent

> 📈 **An AI-powered investment research platform that analyzes publicly traded companies using a multi-agent AI workflow.**

<a href="https://ai-investment-research-agent-58gv.vercel.app/">🚀 Visit Live Demo</a>

---

# 🔑 Sample Login Credentials

Use the following demo account to explore the application:

| Field | Value |
|-------|-------|
| 📧 **Email** | `hr@gmail.com` |
| 🔒 **Password** | `123456789` |

> 💡 **Tip:** You can also create your own account using the Sign Up page.


---

# 📖 Overview — What it does

The **AI Investment Research Agent** is an intelligent web application designed to perform comprehensive financial analysis on publicly traded companies.

Users can search for a company, and the multi-agent system fetches real-time financial data, analyzes the company's performance, and presents the findings through an interactive and visually appealing dashboard.

The dashboard includes:

- 📊 Quarterly Revenue Trends
- 📈 One-Year Stock Price History
- 💡 AI-generated Investment Insights
- 📝 Detailed Financial Analysis

to help users make informed investment decisions.

---

# 🚀 How to run it

## 📋 Prerequisites

- ✅ Node.js (v16+)
- ✅ MongoDB Atlas account (or local MongoDB)
- ✅ Tavily API Key (for web search/agent integration)
- ✅ OpenAI API Key (for the LLM)

---

## ⚙️ Setup Steps

### 1️⃣ Clone/Unzip the repository

### 2️⃣ Setup Backend

- Navigate to the `backend` directory

```bash
cd backend
```

- Install dependencies

```bash
npm install
```

- Create a `.env` file in the `backend` directory and add the required keys.

- Start the backend server

```bash
npm start
```

or

```bash
npm run dev
```

---

### 3️⃣ Setup Frontend

Navigate to the frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run the frontend

```bash
npm run dev
```

The frontend will be available at:

```
http://localhost:5173
```

---

# 🔐 Environment Variables (.env)

```env
PORT=5000

MONGODB_URI=your_mongodb_atlas_connection_string

JWT_SECRET=your_jwt_secret

OPENAI_API_KEY=your_openai_api_key

TAVILY_API_KEY=your_tavily_api_key
```

---

# 🏗️ How it works — Approach and Architecture

The application is structured into a modern full-stack architecture:

### 🎨 Frontend (React + Vite)

- Responsive light-themed UI
- 📊 Recharts for financial visualizations
- 📡 Server-Sent Events (SSE) for live streaming updates

---

### ⚙️ Backend (Node.js + Express)

- 🔐 JWT Authentication
- 👤 User Profiles
- 📝 Search History
- 🍃 MongoDB Atlas integration

---

### 🤖 AI Agent System (LangGraph.js)

- Multi-agent workflow
- 🧠 LLM-powered planning
- 📊 Financial data analysis
- 📡 Live streaming progress

---

### 🗄️ Database (MongoDB Atlas)

Stores:

- 👤 User credentials
- 📄 User profiles
- 🕘 Search history

---

# ⚖️ Key decisions & trade-offs

### 📡 Server-Sent Events (SSE) over WebSockets

- ✅ Simpler implementation
- ✅ Perfect for one-way streaming
- ✅ Works well with Vercel
- ✅ Lower overhead

---

### 🤖 LangGraph.js

Selected over simpler chain-based approaches because it enables cyclical reasoning, allowing the agent to dynamically decide when to fetch more data or when enough information has been gathered.

---

### 📊 Recharts

Chosen because of its declarative React components, making complex financial charts easy to integrate.

---

### 🎨 Light Theme & 3D Aesthetics

A vibrant light theme with subtle 3D elements creates a premium, engaging experience instead of relying on a generic dark UI.

---

### 🗄️ Trade-off — Data Storage

Search history is currently stored as a monolithic document per search. As the application scales, this can be improved with normalization or a time-series approach.

---

# 🖼️ Example runs

## 📊 Dashboard Screenshot

![Dashboard Screenshot - AAPL Analysis](./frontend/public/screenshots/analysis%20page.png)

---

## 🔐 Auth Page

![Auth Page 3D Aesthetics](./frontend/public/screenshots/login%20page.png)

---

## 🕘 History Tab

![History tab](./frontend/public/screenshots/history%20page.png)

---

# 🌐 Live Deployed Link

### 🚀 https://ai-investment-research-agent-58gv.vercel.app/

---

# 🚀 What you would improve with more time

### ⚡ Caching Layer

Implement Redis to cache financial data and agent responses for frequently searched companies.

### 📊 More Advanced Visualizations

Add:

- Candlestick Charts
- RSI
- MACD indicators

using lightweight-charts.

### 💼 User Portfolios

Allow users to:

- ⭐ Save companies
- 📈 Create watchlists
- 💰 Simulate portfolios

### 🧠 Agent Memory

Implement cross-session memory so the agent remembers user preferences (e.g., preferred sectors or dividend-focused stocks).