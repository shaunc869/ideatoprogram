export interface Lesson {
  id: string;
  title: string;
  description: string;
  category: "free" | "free-js" | "python" | "javascript";
  isPro: boolean;
  order: number;
  content: string;
  codeExample: string;
}

const freeLessons: Lesson[] = [
  {
    id: "free-1", title: "What is Programming?", description: "Learn the fundamentals of what programming is and why it matters.", category: "free", isPro: false, order: 1,
    content: "Programming is the process of creating instructions that a computer can follow to perform tasks. These instructions are written in programming languages that act as a bridge between human thought and machine execution.\n\nAt its core, programming involves:\n- **Problem Solving**: Breaking down complex problems into smaller, manageable steps\n- **Logic**: Creating sequences of instructions that produce desired outcomes\n- **Abstraction**: Hiding complexity behind simple interfaces\n\nProgramming languages like Python and JavaScript allow us to write these instructions in a way that's readable by humans and executable by machines.",
    codeExample: "# This is a simple program\nprint(\"Hello, World!\")\n\n# Programs follow instructions step by step\nname = \"Learner\"\nprint(f\"Welcome, {name}!\")\nprint(\"Let's start coding!\")"
  },
  {
    id: "free-2", title: "Variables & Data Types", description: "Understand how to store and work with different types of data.", category: "free", isPro: false, order: 2,
    content: "Variables are containers that store data values. Think of them as labeled boxes where you can put different types of information.\n\n**Common Data Types:**\n- **Strings**: Text data like \"Hello\"\n- **Numbers**: Integers (42) and decimals (3.14)\n- **Booleans**: True or False values\n- **Lists/Arrays**: Collections of items\n\nVariables let you store, retrieve, and manipulate data throughout your program.",
    codeExample: "# Strings\ngreeting = \"Hello, World!\"\n\n# Numbers\nage = 25\ntemperature = 98.6\n\n# Booleans\nis_student = True\n\n# Lists\ncolors = [\"red\", \"green\", \"blue\"]\n\nprint(type(greeting))  # <class 'str'>\nprint(type(age))       # <class 'int'>"
  },
  {
    id: "free-3", title: "Conditional Statements", description: "Learn how to make decisions in your code with if/else.", category: "free", isPro: false, order: 3,
    content: "Conditional statements let your program make decisions based on conditions. The most common form is the if/else statement.\n\n**How it works:**\n1. Check a condition\n2. If the condition is true, run one block of code\n3. If false, run a different block\n\nYou can chain multiple conditions with elif (else if) to handle many scenarios.",
    codeExample: "age = 18\n\nif age >= 18:\n    print(\"You can vote!\")\nelif age >= 16:\n    print(\"You can drive!\")\nelse:\n    print(\"You're still young!\")\n\n# Combining conditions\nhas_ticket = True\nis_vip = False\n\nif has_ticket and is_vip:\n    print(\"VIP entrance\")\nelif has_ticket:\n    print(\"General entrance\")\nelse:\n    print(\"Buy a ticket first\")"
  },
  {
    id: "free-4", title: "Loops", description: "Repeat actions efficiently with for and while loops.", category: "free", isPro: false, order: 4,
    content: "Loops allow you to repeat a block of code multiple times without writing it over and over.\n\n**Two main types:**\n- **For loops**: Run a set number of times or iterate over a collection\n- **While loops**: Run as long as a condition is true\n\nLoops are essential for processing lists, repeating tasks, and building interactive programs.",
    codeExample: "# For loop with range\nfor i in range(5):\n    print(f\"Count: {i}\")\n\n# For loop over a list\nfruits = [\"apple\", \"banana\", \"cherry\"]\nfor fruit in fruits:\n    print(f\"I like {fruit}\")\n\n# While loop\ncount = 0\nwhile count < 3:\n    print(f\"While count: {count}\")\n    count += 1"
  },
  {
    id: "free-5", title: "Functions", description: "Create reusable blocks of code with functions.", category: "free", isPro: false, order: 5,
    content: "Functions are reusable blocks of code that perform a specific task. They help you organize code, avoid repetition, and make programs easier to read.\n\n**Key concepts:**\n- **Parameters**: Input values the function accepts\n- **Return values**: Output the function produces\n- **Calling**: Using the function by its name",
    codeExample: "# Defining a function\ndef greet(name):\n    return f\"Hello, {name}!\"\n\n# Calling the function\nmessage = greet(\"Alice\")\nprint(message)  # Hello, Alice!\n\n# Function with multiple parameters\ndef add(a, b):\n    return a + b\n\nresult = add(5, 3)\nprint(result)  # 8\n\n# Default parameters\ndef power(base, exp=2):\n    return base ** exp\n\nprint(power(3))     # 9\nprint(power(3, 3))  # 27"
  },
  {
    id: "free-6", title: "Lists & Arrays", description: "Work with collections of data efficiently.", category: "free", isPro: false, order: 6,
    content: "Lists (called arrays in many languages) are ordered collections that can hold multiple values. They're one of the most commonly used data structures.\n\n**Key operations:**\n- Adding and removing items\n- Accessing items by index\n- Slicing and iterating\n- Sorting and searching",
    codeExample: "# Creating a list\nnumbers = [1, 2, 3, 4, 5]\n\n# Accessing elements\nprint(numbers[0])   # 1 (first)\nprint(numbers[-1])  # 5 (last)\n\n# Adding elements\nnumbers.append(6)\nnumbers.insert(0, 0)\n\n# Removing elements\nnumbers.remove(3)\npopped = numbers.pop()\n\n# Slicing\nprint(numbers[1:3])  # [1, 2]\n\n# List comprehension\nsquares = [x**2 for x in range(5)]\nprint(squares)  # [0, 1, 4, 9, 16]"
  },
  {
    id: "free-7", title: "Dictionaries & Objects", description: "Store data in key-value pairs for fast lookups.", category: "free", isPro: false, order: 7,
    content: "Dictionaries (objects in JavaScript) store data as key-value pairs. They provide fast lookups and are perfect for representing structured data.\n\n**Use cases:**\n- Storing user profiles\n- Configuration settings\n- Counting occurrences\n- Mapping relationships",
    codeExample: "# Creating a dictionary\nstudent = {\n    \"name\": \"Alice\",\n    \"age\": 20,\n    \"grades\": [90, 85, 92]\n}\n\n# Accessing values\nprint(student[\"name\"])  # Alice\nprint(student.get(\"age\"))  # 20\n\n# Adding/updating\nstudent[\"email\"] = \"alice@example.com\"\nstudent[\"age\"] = 21\n\n# Iterating\nfor key, value in student.items():\n    print(f\"{key}: {value}\")\n\n# Nested dictionaries\nschool = {\n    \"class_a\": {\"students\": 30},\n    \"class_b\": {\"students\": 25}\n}"
  },
  {
    id: "free-8", title: "String Manipulation", description: "Master working with text data in your programs.", category: "free", isPro: false, order: 8,
    content: "Strings are sequences of characters used to represent text. Mastering string manipulation is essential since most programs deal with text data.\n\n**Common operations:**\n- Concatenation and formatting\n- Searching and replacing\n- Splitting and joining\n- Case conversion",
    codeExample: "text = \"Hello, World!\"\n\n# Methods\nprint(text.upper())       # HELLO, WORLD!\nprint(text.lower())       # hello, world!\nprint(text.replace(\"World\", \"Python\"))\n\n# F-strings (formatted strings)\nname = \"Alice\"\nage = 25\nprint(f\"{name} is {age} years old\")\n\n# Splitting and joining\nwords = \"one,two,three\".split(\",\")\nprint(words)  # ['one', 'two', 'three']\njoined = \" - \".join(words)\nprint(joined)  # one - two - three\n\n# Slicing\nprint(text[0:5])   # Hello\nprint(text[::-1])  # !dlroW ,olleH"
  },
  {
    id: "free-9", title: "Error Handling", description: "Handle errors gracefully to build robust programs.", category: "free", isPro: false, order: 9,
    content: "Errors are inevitable in programming. Error handling lets you anticipate problems and respond gracefully instead of crashing.\n\n**Types of errors:**\n- **Syntax errors**: Code that doesn't follow language rules\n- **Runtime errors**: Problems that occur during execution\n- **Logic errors**: Code runs but produces wrong results",
    codeExample: "# Try/except block\ntry:\n    number = int(input(\"Enter a number: \"))\n    result = 10 / number\n    print(f\"Result: {result}\")\nexcept ValueError:\n    print(\"That's not a valid number!\")\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")\nfinally:\n    print(\"This always runs\")\n\n# Raising exceptions\ndef validate_age(age):\n    if age < 0:\n        raise ValueError(\"Age cannot be negative\")\n    return age\n\ntry:\n    validate_age(-5)\nexcept ValueError as e:\n    print(f\"Error: {e}\")"
  },
  {
    id: "free-10", title: "Input & Output", description: "Learn to interact with users through input and output.", category: "free", isPro: false, order: 10,
    content: "Programs need to communicate with users. Input allows programs to receive data, and output displays results back to the user.\n\n**Key concepts:**\n- Reading user input\n- Formatting output\n- Reading and writing files\n- Console vs GUI output",
    codeExample: "# Basic input/output\nname = input(\"What's your name? \")\nprint(f\"Nice to meet you, {name}!\")\n\n# Type conversion from input\nage = int(input(\"How old are you? \"))\nprint(f\"In 10 years you'll be {age + 10}\")\n\n# File I/O\nwith open(\"notes.txt\", \"w\") as f:\n    f.write(\"Hello from Python!\\n\")\n    f.write(\"Learning is fun!\")\n\nwith open(\"notes.txt\", \"r\") as f:\n    content = f.read()\n    print(content)"
  },
];

