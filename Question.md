# TalentStage — AI-Powered Freelance Marketplace

## Problem Statement & Platform Requirements

TalentStage is an advanced, AI-powered freelance platform designed to connect top technical talent with clients. The platform requires a premium, interactive user experience with verified credentials, dynamic task tracking, simulated economic workflows, and robust AI integrations.

---

## Core Requirements & Features

### 1. Dual-Role Flexibility & Unified Navigation
- **Roles Supported**: Freelancer, Client, and "Both" (dual-role toggle).
- **Unified Navigation**: A completely de-congested header layout supporting easy toggling between client and freelancer views.
- **Premium Aesthetics**:
  - Breathing pulse branding animation for the logo.
  - Responsive scaling and rapid, high-energy jitter interactions on hover.
  - Enforced `nowrap` behavior on navigation items to prevent congested wrapping on medium/narrow screens.

### 2. AI-Powered Skill Verification
- **Test Generation**: Custom, dynamic 10-question technical assessments simulated in real-time by a generative AI model (or a robust offline local quiz fallback when hitting API rate limits).
- **Grading & Badges**: Scoring 80% or higher awards a unique, neon-glowing verified badge to the freelancer's profile.
- **Strict Cooldown Rule**: 
  - Failing an assessment imposes a strict **1-minute cooldown** calculated from the exact time of failure.
  - A real-time countdown timer must be displayed to the user.
  - If a user attempts to bypass the timer and take a test during the cooldown, they must be redirected instantly to their portfolio page.

### 3. Interactive Contracts Board
- **Task Management**: Real-time filter tabs ("All", "Active", "Completed") with expanding details, milestone checklists, and dynamic contract progress calculations.
- **Simulated Payout Flow**: Interactive work submission and client review panels that simulate contract approval, release funds, and automatically update the transaction ledger.

### 4. Dynamic Earnings Dashboard
- **Financial Ledger**: Dynamic calculation of total earnings, pending payments, and active contract values.
- **Filtering & Search**: Live text search, multi-field sorting, and transaction tab filtering.
- **Withdrawal Simulator**: An interactive checkout module that lets users simulate money withdrawals to a bank account or crypto wallet, updating the global ledger in real-time.
