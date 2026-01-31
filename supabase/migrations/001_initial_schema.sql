-- ============================================================
-- CONSULT PREP - DATABASE SCHEMA
-- "Duolingo for Consulting" MVP
-- ============================================================

-- ============================================================
-- CORE USER TABLES
-- ============================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    avatar_url TEXT,
    target_company TEXT CHECK (target_company IN ('mckinsey', 'bcg', 'bain', 'other')),
    target_role TEXT,
    experience_level TEXT CHECK (experience_level IN ('student', 'professional', 'career_change')),
    weekly_goal_minutes INTEGER DEFAULT 60,
    timezone TEXT DEFAULT 'UTC',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User gamification state
CREATE TABLE public.user_gamification (
    user_id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    total_xp INTEGER DEFAULT 0,
    current_level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    streak_freeze_count INTEGER DEFAULT 0,
    streak_freeze_used_date DATE,
    gems INTEGER DEFAULT 50,
    hearts INTEGER DEFAULT 5,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- XP transaction log
CREATE TABLE public.xp_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    amount INTEGER NOT NULL,
    source_type TEXT NOT NULL,
    source_id UUID,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements/Badges
CREATE TABLE public.achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    xp_reward INTEGER DEFAULT 0,
    requirement_type TEXT NOT NULL CHECK (requirement_type IN ('streak', 'total_xp', 'content_complete', 'perfect_sessions')),
    requirement_value INTEGER NOT NULL,
    requirement_metadata JSONB DEFAULT '{}',
    tier TEXT DEFAULT 'bronze' CHECK (tier IN ('bronze', 'silver', 'gold', 'platinum')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User achievements (earned badges)
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    achievement_id UUID NOT NULL REFERENCES public.achievements(id),
    earned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, achievement_id)
);

-- Level thresholds
CREATE TABLE public.level_thresholds (
    level INTEGER PRIMARY KEY,
    xp_required INTEGER NOT NULL,
    title TEXT NOT NULL,
    perks JSONB DEFAULT '{}'
);

-- ============================================================
-- CONTENT HIERARCHY TABLES
-- ============================================================

-- Content pillars (top-level categories)
CREATE TABLE public.pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    color_hex TEXT,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Topics within pillars
CREATE TABLE public.topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pillar_id UUID NOT NULL REFERENCES public.pillars(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    icon_url TEXT,
    difficulty_tier INTEGER DEFAULT 1 CHECK (difficulty_tier BETWEEN 1 AND 3),
    display_order INTEGER DEFAULT 0,
    prerequisite_topic_id UUID REFERENCES public.topics(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(pillar_id, slug)
);

-- Lessons within topics
CREATE TABLE public.lessons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    slug TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER DEFAULT 5,
    xp_reward INTEGER DEFAULT 10,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(topic_id, slug)
);

-- ============================================================
-- CONTENT ITEMS (Polymorphic approach)
-- ============================================================

-- Base content items table
CREATE TABLE public.content_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id UUID NOT NULL REFERENCES public.lessons(id) ON DELETE CASCADE,
    content_type TEXT NOT NULL CHECK (content_type IN ('flashcard', 'drill', 'case_step', 'quiz', 'fact')),
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    tags TEXT[] DEFAULT '{}',
    estimated_seconds INTEGER DEFAULT 30,
    xp_value INTEGER DEFAULT 5,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Flashcards (Maths & Business Tools)
CREATE TABLE public.flashcards (
    content_item_id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    front_content TEXT NOT NULL,
    front_image_url TEXT,
    back_content TEXT NOT NULL,
    back_image_url TEXT,
    explanation TEXT,
    formula TEXT,
    mnemonic TEXT,
    related_flashcard_ids UUID[] DEFAULT '{}'
);

-- Drills (Business Sense - short scenarios)
CREATE TABLE public.drills (
    content_item_id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    scenario_text TEXT NOT NULL,
    scenario_image_url TEXT,
    question_text TEXT NOT NULL,
    options JSONB NOT NULL,
    time_limit_seconds INTEGER,
    explanation TEXT NOT NULL,
    framework_hint TEXT
);

