# 🚀 ReleaseRadar

Track GitHub repository releases and NPM package updates in real-time. Full-stack, containerized, deployed on AWS EC2, and powered by Firebase authentication.

Live Demo → **[http://13.60.245.64](http://13.60.245.64)**

---

## 📌 Overview

ReleaseRadar is a full-stack application designed to help developers monitor new releases of the repositories and packages they care about.

It provides:

* 🔐 **Google OAuth login** via Firebase
* 🗂️ **Watchlist** of GitHub repos / NPM packages
* 🔄 **Automated release checking** (FastAPI backend)
* ⚡ **Real-time updates with SSE** to the frontend
* 🐳 **Full Dockerized development environment**
* ☁️ **Production deployment on AWS EC2 + Nginx + systemd**
* 🔄 **CI/CD via GitHub Actions (auto-deploy on push)**

---

## 🏗️ Tech Stack

### **Frontend**

* Next.js 14
* TypeScript
* Shadcn UI + TailwindCSS
* Firebase Authentication

### **Backend**

* Python FastAPI
* SQLModel / SQLAlchemy
* Uvicorn
* PostgreSQL

### **Infrastructure**

* Docker & docker-compose (for local development)
* AWS EC2 (Ubuntu 22.04)
* Nginx reverse proxy
* systemd services
* GitHub Actions CI/CD

---

## 🌐 Live Demo

The application is deployed on an AWS EC2 instance:

👉 **[http://13.60.245.64](http://13.60.245.64)**

---

## ⚙️ Local Development (Docker)

Clone the repository:

```bash
git clone https://github.com/your-user/releaseradar.git
cd releaseradar
```

Start the stack with docker-compose:

```bash
docker-compose up --build
```

This starts:

| Service          | Port                                           |
| ---------------- | ---------------------------------------------- |
| FastAPI backend  | [http://localhost:8080](http://localhost:8080) |
| Next.js frontend | [http://localhost:3000](http://localhost:3000) |
| PostgreSQL       | localhost:5432                                 |

---

## 🔐 Firebase Configuration (Required)

Create a Firebase project:
[https://console.firebase.google.com/](https://console.firebase.google.com/)

### Enable Google Authentication

* Go to *Authentication → Sign-in method*
* Enable **Google**
* Add the following to *Authorized Domains*:

  * `localhost`
  * `1.2.3.4` (production domain or IP)

### Firebase Admin SDK

Download the Admin credentials file:

```
firebase.json
```

Place it inside:

```
backend/app/firebase.json
```

---

## 🔑 Environment Variables

### **Backend (.env)**

Create:

```
backend/.env
```

With:

```
DATABASE_URL=postgresql+psycopg2://postgres:postgres@db:5432/releaseradar
FIREBASE_CREDENTIALS_PATH=/app/app/firebase.json
```

### **Frontend (.env.local)**

Provide your Firebase public config:

```
NEXT_PUBLIC_API_URL=http://localhost:8080
NEXT_PUBLIC_FIREBASE_API_KEY=your_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

---

## 🔄 CI/CD (GitHub Actions)

Every push to `main` triggers automated deployment:

* SSH into EC2
* Pull latest code
* Install dependencies
* Rebuild frontend
* Restart backend & frontend services

Workflow file lives in:
`.github/workflows/deploy.yml`

---

## 🧪 API Endpoints

* `GET /api/watchlist` – Retrieve tracked items
* `POST /api/watchlist` – Add new repo or package
* `DELETE /api/watchlist/:id` – Remove item
* `GET /api/releases` – Fetch detected releases

---

## 📄 License

MIT License — free to use, modify, and contribute.