const freeJsLessons: Lesson[] = [
  {
    id: "free-js-1", title: "What is JavaScript?", description: "Learn why JavaScript powers the entire web.", category: "free-js", isPro: false, order: 1,
    content: "JavaScript is the programming language of the web. Every website you visit uses JavaScript to make things interactive — buttons that click, forms that validate, animations that move.\n\nJavaScript runs in your browser and on servers (Node.js). It's one of the most popular languages in the world.\n\n**What JavaScript can do:**\n- Make websites interactive\n- Build mobile apps\n- Create server backends\n- Build games",
    codeExample: "// Your first JavaScript program\nconsole.log(\"Hello, World!\");\n\n// Variables\nlet name = \"Learner\";\nconsole.log(\"Welcome, \" + name + \"!\");"
  },
  {
    id: "free-js-2", title: "Variables in JavaScript", description: "Learn let, const, and how to store data.", category: "free-js", isPro: false, order: 2,
    content: "JavaScript has three ways to create variables:\n\n- **let** — for values that change\n- **const** — for values that stay the same\n- **var** — the old way (avoid this)\n\nAlways prefer const unless you need to change the value, then use let.",
    codeExample: "// const - doesn't change\nconst name = \"Alice\";\nconst age = 25;\n\n// let - can change\nlet score = 0;\nscore = 10;\n\nconsole.log(name);  // Alice\nconsole.log(score); // 10"
  },
  {
    id: "free-js-3", title: "If/Else in JavaScript", description: "Make decisions in your JavaScript code.", category: "free-js", isPro: false, order: 3,
    content: "If/else statements let your code make decisions. The syntax uses curly braces {} instead of indentation.\n\n**Key differences from Python:**\n- Use curly braces {} not colons\n- Conditions go in parentheses ()\n- Use === for comparison (not ==)",
    codeExample: "const age = 18;\n\nif (age >= 18) {\n    console.log(\"You can vote!\");\n} else if (age >= 16) {\n    console.log(\"You can drive!\");\n} else {\n    console.log(\"You're still young!\");\n}"
  },
  {
    id: "free-js-4", title: "Loops in JavaScript", description: "Repeat code with for and while loops.", category: "free-js", isPro: false, order: 4,
    content: "JavaScript has several types of loops:\n\n- **for loop** — classic counting loop\n- **for...of** — loop over arrays\n- **while** — loop while condition is true\n\nThe for loop has three parts: start, condition, and step.",
    codeExample: "// Classic for loop\nfor (let i = 1; i <= 5; i++) {\n    console.log(i);\n}\n\n// for...of loop\nconst fruits = [\"apple\", \"banana\", \"cherry\"];\nfor (const fruit of fruits) {\n    console.log(fruit);\n}"
  },
  {
    id: "free-js-5", title: "Functions in JavaScript", description: "Create reusable code blocks with functions.", category: "free-js", isPro: false, order: 5,
    content: "Functions are reusable blocks of code. JavaScript has two main ways to write them:\n\n- **Regular functions** — function keyword\n- **Arrow functions** — shorter syntax with =>\n\nArrow functions are modern and popular.",
    codeExample: "// Regular function\nfunction greet(name) {\n    return \"Hello, \" + name + \"!\";\n}\n\n// Arrow function\nconst add = (a, b) => a + b;\n\nconsole.log(greet(\"Alice\")); // Hello, Alice!\nconsole.log(add(3, 5));      // 8"
  },
  {
    id: "free-js-6", title: "Arrays in JavaScript", description: "Work with lists of data using arrays.", category: "free-js", isPro: false, order: 6,
    content: "Arrays hold ordered lists of items. They're one of the most used data structures in JavaScript.\n\n**Common methods:**\n- push() — add to end\n- pop() — remove from end\n- length — how many items\n- map/filter — transform arrays",
    codeExample: "const numbers = [1, 2, 3, 4, 5];\n\n// Add and remove\nnumbers.push(6);\nconsole.log(numbers.length); // 6\n\n// Loop\nnumbers.forEach(n => console.log(n));\n\n// Transform\nconst doubled = numbers.map(n => n * 2);\nconsole.log(doubled);"
  },
  {
    id: "free-js-7", title: "Objects in JavaScript", description: "Store structured data with key-value pairs.", category: "free-js", isPro: false, order: 7,
    content: "Objects store data as key-value pairs. They're like dictionaries in Python.\n\n**Key concepts:**\n- Access with dot notation: obj.key\n- Access with brackets: obj[\"key\"]\n- Add new properties anytime\n- Methods are functions inside objects",
    codeExample: "const user = {\n    name: \"Alice\",\n    age: 25,\n    greet() {\n        console.log(\"Hi, I'm \" + this.name);\n    }\n};\n\nconsole.log(user.name);  // Alice\nconsole.log(user.age);   // 25\nuser.greet();            // Hi, I'm Alice"
  },
  {
    id: "free-js-8", title: "Template Literals", description: "Build strings the modern way with backticks.", category: "free-js", isPro: false, order: 8,
    content: "Template literals use backticks (`) instead of quotes. They let you embed variables directly in strings using ${} syntax.\n\n**Benefits:**\n- Embed variables with ${}\n- Multi-line strings\n- Much cleaner than string concatenation",
    codeExample: "const name = \"Alice\";\nconst age = 25;\n\n// Template literal\nconsole.log(`Hello, ${name}!`);\nconsole.log(`You are ${age} years old.`);\nconsole.log(`In 10 years you'll be ${age + 10}.`);\n\n// Multi-line\nconst message = `\n  Welcome!\n  Your name: ${name}\n`;\nconsole.log(message);"
  },
  {
    id: "free-js-9", title: "Error Handling in JS", description: "Handle errors with try/catch.", category: "free-js", isPro: false, order: 9,
    content: "Try/catch blocks let you handle errors without crashing your program.\n\n**Structure:**\n- try {} — code that might fail\n- catch (error) {} — what to do if it fails\n- finally {} — always runs\n\nThis is the same concept as Python's try/except.",
    codeExample: "try {\n    const data = JSON.parse(\"not valid json\");\n} catch (error) {\n    console.log(\"Error:\", error.message);\n} finally {\n    console.log(\"Done!\");\n}\n\n// Custom error\nfunction divide(a, b) {\n    if (b === 0) throw new Error(\"Cannot divide by zero\");\n    return a / b;\n}"
  },
  {
    id: "free-js-10", title: "Console & Debugging", description: "Use console methods to debug your code.", category: "free-js", isPro: false, order: 10,
    content: "The console is your best friend for debugging JavaScript. It has many useful methods beyond just console.log().\n\n**Useful methods:**\n- console.log() — print values\n- console.table() — display arrays/objects as tables\n- console.warn() — yellow warning\n- console.error() — red error",
    codeExample: "// Basic logging\nconsole.log(\"Hello!\");\nconsole.log(42);\nconsole.log([1, 2, 3]);\n\n// Useful for debugging\nconst user = { name: \"Alice\", age: 25 };\nconsole.log(\"User:\", user);\n\n// Warnings and errors\nconsole.warn(\"This is a warning\");\nconsole.error(\"This is an error\");"
  },
];