-- Case Steps (Case Resolution - interactive walkthrough)
CREATE TABLE public.case_steps (
    content_item_id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    case_id UUID NOT NULL,
    step_number INTEGER NOT NULL,
    step_type TEXT NOT NULL CHECK (step_type IN ('context', 'clarifying_question', 'structure', 'analysis', 'synthesis', 'recommendation')),
    prompt_text TEXT NOT NULL,
    expected_response_type TEXT,
    options JSONB,
    ideal_response TEXT,
    scoring_rubric JSONB,
    hints JSONB DEFAULT '[]',
    time_guidance_seconds INTEGER
);

-- Cases (grouping entity for case steps)
CREATE TABLE public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    client_name TEXT,
    industry TEXT,
    case_type TEXT CHECK (case_type IN ('profitability', 'market_entry', 'growth_strategy', 'ma', 'pricing')),
    difficulty INTEGER DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    estimated_minutes INTEGER DEFAULT 20,
    context_text TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Quiz Questions (Industry Insights - data interpretation)
CREATE TABLE public.quiz_questions (
    content_item_id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    question_type TEXT NOT NULL CHECK (question_type IN ('chart_reading', 'data_interpretation', 'industry_knowledge')),
    question_text TEXT NOT NULL,
    chart_data JSONB,
    chart_type TEXT,
    chart_image_url TEXT,
    options JSONB NOT NULL,
    explanation TEXT NOT NULL,
    data_source TEXT
);

-- Facts (General Knowledge - macro facts)
CREATE TABLE public.facts (
    content_item_id UUID PRIMARY KEY REFERENCES public.content_items(id) ON DELETE CASCADE,
    fact_text TEXT NOT NULL,
    category TEXT CHECK (category IN ('economics', 'industry', 'company', 'geography')),
    verification_question TEXT,
    answer JSONB NOT NULL,
    source TEXT,
    last_verified_at DATE
);

-- ============================================================
-- SPACED REPETITION SYSTEM
-- ============================================================

-- User progress on individual content items (SM-2 algorithm data)
CREATE TABLE public.user_content_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,

    -- SM-2 Algorithm Fields
    repetitions INTEGER DEFAULT 0,
    ease_factor DECIMAL(4,2) DEFAULT 2.5,
    interval_days INTEGER DEFAULT 0,
    next_review_at TIMESTAMPTZ,

    -- Performance tracking
    times_seen INTEGER DEFAULT 0,
    times_correct INTEGER DEFAULT 0,
    last_quality_score INTEGER,
    average_response_time_ms INTEGER,

    -- State
    status TEXT DEFAULT 'new' CHECK (status IN ('new', 'learning', 'review', 'mastered')),
    first_seen_at TIMESTAMPTZ,
    last_reviewed_at TIMESTAMPTZ,
    mastered_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, content_item_id)
);

-- Review history (for analytics and algorithm tuning)
CREATE TABLE public.review_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,

    quality_score INTEGER NOT NULL CHECK (quality_score BETWEEN 0 AND 5),
    response_time_ms INTEGER,
    was_correct BOOLEAN NOT NULL,

    -- Snapshot of SM-2 state AFTER this review
    ease_factor_after DECIMAL(4,2),
    interval_days_after INTEGER,
    repetitions_after INTEGER,

    session_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SESSION & PROGRESS TRACKING
-- ============================================================

-- Study sessions
CREATE TABLE public.study_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    session_type TEXT NOT NULL CHECK (session_type IN ('practice', 'review', 'quick_drill', 'full_case')),
    pillar_id UUID REFERENCES public.pillars(id),
    topic_id UUID REFERENCES public.topics(id),

    -- Session metrics
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ended_at TIMESTAMPTZ,
    duration_seconds INTEGER,

    items_attempted INTEGER DEFAULT 0,
    items_correct INTEGER DEFAULT 0,
    xp_earned INTEGER DEFAULT 0,

    -- Session composition
    new_items_count INTEGER DEFAULT 0,
    review_items_count INTEGER DEFAULT 0,
    weak_items_count INTEGER DEFAULT 0,

    completed BOOLEAN DEFAULT FALSE
);

