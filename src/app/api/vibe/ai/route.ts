import { NextRequest, NextResponse } from "next/server";
import { verifyToken, canUseVibe, recordVibeUsage, updateVibeProject, getUserById } from "@/lib/db";
import type Anthropic from "@anthropic-ai/sdk";

// ---------------------------------------------------------------------------
// generateVibeResponse - the core AI code-generation engine
// ---------------------------------------------------------------------------

interface VibeResponse {
  message: string;
  code: string | null;
}

function generateVibeResponse(prompt: string, code: string | null, language: string): VibeResponse {
  const lower = prompt.toLowerCase().trim();
  const lang = language?.toLowerCase() ?? "python";
  const isPython = lang === "python";

  // ----- helpers -----------------------------------------------------------

  /** Wrap an answer */
  const r = (message: string, code: string | null): VibeResponse => ({ message, code });

  // ----- 1. BUILD A CALCULATOR -------------------------------------------

  if (matches(lower, ["calculator", "calc app"])) {
    if (isPython) {
      return r(
        "Here's a fully working calculator with add, subtract, multiply, divide, and power operations. It runs in a loop so you can keep calculating until you type 'quit'.",
        `def calculator():
    """A simple interactive calculator."""

    def add(a, b):
        return a + b

    def subtract(a, b):
        return a - b

    def multiply(a, b):
        return a * b

    def divide(a, b):
        if b == 0:
            return "Error: division by zero"
        return a / b

    def power(a, b):
        return a ** b

    def modulo(a, b):
        if b == 0:
            return "Error: division by zero"
        return a % b

    operations = {
        "+": add,
        "-": subtract,
        "*": multiply,
        "/": divide,
        "**": power,
        "%": modulo,
    }

    print("=== Calculator ===")
    print("Operations: +  -  *  /  **  %")
    print("Type 'quit' to exit.\\n")

    while True:
        expr = input("Enter expression (e.g. 2 + 3): ").strip()
        if expr.lower() == "quit":
            print("Goodbye!")
            break

        parts = expr.split()
        if len(parts) != 3:
            print("Please use the format: <number> <operator> <number>")
            continue

        try:
            a = float(parts[0])
            op = parts[1]
            b = float(parts[2])
        except ValueError:
            print("Invalid numbers. Try again.")
            continue

        if op not in operations:
            print(f"Unknown operator '{op}'. Use one of: {', '.join(operations)}")
            continue

        result = operations[op](a, b)
        print(f"  Result: {result}\\n")

calculator()`,
      );
    }
    return r(
      "Here's a fully working JavaScript calculator with keyboard support and a clean display.",
      `class Calculator {
  constructor() {
    this.current = "0";
    this.previous = "";
    this.operator = null;
    this.resetNext = false;
  }

  input(value) {
    if (this.resetNext) {
      this.current = "0";
      this.resetNext = false;
    }
    if (value === "." && this.current.includes(".")) return;
    this.current = this.current === "0" && value !== "." ? value : this.current + value;
  }

  setOperator(op) {
    if (this.operator) this.calculate();
    this.previous = this.current;
    this.operator = op;
    this.resetNext = true;
  }

  calculate() {
    const a = parseFloat(this.previous);
    const b = parseFloat(this.current);
    if (isNaN(a) || isNaN(b)) return;
    const ops = { "+": a + b, "-": a - b, "*": a * b, "/": b !== 0 ? a / b : "Error" };
    this.current = String(ops[this.operator] ?? "Error");
    this.operator = null;
    this.previous = "";
    this.resetNext = true;
  }

  clear() {
    this.current = "0";
    this.previous = "";
    this.operator = null;
  }

  get display() {
    return this.current;
  }
}

// --- demo ---
const calc = new Calculator();
calc.input("5");
calc.setOperator("+");
calc.input("3");
calc.calculate();
console.log("5 + 3 =", calc.display); // 8

calc.clear();
calc.input("1");
calc.input("0");
calc.setOperator("*");
calc.input("4");
calc.calculate();
console.log("10 * 4 =", calc.display); // 40`,
    );
  }

  // ----- 2. TODO LIST -----------------------------------------------------

  if (matches(lower, ["todo", "to-do", "task list", "task manager"])) {
    if (isPython) {
      return r(
        "Here's a command-line to-do list manager with add, complete, delete, and list features. Tasks are stored in memory while the program runs.",
        `class TodoList:
    def __init__(self):
        self.tasks = []
        self.next_id = 1

    def add(self, title, priority="medium"):
        task = {
            "id": self.next_id,
            "title": title,
            "priority": priority,
            "done": False,
        }
        self.tasks.append(task)
        self.next_id += 1
        print(f"  Added task #{task['id']}: {title}")

    def complete(self, task_id):
        for t in self.tasks:
            if t["id"] == task_id:
                t["done"] = True
                print(f"  Completed: {t['title']}")
                return
        print(f"  Task #{task_id} not found.")

    def delete(self, task_id):
        for i, t in enumerate(self.tasks):
            if t["id"] == task_id:
                removed = self.tasks.pop(i)
                print(f"  Deleted: {removed['title']}")
                return
        print(f"  Task #{task_id} not found.")

    def show(self, show_all=True):
        visible = self.tasks if show_all else [t for t in self.tasks if not t["done"]]
        if not visible:
            print("  No tasks!")
            return
        for t in visible:
            status = "done" if t["done"] else "todo"
            print(f"  [{status}] #{t['id']} {t['title']} (priority: {t['priority']})")

def main():
    todos = TodoList()
    print("=== Todo List Manager ===")
    print("Commands: add <task>, done <id>, delete <id>, list, quit\\n")

    while True:
        cmd = input("> ").strip()
        if not cmd:
            continue
        parts = cmd.split(maxsplit=1)
        action = parts[0].lower()

        if action == "quit":
            print("Goodbye!")
            break
        elif action == "add" and len(parts) > 1:
            todos.add(parts[1])
        elif action == "done" and len(parts) > 1:
            todos.complete(int(parts[1]))
        elif action == "delete" and len(parts) > 1:
            todos.delete(int(parts[1]))
        elif action == "list":
            todos.show()
        else:
            print("  Unknown command.")

main()`,
      );
    }
    return r(
      "Here's a JavaScript to-do list with add, toggle, delete, and filter functionality.",
      `class TodoList {
  constructor() {
    this.tasks = [];
    this.nextId = 1;
  }

  add(title, priority = "medium") {
    const task = { id: this.nextId++, title, priority, done: false, createdAt: new Date() };
    this.tasks.push(task);
    return task;
  }

  toggle(id) {
    const task = this.tasks.find(t => t.id === id);
    if (task) task.done = !task.done;
    return task;
  }

  remove(id) {
    const idx = this.tasks.findIndex(t => t.id === id);
    if (idx !== -1) return this.tasks.splice(idx, 1)[0];
    return null;
  }

  filter(status) {
    if (status === "done") return this.tasks.filter(t => t.done);
    if (status === "pending") return this.tasks.filter(t => !t.done);
    return [...this.tasks];
  }

  summary() {
    const done = this.tasks.filter(t => t.done).length;
    return \`\${done}/\${this.tasks.length} tasks completed\`;
  }
}

// --- demo ---
const list = new TodoList();
list.add("Buy groceries", "high");
list.add("Read a book", "low");
list.add("Write code", "high");
list.toggle(1);

console.log("All tasks:");
list.filter("all").forEach(t =>
  console.log(\`  [\${t.done ? "x" : " "}] #\${t.id} \${t.title} (\${t.priority})\`)
);
console.log(list.summary());`,
    );
  }

  // ----- 3. GUESSING GAME ------------------------------------------------

  if (matches(lower, ["guessing game", "guess the number", "number game"])) {
    if (isPython) {
      return r(
        "Here's a number guessing game with difficulty levels, hints, and a score tracker.",
        `import random

def guessing_game():
    difficulties = {
        "easy":   {"range": 50,  "attempts": 10},
        "medium": {"range": 100, "attempts": 7},
        "hard":   {"range": 200, "attempts": 5},
    }

    print("=== Number Guessing Game ===")
    print("Difficulties: easy, medium, hard")
    diff = input("Choose difficulty: ").strip().lower()
    if diff not in difficulties:
        diff = "medium"

    settings = difficulties[diff]
    secret = random.randint(1, settings["range"])
    max_attempts = settings["attempts"]
    attempts = 0
    guesses = []

    print(f"\\nI'm thinking of a number between 1 and {settings['range']}.")
    print(f"You have {max_attempts} attempts. Good luck!\\n")

    while attempts < max_attempts:
        try:
            guess = int(input(f"Attempt {attempts + 1}/{max_attempts}: "))
        except ValueError:
            print("  Please enter a valid number.")
            continue

        attempts += 1
        guesses.append(guess)

        if guess == secret:
            score = max(100 - (attempts - 1) * 15, 10)
            print(f"\\n  Correct! You found it in {attempts} attempt(s)!")
            print(f"  Score: {score} points")
            return

        direction = "higher" if guess < secret else "lower"
        distance = abs(guess - secret)
        warmth = "Boiling!" if distance < 5 else "Warm" if distance < 15 else "Cold"
        print(f"  Go {direction}! ({warmth})")

    print(f"\\n  Out of attempts! The number was {secret}.")
    print(f"  Your guesses: {guesses}")

guessing_game()`,
      );
    }
    return r(
      "Here's a JavaScript number guessing game with difficulty, hints, and scoring.",
      `function guessingGame() {
  const difficulties = {
    easy:   { range: 50,  attempts: 10 },
    medium: { range: 100, attempts: 7  },
    hard:   { range: 200, attempts: 5  },
  };

  const diff = "medium"; // change as needed
  const { range, attempts: maxAttempts } = difficulties[diff];
  const secret = Math.floor(Math.random() * range) + 1;
  let attemptsLeft = maxAttempts;
  const history = [];

  function guess(n) {
    if (attemptsLeft <= 0) return { status: "game_over", secret };
    attemptsLeft--;
    history.push(n);

    if (n === secret) {
      const score = Math.max(100 - history.length * 15, 10);
      return { status: "win", attempts: history.length, score };
    }

    const direction = n < secret ? "higher" : "lower";
    const dist = Math.abs(n - secret);
    const warmth = dist < 5 ? "Boiling!" : dist < 15 ? "Warm" : "Cold";
    return { status: "wrong", hint: \`Go \${direction}! (\${warmth})\`, attemptsLeft };
  }

  return { guess, getHistory: () => [...history] };
}

// --- demo ---
const game = guessingGame();
console.log(game.guess(50));
console.log(game.guess(75));
console.log(game.guess(63));`,
    );
  }

  // ----- 4. PASSWORD GENERATOR -------------------------------------------

  if (matches(lower, ["password", "pass gen", "random string", "password generator"])) {
    if (isPython) {
      return r(
        "Here's a password generator with configurable length, character sets, and strength checking.",
        `import random
import string

def generate_password(length=16, uppercase=True, lowercase=True,
                      digits=True, symbols=True, exclude_ambiguous=False):
    """Generate a secure random password."""
    chars = ""
    required = []

    if uppercase:
        pool = string.ascii_uppercase
        if exclude_ambiguous:
            pool = pool.replace("O", "").replace("I", "")
        chars += pool
        required.append(random.choice(pool))
    if lowercase:
        pool = string.ascii_lowercase
        if exclude_ambiguous:
            pool = pool.replace("l", "").replace("o", "")
        chars += pool
        required.append(random.choice(pool))
    if digits:
        pool = string.digits
        if exclude_ambiguous:
            pool = pool.replace("0", "").replace("1", "")
        chars += pool
        required.append(random.choice(pool))
    if symbols:
        pool = "!@#$%^&*_+-=?"
        chars += pool
        required.append(random.choice(pool))

    if not chars:
        return "Error: enable at least one character set"

    remaining = length - len(required)
    password = required + [random.choice(chars) for _ in range(remaining)]
    random.shuffle(password)
    return "".join(password)


def check_strength(password):
    """Rate password strength from 0-100."""
    score = 0
    if len(password) >= 8:  score += 20
    if len(password) >= 12: score += 10
    if len(password) >= 16: score += 10
    if any(c.isupper() for c in password): score += 15
    if any(c.islower() for c in password): score += 15
    if any(c.isdigit() for c in password): score += 15
    if any(c in "!@#$%^&*_+-=?" for c in password): score += 15

    if score >= 80: return score, "Strong"
    if score >= 50: return score, "Medium"
    return score, "Weak"


# --- demo ---
print("=== Password Generator ===\\n")
for length in [8, 12, 16, 24]:
    pw = generate_password(length=length)
    score, label = check_strength(pw)
    print(f"  Length {length:>2}: {pw}  [{label} - {score}/100]")

print("\\nNo symbols:")
print(f"  {generate_password(length=16, symbols=False)}")

print("\\nNo ambiguous characters:")
print(f"  {generate_password(length=16, exclude_ambiguous=True)}")`,
      );
    }
    return r(
      "Here's a JavaScript password generator with strength checker.",
      `function generatePassword(options = {}) {
  const {
    length = 16,
    uppercase = true,
    lowercase = true,
    digits = true,
    symbols = true,
  } = options;

  const charSets = {
    uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
    lowercase: "abcdefghijklmnopqrstuvwxyz",
    digits: "0123456789",
    symbols: "!@#$%^&*_+-=?",
  };

  let pool = "";
  const required = [];
  if (uppercase) { pool += charSets.uppercase; required.push(pick(charSets.uppercase)); }
  if (lowercase) { pool += charSets.lowercase; required.push(pick(charSets.lowercase)); }
  if (digits)    { pool += charSets.digits;    required.push(pick(charSets.digits));    }
  if (symbols)   { pool += charSets.symbols;   required.push(pick(charSets.symbols));   }

  if (!pool) return "Error: enable at least one set";

  const remaining = Array.from({ length: length - required.length }, () => pick(pool));
  return shuffle([...required, ...remaining]).join("");
}

function pick(str) { return str[Math.floor(Math.random() * str.length)]; }
function shuffle(arr) { for (let i = arr.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [arr[i], arr[j]] = [arr[j], arr[i]]; } return arr; }

function checkStrength(pw) {
  let score = 0;
  if (pw.length >= 8)  score += 20;
  if (pw.length >= 12) score += 10;
  if (pw.length >= 16) score += 10;
  if (/[A-Z]/.test(pw)) score += 15;
  if (/[a-z]/.test(pw)) score += 15;
  if (/[0-9]/.test(pw)) score += 15;
  if (/[!@#$%^&*_+\\-=?]/.test(pw)) score += 15;
  const label = score >= 80 ? "Strong" : score >= 50 ? "Medium" : "Weak";
  return { score, label };
}

// --- demo ---
for (const len of [8, 12, 16, 24]) {
  const pw = generatePassword({ length: len });
  const { score, label } = checkStrength(pw);
  console.log(\`Length \${len}: \${pw}  [\${label} - \${score}/100]\`);
}`,
    );
  }

  // ----- 5. COUNTDOWN TIMER ----------------------------------------------

  if (matches(lower, ["countdown", "timer", "stopwatch"])) {
    if (isPython) {
      return r(
        "Here's a countdown timer with multiple timer support and formatted display.",
        `import time

def countdown(seconds, label="Timer"):
    """Run a countdown timer with a formatted display."""
    print(f"\\n  {label}: Starting {format_time(seconds)} countdown...\\n")

    while seconds > 0:
        mins, secs = divmod(seconds, 60)
        hrs, mins = divmod(mins, 60)
        display = f"  {hrs:02d}:{mins:02d}:{secs:02d}"
        print(f"\\r{display}", end="", flush=True)
        time.sleep(1)
        seconds -= 1

    print(f"\\r  00:00:00")
    print(f"\\n  {label} complete!\\a")


def format_time(seconds):
    """Format seconds into a human-readable string."""
    if seconds < 60:
        return f"{seconds} seconds"
    if seconds < 3600:
        return f"{seconds // 60} min {seconds % 60} sec"
    hrs = seconds // 3600
    mins = (seconds % 3600) // 60
    return f"{hrs}h {mins}m"


def pomodoro():
    """Run a Pomodoro timer (25 min work, 5 min break)."""
    print("=== Pomodoro Timer ===")
    sessions = int(input("How many sessions? ") or "4")

    for i in range(1, sessions + 1):
        print(f"\\n--- Session {i}/{sessions}: WORK ---")
        countdown(25 * 60, "Work")
        if i < sessions:
            print(f"\\n--- Session {i}/{sessions}: BREAK ---")
            countdown(5 * 60, "Break")

    print("\\nAll sessions complete! Great work!")


def main():
    print("=== Timer App ===")
    print("1. Quick countdown")
    print("2. Pomodoro timer")
    choice = input("Choose (1/2): ").strip()

    if choice == "2":
        pomodoro()
    else:
        secs = int(input("Seconds: ") or "10")
        countdown(secs)

main()`,
      );
    }
    return r(
      "Here's a JavaScript countdown timer with Pomodoro support.",
      `class CountdownTimer {
  constructor(seconds, label = "Timer") {
    this.total = seconds;
    this.remaining = seconds;
    this.label = label;
    this.interval = null;
    this.onTick = null;
    this.onComplete = null;
  }

  start() {
    if (this.interval) return;
    this.interval = setInterval(() => {
      this.remaining--;
      if (this.onTick) this.onTick(this.format());
      if (this.remaining <= 0) {
        this.stop();
        if (this.onComplete) this.onComplete(this.label);
      }
    }, 1000);
    console.log(\`\${this.label}: started \${this.format()}\`);
  }

  stop()  { clearInterval(this.interval); this.interval = null; }
  reset() { this.stop(); this.remaining = this.total; }

  format() {
    const h = Math.floor(this.remaining / 3600);
    const m = Math.floor((this.remaining % 3600) / 60);
    const s = this.remaining % 60;
    return [h, m, s].map(v => String(v).padStart(2, "0")).join(":");
  }

  get progress() {
    return ((this.total - this.remaining) / this.total) * 100;
  }
}

// Pomodoro helper
function pomodoro(sessions = 4) {
  let current = 0;
  function nextSession() {
    if (current >= sessions * 2 - 1) { console.log("All done!"); return; }
    const isWork = current % 2 === 0;
    const secs = isWork ? 25 * 60 : 5 * 60;
    const timer = new CountdownTimer(secs, isWork ? "Work" : "Break");
    timer.onTick = (t) => process.stdout.write(\`\\r  \${timer.label}: \${t}\`);
    timer.onComplete = () => { console.log(" - Done!"); current++; nextSession(); };
    timer.start();
  }
  nextSession();
}

// --- demo ---
const t = new CountdownTimer(10, "Quick Timer");
t.onTick = (time) => console.log(\`  \${time}\`);
t.onComplete = (label) => console.log(\`  \${label} finished!\`);
t.start();`,
    );
  }

  // ----- 6. QUIZ GAME ----------------------------------------------------

  if (matches(lower, ["quiz", "trivia", "question game"])) {
    if (isPython) {
      return r(
        "Here's a quiz game with multiple categories, scoring, and a results summary.",
        `import random

def quiz_game():
    questions = {
        "Science": [
            {"q": "What planet is known as the Red Planet?", "options": ["Venus", "Mars", "Jupiter", "Saturn"], "answer": 1},
            {"q": "What gas do plants absorb from the atmosphere?", "options": ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"], "answer": 2},
            {"q": "What is the speed of light (approx)?", "options": ["300,000 km/s", "150,000 km/s", "500,000 km/s", "1,000 km/s"], "answer": 0},
        ],
        "History": [
            {"q": "In what year did World War II end?", "options": ["1943", "1944", "1945", "1946"], "answer": 2},
            {"q": "Who painted the Mona Lisa?", "options": ["Michelangelo", "Da Vinci", "Raphael", "Rembrandt"], "answer": 1},
            {"q": "Which ancient wonder was in Alexandria?", "options": ["Colosseum", "Lighthouse", "Pyramids", "Gardens"], "answer": 1},
        ],
        "Programming": [
            {"q": "What does HTML stand for?", "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], "answer": 0},
            {"q": "Which language is used for iOS apps?", "options": ["Java", "Kotlin", "Swift", "C#"], "answer": 2},
            {"q": "What does CSS stand for?", "options": ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], "answer": 1},
        ],
    }

    print("=== Quiz Game ===")
    print(f"Categories: {', '.join(questions.keys())}\\n")

    score = 0
    total = 0
    results = []

    for category, qs in questions.items():
        print(f"--- {category} ---")
        random.shuffle(qs)
        for q_data in qs:
            total += 1
            print(f"\\n  Q{total}: {q_data['q']}")
            for i, opt in enumerate(q_data["options"]):
                print(f"    {i + 1}. {opt}")

            try:
                choice = int(input("  Your answer (1-4): ")) - 1
            except (ValueError, EOFError):
                choice = -1

            if choice == q_data["answer"]:
                print("  Correct!")
                score += 1
                results.append(("correct", q_data["q"]))
            else:
                correct = q_data["options"][q_data["answer"]]
                print(f"  Wrong! The answer was: {correct}")
                results.append(("wrong", q_data["q"]))

    # Summary
    pct = (score / total) * 100 if total else 0
    print(f"\\n=== Results: {score}/{total} ({pct:.0f}%) ===")
    grade = "A+" if pct >= 90 else "A" if pct >= 80 else "B" if pct >= 70 else "C" if pct >= 60 else "F"
    print(f"Grade: {grade}")

quiz_game()`,
      );
    }
    return r(
      "Here's a JavaScript quiz game engine with categories and scoring.",
      `class QuizGame {
  constructor(questions) {
    this.questions = questions;
    this.current = 0;
    this.score = 0;
    this.results = [];
  }

  get question() {
    return this.questions[this.current] ?? null;
  }

  answer(choiceIndex) {
    const q = this.questions[this.current];
    if (!q) return null;
    const correct = choiceIndex === q.answer;
    if (correct) this.score++;
    this.results.push({ question: q.q, correct, chosen: choiceIndex, answer: q.answer });
    this.current++;
    return { correct, correctAnswer: q.options[q.answer], done: this.current >= this.questions.length };
  }

  summary() {
    const pct = Math.round((this.score / this.questions.length) * 100);
    const grade = pct >= 90 ? "A+" : pct >= 80 ? "A" : pct >= 70 ? "B" : pct >= 60 ? "C" : "F";
    return { score: this.score, total: this.questions.length, percentage: pct, grade };
  }
}

const questions = [
  { q: "What planet is known as the Red Planet?", options: ["Venus", "Mars", "Jupiter", "Saturn"], answer: 1 },
  { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Modern Language", "Hyper Transfer Markup Language", "Home Tool Markup Language"], answer: 0 },
  { q: "Which language is used for iOS apps?", options: ["Java", "Kotlin", "Swift", "C#"], answer: 2 },
  { q: "In what year did World War II end?", options: ["1943", "1944", "1945", "1946"], answer: 2 },
  { q: "What does CSS stand for?", options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style System", "Colorful Style Sheets"], answer: 1 },
];

const game = new QuizGame(questions);
// demo: answer all questions
while (game.question) {
  const q = game.question;
  console.log(\`Q: \${q.q}\`);
  const result = game.answer(q.answer); // answer correctly for demo
  console.log(\`  \${result.correct ? "Correct!" : "Wrong!"}\`);
}
console.log("Summary:", game.summary());`,
    );
  }

  // ----- 7. WEATHER APP (mock data) --------------------------------------

  if (matches(lower, ["weather", "forecast", "temperature"])) {
    if (isPython) {
      return r(
        "Here's a weather app with mock data showing current conditions, forecasts, and weather alerts.",
        `import random

def weather_app():
    """Weather app with mock data."""

    cities = {
        "New York":    {"lat": 40.71, "lon": -74.01, "timezone": "EST"},
        "London":      {"lat": 51.51, "lon": -0.13,  "timezone": "GMT"},
        "Tokyo":       {"lat": 35.68, "lon": 139.69, "timezone": "JST"},
        "Sydney":      {"lat": -33.87,"lon": 151.21, "timezone": "AEST"},
        "Paris":       {"lat": 48.86, "lon": 2.35,   "timezone": "CET"},
    }

    conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Stormy", "Snowy", "Foggy", "Windy"]
    icons = {"Sunny": "sun", "Partly Cloudy": "cloud-sun", "Cloudy": "cloud",
             "Rainy": "cloud-rain", "Stormy": "bolt", "Snowy": "snowflake",
             "Foggy": "smog", "Windy": "wind"}

    def get_weather(city):
        if city not in cities:
            return None
        info = cities[city]
        temp = random.randint(-5, 38)
        condition = random.choice(conditions)
        return {
            "city": city,
            "temperature": temp,
            "feels_like": temp + random.randint(-3, 3),
            "condition": condition,
            "icon": icons[condition],
            "humidity": random.randint(20, 95),
            "wind_speed": random.randint(0, 50),
            "wind_direction": random.choice(["N", "NE", "E", "SE", "S", "SW", "W", "NW"]),
            "uv_index": random.randint(0, 11),
            "visibility": random.randint(1, 20),
            "timezone": info["timezone"],
        }

    def get_forecast(city, days=5):
        return [
            {
                "day": f"Day {i+1}",
                "high": random.randint(10, 35),
                "low": random.randint(-5, 15),
                "condition": random.choice(conditions),
                "rain_chance": random.randint(0, 100),
            }
            for i in range(days)
        ]

    # --- demo ---
    print("=== Weather App ===\\n")
    for city in cities:
        w = get_weather(city)
        print(f"  {w['city']} ({w['timezone']})")
        print(f"    {w['condition']} | {w['temperature']}C (feels like {w['feels_like']}C)")
        print(f"    Humidity: {w['humidity']}% | Wind: {w['wind_speed']} km/h {w['wind_direction']}")
        print(f"    UV: {w['uv_index']} | Visibility: {w['visibility']} km\\n")

    print("  --- 5-Day Forecast for New York ---")
    for day in get_forecast("New York"):
        print(f"    {day['day']}: {day['condition']} | {day['low']}C - {day['high']}C | Rain: {day['rain_chance']}%")

weather_app()`,
      );
    }
    return r(
      "Here's a JavaScript weather app with mock data and forecasts.",
      `const weatherApp = (() => {
  const cities = {
    "New York": { lat: 40.71, lon: -74.01, tz: "EST" },
    "London":   { lat: 51.51, lon: -0.13,  tz: "GMT" },
    "Tokyo":    { lat: 35.68, lon: 139.69, tz: "JST" },
    "Sydney":   { lat: -33.87,lon: 151.21, tz: "AEST" },
    "Paris":    { lat: 48.86, lon: 2.35,   tz: "CET" },
  };

  const conditions = ["Sunny", "Partly Cloudy", "Cloudy", "Rainy", "Stormy", "Snowy", "Foggy", "Windy"];
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];

  function getWeather(city) {
    const info = cities[city];
    if (!info) return null;
    const temp = rand(-5, 38);
    const condition = pick(conditions);
    return {
      city, temperature: temp, feelsLike: temp + rand(-3, 3),
      condition, humidity: rand(20, 95),
      wind: { speed: rand(0, 50), direction: pick(["N","NE","E","SE","S","SW","W","NW"]) },
      uvIndex: rand(0, 11), visibility: rand(1, 20), timezone: info.tz,
    };
  }

  function getForecast(city, days = 5) {
    return Array.from({ length: days }, (_, i) => ({
      day: \`Day \${i + 1}\`, high: rand(10, 35), low: rand(-5, 15),
      condition: pick(conditions), rainChance: rand(0, 100),
    }));
  }

  return { getWeather, getForecast, cities: Object.keys(cities) };
})();

// --- demo ---
for (const city of weatherApp.cities) {
  const w = weatherApp.getWeather(city);
  console.log(\`\${w.city} (\${w.timezone}): \${w.condition}, \${w.temperature}C, Humidity \${w.humidity}%\`);
}
console.log("\\nForecast for Tokyo:");
weatherApp.getForecast("Tokyo").forEach(d =>
  console.log(\`  \${d.day}: \${d.condition} \${d.low}C-\${d.high}C, Rain \${d.rainChance}%\`)
);`,
    );
  }

  // ----- 8. TIC-TAC-TOE --------------------------------------------------

  if (matches(lower, ["tic-tac-toe", "tic tac toe", "tictactoe", "noughts and crosses"])) {
    if (isPython) {
      return r(
        "Here's a tic-tac-toe game with an AI opponent that uses the minimax algorithm.",
        `def tic_tac_toe():
    board = [" "] * 9

    def display():
        for i in range(0, 9, 3):
            row = " | ".join(board[i:i+3])
            print(f"  {row}")
            if i < 6:
                print("  ---------")
        print()

    def check_winner(b):
        lines = [
            [0,1,2],[3,4,5],[6,7,8],  # rows
            [0,3,6],[1,4,7],[2,5,8],  # cols
            [0,4,8],[2,4,6],          # diagonals
        ]
        for line in lines:
            if b[line[0]] == b[line[1]] == b[line[2]] != " ":
                return b[line[0]]
        return None

    def is_full(b):
        return " " not in b

    def minimax(b, is_maximizing):
        winner = check_winner(b)
        if winner == "O": return 1
        if winner == "X": return -1
        if is_full(b): return 0

        if is_maximizing:
            best = -float("inf")
            for i in range(9):
                if b[i] == " ":
                    b[i] = "O"
                    best = max(best, minimax(b, False))
                    b[i] = " "
            return best
        else:
            best = float("inf")
            for i in range(9):
                if b[i] == " ":
                    b[i] = "X"
                    best = min(best, minimax(b, True))
                    b[i] = " "
            return best

    def ai_move():
        best_score = -float("inf")
        best_pos = 0
        for i in range(9):
            if board[i] == " ":
                board[i] = "O"
                score = minimax(board, False)
                board[i] = " "
                if score > best_score:
                    best_score = score
                    best_pos = i
        board[best_pos] = "O"

    print("=== Tic-Tac-Toe ===")
    print("You are X. Enter position 1-9.\\n")
    display()

    while True:
        # Player move
        try:
            pos = int(input("Your move (1-9): ")) - 1
        except (ValueError, EOFError):
            print("Invalid input.")
            continue
        if pos < 0 or pos > 8 or board[pos] != " ":
            print("Invalid move!")
            continue
        board[pos] = "X"

        w = check_winner(board)
        if w:
            display()
            print(f"  {w} wins!")
            return
        if is_full(board):
            display()
            print("  It's a draw!")
            return

        # AI move
        ai_move()
        display()

        w = check_winner(board)
        if w:
            print(f"  {w} wins!")
            return
        if is_full(board):
            print("  It's a draw!")
            return

tic_tac_toe()`,
      );
    }
    return r(
      "Here's a JavaScript tic-tac-toe game with AI using minimax.",
      `class TicTacToe {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = "X";
  }

  play(pos) {
    if (this.board[pos] || this.winner) return null;
    this.board[pos] = this.currentPlayer;
    const result = { player: this.currentPlayer, pos, winner: this.winner, draw: this.isDraw };
    this.currentPlayer = this.currentPlayer === "X" ? "O" : "X";
    return result;
  }

  aiMove() {
    let bestScore = -Infinity, bestPos = 0;
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        this.board[i] = "O";
        const score = this.minimax(false);
        this.board[i] = null;
        if (score > bestScore) { bestScore = score; bestPos = i; }
      }
    }
    return this.play(bestPos);
  }

  minimax(isMax) {
    if (this.winner === "O") return 1;
    if (this.winner === "X") return -1;
    if (this.isDraw) return 0;
    let best = isMax ? -Infinity : Infinity;
    for (let i = 0; i < 9; i++) {
      if (!this.board[i]) {
        this.board[i] = isMax ? "O" : "X";
        const score = this.minimax(!isMax);
        this.board[i] = null;
        best = isMax ? Math.max(best, score) : Math.min(best, score);
      }
    }
    return best;
  }

  get winner() {
    const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
    for (const [a,b,c] of lines) {
      if (this.board[a] && this.board[a] === this.board[b] && this.board[b] === this.board[c])
        return this.board[a];
    }
    return null;
  }

  get isDraw() { return !this.winner && this.board.every(c => c !== null); }

  display() {
    for (let i = 0; i < 9; i += 3)
      console.log(this.board.slice(i, i+3).map(c => c || ".").join(" | "));
  }
}

// --- demo ---
const game = new TicTacToe();
game.play(4); // X center
game.aiMove(); // O responds
game.play(0); // X corner
game.aiMove(); // O responds
game.display();`,
    );
  }

  // ----- 9. CHATBOT -------------------------------------------------------

  if (matches(lower, ["chat bot", "chatbot", "conversational", "chat program"])) {
    if (isPython) {
      return r(
        "Here's a rule-based chatbot with pattern matching, memory, and multiple conversation topics.",
        `import random
import re

def chatbot():
    """A rule-based chatbot with pattern matching."""

    memory = {"name": None, "mood": None, "topic": None}

    patterns = [
        (r"(?:my name is|i'm|i am) (\\w+)", lambda m: remember_name(m.group(1))),
        (r"what(?:'s| is) my name", lambda m: recall_name()),
        (r"(?:i feel|i'm feeling|i am feeling) (\\w+)", lambda m: respond_mood(m.group(1))),
        (r"(?:tell me a joke|joke)", lambda m: tell_joke()),
        (r"(?:tell me a fact|fun fact|fact)", lambda m: tell_fact()),
        (r"(?:help|what can you do)", lambda m: show_help()),
        (r"(?:how are you|how do you feel)", lambda m: bot_feelings()),
        (r"(?:meaning of life|purpose)", lambda m: philosophy()),
        (r"(?:thank|thanks)", lambda m: "You're welcome! Anything else?"),
        (r"(?:bye|goodbye|exit|quit)", lambda m: "Goodbye! Have a great day!"),
        (r"(?:hello|hi|hey)", lambda m: greet()),
        (r"(?:weather|forecast)", lambda m: "I wish I could check the weather! Try building a weather app ;)"),
        (r"(?:favorite|favourite) (\\w+)", lambda m: f"Hmm, I don't have a favorite {m.group(1)} but I'd love to hear yours!"),
    ]

    def remember_name(name):
        memory["name"] = name.capitalize()
        return f"Nice to meet you, {memory['name']}!"

    def recall_name():
        return f"Your name is {memory['name']}!" if memory["name"] else "You haven't told me your name yet!"

    def respond_mood(mood):
        memory["mood"] = mood
        responses = {
            "happy": "That's wonderful to hear!",
            "sad": "I'm sorry to hear that. Want to talk about it or hear a joke?",
            "angry": "Take a deep breath. Want to vent or shall I distract you?",
            "tired": "Rest is important! Maybe take a short break?",
            "excited": "That's awesome! What's got you excited?",
        }
        return responses.get(mood.lower(), f"Thanks for sharing that you feel {mood}.")

    def tell_joke():
        jokes = [
            "Why do programmers prefer dark mode? Because light attracts bugs!",
            "There are 10 kinds of people: those who understand binary and those who don't.",
            "A SQL query walks into a bar, sees two tables and asks: 'Can I join you?'",
            "Why was the JavaScript developer sad? Because he didn't Node how to Express himself.",
            "What's a programmer's favorite hangout place? Foo Bar.",
        ]
        return random.choice(jokes)

    def tell_fact():
        facts = [
            "The first computer bug was an actual moth found in a computer in 1947.",
            "Python is named after Monty Python, not the snake!",
            "The first website is still online: http://info.cern.ch",
            "There are approximately 700 programming languages.",
            "The average developer writes about 50 lines of code per day.",
        ]
        return random.choice(facts)

    def show_help():
        return ("I can chat about many things! Try:\\n"
                "  - Tell me your name\\n"
                "  - Ask for a joke or fun fact\\n"
                "  - Tell me how you feel\\n"
                "  - Ask me anything!")

    def bot_feelings():
        return random.choice([
            "I'm doing great, thanks for asking!",
            "I'm feeling chatty today!",
            "Pretty good! Ready to help you out.",
        ])

    def philosophy():
        return "42. But also: to learn, to build, and to help others."

    def greet():
        name = f", {memory['name']}" if memory["name"] else ""
        return random.choice([f"Hello{name}!", f"Hey{name}! What's up?", f"Hi{name}! How can I help?"])

    def respond(text):
        text = text.lower().strip()
        for pattern, handler in patterns:
            match = re.search(pattern, text)
            if match:
                return handler(match)
        fallbacks = [
            "Interesting! Tell me more.",
            "I'm not sure I understand. Could you rephrase?",
            "That's cool! What else is on your mind?",
            "Hmm, I'll have to think about that one.",
        ]
        return random.choice(fallbacks)

    print("=== ChatBot ===")
    print("Type 'quit' to exit.\\n")

    while True:
        user_input = input("You: ").strip()
        if not user_input:
            continue
        reply = respond(user_input)
        print(f"Bot: {reply}\\n")
        if "goodbye" in reply.lower():
            break

chatbot()`,
      );
    }
    return r(
      "Here's a JavaScript chatbot with pattern matching and conversation memory.",
      `class ChatBot {
  constructor() {
    this.memory = { name: null, mood: null };
    this.history = [];
  }

  respond(input) {
    const text = input.toLowerCase().trim();
    this.history.push({ role: "user", text: input });

    let reply;
    if (/(?:my name is|i'm|i am) (\\w+)/i.test(input)) {
      this.memory.name = input.match(/(?:my name is|i'm|i am) (\\w+)/i)[1];
      reply = \`Nice to meet you, \${this.memory.name}!\`;
    } else if (/what(?:'s| is) my name/.test(text)) {
      reply = this.memory.name ? \`Your name is \${this.memory.name}!\` : "You haven't told me yet!";
    } else if (/(?:i feel|i'm feeling) (\\w+)/.test(text)) {
      const mood = text.match(/(?:i feel|i'm feeling) (\\w+)/)[1];
      const moods = { happy: "Wonderful!", sad: "I'm sorry. Want a joke?", angry: "Take a breath.", tired: "Rest up!" };
      reply = moods[mood] || \`Thanks for sharing you feel \${mood}.\`;
    } else if (/joke/.test(text)) {
      const jokes = [
        "Why do programmers prefer dark mode? Light attracts bugs!",
        "There are 10 types of people: those who understand binary and those who don't.",
        "A SQL query walks into a bar, sees two tables and asks: Can I join you?",
      ];
      reply = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (/fact/.test(text)) {
      const facts = [
        "The first bug was a real moth in a computer (1947).",
        "Python is named after Monty Python!",
        "There are ~700 programming languages.",
      ];
      reply = facts[Math.floor(Math.random() * facts.length)];
    } else if (/(?:hello|hi|hey)/.test(text)) {
      const name = this.memory.name ? \`, \${this.memory.name}\` : "";
      reply = ["Hello" + name + "!", "Hey" + name + "! What's up?", "Hi" + name + "!"][Math.floor(Math.random() * 3)];
    } else if (/(?:help|what can you do)/.test(text)) {
      reply = "I can chat, tell jokes, remember your name, and more!";
    } else if (/(?:bye|quit|exit)/.test(text)) {
      reply = "Goodbye! Have a great day!";
    } else {
      const fallbacks = ["Interesting! Tell me more.", "Could you rephrase?", "That's cool!"];
      reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    this.history.push({ role: "bot", text: reply });
    return reply;
  }
}

// --- demo ---
const bot = new ChatBot();
console.log(bot.respond("Hello!"));
console.log(bot.respond("My name is Alex"));
console.log(bot.respond("Tell me a joke"));
console.log(bot.respond("What's my name?"));`,
    );
  }

  // ----- 10. SIMPLE WEBSITE (HTML/CSS) -----------------------------------

  if (matches(lower, ["website", "html page", "web page", "landing page", "portfolio"])) {
    return r(
      "Here's a complete responsive website template with HTML, CSS, and JavaScript.",
      `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Website</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; }

    /* Navigation */
    nav { background: #2d3436; color: white; padding: 1rem 2rem; display: flex; justify-content: space-between; align-items: center; position: sticky; top: 0; z-index: 100; }
    nav .logo { font-size: 1.5rem; font-weight: bold; }
    nav ul { list-style: none; display: flex; gap: 1.5rem; }
    nav a { color: white; text-decoration: none; transition: opacity 0.2s; }
    nav a:hover { opacity: 0.8; }

    /* Hero */
    .hero { background: linear-gradient(135deg, #6c5ce7, #a29bfe); color: white; padding: 6rem 2rem; text-align: center; }
    .hero h1 { font-size: 3rem; margin-bottom: 1rem; }
    .hero p { font-size: 1.2rem; max-width: 600px; margin: 0 auto 2rem; opacity: 0.9; }
    .btn { display: inline-block; padding: 0.8rem 2rem; background: white; color: #6c5ce7; border-radius: 8px; text-decoration: none; font-weight: bold; transition: transform 0.2s; }
    .btn:hover { transform: translateY(-2px); }

    /* Features */
    .features { padding: 4rem 2rem; max-width: 1000px; margin: 0 auto; }
    .features h2 { text-align: center; margin-bottom: 2rem; font-size: 2rem; }
    .feature-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; }
    .feature-card { background: #f8f9fa; border-radius: 12px; padding: 2rem; text-align: center; transition: transform 0.2s; }
    .feature-card:hover { transform: translateY(-4px); }
    .feature-card h3 { margin: 1rem 0 0.5rem; }

    /* Footer */
    footer { background: #2d3436; color: white; text-align: center; padding: 2rem; margin-top: 4rem; }

    @media (max-width: 600px) {
      .hero h1 { font-size: 2rem; }
      nav ul { gap: 0.8rem; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="logo">MySite</div>
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#contact">Contact</a></li>
    </ul>
  </nav>

  <section class="hero" id="home">
    <h1>Welcome to MySite</h1>
    <p>A beautifully crafted website template to kickstart your next project.</p>
    <a href="#features" class="btn">Get Started</a>
  </section>

  <section class="features" id="features">
    <h2>Features</h2>
    <div class="feature-grid">
      <div class="feature-card">
        <h3>Responsive Design</h3>
        <p>Looks great on every device, from phones to desktops.</p>
      </div>
      <div class="feature-card">
        <h3>Modern CSS</h3>
        <p>Built with CSS Grid, Flexbox, and custom properties.</p>
      </div>
      <div class="feature-card">
        <h3>Fast & Light</h3>
        <p>No frameworks needed. Pure HTML, CSS, and JavaScript.</p>
      </div>
    </div>
  </section>

  <footer id="contact">
    <p>Built with code and creativity. &copy; 2024 MySite.</p>
  </footer>

  <script>
    // Smooth scrolling
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        document.querySelector(a.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
      });
    });
  </script>
</body>
</html>`,
    );
  }

  // ----- 11. FIX CODE ----------------------------------------------------

  if (matches(lower, ["fix", "debug", "error", "bug", "broken", "not working", "issue"])) {
    if (!code) {
      return r("Please share your code so I can help fix it. Paste your code in the editor and try again.", null);
    }
    const analysis = analyzeAndFix(code, lang);
    return r(analysis.message, analysis.code);
  }

  // ----- 12. ADD FEATURE -------------------------------------------------

  if (matches(lower, ["add a", "add an", "include", "insert", "append", "new feature"])) {
    if (!code) {
      return r(
        "I'd be happy to add that feature! Please put your existing code in the editor first, then tell me what to add.",
        null,
      );
    }
    const feature = lower.replace(/^(?:add a|add an|add|include|insert|append)\s+/i, "").trim();
    const modified = addFeature(code, feature, lang);
    return r(modified.message, modified.code);
  }

  // ----- 13. EXPLAIN CODE ------------------------------------------------

  if (matches(lower, ["explain", "how does", "what does", "walk me through", "understand"])) {
    if (!code) {
      return r("Paste the code you'd like explained into the editor and ask again!", null);
    }
    const explanation = explainCode(code, lang);
    return r(explanation, null);
  }

  // ----- 14. REFACTOR / IMPROVE ------------------------------------------

  if (matches(lower, ["refactor", "improve", "clean up", "optimize", "make better", "simplify"])) {
    if (!code) {
      return r("Share your code in the editor and I'll suggest improvements!", null);
    }
    const improved = refactorCode(code, lang);
    return r(improved.message, improved.code);
  }

  // ----- DEFAULT: generate something based on prompt ----------------------

  return generateGeneric(prompt, lang);
}