const pythonTopics = [
  ["Python Setup & Environment", "Set up Python and create your first script."],
  ["Python Data Types Deep Dive", "Master integers, floats, strings, and complex numbers."],
  ["Advanced String Formatting", "f-strings, format(), and template strings."],
  ["List Comprehensions", "Write elegant one-line list transformations."],
  ["Tuple & Set Operations", "Immutable sequences and unique collections."],
  ["Dictionary Comprehensions", "Create dictionaries with concise expressions."],
  ["Advanced Functions", "*args, **kwargs, and first-class functions."],
  ["Lambda Functions", "Anonymous functions for quick operations."],
  ["Decorators Basics", "Modify function behavior with decorators."],
  ["Advanced Decorators", "Parameterized decorators and class decorators."],
  ["Generators & Iterators", "Lazy evaluation for memory-efficient processing."],
  ["Context Managers", "Resource management with 'with' statements."],
  ["Object-Oriented Programming Basics", "Classes, objects, and encapsulation."],
  ["Inheritance & Polymorphism", "Code reuse through class hierarchies."],
  ["Magic Methods", "__init__, __str__, __repr__ and more."],
  ["Abstract Classes & Interfaces", "Define contracts with ABC module."],
  ["Property Decorators", "Getters, setters, and computed properties."],
  ["Class Methods & Static Methods", "@classmethod and @staticmethod patterns."],
  ["Multiple Inheritance & MRO", "Method Resolution Order and diamond problem."],
  ["Dataclasses", "Reduce boilerplate with @dataclass decorator."],
  ["Type Hints & Annotations", "Static typing for better code quality."],
  ["Modules & Packages", "Organize code into reusable modules."],
  ["Virtual Environments", "Isolate project dependencies with venv."],
  ["pip & Package Management", "Install and manage third-party packages."],
  ["File Handling Advanced", "Binary files, CSV, and file system operations."],
  ["JSON & Data Serialization", "Parse and create JSON data."],
  ["Regular Expressions", "Pattern matching with the re module."],
  ["Error Handling Advanced", "Custom exceptions and exception chaining."],
  ["Logging", "Professional logging with the logging module."],
  ["Unit Testing with unittest", "Write and run automated tests."],
  ["Testing with pytest", "Modern Python testing framework."],
  ["Mocking in Tests", "Isolate code with unittest.mock."],
  ["Collections Module", "Counter, defaultdict, OrderedDict, and more."],
  ["itertools Module", "Efficient looping with iterator tools."],
  ["functools Module", "Higher-order functions and caching."],
  ["pathlib Module", "Modern file path handling."],
  ["datetime Module", "Working with dates and times."],
  ["os & sys Modules", "System-level operations and environment."],
  ["subprocess Module", "Run external commands from Python."],
  ["Threading Basics", "Concurrent execution with threads."],
  ["Multiprocessing", "True parallelism with multiple processes."],
  ["Async/Await Basics", "Asynchronous programming fundamentals."],
  ["asyncio Deep Dive", "Event loops and coroutines."],
  ["HTTP Requests with requests", "Make API calls and handle responses."],
  ["Web Scraping with BeautifulSoup", "Extract data from web pages."],
  ["Flask Basics", "Build web applications with Flask."],
  ["Flask REST APIs", "Create RESTful APIs with Flask."],
  ["Django Introduction", "Full-featured web framework overview."],
  ["Django Models & ORM", "Database interaction with Django ORM."],
  ["Django Views & Templates", "Build dynamic web pages."],
  ["FastAPI Basics", "Modern async API framework."],
  ["SQLite with Python", "Embedded database operations."],
  ["SQLAlchemy ORM", "Database abstraction and queries."],
  ["PostgreSQL with Python", "Production database integration."],
  ["MongoDB with PyMongo", "NoSQL database operations."],
  ["Pandas Basics", "Data manipulation and analysis."],
  ["Pandas Advanced", "GroupBy, merging, and pivot tables."],
  ["NumPy Fundamentals", "Numerical computing with arrays."],
  ["Matplotlib & Visualization", "Create charts and graphs."],
  ["Seaborn Statistical Plots", "Beautiful statistical visualizations."],
  ["Data Cleaning Techniques", "Handle missing data and outliers."],
  ["CSV & Excel Processing", "Read and write spreadsheet data."],
  ["Web APIs & REST Clients", "Consume external APIs."],
  ["Authentication & JWT", "Secure your applications."],
  ["Environment Variables & Secrets", "Manage configuration securely."],
  ["Caching Strategies", "Speed up with functools.lru_cache."],
  ["Memory Management", "Garbage collection and memory optimization."],
  ["Profiling & Optimization", "Find and fix performance bottlenecks."],
  ["Design Patterns in Python", "Singleton, Factory, Observer patterns."],
  ["SOLID Principles", "Writing maintainable object-oriented code."],
  ["Clean Code Practices", "Readable and maintainable Python code."],
  ["Code Documentation", "Docstrings, Sphinx, and documentation."],
  ["Packaging Your Code", "Create distributable packages."],
  ["Command Line Applications", "Build CLI tools with argparse/click."],
  ["Working with APIs", "Build and consume RESTful services."],
  ["Websockets in Python", "Real-time bidirectional communication."],
  ["Email Sending", "Send emails with smtplib and templates."],
  ["Image Processing with Pillow", "Resize, crop, and filter images."],
  ["PDF Generation", "Create PDFs with reportlab."],
  ["Automation Scripts", "Automate repetitive tasks."],
  ["GUI with Tkinter", "Desktop applications with built-in GUI."],
  ["Cryptography Basics", "Hashing, encryption, and security."],
  ["Network Programming", "Sockets and network communication."],
  ["Debugging Techniques", "pdb, breakpoints, and debugging strategies."],
  ["Python 3.10+ Features", "Match statements and new syntax."],
  ["Metaclasses", "Customize class creation."],
  ["Descriptors", "Control attribute access at the class level."],
  ["Closures & Scoping", "Variable scope and closure patterns."],
  ["Concurrency Patterns", "Thread pools and process pools."],
  ["Event-Driven Programming", "Build reactive applications."],
  ["Microservices with Python", "Distributed architecture patterns."],
  ["Docker & Python", "Containerize Python applications."],
  ["CI/CD for Python", "Automated testing and deployment."],
  ["GraphQL with Python", "Query language for APIs."],
  ["Machine Learning Intro", "Basics of ML with scikit-learn."],
  ["Natural Language Processing", "Text analysis with NLTK."],
  ["Building a Portfolio Project", "Combine skills into a complete app."],
  ["Python Best Practices", "Industry standards and conventions."],
  ["Career Tips for Python Devs", "Landing your first Python job."],
];