-- Individual items within a session
CREATE TABLE public.session_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID NOT NULL REFERENCES public.study_sessions(id) ON DELETE CASCADE,
    content_item_id UUID NOT NULL REFERENCES public.content_items(id) ON DELETE CASCADE,

    item_order INTEGER NOT NULL,
    was_correct BOOLEAN,
    quality_score INTEGER CHECK (quality_score BETWEEN 0 AND 5),
    response_time_ms INTEGER,
    hints_used INTEGER DEFAULT 0,
    skipped BOOLEAN DEFAULT FALSE,

    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ
);

-- User progress by topic (aggregated for quick access)
CREATE TABLE public.user_topic_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,

    items_total INTEGER DEFAULT 0,
    items_seen INTEGER DEFAULT 0,
    items_mastered INTEGER DEFAULT 0,

    proficiency_score DECIMAL(5,2) DEFAULT 0,
    recent_accuracy DECIMAL(5,2) DEFAULT 0,
    average_quality DECIMAL(3,2) DEFAULT 2.5,
    last_practiced_at TIMESTAMPTZ,

    -- Unlock status
    is_unlocked BOOLEAN DEFAULT FALSE,
    unlocked_at TIMESTAMPTZ,

    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),

    UNIQUE(user_id, topic_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================

-- User lookups
CREATE INDEX idx_user_gamification_level ON public.user_gamification(current_level);
CREATE INDEX idx_user_gamification_streak ON public.user_gamification(current_streak DESC);

-- Content item lookups
CREATE INDEX idx_content_items_lesson ON public.content_items(lesson_id);
CREATE INDEX idx_content_items_type ON public.content_items(content_type);
CREATE INDEX idx_content_items_difficulty ON public.content_items(difficulty);

-- Spaced repetition queries (critical path)
CREATE INDEX idx_user_content_progress_review ON public.user_content_progress(user_id, next_review_at)
    WHERE status IN ('learning', 'review');
CREATE INDEX idx_user_content_progress_status ON public.user_content_progress(user_id, status);

-- Session lookups
CREATE INDEX idx_study_sessions_user_date ON public.study_sessions(user_id, started_at DESC);
CREATE INDEX idx_review_history_user_content ON public.review_history(user_id, content_item_id, created_at DESC);

-- Topic progress
CREATE INDEX idx_user_topic_progress_user ON public.user_topic_progress(user_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_topic_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.xp_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_history ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON public.users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own gamification" ON public.user_gamification
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress" ON public.user_content_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own sessions" ON public.study_sessions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own session items" ON public.session_items
    FOR ALL USING (
        session_id IN (
            SELECT id FROM public.study_sessions WHERE user_id = auth.uid()
        )
    );

CREATE POLICY "Users can view own achievements" ON public.user_achievements
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own topic progress" ON public.user_topic_progress
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own xp transactions" ON public.xp_transactions
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own review history" ON public.review_history
    FOR ALL USING (auth.uid() = user_id);

-- Content is readable by all authenticated users
ALTER TABLE public.pillars ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.facts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.case_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.level_thresholds ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read pillars" ON public.pillars
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read topics" ON public.topics
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read lessons" ON public.lessons
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read content" ON public.content_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read flashcards" ON public.flashcards
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read drills" ON public.drills
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read quiz questions" ON public.quiz_questions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read facts" ON public.facts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read cases" ON public.cases
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read case steps" ON public.case_steps
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read achievements" ON public.achievements
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can read level thresholds" ON public.level_thresholds
    FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to relevant tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_gamification_updated_at
    BEFORE UPDATE ON public.user_gamification
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_content_progress_updated_at
    BEFORE UPDATE ON public.user_content_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_topic_progress_updated_at
    BEFORE UPDATE ON public.user_topic_progress
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at
    BEFORE UPDATE ON public.content_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile and gamification on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email)
    VALUES (NEW.id, NEW.email);

    INSERT INTO public.user_gamification (user_id)
    VALUES (NEW.id);

    RETURN NEW;
END;
$$ language 'plpgsql' SECURITY DEFINER;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();
