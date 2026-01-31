-- ============================================================
-- SEED DATA: Level Thresholds
-- ============================================================

INSERT INTO public.level_thresholds (level, xp_required, title, perks) VALUES
(1, 0, 'Analyst Intern', '{"hearts_max": 5}'),
(2, 60, 'Junior Analyst', '{"hearts_max": 5}'),
(3, 150, 'Analyst', '{"hearts_max": 5, "streak_freeze_earned": 1}'),
(4, 300, 'Senior Analyst', '{"hearts_max": 6}'),
(5, 500, 'Associate', '{"hearts_max": 6, "streak_freeze_earned": 1}'),
(6, 800, 'Senior Associate', '{"hearts_max": 7}'),
(7, 1200, 'Engagement Manager', '{"hearts_max": 7, "streak_freeze_earned": 1}'),
(8, 1800, 'Principal', '{"hearts_max": 8}'),
(9, 2600, 'Associate Partner', '{"hearts_max": 8, "streak_freeze_earned": 2}'),
(10, 3600, 'Partner', '{"hearts_max": 10, "streak_freeze_earned": 2}'),
(11, 5000, 'Senior Partner', '{"hearts_max": 10}'),
(12, 7000, 'Managing Director', '{"hearts_max": 12}'),
(13, 10000, 'Global Managing Partner', '{"hearts_max": 15}');

-- ============================================================
-- SEED DATA: Achievements
-- ============================================================

INSERT INTO public.achievements (slug, name, description, xp_reward, requirement_type, requirement_value, tier) VALUES
-- Streak achievements
('streak_3', 'Getting Started', '3-day streak', 10, 'streak', 3, 'bronze'),
('streak_7', 'Week Warrior', '7-day streak', 25, 'streak', 7, 'bronze'),
('streak_14', 'Fortnight Fighter', '14-day streak', 50, 'streak', 14, 'silver'),
('streak_30', 'Monthly Master', '30-day streak', 100, 'streak', 30, 'gold'),
('streak_100', 'Centurion', '100-day streak', 500, 'streak', 100, 'platinum'),
-- XP achievements
('xp_100', 'First Steps', 'Earn 100 XP', 0, 'total_xp', 100, 'bronze'),
('xp_500', 'Rising Star', 'Earn 500 XP', 0, 'total_xp', 500, 'bronze'),
('xp_1000', 'Consultant', 'Earn 1,000 XP', 0, 'total_xp', 1000, 'silver'),
('xp_5000', 'Expert', 'Earn 5,000 XP', 0, 'total_xp', 5000, 'gold'),
('xp_10000', 'Partner Material', 'Earn 10,000 XP', 0, 'total_xp', 10000, 'platinum'),
-- Perfect session achievements
('perfect_1', 'Flawless', 'Complete a perfect session', 15, 'perfect_sessions', 1, 'bronze'),
('perfect_10', 'Precision Player', '10 perfect sessions', 50, 'perfect_sessions', 10, 'silver'),
('perfect_50', 'Perfectionist', '50 perfect sessions', 150, 'perfect_sessions', 50, 'gold');

-- ============================================================
-- SEED DATA: Pillars
-- ============================================================

INSERT INTO public.pillars (slug, name, description, color_hex, display_order) VALUES
('case_resolution', 'Case Resolution', 'Master the art of structured problem-solving with interactive cases', '#3b82f6', 1),
('maths_tools', 'Maths & Business Tools', 'CAGR, WACC, NPV and essential frameworks at your fingertips', '#22c55e', 2),
('business_sense', 'Business Sense', 'Develop your hypothesis reflex with real-world scenarios', '#f59e0b', 3),
('industry_insights', 'Industry Insights', 'Know margins, trends, and benchmarks across key industries', '#8b5cf6', 4),
('general_knowledge', 'General Knowledge', 'Macro data for market sizing: GDP, population, key stats', '#ec4899', 5);