const jsTopics = [
  ["JavaScript Setup & Tools", "Set up your JS development environment."],
  ["Variables: let, const, var", "Modern variable declarations and scoping."],
  ["Template Literals", "String interpolation and multi-line strings."],
  ["Arrow Functions", "Concise function syntax with =>"],
  ["Destructuring", "Extract values from arrays and objects."],
  ["Spread & Rest Operators", "... operator for flexible code."],
  ["Array Methods: map, filter, reduce", "Functional array transformations."],
  ["Object Methods & Shorthand", "Modern object literal features."],
  ["Promises", "Handle asynchronous operations."],
  ["Async/Await", "Write async code that reads like sync."],
  ["Fetch API", "Make HTTP requests from the browser."],
  ["DOM Manipulation", "Access and modify web page elements."],
  ["Event Handling", "Respond to user interactions."],
  ["Event Delegation", "Efficient event handling patterns."],
  ["Local Storage & Session Storage", "Persist data in the browser."],
  ["JSON Handling", "Parse and stringify JSON data."],
  ["Error Handling with try/catch", "Graceful error management."],
  ["Regular Expressions in JS", "Pattern matching and validation."],
  ["Closures", "Functions that remember their scope."],
  ["The 'this' Keyword", "Understanding context in JavaScript."],
  ["Prototypes & Inheritance", "JavaScript's inheritance model."],
  ["ES6 Classes", "Object-oriented JavaScript."],
  ["Modules: import/export", "Organize code with ES modules."],
  ["Symbol & Iterator Protocol", "Custom iteration behavior."],
  ["Map & Set", "Modern collection data structures."],
  ["WeakMap & WeakSet", "Memory-efficient collections."],
  ["Proxy & Reflect", "Meta-programming in JavaScript."],
  ["Generator Functions", "Pausable functions with yield."],
  ["Optional Chaining & Nullish Coalescing", "Safe property access with ?. and ??"],
  ["Array & Object Destructuring Advanced", "Nested and default value patterns."],
  ["Debounce & Throttle", "Rate-limiting function execution."],
  ["Currying & Partial Application", "Transform function signatures."],
  ["Memoization", "Cache function results for speed."],
  ["Web Workers", "Run JS in background threads."],
  ["Service Workers & PWA Basics", "Offline-capable web apps."],
  ["IndexedDB", "Client-side database storage."],
  ["Canvas API", "Draw graphics programmatically."],
  ["WebSocket Client", "Real-time server communication."],
  ["Intersection Observer", "Detect element visibility."],
  ["Mutation Observer", "Watch for DOM changes."],
  ["Node.js Basics", "Server-side JavaScript runtime."],
  ["Node.js File System", "Read and write files with fs."],
  ["Express.js Basics", "Build web servers with Express."],
  ["Express Middleware", "Request processing pipeline."],
  ["REST API Design", "Build RESTful endpoints."],
  ["Authentication with JWT", "Secure your Node.js APIs."],
  ["MongoDB with Mongoose", "NoSQL database for Node.js."],
  ["PostgreSQL with Node", "Relational database integration."],
  ["Input Validation", "Sanitize and validate user data."],
  ["Rate Limiting & Security", "Protect your APIs."],
  ["React Basics", "Component-based UI development."],
  ["React State & Props", "Data flow in React apps."],
  ["React Hooks: useState & useEffect", "Modern React state management."],
  ["React Custom Hooks", "Reusable logic extraction."],
  ["React Context API", "Global state without prop drilling."],
  ["React Router", "Client-side navigation."],
  ["React Forms & Validation", "Handle user input in React."],
  ["React Performance Optimization", "Memo, useMemo, useCallback."],
  ["Next.js Basics", "Full-stack React framework."],
  ["Next.js API Routes", "Backend endpoints in Next.js."],
  ["TypeScript Basics", "Static typing for JavaScript."],
  ["TypeScript Interfaces & Types", "Define data shapes and contracts."],
  ["TypeScript Generics", "Flexible, reusable type definitions."],
  ["TypeScript with React", "Type-safe React components."],
  ["Testing with Jest", "JavaScript unit testing framework."],
  ["Testing React Components", "Component testing with Testing Library."],
  ["E2E Testing with Playwright", "End-to-end browser testing."],
  ["Mocking & Stubbing in JS", "Isolate code for testing."],
  ["npm & Package Management", "Manage JS dependencies."],
  ["Webpack Basics", "Module bundling for the web."],
  ["Vite & Modern Build Tools", "Fast development and builds."],
  ["ESLint & Prettier", "Code quality and formatting."],
  ["Git for JS Developers", "Version control best practices."],
  ["CSS-in-JS", "Styled-components and emotion."],
  ["Tailwind CSS with JS", "Utility-first styling."],
  ["Animation with JS", "GSAP, Framer Motion, CSS animations."],
  ["State Management: Redux", "Predictable state container."],
  ["State Management: Zustand", "Lightweight state management."],
  ["GraphQL Client", "Query APIs with Apollo Client."],
  ["WebRTC Basics", "Peer-to-peer communication."],
  ["Drag & Drop API", "Interactive drag and drop."],
  ["File Upload Handling", "Process file uploads client & server."],
  ["Image Optimization", "Lazy loading and responsive images."],
  ["SEO for JavaScript Apps", "Search engine optimization."],
  ["Accessibility (a11y)", "Make apps usable for everyone."],
  ["Internationalization (i18n)", "Multi-language support."],
  ["Error Tracking & Monitoring", "Sentry and error reporting."],
  ["Performance Monitoring", "Lighthouse and Web Vitals."],
  ["CI/CD for JS Projects", "Automated testing and deployment."],
  ["Docker & JavaScript", "Containerize JS applications."],
  ["Serverless Functions", "AWS Lambda and Vercel Functions."],
  ["Real-time Apps with Socket.io", "Build chat and live features."],
  ["Payment Integration (Stripe)", "Process payments in JS apps."],
  ["OAuth & Social Login", "Third-party authentication."],
  ["Design Patterns in JS", "Common patterns and best practices."],
  ["Clean Code in JavaScript", "Readable maintainable JS code."],
  ["Building a Full-Stack Project", "Combine skills into a complete app."],
  ["JS Interview Preparation", "Common questions and algorithms."],
  ["Career Tips for JS Developers", "Landing your first JS job."],
];

