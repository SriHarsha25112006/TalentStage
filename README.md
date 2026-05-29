# TalentStage

TalentStage is a premium, AI-powered dual-sided marketplace that connects top-tier creative and technical freelancers with clients. The platform features intelligent project scoping, AI-verified skill assessments, and smart matching algorithms to ensure the perfect fit for every project.

## Features

### For Freelancers
- **Rich Portfolios:** Showcase your best work in a stunning, interactive gallery.
- **AI Skill Verification:** Prove your expertise with dynamically generated, highly personalized skill assessments.
- **Smart Proposals:** Submit competitive bids with custom milestones.
- **Earnings Dashboard:** Track active contracts, pending payments, and total earnings.

### For Clients
- **AI Project Scoping:** Describe your vague needs, and our AI will generate a structured project brief with recommended budgets and timelines.
- **Smart Matching:** Instantly see the top 5 freelancers ranked for your specific project.
- **Milestone Management:** Approve deliverables and release funds securely.

### Community Hub
- **Public Feed:** Share wins, tips, and resources with other professionals.
- **Mentorship:** Offer or book 1-on-1 mentorship sessions.
- **Skill Challenges:** Compete in weekly challenges to earn exclusive badges.

## Technology Stack
- **Frontend:** React, Vite, Lucide Icons, Custom CSS (Glassmorphism & Dark Mode)
- **Backend:** Python, FastAPI, PostgreSQL (asyncpg), SQLAlchemy
- **AI Integration:** Google Gemini 1.5 Pro, LangChain
- **Security:** JWT Authentication, Bcrypt Password Hashing

## Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL (running locally)

### Setup & Run
You can launch the entire application with a single command using the provided Python runner script.

1. Ensure your `.env` file in the `backend/` folder is configured with your database URI and Gemini API key.
2. Ensure you have installed the backend dependencies:
   ```bash
   cd backend
   python -m venv venv
   .\venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Run the application from the root directory:
   ```bash
   python run_app.py
   ```
This will automatically spin up the FastAPI backend, the Vite React frontend, and open your web browser to `http://localhost:5173`.