-- ============================================================
-- SEED DATA: Topics
-- ============================================================

-- Business Sense Topics
INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'profitability_analysis', 'Profitability Analysis', 'Decompose margins and identify drivers', 1, 1
FROM public.pillars p WHERE p.slug = 'business_sense';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'unit_economics', 'Unit Economics', 'LTV, CAC, and customer profitability', 2, 2
FROM public.pillars p WHERE p.slug = 'business_sense';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'hypothesis_generation', 'Hypothesis Generation', 'Develop the hypothesis reflex', 2, 3
FROM public.pillars p WHERE p.slug = 'business_sense';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'revenue_decomposition', 'Revenue Decomposition', 'Break down revenue drivers', 1, 4
FROM public.pillars p WHERE p.slug = 'business_sense';

-- Industry Insights Topics
INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'pharma_healthcare', 'Pharma & Healthcare', 'Margins, R&D, and industry dynamics', 2, 1
FROM public.pillars p WHERE p.slug = 'industry_insights';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'retail_consumer', 'Retail & Consumer', 'Inventory, margins, and channel dynamics', 1, 2
FROM public.pillars p WHERE p.slug = 'industry_insights';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'tech_software', 'Tech & Software', 'SaaS metrics, cost structures, and growth', 2, 3
FROM public.pillars p WHERE p.slug = 'industry_insights';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'energy_utilities', 'Energy & Utilities', 'Capex, regulation, and margins', 3, 4
FROM public.pillars p WHERE p.slug = 'industry_insights';

-- Maths & Tools Topics
INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'growth_metrics', 'Growth Metrics', 'CAGR, YoY, and growth calculations', 1, 1
FROM public.pillars p WHERE p.slug = 'maths_tools';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'valuation', 'Valuation', 'NPV, IRR, WACC, and DCF basics', 2, 2
FROM public.pillars p WHERE p.slug = 'maths_tools';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'mental_math', 'Mental Math', 'Quick calculations and approximations', 1, 3
FROM public.pillars p WHERE p.slug = 'maths_tools';

-- General Knowledge Topics
INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'us_market', 'US Market', 'Population, GDP, and key economic data', 1, 1
FROM public.pillars p WHERE p.slug = 'general_knowledge';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'global_markets', 'Global Markets', 'International economic data and comparisons', 2, 2
FROM public.pillars p WHERE p.slug = 'general_knowledge';

-- Case Resolution Topics
INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'profitability_cases', 'Profitability Cases', 'Classic profit improvement scenarios', 1, 1
FROM public.pillars p WHERE p.slug = 'case_resolution';

INSERT INTO public.topics (pillar_id, slug, name, description, difficulty_tier, display_order)
SELECT p.id, 'market_entry', 'Market Entry', 'Should we enter this market?', 2, 2
FROM public.pillars p WHERE p.slug = 'case_resolution';

-- ============================================================
-- SEED DATA: Lessons
-- ============================================================

-- Business Sense - Profitability Analysis Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'margin_decomposition', 'Margin Decomposition', 'Break down margins to identify drivers', 5, 15, 1
FROM public.topics t WHERE t.slug = 'profitability_analysis';

INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'cost_structure', 'Cost Structure Analysis', 'Fixed vs variable, operating leverage', 5, 15, 2
FROM public.topics t WHERE t.slug = 'profitability_analysis';

-- Business Sense - Unit Economics Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'ltv_cac', 'LTV & CAC', 'Customer lifetime value and acquisition cost', 5, 15, 1
FROM public.topics t WHERE t.slug = 'unit_economics';

-- Industry Insights - Pharma Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'pharma_margins', 'Pharma Margins', 'Gross margins, R&D spend, and profitability', 5, 15, 1
FROM public.topics t WHERE t.slug = 'pharma_healthcare';

-- Industry Insights - Retail Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'retail_benchmarks', 'Retail Benchmarks', 'Margins and turnover by sub-sector', 5, 15, 1
FROM public.topics t WHERE t.slug = 'retail_consumer';