function generatePythonContent(title: string, index: number): { content: string; codeExample: string } {
  return {
    content: `## ${title}\n\nThis lesson covers ${title.toLowerCase()} in depth. You'll learn the key concepts, see practical examples, and practice writing real code.\n\n**What you'll learn:**\n- Core concepts of ${title.toLowerCase()}\n- Best practices and common patterns\n- Real-world applications\n- Hands-on coding exercises\n\n**Prerequisites:** Complete the previous lessons in the Python track.`,
    codeExample: getPythonExample(index)
  };
}

function getPythonExample(index: number): string {
  const examples = [
    `# Python Setup\nimport sys\nprint(f"Python version: {sys.version}")\nprint("Hello from Python!")`,
    `# Data Types\nx: int = 42\ny: float = 3.14\nz: complex = 2 + 3j\nprint(type(x), type(y), type(z))`,
    `# Advanced String Formatting\nname = "World"\nprint(f"Hello, {name:>20}")\nprint(f"Pi is approximately {3.14159:.2f}")`,
    `# List Comprehensions\nsquares = [x**2 for x in range(10)]\nevens = [x for x in range(20) if x % 2 == 0]\nmatrix = [[i*j for j in range(3)] for i in range(3)]\nprint(squares)\nprint(evens)`,
    `# Tuples & Sets\npoint = (3, 4)\nx, y = point\ncolors = {"red", "green", "blue"}\ncolors.add("yellow")\nprint(colors.intersection({"red", "purple"}))`,
    `# Dict Comprehensions\nsquare_dict = {x: x**2 for x in range(5)}\nfiltered = {k: v for k, v in square_dict.items() if v > 5}\nprint(filtered)`,
    `# *args and **kwargs\ndef flexible(*args, **kwargs):\n    print(f"Args: {args}")\n    print(f"Kwargs: {kwargs}")\n\nflexible(1, 2, 3, name="Alice", age=25)`,
    `# Lambda Functions\nsquare = lambda x: x ** 2\nnames = ["Charlie", "Alice", "Bob"]\nsorted_names = sorted(names, key=lambda n: len(n))\nprint(sorted_names)`,
    `# Decorators\ndef timer(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        print(f"{func.__name__} took {time.time()-start:.4f}s")\n        return result\n    return wrapper\n\n@timer\ndef slow_function():\n    import time; time.sleep(0.1)\n    return "done"\n\nprint(slow_function())`,
    `# Advanced Decorators\nfrom functools import wraps\n\ndef repeat(n):\n    def decorator(func):\n        @wraps(func)\n        def wrapper(*args, **kwargs):\n            for _ in range(n):\n                result = func(*args, **kwargs)\n            return result\n        return wrapper\n    return decorator\n\n@repeat(3)\ndef say_hello():\n    print("Hello!")\n\nsay_hello()`,
  ];

  const extraExamples = [
    `# Generators\ndef fibonacci(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nfor num in fibonacci(10):\n    print(num, end=" ")`,
    `# Context Managers\nclass FileManager:\n    def __init__(self, filename, mode):\n        self.filename = filename\n        self.mode = mode\n    def __enter__(self):\n        self.file = open(self.filename, self.mode)\n        return self.file\n    def __exit__(self, *args):\n        self.file.close()`,
    `# OOP Basics\nclass Dog:\n    def __init__(self, name, breed):\n        self.name = name\n        self.breed = breed\n    def bark(self):\n        return f"{self.name} says Woof!"\n\ndog = Dog("Buddy", "Golden Retriever")\nprint(dog.bark())`,
    `# Inheritance\nclass Animal:\n    def __init__(self, name):\n        self.name = name\n    def speak(self):\n        raise NotImplementedError\n\nclass Cat(Animal):\n    def speak(self):\n        return f"{self.name} says Meow!"\n\ncat = Cat("Whiskers")\nprint(cat.speak())`,
    `# Magic Methods\nclass Vector:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n    def __add__(self, other):\n        return Vector(self.x + other.x, self.y + other.y)\n    def __repr__(self):\n        return f"Vector({self.x}, {self.y})"`,
    `# Abstract Classes\nfrom abc import ABC, abstractmethod\n\nclass Shape(ABC):\n    @abstractmethod\n    def area(self):\n        pass\n\nclass Circle(Shape):\n    def __init__(self, radius):\n        self.radius = radius\n    def area(self):\n        return 3.14159 * self.radius ** 2`,
    `# Property Decorators\nclass Temperature:\n    def __init__(self, celsius=0):\n        self._celsius = celsius\n    @property\n    def fahrenheit(self):\n        return self._celsius * 9/5 + 32\n    @fahrenheit.setter\n    def fahrenheit(self, value):\n        self._celsius = (value - 32) * 5/9`,
    `# Class & Static Methods\nclass Date:\n    def __init__(self, year, month, day):\n        self.year = year\n        self.month = month\n        self.day = day\n    @classmethod\n    def from_string(cls, date_str):\n        y, m, d = map(int, date_str.split("-"))\n        return cls(y, m, d)\n    @staticmethod\n    def is_valid(date_str):\n        try:\n            y, m, d = map(int, date_str.split("-"))\n            return 1 <= m <= 12 and 1 <= d <= 31\n        except:\n            return False`,
    `# Multiple Inheritance\nclass A:\n    def method(self):\n        print("A")\nclass B(A):\n    def method(self):\n        print("B")\n        super().method()\nclass C(A):\n    def method(self):\n        print("C")\n        super().method()\nclass D(B, C):\n    def method(self):\n        print("D")\n        super().method()\n\nD().method()  # D, B, C, A`,
    `# Dataclasses\nfrom dataclasses import dataclass, field\n\n@dataclass\nclass Student:\n    name: str\n    age: int\n    grades: list = field(default_factory=list)\n    \n    @property\n    def average(self):\n        return sum(self.grades) / len(self.grades) if self.grades else 0`,
  ];

  const moreExamples = [
    `# Type Hints\nfrom typing import List, Dict, Optional\n\ndef get_user(user_id: int) -> Optional[Dict[str, str]]:\n    users: Dict[int, Dict[str, str]] = {\n        1: {"name": "Alice", "role": "admin"}\n    }\n    return users.get(user_id)`,
    `# Modules\n# mymodule.py\ndef helper():\n    return "I'm helping!"\n\n# main.py\n# from mymodule import helper\n# print(helper())`,
    `# Virtual Environments\nimport subprocess\n# python -m venv myenv\n# source myenv/bin/activate  # Mac/Linux\n# myenv\\Scripts\\activate    # Windows\n# pip install requests`,
    `# pip & Package Management\nimport subprocess\n# pip install package_name\n# pip freeze > requirements.txt\n# pip install -r requirements.txt`,
    `# Advanced File Handling\nimport csv\ndata = [["Name","Age"],["Alice",30],["Bob",25]]\nwith open("data.csv","w",newline="") as f:\n    writer = csv.writer(f)\n    writer.writerows(data)`,
    `# JSON\nimport json\ndata = {"name": "Alice", "scores": [95, 87, 92]}\njson_str = json.dumps(data, indent=2)\nparsed = json.loads(json_str)\nprint(parsed["name"])`,
    `# Regular Expressions\nimport re\ntext = "Contact: alice@email.com or bob@test.org"\nemails = re.findall(r'[\\w.]+@[\\w.]+', text)\nprint(emails)`,
    `# Custom Exceptions\nclass InsufficientFundsError(Exception):\n    def __init__(self, balance, amount):\n        self.balance = balance\n        self.amount = amount\n        super().__init__(f"Cannot withdraw {amount}, balance is {balance}")`,
    `# Logging\nimport logging\nlogging.basicConfig(level=logging.DEBUG)\nlogger = logging.getLogger(__name__)\nlogger.info("Application started")\nlogger.warning("Low memory")\nlogger.error("Connection failed")`,
    `# Unit Testing\nimport unittest\n\nclass TestMath(unittest.TestCase):\n    def test_add(self):\n        self.assertEqual(1 + 1, 2)\n    def test_subtract(self):\n        self.assertEqual(5 - 3, 2)`,
  ];

  const allExamples = [...examples, ...extraExamples, ...moreExamples];
  return allExamples[index % allExamples.length] || examples[0];
}