// ---------------------------------------------------------------------------
// Helper: match keywords
// ---------------------------------------------------------------------------

function matches(text: string, keywords: string[]): boolean {
  return keywords.some((kw) => text.includes(kw));
}

// ---------------------------------------------------------------------------
// analyzeAndFix - attempts to detect and fix common issues
// ---------------------------------------------------------------------------

function analyzeAndFix(code: string, lang: string): { message: string; code: string } {
  const isPython = lang === "python";
  let fixed = code;
  const fixes: string[] = [];

  if (isPython) {
    // Fix missing colons after def/if/for/while/class/else/elif/try/except
    const colonLines = fixed.split("\n").map((line) => {
      const trimmed = line.trimEnd();
      if (/^(\s*)(def |if |elif |else|for |while |class |try|except|finally)/.test(trimmed) && !trimmed.endsWith(":") && !trimmed.endsWith(",")) {
        fixes.push(`Added missing colon: "${trimmed}"`);
        return trimmed + ":";
      }
      return line;
    });
    fixed = colonLines.join("\n");

    // Fix common print statement (Python 2 style)
    if (/^(\s*)print\s+[^(]/m.test(fixed)) {
      fixed = fixed.replace(/^(\s*)print\s+(.+)$/gm, "$1print($2)");
      fixes.push("Converted Python 2 print statements to Python 3 print() calls");
    }

    // Fix = used instead of == in conditions
    fixed = fixed.replace(/^(\s*(?:if|elif|while)\s+.*?)([^=!<>])=([^=])/gm, (_, prefix, before, after) => {
      fixes.push("Fixed assignment (=) used instead of comparison (==) in condition");
      return `${prefix}${before}==${after}`;
    });
  } else {
    // JS fixes
    // Missing semicolons (basic heuristic)
    const jsLines = fixed.split("\n").map((line) => {
      const trimmed = line.trimEnd();
      if (trimmed && !trimmed.endsWith(";") && !trimmed.endsWith("{") && !trimmed.endsWith("}") &&
          !trimmed.endsWith(",") && !trimmed.endsWith("(") && !trimmed.endsWith(":") &&
          !trimmed.startsWith("//") && !trimmed.startsWith("/*") && !trimmed.startsWith("*") &&
          /^(\s*)(?:const|let|var|return|throw)\s/.test(trimmed)) {
        fixes.push(`Added missing semicolon: "${trimmed.trim()}"`);
        return trimmed + ";";
      }
      return line;
    });
    fixed = jsLines.join("\n");

    // Fix === vs ==
    if (/[^=!]==[^=]/.test(fixed) && !/===/.test(fixed)) {
      fixed = fixed.replace(/([^=!])={2}([^=])/g, "$1===$2");
      fixes.push("Upgraded == to === for strict equality");
    }
  }

  if (fixes.length === 0) {
    return {
      message: "I reviewed your code and didn't find obvious syntax issues. The code looks structurally sound. If you're seeing a specific error, paste the error message and I'll help debug it.",
      code: fixed,
    };
  }

  return {
    message: `I found and fixed ${fixes.length} issue(s):\n\n${fixes.map((f) => `- ${f}`).join("\n")}\n\nReview the updated code to make sure it matches your intent.`,
    code: fixed,
  };
}

// ---------------------------------------------------------------------------
// addFeature - adds a feature to existing code
// ---------------------------------------------------------------------------

function addFeature(code: string, feature: string, lang: string): { message: string; code: string } {
  const isPython = lang === "python";
  const featureLower = feature.toLowerCase();

  // Try to detect what class/function we're extending
  if (featureLower.includes("print") || featureLower.includes("log") || featureLower.includes("display")) {
    if (isPython) {
      return {
        message: "I added a display/print function to your code.",
        code: code + `\n\ndef display_info():\n    """Display all information."""\n    print("=== Info Display ===")\n    print("Program output:")\n    # Add your display logic here\n    print("Done.")\n\ndisplay_info()\n`,
      };
    }
    return {
      message: "I added a display/log function to your code.",
      code: code + `\n\nfunction displayInfo() {\n  console.log("=== Info Display ===");\n  console.log("Program output:");\n  // Add your display logic here\n  console.log("Done.");\n}\n\ndisplayInfo();\n`,
    };
  }

  if (featureLower.includes("save") || featureLower.includes("export") || featureLower.includes("file")) {
    if (isPython) {
      return {
        message: "I added a save-to-file function to your code.",
        code: code + `\n\ndef save_to_file(data, filename="output.txt"):\n    """Save data to a file."""\n    with open(filename, "w") as f:\n        if isinstance(data, list):\n            for item in data:\n                f.write(str(item) + "\\n")\n        else:\n            f.write(str(data))\n    print(f"Data saved to {filename}")\n`,
      };
    }
    return {
      message: "I added a save/export function to your code.",
      code: code + `\n\nfunction saveToFile(data, filename = "output.json") {\n  const fs = require("fs");\n  const content = typeof data === "string" ? data : JSON.stringify(data, null, 2);\n  fs.writeFileSync(filename, content);\n  console.log(\`Saved to \${filename}\`);\n}\n`,
    };
  }

  if (featureLower.includes("input") || featureLower.includes("user") || featureLower.includes("prompt")) {
    if (isPython) {
      return {
        message: "I added user input handling to your code.",
        code: code + `\n\ndef get_user_input(prompt_text, input_type=str, default=None):\n    """Get validated user input."""\n    while True:\n        try:\n            value = input(prompt_text).strip()\n            if not value and default is not None:\n                return default\n            return input_type(value)\n        except (ValueError, EOFError):\n            print(f"  Please enter a valid {input_type.__name__}.")\n`,
      };
    }
    return {
      message: "I added user input handling to your code.",
      code: code + `\n\nfunction getUserInput(promptText, defaultValue = "") {\n  const readline = require("readline");\n  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });\n  return new Promise(resolve => {\n    rl.question(promptText, answer => {\n      rl.close();\n      resolve(answer.trim() || defaultValue);\n    });\n  });\n}\n`,
    };
  }

  // Generic: add a comment block + placeholder
  if (isPython) {
    return {
      message: `I added a section for "${feature}" to your code. Fill in the implementation details.`,
      code: code + `\n\n# --- ${feature} ---\ndef ${feature.replace(/[^a-zA-Z0-9]/g, "_").toLowerCase()}():\n    """${feature} implementation."""\n    # TODO: implement ${feature}\n    pass\n`,
    };
  }
  return {
    message: `I added a section for "${feature}" to your code. Fill in the implementation details.`,
    code: code + `\n\n// --- ${feature} ---\nfunction ${toCamelCase(feature)}() {\n  // TODO: implement ${feature}\n}\n`,
  };
}

function toCamelCase(str: string): string {
  return str
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .split(" ")
    .map((w, i) => (i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    .join("");
}

// ---------------------------------------------------------------------------
// explainCode
// ---------------------------------------------------------------------------

function explainCode(code: string, lang: string): string {
  const lines = code.split("\n").filter((l) => l.trim().length > 0);
  const isPython = lang === "python";

  const parts: string[] = [];
  parts.push(`Here's a breakdown of your ${isPython ? "Python" : "JavaScript"} code:\n`);

  // Count structures
  const functions = isPython
    ? (code.match(/^\s*def /gm) || []).length
    : (code.match(/(?:function |const \w+ = (?:\(|async)|=>\s*\{)/gm) || []).length;
  const classes = (code.match(isPython ? /^\s*class /gm : /^\s*class /gm) || []).length;
  const loops = (code.match(isPython ? /^\s*(?:for|while) /gm : /(?:for|while)\s*\(/gm) || []).length;
  const conditionals = (code.match(isPython ? /^\s*if /gm : /(?:if)\s*\(/gm) || []).length;

  parts.push(`**Structure:** ${lines.length} lines of code with ${functions} function(s), ${classes} class(es), ${loops} loop(s), and ${conditionals} conditional(s).\n`);

  // Identify imports
  const imports = isPython
    ? (code.match(/^\s*(?:import |from )/gm) || [])
    : (code.match(/^\s*(?:import |const .+ = require)/gm) || []);
  if (imports.length > 0) {
    parts.push(`**Dependencies:** Uses ${imports.length} import(s).\n`);
  }

  // Look for common patterns
  if (code.includes("class ")) parts.push("- Uses **object-oriented programming** with classes.");
  if (code.includes("async ") || code.includes("await ")) parts.push("- Uses **asynchronous programming** (async/await).");
  if (code.includes(".map(") || code.includes(".filter(") || code.includes(".reduce(")) parts.push("- Uses **functional programming** patterns (map/filter/reduce).");
  if (code.includes("try") && (code.includes("except") || code.includes("catch"))) parts.push("- Includes **error handling** (try/catch).");
  if (code.includes("print(") || code.includes("console.log")) parts.push("- Produces **console output** for debugging or display.");

  parts.push("\nThe code appears to be " + (lines.length > 50 ? "a substantial program" : lines.length > 20 ? "a moderate-sized script" : "a concise script") + ". Let me know if you'd like me to explain any specific part in more detail!");

  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// refactorCode
// ---------------------------------------------------------------------------

function refactorCode(code: string, lang: string): { message: string; code: string } {
  const isPython = lang === "python";
  let improved = code;
  const suggestions: string[] = [];

  if (isPython) {
    // Add docstrings to functions missing them
    improved = improved.replace(/(def \w+\([^)]*\):)\n(\s+)(?!""")/g, (_, defLine, indent) => {
      suggestions.push("Added docstrings to functions");
      return `${defLine}\n${indent}\"\"\"TODO: Add description.\"\"\"\n${indent}`;
    });

    // Replace string concatenation with f-strings
    if (/print\([^)]*\+[^)]*\)/.test(improved)) {
      suggestions.push("Consider using f-strings instead of string concatenation for cleaner code");
    }
  } else {
    // Suggest const over let where possible
    if (/\blet\b/.test(improved)) {
      suggestions.push("Consider using 'const' instead of 'let' where variables aren't reassigned");
    }
    // Suggest arrow functions
    if (/function\s*\(/.test(improved)) {
      suggestions.push("Consider using arrow functions for anonymous functions");
    }
  }

  if (suggestions.length === 0) {
    return { message: "Your code already looks clean! No major refactoring needed.", code: improved };
  }

  return {
    message: `Here are the improvements I made/suggest:\n\n${suggestions.map((s) => `- ${s}`).join("\n")}`,
    code: improved,
  };
}

// ---------------------------------------------------------------------------
// generateGeneric - fallback code generator
// ---------------------------------------------------------------------------

function generateGeneric(prompt: string, lang: string): VibeResponse {
  const isPython = lang === "python";
  const topic = prompt.toLowerCase();

  // Try to extract what they want to build
  if (topic.includes("sort") || topic.includes("sorting")) {
    if (isPython) {
      return {
        message: "Here are multiple sorting algorithms implemented in Python with comparisons.",
        code: `def bubble_sort(arr):\n    a = arr[:]\n    n = len(a)\n    for i in range(n):\n        for j in range(0, n-i-1):\n            if a[j] > a[j+1]:\n                a[j], a[j+1] = a[j+1], a[j]\n    return a\n\ndef quick_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    pivot = arr[len(arr) // 2]\n    left = [x for x in arr if x < pivot]\n    mid = [x for x in arr if x == pivot]\n    right = [x for x in arr if x > pivot]\n    return quick_sort(left) + mid + quick_sort(right)\n\ndef merge_sort(arr):\n    if len(arr) <= 1:\n        return arr\n    mid = len(arr) // 2\n    left = merge_sort(arr[:mid])\n    right = merge_sort(arr[mid:])\n    return merge(left, right)\n\ndef merge(left, right):\n    result = []\n    i = j = 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]:\n            result.append(left[i]); i += 1\n        else:\n            result.append(right[j]); j += 1\n    result.extend(left[i:])\n    result.extend(right[j:])\n    return result\n\n# Demo\nimport random\ndata = [random.randint(1, 100) for _ in range(10)]\nprint(f"Original: {data}")\nprint(f"Bubble:   {bubble_sort(data)}")\nprint(f"Quick:    {quick_sort(data)}")\nprint(f"Merge:    {merge_sort(data)}")`,
      };
    }
    return {
      message: "Here are multiple sorting algorithms in JavaScript.",
      code: `function bubbleSort(arr) {\n  const a = [...arr];\n  for (let i = 0; i < a.length; i++)\n    for (let j = 0; j < a.length - i - 1; j++)\n      if (a[j] > a[j+1]) [a[j], a[j+1]] = [a[j+1], a[j]];\n  return a;\n}\n\nfunction quickSort(arr) {\n  if (arr.length <= 1) return arr;\n  const pivot = arr[Math.floor(arr.length / 2)];\n  return [...quickSort(arr.filter(x => x < pivot)), ...arr.filter(x => x === pivot), ...quickSort(arr.filter(x => x > pivot))];\n}\n\nconst data = Array.from({length: 10}, () => Math.floor(Math.random() * 100));\nconsole.log("Original:", data);\nconsole.log("Bubble:  ", bubbleSort(data));\nconsole.log("Quick:   ", quickSort(data));`,
    };
  }

  if (topic.includes("api") || topic.includes("fetch") || topic.includes("http") || topic.includes("request")) {
    if (isPython) {
      return {
        message: "Here's a simple HTTP API client pattern in Python.",
        code: `import json\nfrom urllib.request import urlopen, Request\nfrom urllib.error import HTTPError, URLError\n\ndef api_get(url, headers=None):\n    """Make a GET request and return JSON."""\n    try:\n        req = Request(url, headers=headers or {})\n        with urlopen(req) as response:\n            return json.loads(response.read().decode())\n    except HTTPError as e:\n        print(f"HTTP Error {e.code}: {e.reason}")\n    except URLError as e:\n        print(f"Connection Error: {e.reason}")\n    return None\n\n# Example: fetch a public API\ndata = api_get("https://jsonplaceholder.typicode.com/posts/1")\nif data:\n    print(f"Title: {data['title']}")\n    print(f"Body: {data['body']}")`,
      };
    }
    return {
      message: "Here's a fetch API wrapper for JavaScript.",
      code: `async function apiGet(url) {\n  try {\n    const res = await fetch(url);\n    if (!res.ok) throw new Error(\`HTTP \${res.status}\`);\n    return await res.json();\n  } catch (err) {\n    console.error("Request failed:", err.message);\n    return null;\n  }\n}\n\n// Example\napiGet("https://jsonplaceholder.typicode.com/posts/1")\n  .then(data => {\n    if (data) console.log("Title:", data.title);\n  });`,
    };
  }

  // Ultimate fallback: generate a basic template
  if (isPython) {
    return {
      message: `I generated a Python starter based on your prompt: "${prompt}". Modify it to suit your needs!`,
      code: `# ${prompt}\n\ndef main():\n    \"\"\"Main entry point.\"\"\"\n    print("${prompt}")\n    # TODO: Add your implementation here\n    \n    data = []\n    \n    while True:\n        user_input = input("Enter command (or 'quit'): ").strip()\n        if user_input.lower() == 'quit':\n            break\n        data.append(user_input)\n        print(f"  Added: {user_input}")\n        print(f"  Total items: {len(data)}")\n    \n    print(f"\\nFinal data: {data}")\n    print("Done!")\n\nif __name__ == "__main__":\n    main()`,
    };
  }
  return {
    message: `I generated a JavaScript starter based on your prompt: "${prompt}". Modify it to suit your needs!`,
    code: `// ${prompt}\n\nfunction main() {\n  console.log("${prompt}");\n  // TODO: Add your implementation here\n  \n  const data = [];\n  console.log("Ready! Modify this template to build your project.");\n  return data;\n}\n\nmain();`,
  };
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------

export async function POST(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  const userId = verifyToken(token);
  if (!userId) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

  const { prompt, code, language, projectId } = await req.json();

  // Check usage limits
  const usage = canUseVibe(userId);
  if (!usage.allowed) {
    return NextResponse.json(
      { error: "You've used all 10 free AI prompts. Upgrade to Vibe Pro for unlimited access!" },
      { status: 403 },
    );
  }

  // Record usage
  recordVibeUsage(userId);

  // Check if user is a pro subscriber (Vibe Pro or Pro All)
  const user = getUserById(userId);
  const isPro = user?.isVibeUnlimited || user?.subscriptions?.some(
    (s) => s.plan === "vibe_pro" || s.plan === "pro_all"
  ) || false;

  let response: VibeResponse;

  // If Anthropic API key is set, use Claude
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const AnthropicSDK = (await import("@anthropic-ai/sdk")).default;
      const client = new AnthropicSDK() as InstanceType<typeof Anthropic>;

      // Pro users get advanced full-featured code generation
      // Free users get basic simple examples
      const systemPrompt = isPro
        ? `You are an expert AI coding assistant in Vibe Code Studio (PRO MODE). The user has a paid subscription. Generate COMPLETE, PRODUCTION-QUALITY, FULLY-FEATURED code. Include:
- Full error handling and input validation
- Clean architecture with classes/modules
- Comments explaining complex parts
- Multiple features, not just the basics
- Professional formatting and best practices
- If they ask for a game: include scoring, menus, difficulty levels, replay
- If they ask for an app: include CRUD, search, sorting, data persistence
- If they ask for a website: include multiple pages, navigation, styling
Write the most impressive, complete version possible. Language: ${language || "python"}. Current code: ${code || "empty project"}.
Always respond with JSON: {"message": "explanation of what was built and all features", "code": "the complete code"}`
        : `You are an AI coding assistant in Vibe Code Studio (FREE MODE). Generate simple, working code that demonstrates the basic concept. Keep it short and beginner-friendly (under 50 lines). Language: ${language || "python"}. Current code: ${code || "empty project"}.
Always respond with JSON: {"message": "brief explanation", "code": "the code"}`;

      const maxTokens = isPro ? 8192 : 2048;

      const message = await client.messages.create({
        model: isPro ? "claude-sonnet-4-6" : "claude-haiku-4-5-20251001",
        max_tokens: maxTokens,
        system: systemPrompt,
        messages: [{ role: "user", content: prompt }],
      });

      const textBlock = message.content[0];
      const responseText = textBlock.type === "text" ? textBlock.text : "{}";

      try {
        const parsed = JSON.parse(responseText);
        response = {
          message: parsed.message || "Here's your code!",
          code: parsed.code || null,
        };
      } catch {
        response = { message: responseText, code: null };
      }
    } catch (error) {
      console.error("Anthropic API error, falling back to pattern matching:", error);
      response = generateVibeResponse(prompt, code ?? null, language ?? "python");
    }
  } else {
    // Fallback: pattern-matching response (always basic for non-API)
    response = generateVibeResponse(prompt, code ?? null, language ?? "python");
    // For pro users without API key, add a note
    if (isPro) {
      response.message = "⚡ PRO MODE: " + response.message + "\n\n(Connect an Anthropic API key for full AI-powered generation)";
    }
  }

  // Auto-save if projectId and generated code
  if (projectId && response.code) {
    updateVibeProject(projectId, userId, response.code);
  }

  return NextResponse.json({
    response,
    usage: canUseVibe(userId),
  });
}