-- Industry Insights - Tech Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'saas_metrics', 'SaaS Metrics', 'Rule of 40, cost structure, and benchmarks', 5, 15, 1
FROM public.topics t WHERE t.slug = 'tech_software';

-- Maths & Tools - Growth Metrics Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'cagr_fundamentals', 'CAGR Fundamentals', 'Compound Annual Growth Rate calculations', 5, 10, 1
FROM public.topics t WHERE t.slug = 'growth_metrics';

-- General Knowledge - US Market Lessons
INSERT INTO public.lessons (topic_id, slug, name, description, estimated_minutes, xp_reward, display_order)
SELECT t.id, 'us_demographics', 'US Demographics', 'Population, households, and key stats', 5, 10, 1
FROM public.topics t WHERE t.slug = 'us_market';

-- ============================================================
-- SEED DATA: Content Items - Business Sense Drills
-- ============================================================

-- Drill 1: Revenue-Margin Paradox
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'drill', 3, ARRAY['profitability', 'margin_analysis', 'decomposition'], 90, 15, 1
FROM public.lessons l WHERE l.slug = 'margin_decomposition';

INSERT INTO public.drills (content_item_id, scenario_text, question_text, options, time_limit_seconds, explanation, framework_hint)
SELECT c.id,
'A consumer electronics retailer reports the following trends over 3 years:
- Revenue: +22% CAGR
- Gross Margin: Declined from 28% to 24%
- Operating Profit: Stable at $50M

The CEO claims the strategy is "working perfectly."',
'Which hypothesis BEST explains how the CEO''s claim could be valid?',
'[
  {"id": "a", "text": "They shifted to higher-volume, lower-margin products intentionally", "isCorrect": false, "feedback": "This explains declining margin but doesn''t explain stable profit with 22% revenue growth"},
  {"id": "b", "text": "Operating expenses were reduced proportionally to offset margin decline", "isCorrect": true, "feedback": "Correct. If GM declined but revenue grew significantly, OpEx reduction could stabilize operating profit"},
  {"id": "c", "text": "The company acquired competitors, inflating revenue artificially", "isCorrect": false, "feedback": "M&A would show up in operating costs and wouldn''t explain stable profit"},
  {"id": "d", "text": "Currency fluctuations masked the true performance", "isCorrect": false, "feedback": "Currency effects wouldn''t systematically explain all three metrics"}
]'::jsonb,
90,
'Let''s do the math:

Year 1: Revenue = $600M, GM = 28%, Gross Profit = $168M
OpEx must have been $118M for $50M operating profit.

Year 3: Revenue = ~$890M (+22% CAGR), GM = 24%, Gross Profit = $214M
For $50M operating profit, OpEx = $164M

OpEx ratio improved from 19.7% to 18.4% of revenue, suggesting efficiency gains or cost cuts offset margin compression.

Key insight: Revenue growth can mask margin decline if operating leverage improves.',
'Decompose: Operating Profit = (Revenue × Gross Margin) - Operating Expenses'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'margin_decomposition' AND c.display_order = 1;

-- Drill 2: LTV/CAC Analysis
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'drill', 2, ARRAY['unit_economics', 'LTV_CAC', 'subscription'], 75, 12, 1
FROM public.lessons l WHERE l.slug = 'ltv_cac';

