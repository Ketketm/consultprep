# ConsultPrep - A Personal Learning Platform for Consulting Interviews (check demo mode and WIP version on the link following : https://consultprep.vercel.app/ )

## About This Project

This is a personal side project I started while preparing for strategy consulting interviews (MBB: McKinsey, BCG, Bain). After going through countless case study books, online drills, and practice sessions, I realized there wasn't a tool that combined everything I needed into one place — something that could track my progress, identify my weak spots, and make the preparation process feel more engaging.

So I decided to build one myself.

**Note:** This project is still very much a work in progress. It's not polished or production-ready, but it represents my attempt to solve a real problem I was facing and learn new skills along the way.

---

## The Idea

Consulting interviews require mastering several distinct skill areas:
- **Mental Math** — Quick calculations under pressure
- **Business Frameworks** — Structured thinking and problem decomposition
- **Industry Knowledge** — Margins, benchmarks, and sector-specific data
- **Case Intuition** — Pattern recognition and hypothesis generation

Most preparation resources treat these as separate topics. I wanted something that would:

1. **Track my progress** across all these areas in one dashboard
2. **Adapt to my weaknesses** — spending more time where I struggle
3. **Make practice feel less tedious** — gamification elements to stay motivated
4. **Support bilingual learning** — I practice in both French and English

---

## How It Works

### The Dashboard
The home screen gives me a quick overview of where I stand:
- **Skill Radar** — A visual map of my proficiency across different pillars
- **Today's Mission** — Suggested activities based on what's due for review or what needs work
- **Weekly Streak** — A simple motivator to practice consistently

### Learning Modules

**1. Flashcard Drills**
Memorization-based content for things like:
- Squares and cubes (1-25)
- Key percentages and fractions
- Industry benchmarks (pharma margins, SaaS metrics, retail KPIs)

These use a spaced repetition system — the app shows me cards I'm struggling with more frequently.

**2. Business Sense Exercises**
Scenario-based questions that test intuition:
- "A retailer's revenue grew 15% but margins dropped — what's happening?"
- "Should this startup increase or decrease marketing spend given these unit economics?"

**3. Case Practice**
I built a simple "case player" where I can import case studies in JSON format and work through them step by step. Each step has:
- A prompt/question
- Space for my answer
- A model answer to compare against
- Self-evaluation to track how I did

**4. Human Calculator**
A mental math trainer with timed challenges — useful for getting faster at the quantitative parts of cases.

### The XP System
To keep things interesting, I added a gamification layer:
- Earn XP for completing exercises
- Level up through consulting ranks (Analyst → Associate → Manager → Partner)
- Streak tracking to encourage daily practice

---

## How I Built It

I'm not a professional developer — I have some basic coding background, but I've mostly learned by doing. For this project, I took what I'd call a "vibe coding" approach: starting with a rough idea, experimenting, breaking things, and iterating until something worked.

**The tech side (in simple terms):**
- Built with **Next.js** — a popular framework for web apps that handles both the frontend and backend
- Styled with **Tailwind CSS** — a utility-based approach that makes it easy to design without writing custom CSS
- State management with **Zustand** — a lightweight way to keep track of data like user progress
- Charts with **Recharts** — for the skill radar visualization
- Everything runs in the browser, with data stored locally (no database setup needed)

I used **Claude** (AI assistant) extensively to help me write code, debug issues, and learn best practices as I went. It was genuinely like having a patient mentor available 24/7.

---

## What's Next

This is far from finished. Some things I'd like to add:
- User accounts and cloud sync
- More content across all modules
- Actual spaced repetition algorithms (currently simplified)
- Mobile app version
- Community features (compare progress with friends)

---

## Why I'm Sharing This

This project represents how I approach problems:
1. **Identify a real pain point** — disorganized interview prep
2. **Design a solution** — even if imperfect, something functional
3. **Learn by building** — picking up new skills along the way
4. **Iterate** — continuously improving based on actual usage

It's not meant to be a commercial product (at least not yet). It's a learning exercise, a productivity tool for myself, and hopefully something that shows how I think and work.

---

## Running Locally

If you want to explore the code:

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

---

## Screenshots

*(Coming soon)*

---

## License

This is a personal project, shared for educational purposes.