function generateJSContent(title: string, index: number): { content: string; codeExample: string } {
  return {
    content: `## ${title}\n\nThis lesson covers ${title.toLowerCase()} in depth. You'll learn the key concepts, see practical examples, and practice writing real code.\n\n**What you'll learn:**\n- Core concepts of ${title.toLowerCase()}\n- Best practices and common patterns\n- Real-world applications\n- Hands-on coding exercises\n\n**Prerequisites:** Complete the previous lessons in the JavaScript track.`,
    codeExample: getJSExample(index)
  };
}

function getJSExample(index: number): string {
  const examples = [
    `// JavaScript Setup\nconsole.log("Hello from JavaScript!");\nconsole.log("Node version:", process.version);`,
    `// let, const, var\nlet count = 0;\nconst PI = 3.14159;\n// var is function-scoped (avoid)\ncount++;\nconsole.log(count, PI);`,
    `// Template Literals\nconst name = "World";\nconst greeting = \`Hello, \${name}!\`;\nconst multiline = \`\n  Line 1\n  Line 2\n\`;\nconsole.log(greeting);`,
    `// Arrow Functions\nconst add = (a, b) => a + b;\nconst greet = name => \`Hello, \${name}!\`;\nconst getUser = () => ({ name: "Alice", age: 25 });\nconsole.log(add(2, 3));`,
    `// Destructuring\nconst { name, age } = { name: "Alice", age: 25 };\nconst [first, ...rest] = [1, 2, 3, 4];\nconst { a: x, b: y } = { a: 1, b: 2 };\nconsole.log(name, first, rest);`,
    `// Spread & Rest\nconst arr1 = [1, 2, 3];\nconst arr2 = [...arr1, 4, 5];\nconst obj1 = { a: 1, b: 2 };\nconst obj2 = { ...obj1, c: 3 };\nfunction sum(...nums) {\n  return nums.reduce((a, b) => a + b, 0);\n}\nconsole.log(sum(1, 2, 3, 4));`,
    `// Array Methods\nconst numbers = [1, 2, 3, 4, 5];\nconst doubled = numbers.map(n => n * 2);\nconst evens = numbers.filter(n => n % 2 === 0);\nconst total = numbers.reduce((sum, n) => sum + n, 0);\nconsole.log(doubled, evens, total);`,
    `// Object Methods\nconst user = {\n  name: "Alice",\n  greet() {\n    return \`Hi, I'm \${this.name}\`;\n  }\n};\nconst keys = Object.keys(user);\nconst entries = Object.entries(user);`,
    `// Promises\nconst fetchData = () => {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve({ id: 1, name: "Alice" });\n    }, 1000);\n  });\n};\nfetchData().then(data => console.log(data));`,
    `// Async/Await\nasync function getUser() {\n  try {\n    const response = await fetch("/api/user");\n    const data = await response.json();\n    return data;\n  } catch (error) {\n    console.error("Failed:", error);\n  }\n}`,
    `// Fetch API\nasync function postData(url, data) {\n  const response = await fetch(url, {\n    method: "POST",\n    headers: { "Content-Type": "application/json" },\n    body: JSON.stringify(data)\n  });\n  return response.json();\n}`,
    `// DOM Manipulation\nconst el = document.getElementById("app");\nel.textContent = "Hello!";\nconst div = document.createElement("div");\ndiv.className = "card";\ndiv.innerHTML = "<h2>Title</h2>";\nel.appendChild(div);`,
    `// Event Handling\nconst button = document.querySelector("button");\nbutton.addEventListener("click", (e) => {\n  console.log("Clicked!", e.target);\n});\n// Remove listener\n// button.removeEventListener("click", handler);`,
    `// Event Delegation\ndocument.querySelector("ul").addEventListener("click", (e) => {\n  if (e.target.tagName === "LI") {\n    console.log("Clicked:", e.target.textContent);\n  }\n});`,
    `// Local Storage\nlocalStorage.setItem("theme", "dark");\nconst theme = localStorage.getItem("theme");\nconsole.log(theme); // "dark"\nsessionStorage.setItem("token", "abc123");`,
    `// JSON Handling\nconst data = { name: "Alice", scores: [95, 87] };\nconst jsonStr = JSON.stringify(data, null, 2);\nconst parsed = JSON.parse(jsonStr);\nconsole.log(parsed.name);`,
    `// Error Handling\ntry {\n  const data = JSON.parse("invalid json");\n} catch (error) {\n  if (error instanceof SyntaxError) {\n    console.error("Bad JSON:", error.message);\n  }\n} finally {\n  console.log("Cleanup done");\n}`,
    `// RegExp\nconst email = /^[\\w.]+@[\\w.]+\\.[a-z]{2,}$/i;\nconsole.log(email.test("alice@test.com")); // true\nconst matches = "Hello 123 World 456".match(/\\d+/g);\nconsole.log(matches); // ["123", "456"]`,
    `// Closures\nfunction counter() {\n  let count = 0;\n  return {\n    increment: () => ++count,\n    decrement: () => --count,\n    getCount: () => count\n  };\n}\nconst c = counter();\nc.increment(); c.increment();\nconsole.log(c.getCount()); // 2`,
    `// The 'this' keyword\nconst obj = {\n  name: "Alice",\n  greet() { console.log(this.name); },\n  greetArrow: () => { console.log(this); } // window/undefined\n};\nobj.greet(); // "Alice"`,
  ];

  return examples[index % examples.length] || examples[0];
}