INSERT INTO public.drills (content_item_id, scenario_text, question_text, options, time_limit_seconds, explanation, framework_hint)
SELECT c.id,
'A D2C subscription box company shares these metrics:
- CAC (Customer Acquisition Cost): $80
- Average Order Value: $40/month
- Gross Margin: 60%
- Average Customer Lifetime: 8 months',
'Should the company INCREASE or DECREASE marketing spend, and why?',
'[
  {"id": "a", "text": "INCREASE - LTV/CAC ratio is healthy at 2.4x", "isCorrect": true, "feedback": "Correct! LTV = $40 × 60% × 8 = $192. LTV/CAC = $192/$80 = 2.4x. Above 3x is ideal, but 2.4x is healthy for growth."},
  {"id": "b", "text": "DECREASE - They''re losing money on each customer", "isCorrect": false, "feedback": "Incorrect. LTV ($192) exceeds CAC ($80), so each customer is profitable."},
  {"id": "c", "text": "INCREASE - 8-month lifetime means fast payback", "isCorrect": false, "feedback": "Partially right reasoning. Payback = CAC / Monthly Contribution = $80 / $24 = 3.3 months. Fast, but that''s not the key metric."},
  {"id": "d", "text": "DECREASE - 60% margin is too low for subscription", "isCorrect": false, "feedback": "60% gross margin is healthy for physical goods subscription. Digital would be higher."}
]'::jsonb,
75,
'Unit Economics Breakdown:

• Monthly Contribution = $40 × 60% = $24
• Customer LTV = $24 × 8 months = $192
• LTV/CAC Ratio = $192 / $80 = 2.4x
• Payback Period = $80 / $24 = 3.3 months

Benchmarks:
- LTV/CAC > 3x = Excellent
- LTV/CAC 2-3x = Healthy, can scale
- LTV/CAC < 1x = Losing money

At 2.4x with 3-month payback, this is a healthy unit economics model.',
'Calculate LTV = AOV × Margin × Lifetime. Then compare LTV/CAC ratio.'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'ltv_cac' AND c.display_order = 1;

-- ============================================================
-- SEED DATA: Content Items - Industry Insights Quizzes
-- ============================================================

-- Quiz 1: Pharma Margins
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'quiz', 2, ARRAY['pharma', 'gross_margin', 'benchmarks'], 45, 10, 1
FROM public.lessons l WHERE l.slug = 'pharma_margins';

INSERT INTO public.quiz_questions (content_item_id, question_type, question_text, chart_data, options, explanation, data_source)
SELECT c.id,
'data_interpretation',
'What is the typical GROSS MARGIN range for a major pharmaceutical company?',
'{"type": "bar", "title": "Gross Margins by Industry (2023 Median)", "data": [{"label": "Software/SaaS", "value": 72}, {"label": "Pharma", "value": null}, {"label": "Retail (Grocery)", "value": 28}, {"label": "Airlines", "value": 35}, {"label": "Automotive", "value": 18}]}'::jsonb,
'[
  {"id": "a", "text": "45-55%", "isCorrect": false},
  {"id": "b", "text": "65-80%", "isCorrect": true},
  {"id": "c", "text": "30-40%", "isCorrect": false},
  {"id": "d", "text": "85-95%", "isCorrect": false}
]'::jsonb,
'Pharma gross margins typically range 65-80% because:

**High margin drivers:**
• Patent protection enables premium pricing
• Low marginal production cost (pills are cheap to manufacture)
• Life-critical products have inelastic demand

**Examples (2023):**
• Pfizer: 66%
• J&J (Pharma segment): 69%
• AbbVie: 70%
• Regeneron: 87%

**Contrast with Operating Margin (15-30%):**
High R&D (15-20% of revenue) and SG&A eat into gross profit significantly.',
'Company 10-K filings, 2023'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'pharma_margins' AND c.display_order = 1;

-- Quiz 2: Retail Inventory Turnover
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'quiz', 3, ARRAY['retail', 'inventory_turnover', 'working_capital'], 60, 12, 1
FROM public.lessons l WHERE l.slug = 'retail_benchmarks';

