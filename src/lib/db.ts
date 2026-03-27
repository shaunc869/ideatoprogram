import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import crypto from "crypto";

const DB_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DB_DIR, "codelearner.db");

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

let _db: Database.Database | null = null;

function getDb(): Database.Database {
  if (_db) return _db;
  ensureDir();
  _db = new Database(DB_PATH);
  _db.pragma("journal_mode = WAL");
  _db.pragma("foreign_keys = ON");
  initTables(_db);
  return _db;
}

function initTables(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      is_pro INTEGER NOT NULL DEFAULT 0,
      theme TEXT NOT NULL DEFAULT 'dark',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS progress (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT 0,
      revealed INTEGER NOT NULL DEFAULT 0,
      xp_earned INTEGER NOT NULL DEFAULT 0,
      completed_at TEXT,
      UNIQUE(user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      lessons_done INTEGER NOT NULL DEFAULT 0,
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS achievements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      badge_id TEXT NOT NULL,
      earned_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_id)
    );

    CREATE TABLE IF NOT EXISTS bookmarks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS saved_code (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      code TEXT NOT NULL DEFAULT '',
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, lesson_id)
    );

    CREATE TABLE IF NOT EXISTS vibe_projects (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title TEXT NOT NULL DEFAULT 'Untitled Project',
      language TEXT NOT NULL DEFAULT 'python',
      code TEXT NOT NULL DEFAULT '',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS vibe_usage (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      used_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_progress_user ON progress(user_id);
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_streaks_user ON streaks(user_id);
    CREATE INDEX IF NOT EXISTS idx_achievements_user ON achievements(user_id);
    CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
    CREATE INDEX IF NOT EXISTS idx_saved_code_user ON saved_code(user_id);
    CREATE INDEX IF NOT EXISTS idx_vibe_projects_user ON vibe_projects(user_id);
    CREATE INDEX IF NOT EXISTS idx_vibe_usage_user ON vibe_usage(user_id);

    CREATE TABLE IF NOT EXISTS subscriptions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL,
      billing TEXT NOT NULL DEFAULT 'monthly',
      price_cents INTEGER NOT NULL,
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      expires_at TEXT NOT NULL,
      active INTEGER NOT NULL DEFAULT 1,
      UNIQUE(user_id, plan)
    );

    CREATE TABLE IF NOT EXISTS referrals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      referrer_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      referred_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      bonus_given INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(referred_id)
    );

    CREATE TABLE IF NOT EXISTS teams (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      plan TEXT NOT NULL DEFAULT 'classroom',
      max_seats INTEGER NOT NULL DEFAULT 30,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      team_id TEXT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      role TEXT NOT NULL DEFAULT 'student',
      UNIQUE(team_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS daily_challenges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      starter_code TEXT NOT NULL DEFAULT '',
      expected_output TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'python',
      difficulty TEXT NOT NULL DEFAULT 'medium',
      hint TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS daily_challenge_submissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      challenge_date TEXT NOT NULL,
      code TEXT NOT NULL,
      passed INTEGER NOT NULL DEFAULT 0,
      submitted_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, challenge_date)
    );

    CREATE TABLE IF NOT EXISTS projects (
      id TEXT PRIMARY KEY,
      lesson_group TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      requirements TEXT NOT NULL,
      starter_code TEXT NOT NULL DEFAULT '',
      language TEXT NOT NULL DEFAULT 'python',
      after_lesson INTEGER NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
    CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON referrals(referrer_id);
    CREATE INDEX IF NOT EXISTS idx_daily_subs_user ON daily_challenge_submissions(user_id);

    CREATE TABLE IF NOT EXISTS password_resets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at TEXT NOT NULL,
      used INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS comments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      lesson_id TEXT NOT NULL,
      text TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS shared_projects (
      id TEXT PRIMARY KEY,
      project_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      user_name TEXT NOT NULL,
      title TEXT NOT NULL,
      language TEXT NOT NULL,
      code TEXT NOT NULL,
      shared_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_comments_lesson ON comments(lesson_id);
    CREATE INDEX IF NOT EXISTS idx_password_resets_token ON password_resets(token);
  `);

  // Migrations
  try { db.exec("ALTER TABLE users ADD COLUMN is_vibe_unlimited INTEGER NOT NULL DEFAULT 0"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN chosen_path TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN referral_code TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN bonus_prompts INTEGER NOT NULL DEFAULT 0"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN github_id TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN google_id TEXT"); } catch {}
  try { db.exec("ALTER TABLE users ADD COLUMN avatar_url TEXT NOT NULL DEFAULT ''"); } catch {}
}

// ----- Password hashing with salt -----
function hashPassword(password: string, salt?: string): { hash: string; salt: string } {
  const s = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, s, 100000, 64, "sha512").toString("hex");
  return { hash, salt: s };
}

function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  const { hash } = hashPassword(password, storedSalt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(storedHash));
}

// ----- Token (signed HMAC) -----
const TOKEN_SECRET = process.env.TOKEN_SECRET || "codelearner-secret-change-in-production-2026";

export function createToken(userId: string): string {
  const payload = Buffer.from(JSON.stringify({ id: userId, ts: Date.now() })).toString("base64url");
  const sig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token: string): string | null {
  try {
    const [payload, sig] = token.split(".");
    if (!payload || !sig) return null;
    const expectedSig = crypto.createHmac("sha256", TOKEN_SECRET).update(payload).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (Date.now() - data.ts > 30 * 24 * 60 * 60 * 1000) return null;
    return data.id;
  } catch {
    return null;
  }
}

// ----- User operations -----
export interface SafeUser {
  id: string;
  name: string;
  email: string;
  isPro: boolean;
  isVibeUnlimited: boolean;
  chosenPath: string;
  referralCode: string;
  bonusPrompts: number;
  theme: string;
  createdAt: string;
  subscriptions: SubInfo[];
}

export interface SubInfo {
  plan: string;
  billing: string;
  expiresAt: string;
  active: boolean;
}

// Plan definitions
export const PLANS = {
  pro_all: { name: "Pro All (760+ lessons)", monthly: 1000, yearly: 10000 },
  pro_python: { name: "Pro Python (100 lessons)", monthly: 500, yearly: 5000 },
  pro_javascript: { name: "Pro JavaScript (100 lessons)", monthly: 500, yearly: 5000 },
  vibe_pro: { name: "Vibe Pro (Unlimited AI)", monthly: 1500, yearly: 15000 },
} as const;

function getUserSubs(db: Database.Database, userId: string): SubInfo[] {
  const rows = db.prepare("SELECT plan, billing, expires_at, active FROM subscriptions WHERE user_id = ? AND active = 1 AND expires_at > datetime('now')").all(userId) as {
    plan: string; billing: string; expires_at: string; active: number;
  }[];
  return rows.map((r) => ({ plan: r.plan, billing: r.billing, expiresAt: r.expires_at, active: !!r.active }));
}

function buildSafeUser(row: Record<string, unknown>, subs: SubInfo[]): SafeUser {
  const hasSub = (plan: string) => subs.some((s) => s.plan === plan);
  return {
    id: row.id as string,
    name: row.name as string,
    email: row.email as string,
    isPro: !!(row.is_pro as number) || hasSub("pro_all"),
    isVibeUnlimited: !!(row.is_vibe_unlimited as number) || hasSub("vibe_pro"),
    chosenPath: (row.chosen_path as string) || "",
    referralCode: (row.referral_code as string) || "",
    bonusPrompts: (row.bonus_prompts as number) || 0,
    theme: (row.theme as string) || "dark",
    createdAt: row.created_at as string,
    subscriptions: subs,
  };
}

export function createUser(name: string, email: string, password: string): SafeUser | null {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (existing) return null;
  const id = crypto.randomUUID();
  const { hash, salt } = hashPassword(password);
  const passwordHash = `${salt}:${hash}`;
  const refCode = id.split("-")[0];
  db.prepare("INSERT INTO users (id, name, email, password_hash, referral_code) VALUES (?, ?, ?, ?, ?)").run(id, name, email, passwordHash, refCode);
  return { id, name, email, isPro: false, isVibeUnlimited: false, chosenPath: "", referralCode: refCode, bonusPrompts: 0, theme: "dark", createdAt: new Date().toISOString(), subscriptions: [] };
}

export function loginUser(email: string, password: string): SafeUser | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as Record<string, unknown> | undefined;
  if (!row) return null;
  const [salt, hash] = (row.password_hash as string).split(":");
  if (!verifyPassword(password, hash, salt)) return null;
  return buildSafeUser(row, getUserSubs(db, row.id as string));
}

export function getUserById(id: string): SafeUser | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM users WHERE id = ?").get(id) as Record<string, unknown> | undefined;
  if (!row) return null;
  return buildSafeUser(row, getUserSubs(db, id));
}

export function upgradeUser(id: string): boolean {
  const db = getDb();
  return db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(id).changes > 0;
}

export function updateUserProfile(id: string, name: string): boolean {
  const db = getDb();
  return db.prepare("UPDATE users SET name = ? WHERE id = ?").run(name, id).changes > 0;
}

export function setUserPath(id: string, path: string): boolean {
  const db = getDb();
  return db.prepare("UPDATE users SET chosen_path = ? WHERE id = ?").run(path, id).changes > 0;
}

export function updateUserTheme(id: string, theme: string): boolean {
  const db = getDb();
  return db.prepare("UPDATE users SET theme = ? WHERE id = ?").run(theme, id).changes > 0;
}

export function changePassword(id: string, oldPassword: string, newPassword: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT password_hash FROM users WHERE id = ?").get(id) as { password_hash: string } | undefined;
  if (!row) return false;
  const [salt, hash] = row.password_hash.split(":");
  if (!verifyPassword(oldPassword, hash, salt)) return false;
  const np = hashPassword(newPassword);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(`${np.salt}:${np.hash}`, id);
  return true;
}

export function resetPassword(email: string, newPassword: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT id FROM users WHERE email = ?").get(email) as { id: string } | undefined;
  if (!row) return false;
  const np = hashPassword(newPassword);
  db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(`${np.salt}:${np.hash}`, row.id);
  return true;
}

// ----- Progress operations -----
export interface UserProgress {
  userId: string;
  xp: number;
  completedLessons: string[];
  revealedAnswers: string[];
}

export function getProgress(userId: string): UserProgress {
  const db = getDb();
  const rows = db.prepare("SELECT lesson_id, completed, revealed, xp_earned FROM progress WHERE user_id = ?").all(userId) as {
    lesson_id: string; completed: number; revealed: number; xp_earned: number;
  }[];
  let xp = 0;
  const completedLessons: string[] = [];
  const revealedAnswers: string[] = [];
  for (const row of rows) {
    xp += row.xp_earned;
    if (row.completed) completedLessons.push(row.lesson_id);
    if (row.revealed) revealedAnswers.push(row.lesson_id);
  }
  return { userId, xp, completedLessons, revealedAnswers };
}

export function completeLesson(userId: string, lessonId: string, xpReward: number): UserProgress {
  const db = getDb();
  const existing = db.prepare("SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?").get(userId, lessonId) as {
    completed: number; revealed: number; xp_earned: number;
  } | undefined;

  if (existing) {
    if (existing.completed && !existing.revealed) return getProgress(userId);
    const newXp = existing.xp_earned > 0 ? 0 : xpReward;
    db.prepare("UPDATE progress SET completed = 1, revealed = 0, xp_earned = xp_earned + ?, completed_at = datetime('now') WHERE user_id = ? AND lesson_id = ?").run(newXp, userId, lessonId);
  } else {
    db.prepare("INSERT INTO progress (user_id, lesson_id, completed, revealed, xp_earned, completed_at) VALUES (?, ?, 1, 0, ?, datetime('now'))").run(userId, lessonId, xpReward);
  }

  // Record streak
  const today = new Date().toISOString().split("T")[0];
  const streakRow = db.prepare("SELECT * FROM streaks WHERE user_id = ? AND date = ?").get(userId, today);
  if (streakRow) {
    db.prepare("UPDATE streaks SET lessons_done = lessons_done + 1 WHERE user_id = ? AND date = ?").run(userId, today);
  } else {
    db.prepare("INSERT INTO streaks (user_id, date, lessons_done) VALUES (?, ?, 1)").run(userId, today);
  }

  // Check achievements
  checkAndAwardAchievements(userId);

  return getProgress(userId);
}

export function revealAnswer(userId: string, lessonId: string): UserProgress | null {
  const db = getDb();
  const prog = getProgress(userId);
  if (prog.xp < 5) return null;

  const existing = db.prepare("SELECT * FROM progress WHERE user_id = ? AND lesson_id = ?").get(userId, lessonId) as { xp_earned: number } | undefined;
  if (existing) {
    db.prepare("UPDATE progress SET revealed = 1, completed = 0, xp_earned = MAX(0, xp_earned - 5) WHERE user_id = ? AND lesson_id = ?").run(userId, lessonId);
  } else {
    db.prepare("INSERT INTO progress (user_id, lesson_id, completed, revealed, xp_earned) VALUES (?, ?, 0, 1, 0)").run(userId, lessonId);
    const latest = db.prepare("SELECT rowid, xp_earned FROM progress WHERE user_id = ? AND xp_earned > 0 ORDER BY completed_at DESC LIMIT 1").get(userId) as { rowid: number } | undefined;
    if (latest) db.prepare("UPDATE progress SET xp_earned = MAX(0, xp_earned - 5) WHERE rowid = ?").run(latest.rowid);
  }
  return getProgress(userId);
}

export function getXpReward(lessonOrder: number): number {
  return lessonOrder * 10;
}

// ----- Streaks -----
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  todayDone: number;
  totalDays: number;
}

export function getStreakInfo(userId: string): StreakInfo {
  const db = getDb();
  const rows = db.prepare("SELECT date, lessons_done FROM streaks WHERE user_id = ? ORDER BY date DESC").all(userId) as { date: string; lessons_done: number }[];

  if (rows.length === 0) return { currentStreak: 0, longestStreak: 0, todayDone: 0, totalDays: 0 };

  const today = new Date().toISOString().split("T")[0];
  const todayRow = rows.find((r) => r.date === today);
  const todayDone = todayRow?.lessons_done ?? 0;

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = new Date();
  for (const row of rows) {
    const dateStr = checkDate.toISOString().split("T")[0];
    if (row.date === dateStr) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      // Allow for yesterday if today hasn't been done yet
      if (currentStreak === 0 && row.date === new Date(checkDate.getTime() - 86400000).toISOString().split("T")[0]) {
        currentStreak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak
  let longestStreak = 0;
  let streak = 0;
  const sortedDates = rows.map((r) => r.date).sort();
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) { streak = 1; continue; }
    const prev = new Date(sortedDates[i - 1]);
    const curr = new Date(sortedDates[i]);
    const diff = (curr.getTime() - prev.getTime()) / 86400000;
    if (diff === 1) { streak++; } else { streak = 1; }
    longestStreak = Math.max(longestStreak, streak);
  }
  longestStreak = Math.max(longestStreak, streak);

  return { currentStreak, longestStreak, todayDone, totalDays: rows.length };
}

// ----- Achievements -----
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: string;
}

export const ALL_BADGES: Badge[] = [
  { id: "first_lesson", name: "First Steps", description: "Complete your first lesson", icon: "🎯", condition: "1 lesson" },
  { id: "five_lessons", name: "Getting Started", description: "Complete 5 lessons", icon: "📚", condition: "5 lessons" },
  { id: "ten_lessons", name: "Dedicated Learner", description: "Complete 10 lessons", icon: "🔥", condition: "10 lessons" },
  { id: "twentyfive_lessons", name: "Quarter Century", description: "Complete 25 lessons", icon: "💪", condition: "25 lessons" },
  { id: "fifty_lessons", name: "Halfway Hero", description: "Complete 50 lessons", icon: "⭐", condition: "50 lessons" },
  { id: "hundred_lessons", name: "Century Club", description: "Complete 100 lessons", icon: "🏆", condition: "100 lessons" },
  { id: "all_free", name: "Free Graduate", description: "Complete all 10 free lessons", icon: "🎓", condition: "All free" },
  { id: "streak_3", name: "On a Roll", description: "3-day coding streak", icon: "🔥", condition: "3-day streak" },
  { id: "streak_7", name: "Week Warrior", description: "7-day coding streak", icon: "⚡", condition: "7-day streak" },
  { id: "streak_30", name: "Monthly Master", description: "30-day coding streak", icon: "👑", condition: "30-day streak" },
  { id: "xp_100", name: "XP Hunter", description: "Earn 100 XP", icon: "💎", condition: "100 XP" },
  { id: "xp_500", name: "XP Champion", description: "Earn 500 XP", icon: "🏅", condition: "500 XP" },
  { id: "xp_1000", name: "XP Legend", description: "Earn 1000 XP", icon: "🌟", condition: "1000 XP" },
  { id: "python_start", name: "Pythonista", description: "Complete first Python lesson", icon: "🐍", condition: "1 Python lesson" },
  { id: "js_start", name: "JS Ninja", description: "Complete first JavaScript lesson", icon: "⚡", condition: "1 JS lesson" },
  { id: "bug_squasher", name: "Bug Squasher", description: "Run code 10 times in a session", icon: "🐛", condition: "10 runs" },
];

function checkAndAwardAchievements(userId: string) {
  const db = getDb();
  const prog = getProgress(userId);
  const streak = getStreakInfo(userId);
  const earned = db.prepare("SELECT badge_id FROM achievements WHERE user_id = ?").all(userId) as { badge_id: string }[];
  const earnedSet = new Set(earned.map((e) => e.badge_id));

  function award(badgeId: string) {
    if (!earnedSet.has(badgeId)) {
      db.prepare("INSERT OR IGNORE INTO achievements (user_id, badge_id) VALUES (?, ?)").run(userId, badgeId);
    }
  }

  const count = prog.completedLessons.length;
  if (count >= 1) award("first_lesson");
  if (count >= 5) award("five_lessons");
  if (count >= 10) award("ten_lessons");
  if (count >= 25) award("twentyfive_lessons");
  if (count >= 50) award("fifty_lessons");
  if (count >= 100) award("hundred_lessons");

  const freeCount = prog.completedLessons.filter((id) => id.startsWith("free-")).length;
  if (freeCount >= 10) award("all_free");

  if (prog.completedLessons.some((id) => id.startsWith("python-"))) award("python_start");
  if (prog.completedLessons.some((id) => id.startsWith("js-"))) award("js_start");

  if (streak.currentStreak >= 3) award("streak_3");
  if (streak.currentStreak >= 7) award("streak_7");
  if (streak.currentStreak >= 30) award("streak_30");

  if (prog.xp >= 100) award("xp_100");
  if (prog.xp >= 500) award("xp_500");
  if (prog.xp >= 1000) award("xp_1000");
}

export function getUserAchievements(userId: string): string[] {
  const db = getDb();
  return (db.prepare("SELECT badge_id FROM achievements WHERE user_id = ?").all(userId) as { badge_id: string }[]).map((r) => r.badge_id);
}

// ----- Bookmarks -----
export function toggleBookmark(userId: string, lessonId: string): boolean {
  const db = getDb();
  const existing = db.prepare("SELECT id FROM bookmarks WHERE user_id = ? AND lesson_id = ?").get(userId, lessonId);
  if (existing) {
    db.prepare("DELETE FROM bookmarks WHERE user_id = ? AND lesson_id = ?").run(userId, lessonId);
    return false;
  }
  db.prepare("INSERT INTO bookmarks (user_id, lesson_id) VALUES (?, ?)").run(userId, lessonId);
  return true;
}

export function getUserBookmarks(userId: string): string[] {
  const db = getDb();
  return (db.prepare("SELECT lesson_id FROM bookmarks WHERE user_id = ?").all(userId) as { lesson_id: string }[]).map((r) => r.lesson_id);
}

// ----- Saved Code -----
export function saveCode(userId: string, lessonId: string, code: string): void {
  const db = getDb();
  db.prepare("INSERT INTO saved_code (user_id, lesson_id, code, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(user_id, lesson_id) DO UPDATE SET code = ?, updated_at = datetime('now')").run(userId, lessonId, code, code);
}

export function getSavedCode(userId: string, lessonId: string): string | null {
  const db = getDb();
  const row = db.prepare("SELECT code FROM saved_code WHERE user_id = ? AND lesson_id = ?").get(userId, lessonId) as { code: string } | undefined;
  return row?.code ?? null;
}

// ----- Leaderboard -----
export function getLeaderboard(limit: number = 10): { name: string; xp: number; lessonsCompleted: number }[] {
  const db = getDb();
  const rows = db.prepare(`
    SELECT u.name, COALESCE(SUM(p.xp_earned), 0) as total_xp, COUNT(CASE WHEN p.completed = 1 THEN 1 END) as lessons_done
    FROM users u LEFT JOIN progress p ON u.id = p.user_id
    GROUP BY u.id ORDER BY total_xp DESC LIMIT ?
  `).all(limit) as { name: string; total_xp: number; lessons_done: number }[];
  return rows.map((r) => ({ name: r.name, xp: r.total_xp, lessonsCompleted: r.lessons_done }));
}

// ----- Vibe Code -----
export function upgradeVibe(userId: string): boolean {
  const db = getDb();
  return db.prepare("UPDATE users SET is_vibe_unlimited = 1 WHERE id = ?").run(userId).changes > 0;
}

export function getVibeUsageCount(userId: string): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as cnt FROM vibe_usage WHERE user_id = ?").get(userId) as { cnt: number };
  return row.cnt;
}

export function recordVibeUsage(userId: string): void {
  const db = getDb();
  db.prepare("INSERT INTO vibe_usage (user_id) VALUES (?)").run(userId);
}

export function canUseVibe(userId: string): { allowed: boolean; used: number; limit: number; unlimited: boolean } {
  const db = getDb();
  const user = db.prepare("SELECT is_vibe_unlimited, bonus_prompts FROM users WHERE id = ?").get(userId) as { is_vibe_unlimited: number; bonus_prompts: number } | undefined;
  if (!user) return { allowed: false, used: 0, limit: 10, unlimited: false };
  // Check subscription
  const subs = getUserSubs(db, userId);
  if (user.is_vibe_unlimited || subs.some((s) => s.plan === "vibe_pro")) return { allowed: true, used: 0, limit: 0, unlimited: true };
  const used = getVibeUsageCount(userId);
  const totalLimit = 10 + (user.bonus_prompts || 0);
  return { allowed: used < totalLimit, used, limit: totalLimit, unlimited: false };
}

export interface VibeProject {
  id: string;
  userId: string;
  title: string;
  language: string;
  code: string;
  createdAt: string;
  updatedAt: string;
}

export function createVibeProject(userId: string, title: string, language: string): VibeProject {
  const db = getDb();
  const id = crypto.randomUUID();
  db.prepare("INSERT INTO vibe_projects (id, user_id, title, language) VALUES (?, ?, ?, ?)").run(id, userId, title, language);
  return { id, userId, title, language, code: "", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
}

export function getUserVibeProjects(userId: string): VibeProject[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM vibe_projects WHERE user_id = ? ORDER BY updated_at DESC").all(userId) as {
    id: string; user_id: string; title: string; language: string; code: string; created_at: string; updated_at: string;
  }[];
  return rows.map((r) => ({ id: r.id, userId: r.user_id, title: r.title, language: r.language, code: r.code, createdAt: r.created_at, updatedAt: r.updated_at }));
}

export function getVibeProject(projectId: string, userId: string): VibeProject | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM vibe_projects WHERE id = ? AND user_id = ?").get(projectId, userId) as {
    id: string; user_id: string; title: string; language: string; code: string; created_at: string; updated_at: string;
  } | undefined;
  if (!row) return null;
  return { id: row.id, userId: row.user_id, title: row.title, language: row.language, code: row.code, createdAt: row.created_at, updatedAt: row.updated_at };
}

export function updateVibeProject(projectId: string, userId: string, code: string, title?: string): boolean {
  const db = getDb();
  if (title) {
    return db.prepare("UPDATE vibe_projects SET code = ?, title = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").run(code, title, projectId, userId).changes > 0;
  }
  return db.prepare("UPDATE vibe_projects SET code = ?, updated_at = datetime('now') WHERE id = ? AND user_id = ?").run(code, projectId, userId).changes > 0;
}

export function deleteVibeProject(projectId: string, userId: string): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM vibe_projects WHERE id = ? AND user_id = ?").run(projectId, userId).changes > 0;
}

// ----- Subscriptions -----
export function subscribe(userId: string, plan: string, billing: "monthly" | "yearly"): boolean {
  const db = getDb();
  const planDef = PLANS[plan as keyof typeof PLANS];
  if (!planDef) return false;
  const priceCents = billing === "yearly" ? planDef.yearly : planDef.monthly;
  const months = billing === "yearly" ? 12 : 1;
  const expiresAt = new Date(Date.now() + months * 30 * 24 * 60 * 60 * 1000).toISOString();

  // Upsert
  const existing = db.prepare("SELECT id FROM subscriptions WHERE user_id = ? AND plan = ?").get(userId, plan);
  if (existing) {
    db.prepare("UPDATE subscriptions SET billing = ?, price_cents = ?, expires_at = ?, active = 1, started_at = datetime('now') WHERE user_id = ? AND plan = ?").run(billing, priceCents, expiresAt, userId, plan);
  } else {
    db.prepare("INSERT INTO subscriptions (user_id, plan, billing, price_cents, expires_at) VALUES (?, ?, ?, ?, ?)").run(userId, plan, billing, priceCents, expiresAt);
  }

  // If pro_all, also set is_pro flag for backward compat
  if (plan === "pro_all") db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(userId);
  if (plan === "vibe_pro") db.prepare("UPDATE users SET is_vibe_unlimited = 1 WHERE id = ?").run(userId);

  return true;
}

export function hasAccess(userId: string, category: string): boolean {
  const user = getUserById(userId);
  if (!user) return false;
  if (category === "free" || category === "free-js") return true;
  if (user.isPro) return true;
  const subs = user.subscriptions;
  if (category === "python") return subs.some((s) => s.plan === "pro_python" || s.plan === "pro_all");
  if (category === "javascript") return subs.some((s) => s.plan === "pro_javascript" || s.plan === "pro_all");
  return false;
}

// ----- Referrals -----
export function applyReferral(referralCode: string, newUserId: string): boolean {
  const db = getDb();
  const referrer = db.prepare("SELECT id FROM users WHERE referral_code = ? AND id != ?").get(referralCode, newUserId) as { id: string } | undefined;
  if (!referrer) return false;
  const existing = db.prepare("SELECT id FROM referrals WHERE referred_id = ?").get(newUserId);
  if (existing) return false;
  db.prepare("INSERT INTO referrals (referrer_id, referred_id) VALUES (?, ?)").run(referrer.id, newUserId);
  // Both get 5 bonus prompts
  db.prepare("UPDATE users SET bonus_prompts = bonus_prompts + 5 WHERE id = ?").run(referrer.id);
  db.prepare("UPDATE users SET bonus_prompts = bonus_prompts + 5 WHERE id = ?").run(newUserId);
  return true;
}

export function getReferralCount(userId: string): number {
  const db = getDb();
  const row = db.prepare("SELECT COUNT(*) as cnt FROM referrals WHERE referrer_id = ?").get(userId) as { cnt: number };
  return row.cnt;
}

// ----- Daily Challenges -----
export function getTodayChallenge(): { date: string; title: string; prompt: string; starterCode: string; expectedOutput: string; language: string; difficulty: string; hint: string } | null {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  let row = db.prepare("SELECT * FROM daily_challenges WHERE date = ?").get(today) as Record<string, unknown> | undefined;

  if (!row) {
    // Auto-generate today's challenge
    const challenges = [
      { title: "FizzBuzz", prompt: "Print numbers 1-15. For multiples of 3 print 'Fizz', multiples of 5 print 'Buzz', both print 'FizzBuzz'.", starter: "", expected: "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz", lang: "python", hint: "Use % operator to check divisibility" },
      { title: "Reverse String", prompt: "Write a function that reverses the string 'hello world' and prints it.", starter: "", expected: "dlrow olleh", lang: "python", hint: "Use string slicing [::-1]" },
      { title: "Sum of Digits", prompt: "Find and print the sum of digits in the number 12345.", starter: "", expected: "15", lang: "python", hint: "Convert to string, loop over chars, convert back to int" },
      { title: "Palindrome Check", prompt: "Check if 'racecar' is a palindrome. Print True or False.", starter: "", expected: "True", lang: "python", hint: "Compare string with its reverse" },
      { title: "Count Vowels", prompt: "Count and print the number of vowels in 'Hello World'.", starter: "", expected: "3", lang: "python", hint: "Loop through chars, check if in 'aeiouAEIOU'" },
      { title: "Max in Array", prompt: "Find and print the largest number in [3, 7, 2, 9, 1, 5].", starter: "numbers = [3, 7, 2, 9, 1, 5]\n", expected: "9", lang: "python", hint: "Use the max() function" },
      { title: "Even Numbers", prompt: "Print all even numbers from 1 to 20, each on a new line.", starter: "", expected: "2\n4\n6\n8\n10\n12\n14\n16\n18\n20", lang: "python", hint: "Use range with step 2, or check with % 2" },
      { title: "Word Count", prompt: "Count and print the number of words in 'The quick brown fox jumps'.", starter: "", expected: "5", lang: "python", hint: "Use .split() and len()" },
      { title: "Factorial", prompt: "Calculate and print the factorial of 6 (6!).", starter: "", expected: "720", lang: "python", hint: "6! = 6*5*4*3*2*1" },
      { title: "Array Double", prompt: "Double every number in [1,2,3,4,5] and print the result as a list.", starter: "nums = [1, 2, 3, 4, 5]\n", expected: "[2, 4, 6, 8, 10]", lang: "javascript", hint: "Use .map(n => n * 2)" },
    ];
    const dayNum = Math.floor(Date.now() / 86400000);
    const c = challenges[dayNum % challenges.length];
    const diff = ["easy", "medium", "hard"][dayNum % 3];
    db.prepare("INSERT OR IGNORE INTO daily_challenges (date, title, prompt, starter_code, expected_output, language, difficulty, hint) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(today, c.title, c.prompt, c.starter, c.expected, c.lang, diff, c.hint);
    row = db.prepare("SELECT * FROM daily_challenges WHERE date = ?").get(today) as Record<string, unknown> | undefined;
  }

  if (!row) return null;
  return {
    date: row.date as string, title: row.title as string, prompt: row.prompt as string,
    starterCode: row.starter_code as string, expectedOutput: row.expected_output as string,
    language: row.language as string, difficulty: row.difficulty as string, hint: row.hint as string,
  };
}

export function submitDailyChallenge(userId: string, code: string, passed: boolean): boolean {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const existing = db.prepare("SELECT id FROM daily_challenge_submissions WHERE user_id = ? AND challenge_date = ?").get(userId, today);
  if (existing) {
    db.prepare("UPDATE daily_challenge_submissions SET code = ?, passed = ? WHERE user_id = ? AND challenge_date = ?").run(code, passed ? 1 : 0, userId, today);
  } else {
    db.prepare("INSERT INTO daily_challenge_submissions (user_id, challenge_date, code, passed) VALUES (?, ?, ?, ?)").run(userId, today, code, passed ? 1 : 0);
  }
  if (passed) {
    // Award 25 XP for daily challenge
    const prog = db.prepare("SELECT id FROM progress WHERE user_id = ? AND lesson_id = ?").get(userId, `daily-${today}`);
    if (!prog) {
      db.prepare("INSERT INTO progress (user_id, lesson_id, completed, xp_earned, completed_at) VALUES (?, ?, 1, 25, datetime('now'))").run(userId, `daily-${today}`);
    }
  }
  return true;
}

export function getDailyChallengeSubmission(userId: string): { passed: boolean; code: string } | null {
  const db = getDb();
  const today = new Date().toISOString().split("T")[0];
  const row = db.prepare("SELECT code, passed FROM daily_challenge_submissions WHERE user_id = ? AND challenge_date = ?").get(userId, today) as { code: string; passed: number } | undefined;
  if (!row) return null;
  return { passed: !!row.passed, code: row.code };
}

// ----- Guided Projects -----
export function getGuidedProjects(): { id: string; lessonGroup: string; title: string; description: string; requirements: string; starterCode: string; language: string; afterLesson: number }[] {
  const db = getDb();
  ensureGuidedProjects(db);
  const rows = db.prepare("SELECT * FROM projects ORDER BY after_lesson ASC").all() as Record<string, unknown>[];
  return rows.map((r) => ({
    id: r.id as string, lessonGroup: r.lesson_group as string, title: r.title as string,
    description: r.description as string, requirements: r.requirements as string,
    starterCode: r.starter_code as string, language: r.language as string, afterLesson: r.after_lesson as number,
  }));
}

function ensureGuidedProjects(db: Database.Database) {
  const count = (db.prepare("SELECT COUNT(*) as cnt FROM projects").get() as { cnt: number }).cnt;
  if (count > 0) return;

  const pyProjects = [
    { id: "proj-py-1", group: "python", title: "Calculator App", desc: "Build a command-line calculator that can add, subtract, multiply, and divide.", reqs: "1. Ask user for two numbers\\n2. Ask for operation (+, -, *, /)\\n3. Display the result\\n4. Handle division by zero", starter: "# Calculator App\\n# Get input from user and perform calculations\\n", after: 10 },
    { id: "proj-py-2", group: "python", title: "Guessing Game", desc: "Create a number guessing game where the computer picks a random number.", reqs: "1. Generate random number 1-100\\n2. Let user guess with hints (higher/lower)\\n3. Track number of guesses\\n4. Congratulate on correct guess", starter: "import random\\n\\n# Number Guessing Game\\n", after: 20 },
    { id: "proj-py-3", group: "python", title: "Contact Book", desc: "Build a contact book that stores names, phones, and emails.", reqs: "1. Add new contacts\\n2. Search contacts by name\\n3. Display all contacts\\n4. Delete contacts\\n5. Use a dictionary to store data", starter: "# Contact Book App\\ncontacts = {}\\n", after: 30 },
    { id: "proj-py-4", group: "python", title: "Quiz App", desc: "Create a multiple-choice quiz with scoring.", reqs: "1. At least 5 questions\\n2. Multiple choice (A/B/C/D)\\n3. Track and display score\\n4. Show correct answers for wrong guesses", starter: "# Quiz App\\nquestions = []\\n", after: 40 },
    { id: "proj-py-5", group: "python", title: "File Organizer", desc: "Build a script that organizes files in a directory by extension.", reqs: "1. Scan a directory\\n2. Group files by extension\\n3. Create folders for each type\\n4. Move files to correct folders", starter: "import os\\nimport shutil\\n\\n# File Organizer\\n", after: 50 },
    { id: "proj-py-6", group: "python", title: "Weather Dashboard", desc: "Create a weather info display using mock data.", reqs: "1. Display temp, humidity, conditions\\n2. 5-day forecast\\n3. Format output nicely\\n4. Use classes for weather data", starter: "# Weather Dashboard\\n", after: 60 },
    { id: "proj-py-7", group: "python", title: "Blog API", desc: "Build a simple REST API for a blog with Flask.", reqs: "1. Create, read, update, delete posts\\n2. List all posts\\n3. Get single post by ID\\n4. Use JSON responses", starter: "from flask import Flask, jsonify, request\\n\\napp = Flask(__name__)\\nposts = []\\n", after: 70 },
    { id: "proj-py-8", group: "python", title: "Data Analyzer", desc: "Analyze a CSV dataset and produce statistics.", reqs: "1. Read CSV data\\n2. Calculate mean, median, mode\\n3. Find min/max values\\n4. Display a summary report", starter: "import csv\\n\\n# Data Analyzer\\n", after: 80 },
    { id: "proj-py-9", group: "python", title: "Chat Bot", desc: "Create an interactive chatbot with pattern matching.", reqs: "1. Respond to greetings\\n2. Answer common questions\\n3. Handle unknown input gracefully\\n4. Maintain conversation history", starter: "# Chat Bot\\n", after: 90 },
    { id: "proj-py-10", group: "python", title: "Portfolio Project", desc: "Build a complete application combining everything you've learned.", reqs: "1. Use classes and OOP\\n2. File I/O for persistence\\n3. Error handling\\n4. Clean code with functions\\n5. User-friendly interface", starter: "# Your Portfolio Project\\n# Combine everything you've learned!\\n", after: 100 },
  ];

  const jsProjects = [
    { id: "proj-js-1", group: "javascript", title: "Todo List App", desc: "Build an interactive todo list in the console.", reqs: "1. Add tasks\\n2. Mark tasks complete\\n3. List all tasks\\n4. Delete tasks", starter: "// Todo List App\\nconst todos = [];\\n", after: 10 },
    { id: "proj-js-2", group: "javascript", title: "Rock Paper Scissors", desc: "Build a rock-paper-scissors game against the computer.", reqs: "1. Player chooses rock/paper/scissors\\n2. Computer makes random choice\\n3. Determine winner\\n4. Track scores over rounds", starter: "// Rock Paper Scissors\\n", after: 20 },
    { id: "proj-js-3", group: "javascript", title: "Expense Tracker", desc: "Track income and expenses with categories.", reqs: "1. Add income/expense entries\\n2. Categorize transactions\\n3. Show balance\\n4. Filter by category", starter: "// Expense Tracker\\nconst transactions = [];\\n", after: 30 },
    { id: "proj-js-4", group: "javascript", title: "Trivia Game", desc: "Build a timed trivia game with multiple categories.", reqs: "1. Multiple categories\\n2. Timer per question\\n3. Scoring system\\n4. High score tracking", starter: "// Trivia Game\\n", after: 40 },
    { id: "proj-js-5", group: "javascript", title: "URL Shortener", desc: "Build a simple URL shortener service.", reqs: "1. Shorten URLs\\n2. Redirect from short URLs\\n3. Track click counts\\n4. List all shortened URLs", starter: "// URL Shortener\\nconst urlMap = new Map();\\n", after: 50 },
    { id: "proj-js-6", group: "javascript", title: "Markdown Parser", desc: "Build a simple markdown to HTML converter.", reqs: "1. Convert headers (#)\\n2. Convert bold/italic\\n3. Convert links\\n4. Convert lists", starter: "// Markdown Parser\\n", after: 60 },
    { id: "proj-js-7", group: "javascript", title: "REST API Server", desc: "Build a REST API with Express.js.", reqs: "1. CRUD endpoints\\n2. Input validation\\n3. Error handling\\n4. JSON responses", starter: "// REST API\\nconst express = require('express');\\n", after: 70 },
    { id: "proj-js-8", group: "javascript", title: "React Dashboard", desc: "Build an interactive dashboard with React components.", reqs: "1. Multiple widgets\\n2. State management\\n3. Data fetching\\n4. Responsive layout", starter: "// React Dashboard\\n", after: 80 },
    { id: "proj-js-9", group: "javascript", title: "Real-Time Chat", desc: "Build a real-time chat application.", reqs: "1. Send/receive messages\\n2. Username system\\n3. Message history\\n4. Online user list", starter: "// Real-Time Chat\\n", after: 90 },
    { id: "proj-js-10", group: "javascript", title: "Full-Stack Project", desc: "Build a complete full-stack application.", reqs: "1. Frontend with React\\n2. Backend API\\n3. Database integration\\n4. Authentication\\n5. Deployment ready", starter: "// Your Full-Stack Project\\n// Combine everything you've learned!\\n", after: 100 },
  ];

  for (const p of [...pyProjects, ...jsProjects]) {
    db.prepare("INSERT OR IGNORE INTO projects (id, lesson_group, title, description, requirements, starter_code, language, after_lesson) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").run(
      p.id, p.group, p.title, p.desc, p.reqs, p.starter, p.group === "javascript" ? "javascript" : "python", p.after
    );
  }
}

// ----- Teams -----
export function createTeam(ownerId: string, name: string, maxSeats: number): { id: string; joinCode: string } {
  const db = getDb();
  const id = crypto.randomUUID();
  const joinCode = "SCHOOL-" + crypto.randomBytes(3).toString("hex").toUpperCase();
  db.prepare("INSERT INTO teams (id, name, owner_id, max_seats) VALUES (?, ?, ?, ?)").run(id, name, ownerId, maxSeats);
  db.prepare("INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, 'owner')").run(id, ownerId);
  // Store join code - add column if needed
  try { db.exec("ALTER TABLE teams ADD COLUMN join_code TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE teams ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'monthly'"); } catch {}
  db.prepare("UPDATE teams SET join_code = ? WHERE id = ?").run(joinCode, id);
  // Grant owner pro access
  db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(ownerId);
  return { id, joinCode };
}

export function addTeamMember(teamId: string, userId: string): boolean {
  const db = getDb();
  const team = db.prepare("SELECT max_seats, plan_type FROM teams WHERE id = ?").get(teamId) as { max_seats: number; plan_type: string } | undefined;
  if (!team) return false;
  const count = (db.prepare("SELECT COUNT(*) as cnt FROM team_members WHERE team_id = ?").get(teamId) as { cnt: number }).cnt;
  // Yearly unlimited = max_seats of 99999, monthly = capped
  if (team.plan_type !== "yearly" && count >= team.max_seats) return false;
  try {
    db.prepare("INSERT INTO team_members (team_id, user_id) VALUES (?, ?)").run(teamId, userId);
    db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(userId);
    return true;
  } catch { return false; }
}

export function joinTeamByCode(joinCode: string, userId: string): { success: boolean; teamName?: string; error?: string } {
  const db = getDb();
  try { db.exec("ALTER TABLE teams ADD COLUMN join_code TEXT NOT NULL DEFAULT ''"); } catch {}
  const team = db.prepare("SELECT id, name, max_seats, plan_type FROM teams WHERE join_code = ?").get(joinCode.toUpperCase()) as {
    id: string; name: string; max_seats: number; plan_type: string;
  } | undefined;
  if (!team) return { success: false, error: "Invalid school code" };

  // Check if already a member
  const existing = db.prepare("SELECT id FROM team_members WHERE team_id = ? AND user_id = ?").get(team.id, userId);
  if (existing) return { success: false, error: "You're already in this school" };

  // Check capacity
  const count = (db.prepare("SELECT COUNT(*) as cnt FROM team_members WHERE team_id = ?").get(team.id) as { cnt: number }).cnt;
  if (team.plan_type !== "yearly" && count >= team.max_seats) {
    return { success: false, error: "This school has reached its student limit" };
  }

  db.prepare("INSERT INTO team_members (team_id, user_id, role) VALUES (?, ?, 'student')").run(team.id, userId);
  db.prepare("UPDATE users SET is_pro = 1 WHERE id = ?").run(userId);
  return { success: true, teamName: team.name };
}

export interface TeamDetail {
  id: string;
  name: string;
  joinCode: string;
  planType: string;
  maxSeats: number;
  members: { userId: string; name: string; email: string; role: string; xp: number; lessonsCompleted: number }[];
}

export function getTeam(teamId: string): TeamDetail | null {
  const db = getDb();
  try { db.exec("ALTER TABLE teams ADD COLUMN join_code TEXT NOT NULL DEFAULT ''"); } catch {}
  try { db.exec("ALTER TABLE teams ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'monthly'"); } catch {}
  const team = db.prepare("SELECT * FROM teams WHERE id = ?").get(teamId) as {
    id: string; name: string; join_code: string; plan_type: string; max_seats: number;
  } | undefined;
  if (!team) return null;

  const members = db.prepare(`
    SELECT tm.user_id, u.name, u.email, tm.role,
      COALESCE(SUM(p.xp_earned), 0) as xp,
      COUNT(CASE WHEN p.completed = 1 THEN 1 END) as lessons_done
    FROM team_members tm
    JOIN users u ON tm.user_id = u.id
    LEFT JOIN progress p ON tm.user_id = p.user_id
    WHERE tm.team_id = ?
    GROUP BY tm.user_id
  `).all(teamId) as { user_id: string; name: string; email: string; role: string; xp: number; lessons_done: number }[];

  return {
    id: team.id,
    name: team.name,
    joinCode: team.join_code || "",
    planType: team.plan_type || "monthly",
    maxSeats: team.max_seats,
    members: members.map((m) => ({ userId: m.user_id, name: m.name, email: m.email, role: m.role, xp: m.xp, lessonsCompleted: m.lessons_done })),
  };
}

export function getTeamByOwner(ownerId: string): TeamDetail | null {
  const db = getDb();
  try { db.exec("ALTER TABLE teams ADD COLUMN join_code TEXT NOT NULL DEFAULT ''"); } catch {}
  const team = db.prepare("SELECT id FROM teams WHERE owner_id = ?").get(ownerId) as { id: string } | undefined;
  if (!team) return null;
  return getTeam(team.id);
}

export function setTeamPlanType(teamId: string, planType: string, maxSeats: number): void {
  const db = getDb();
  try { db.exec("ALTER TABLE teams ADD COLUMN plan_type TEXT NOT NULL DEFAULT 'monthly'"); } catch {}
  db.prepare("UPDATE teams SET plan_type = ?, max_seats = ? WHERE id = ?").run(planType, maxSeats, teamId);
}

// ----- Password Reset -----
export function createPasswordResetToken(email: string): string | null {
  const db = getDb();
  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(email);
  if (!user) return null;
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour
  db.prepare("INSERT INTO password_resets (email, token, expires_at) VALUES (?, ?, ?)").run(email, token, expiresAt);
  return token;
}

export function resetPasswordWithToken(token: string, newPassword: string): boolean {
  const db = getDb();
  const row = db.prepare("SELECT email, expires_at, used FROM password_resets WHERE token = ?").get(token) as {
    email: string; expires_at: string; used: number;
  } | undefined;
  if (!row || row.used) return false;
  if (new Date(row.expires_at) < new Date()) return false;
  const np = hashPassword(newPassword);
  db.prepare("UPDATE users SET password_hash = ? WHERE email = ?").run(`${np.salt}:${np.hash}`, row.email);
  db.prepare("UPDATE password_resets SET used = 1 WHERE token = ?").run(token);
  return true;
}

// ----- Comments -----
export function addComment(userId: string, lessonId: string, text: string): { id: number; userName: string; text: string; createdAt: string } {
  const db = getDb();
  const result = db.prepare("INSERT INTO comments (user_id, lesson_id, text) VALUES (?, ?, ?)").run(userId, lessonId, text);
  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(userId) as { name: string };
  return { id: result.lastInsertRowid as number, userName: user.name, text, createdAt: new Date().toISOString() };
}

export function getComments(lessonId: string): { id: number; userName: string; text: string; createdAt: string }[] {
  const db = getDb();
  const rows = db.prepare("SELECT c.id, u.name as user_name, c.text, c.created_at FROM comments c JOIN users u ON c.user_id = u.id WHERE c.lesson_id = ? ORDER BY c.created_at DESC LIMIT 50").all(lessonId) as {
    id: number; user_name: string; text: string; created_at: string;
  }[];
  return rows.map((r) => ({ id: r.id, userName: r.user_name, text: r.text, createdAt: r.created_at }));
}

export function deleteComment(commentId: number, userId: string): boolean {
  const db = getDb();
  return db.prepare("DELETE FROM comments WHERE id = ? AND user_id = ?").run(commentId, userId).changes > 0;
}

// ----- Shared Projects -----
export function shareProject(projectId: string, userId: string): string {
  const db = getDb();
  const project = db.prepare("SELECT * FROM vibe_projects WHERE id = ? AND user_id = ?").get(projectId, userId) as {
    title: string; language: string; code: string;
  } | undefined;
  if (!project) throw new Error("Project not found");
  const user = db.prepare("SELECT name FROM users WHERE id = ?").get(userId) as { name: string };
  const shareId = crypto.randomBytes(8).toString("hex");
  db.prepare("INSERT OR REPLACE INTO shared_projects (id, project_id, user_id, user_name, title, language, code) VALUES (?, ?, ?, ?, ?, ?, ?)").run(
    shareId, projectId, userId, user.name, project.title, project.language, project.code
  );
  return shareId;
}

export function getSharedProject(shareId: string): { id: string; userName: string; title: string; language: string; code: string; sharedAt: string } | null {
  const db = getDb();
  const row = db.prepare("SELECT * FROM shared_projects WHERE id = ?").get(shareId) as {
    id: string; user_name: string; title: string; language: string; code: string; shared_at: string;
  } | undefined;
  if (!row) return null;
  return { id: row.id, userName: row.user_name, title: row.title, language: row.language, code: row.code, sharedAt: row.shared_at };
}

// ----- OAuth -----
export function findOrCreateOAuthUser(provider: "google" | "github", providerId: string, name: string, email: string): SafeUser {
  const db = getDb();
  const col = provider === "google" ? "google_id" : "github_id";
  let row = db.prepare(`SELECT * FROM users WHERE ${col} = ?`).get(providerId) as Record<string, unknown> | undefined;
  if (row) return buildSafeUser(row, getUserSubs(db, row.id as string));

  // Check if email exists, link account
  row = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as Record<string, unknown> | undefined;
  if (row) {
    db.prepare(`UPDATE users SET ${col} = ? WHERE id = ?`).run(providerId, row.id as string);
    return buildSafeUser(row, getUserSubs(db, row.id as string));
  }

  // Create new user
  const id = crypto.randomUUID();
  const refCode = id.split("-")[0];
  const dummyHash = "oauth:nologin";
  db.prepare(`INSERT INTO users (id, name, email, password_hash, referral_code, ${col}) VALUES (?, ?, ?, ?, ?, ?)`).run(id, name, email, dummyHash, refCode, providerId);
  return { id, name, email, isPro: false, isVibeUnlimited: false, chosenPath: "", referralCode: refCode, bonusPrompts: 0, theme: "dark", createdAt: new Date().toISOString(), subscriptions: [] };
}

// ----- Admin Stats -----
export function getAdminStats(): {
  totalUsers: number; proUsers: number; vibeUsers: number; totalLessonsCompleted: number;
  totalXp: number; activeToday: number; revenue: number; topLessons: { lessonId: string; count: number }[];
} {
  const db = getDb();
  const totalUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users").get() as { cnt: number }).cnt;
  const proUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE is_pro = 1").get() as { cnt: number }).cnt;
  const vibeUsers = (db.prepare("SELECT COUNT(*) as cnt FROM users WHERE is_vibe_unlimited = 1").get() as { cnt: number }).cnt;
  const totalLessonsCompleted = (db.prepare("SELECT COUNT(*) as cnt FROM progress WHERE completed = 1").get() as { cnt: number }).cnt;
  const totalXp = (db.prepare("SELECT COALESCE(SUM(xp_earned), 0) as total FROM progress").get() as { total: number }).total;
  const today = new Date().toISOString().split("T")[0];
  const activeToday = (db.prepare("SELECT COUNT(DISTINCT user_id) as cnt FROM streaks WHERE date = ?").get(today) as { cnt: number }).cnt;
  const revenue = (db.prepare("SELECT COALESCE(SUM(price_cents), 0) as total FROM subscriptions WHERE active = 1").get() as { total: number }).total;
  const topLessons = db.prepare("SELECT lesson_id, COUNT(*) as cnt FROM progress WHERE completed = 1 GROUP BY lesson_id ORDER BY cnt DESC LIMIT 10").all() as { lesson_id: string; cnt: number }[];
  return { totalUsers, proUsers, vibeUsers, totalLessonsCompleted, totalXp, activeToday, revenue, topLessons: topLessons.map((r) => ({ lessonId: r.lesson_id, count: r.cnt })) };
}