const pythonLessons: Lesson[] = pythonTopics.map(([title, desc], i) => {
  const { content, codeExample } = generatePythonContent(title, i);
  return {
    id: `python-${i + 1}`,
    title,
    description: desc,
    category: "python" as const,
    isPro: true,
    order: i + 1,
    content,
    codeExample,
  };
});

const jsLessons: Lesson[] = jsTopics.map(([title, desc], i) => {
  const { content, codeExample } = generateJSContent(title, i);
  return {
    id: `js-${i + 1}`,
    title,
    description: desc,
    category: "javascript" as const,
    isPro: true,
    order: i + 1,
    content,
    codeExample,
  };
});

export const allLessons: Lesson[] = [...freeLessons, ...freeJsLessons, ...pythonLessons, ...jsLessons];

export function getLessonById(id: string): Lesson | undefined {
  return allLessons.find((l) => l.id === id);
}

export function getLessonsByCategory(category: string): Lesson[] {
  return allLessons.filter((l) => l.category === category).sort((a, b) => a.order - b.order);
}

export function getFreeLessons(): Lesson[] {
  return allLessons.filter((l) => !l.isPro && l.category === "free");
}

export function getFreeJsLessons(): Lesson[] {
  return allLessons.filter((l) => !l.isPro && l.category === "free-js");
}

export function getAllFreeLessons(): Lesson[] {
  return allLessons.filter((l) => !l.isPro);
}

export function getProLessons(): Lesson[] {
  return allLessons.filter((l) => l.isPro);
}