INSERT INTO public.quiz_questions (content_item_id, question_type, question_text, chart_data, options, explanation, data_source)
SELECT c.id,
'chart_reading',
'Based on the data below, which retail sub-sector has the HIGHEST inventory turnover (annual)?',
'{"type": "table", "title": "Retail Metrics by Sub-Sector (2023 Industry Averages)", "headers": ["Sub-Sector", "Gross Margin", "Net Margin", "Inventory Days"], "rows": [["Grocery", "28%", "2.5%", "18"], ["Apparel", "52%", "7%", "85"], ["Electronics", "25%", "3%", "45"], ["Home Improvement", "34%", "9%", "75"], ["Luxury Goods", "65%", "15%", "120"]]}'::jsonb,
'[
  {"id": "a", "text": "Grocery (~20x turnover)", "isCorrect": true},
  {"id": "b", "text": "Electronics (~8x turnover)", "isCorrect": false},
  {"id": "c", "text": "Apparel (~4x turnover)", "isCorrect": false},
  {"id": "d", "text": "Home Improvement (~5x turnover)", "isCorrect": false}
]'::jsonb,
'**Inventory Turnover = 365 / Inventory Days**

• Grocery: 365/18 = **20.3x** ✓ (Perishables require rapid turnover)
• Electronics: 365/45 = 8.1x
• Home Improvement: 365/75 = 4.9x
• Apparel: 365/85 = 4.3x
• Luxury: 365/120 = 3x (Exclusivity > velocity)

**Consulting Insight:**
Grocery''s high turnover compensates for thin margins (2.5% net). They make money on volume and velocity, not markup.

**Formula to remember:**
- Inventory Days = (Avg Inventory / COGS) × 365
- Or quick estimate: Turnover ≈ 365 / Inventory Days',
'NYU Stern Damodaran Dataset, 2023'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'retail_benchmarks' AND c.display_order = 1;

-- Quiz 3: SaaS Cost Structure
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'quiz', 3, ARRAY['SaaS', 'cost_structure', 'benchmarks'], 75, 15, 1
FROM public.lessons l WHERE l.slug = 'saas_metrics';

INSERT INTO public.quiz_questions (content_item_id, question_type, question_text, chart_data, options, explanation, data_source)
SELECT c.id,
'data_interpretation',
'A mature SaaS company spends 45% of revenue on Sales & Marketing. What does this suggest about their business?',
'{"type": "bar_grouped", "title": "SaaS Cost Structure by Stage", "categories": ["Early-Stage", "Growth", "Mature"], "series": [{"name": "R&D", "data": [35, 25, 18]}, {"name": "S&M", "data": [55, 40, 25]}, {"name": "G&A", "data": [20, 15, 10]}]}'::jsonb,
'[
  {"id": "a", "text": "They''re likely in a highly competitive market with low switching costs", "isCorrect": true},
  {"id": "b", "text": "They''re over-investing in growth at the expense of profitability", "isCorrect": false},
  {"id": "c", "text": "This is normal for mature SaaS; nothing to investigate", "isCorrect": false},
  {"id": "d", "text": "Their product likely has poor product-market fit", "isCorrect": false}
]'::jsonb,
'**45% S&M for mature SaaS is a RED FLAG** (benchmark: 20-30%)

This elevated spend suggests:
1. **High competition** - Need aggressive sales to win deals
2. **Low switching costs** - Must constantly fight churn
3. **Weak product differentiation** - Can''t win on product alone
4. **Possible: Enterprise-heavy model** - Long sales cycles, high touch

**Benchmarks (Mature SaaS):**
• Salesforce: ~45% S&M (highly competitive CRM market)
• Workday: ~35% S&M (complex enterprise sales)
• Zoom: ~25% S&M (strong product-led growth)
• Atlassian: ~15% S&M (legendary PLG efficiency)

**Rule of thumb:** If mature SaaS S&M > 35%, investigate competitive dynamics.',
'SaaS Capital Benchmarks, KeyBanc SaaS Survey 2023'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'saas_metrics' AND c.display_order = 1;

-- ============================================================
-- SEED DATA: Content Items - Maths & Tools Flashcards
-- ============================================================

-- Flashcard 1: CAGR
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'flashcard', 2, ARRAY['formula', 'CAGR', 'growth'], 30, 5, 1
FROM public.lessons l WHERE l.slug = 'cagr_fundamentals';

INSERT INTO public.flashcards (content_item_id, front_content, back_content, explanation, formula, mnemonic)
SELECT c.id,
'What is the formula for CAGR (Compound Annual Growth Rate)?',
'CAGR = (Ending Value / Beginning Value)^(1/n) - 1',
'CAGR measures the average annual growth rate over multiple periods, smoothing out volatility to show a steady rate.',
'(V_final / V_initial)^(1/years) - 1',
'Think: "Growth per year, averaged out" - it''s the constant rate that would get you from start to end.'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'cagr_fundamentals' AND c.display_order = 1;

-- Flashcard 2: Rule of 72
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'flashcard', 1, ARRAY['mental_math', 'rule_of_72', 'growth'], 30, 5, 2
FROM public.lessons l WHERE l.slug = 'cagr_fundamentals';

INSERT INTO public.flashcards (content_item_id, front_content, back_content, explanation, formula, mnemonic)
SELECT c.id,
'What is the Rule of 72 and when do you use it?',
'Years to double = 72 / Growth Rate (%)',
'Quick mental math to estimate doubling time. At 8% growth, money doubles in ~9 years (72/8). At 12% growth, ~6 years.',
'72 / rate = years to double',
'72 is divisible by many numbers (2, 3, 4, 6, 8, 9, 12) making mental math easy!'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'cagr_fundamentals' AND c.display_order = 2;

-- ============================================================
-- SEED DATA: Content Items - General Knowledge Facts
-- ============================================================

-- Fact 1: US Population
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'fact', 1, ARRAY['US', 'population', 'demographics'], 20, 3, 1
FROM public.lessons l WHERE l.slug = 'us_demographics';

INSERT INTO public.facts (content_item_id, fact_text, category, verification_question, answer, source)
SELECT c.id,
'US Population: ~335 million people (2024)',
'geography',
'The US population is approximately how many million?',
'{"correct": "335", "alternatives": ["330-340"], "explanation": "As of 2024, the US population is approximately 335 million, making it the third most populous country after China and India."}'::jsonb,
'US Census Bureau, 2024'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'us_demographics' AND c.display_order = 1;

-- Fact 2: US Households
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'fact', 1, ARRAY['US', 'households', 'demographics'], 20, 3, 2
FROM public.lessons l WHERE l.slug = 'us_demographics';

INSERT INTO public.facts (content_item_id, fact_text, category, verification_question, answer, source)
SELECT c.id,
'US Households: ~130 million households (average 2.5 people/household)',
'geography',
'How many households are there in the US (approximately)?',
'{"correct": "130 million", "alternatives": ["125-135 million"], "explanation": "The US has approximately 130 million households. Useful for market sizing: if a product is per-household, use 130M not 335M."}'::jsonb,
'US Census Bureau, 2024'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'us_demographics' AND c.display_order = 2;

-- Fact 3: US GDP
INSERT INTO public.content_items (lesson_id, content_type, difficulty, tags, estimated_seconds, xp_value, display_order)
SELECT l.id, 'fact', 2, ARRAY['US', 'GDP', 'economics'], 20, 3, 3
FROM public.lessons l WHERE l.slug = 'us_demographics';

INSERT INTO public.facts (content_item_id, fact_text, category, verification_question, answer, source)
SELECT c.id,
'US GDP: ~$28 trillion (2024), GDP per capita ~$83,000',
'economics',
'What is the approximate US GDP in trillions?',
'{"correct": "28", "alternatives": ["26-30"], "explanation": "US GDP is approximately $28 trillion, making it the world''s largest economy. GDP per capita of ~$83K is among the highest globally."}'::jsonb,
'World Bank, IMF 2024'
FROM public.content_items c
JOIN public.lessons l ON c.lesson_id = l.id
WHERE l.slug = 'us_demographics' AND c.display_order = 3;
