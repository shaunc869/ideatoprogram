export interface Challenge {
  id: string;
  lessonId: string;
  prompt: string;
  starterCode: string;
  expectedOutput: string;
  hint: string;
  solution: string;
  language: "python" | "javascript";
}

const freeChallenges: Challenge[] = [
  {
    id: "ch-free-1", lessonId: "free-1",
    prompt: "Just print the message: Hello, World!  (That's it! One line of code.)",
    starterCode: "# Type your code below - just use print()\n# Example: print(\"Hi\")\n\n",
    expectedOutput: "Hello, World!",
    hint: "Just type: print(\"Hello, World!\")",
    solution: "# Type your code below - just use print()\n# Example: print(\"Hi\")\n\nprint(\"Hello, World!\")",
    language: "python"
  },
  {
    id: "ch-free-2", lessonId: "free-2",
    prompt: "Create a variable called 'name' and set it to \"Alex\". Then print it.",
    starterCode: "# Step 1: Create a variable called name\n# Step 2: Print it\n\nname = ___  # Replace ___ with \"Alex\"\nprint(name)\n",
    expectedOutput: "Alex",
    hint: "Replace the ___ with \"Alex\" (with quotes!)",
    solution: "# Step 1: Create a variable called name\n# Step 2: Print it\n\nname = \"Alex\"\nprint(name)",
    language: "python"
  },
  {
    id: "ch-free-3", lessonId: "free-3",
    prompt: "The variable 'age' is set to 20. If age is 18 or more, print \"You can vote!\". Otherwise print \"Too young\".",
    starterCode: "age = 20\n\n# Write an if/else below:\nif age >= 18:\n    print(___) # What should we print?\nelse:\n    print(___) # What should we print?\n",
    expectedOutput: "You can vote!",
    hint: "Replace the first ___ with \"You can vote!\" and the second with \"Too young\"",
    solution: "age = 20\n\nif age >= 18:\n    print(\"You can vote!\")\nelse:\n    print(\"Too young\")",
    language: "python"
  },
  {
    id: "ch-free-4", lessonId: "free-4",
    prompt: "Use a for loop to print the numbers 1, 2, and 3 (each on its own line).",
    starterCode: "# Use a for loop to print 1, 2, 3\n# Hint: range(1, 4) gives you 1, 2, 3\n\nfor i in range(1, 4):\n    print(___) # What goes here?\n",
    expectedOutput: "1\n2\n3",
    hint: "Replace ___ with just the letter i (the loop variable).",
    solution: "for i in range(1, 4):\n    print(i)",
    language: "python"
  },
  {
    id: "ch-free-5", lessonId: "free-5",
    prompt: "Complete the function below so it adds two numbers together. Then print the result of add(3, 5).",
    starterCode: "# Complete the function\ndef add(a, b):\n    return ___  # What should this return?\n\n# Print the result\nprint(add(3, 5))\n",
    expectedOutput: "8",
    hint: "Replace ___ with: a + b",
    solution: "def add(a, b):\n    return a + b\n\nprint(add(3, 5))",
    language: "python"
  },
  {
    id: "ch-free-6", lessonId: "free-6",
    prompt: "A list of fruits is given. Print how many fruits are in the list using len().",
    starterCode: "fruits = [\"apple\", \"banana\", \"cherry\"]\n\n# Print the number of fruits\nprint(___) # Use len() on the fruits list\n",
    expectedOutput: "3",
    hint: "Replace ___ with: len(fruits)",
    solution: "fruits = [\"apple\", \"banana\", \"cherry\"]\n\nprint(len(fruits))",
    language: "python"
  },
  {
    id: "ch-free-7", lessonId: "free-7",
    prompt: "A dictionary is given. Print the value of the \"name\" key.",
    starterCode: "person = {\"name\": \"Sam\", \"age\": 30}\n\n# Print Sam's name from the dictionary\nprint(___) # Access the 'name' key\n",
    expectedOutput: "Sam",
    hint: "Replace ___ with: person[\"name\"]",
    solution: "person = {\"name\": \"Sam\", \"age\": 30}\n\nprint(person[\"name\"])",
    language: "python"
  },
  {
    id: "ch-free-8", lessonId: "free-8",
    prompt: "Convert the string \"hello\" to uppercase and print it.",
    starterCode: "text = \"hello\"\n\n# Convert to uppercase and print\nprint(___) # Use .upper() on text\n",
    expectedOutput: "HELLO",
    hint: "Replace ___ with: text.upper()",
    solution: "text = \"hello\"\n\nprint(text.upper())",
    language: "python"
  },
  {
    id: "ch-free-9", lessonId: "free-9",
    prompt: "Complete the try/except below. It tries to divide 10 by 0. When the error happens, print \"Cannot divide by zero!\".",
    starterCode: "# Complete the error handling\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(___) # What error message?\n",
    expectedOutput: "Cannot divide by zero!",
    hint: "Replace ___ with: \"Cannot divide by zero!\"",
    solution: "try:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    print(\"Cannot divide by zero!\")",
    language: "python"
  },
  {
    id: "ch-free-10", lessonId: "free-10",
    prompt: "Print the number 42 and the word \"done\" on separate lines.",
    starterCode: "# Print a number and then a word\n# Use two print() statements\n\n",
    expectedOutput: "42\ndone",
    hint: "Use print(42) and then print(\"done\")",
    solution: "print(42)\nprint(\"done\")",
    language: "python"
  },
];

const freeJsChallenges: Challenge[] = [
  {
    id: "ch-free-js-1", lessonId: "free-js-1",
    prompt: "Just log the message: Hello, World!",
    starterCode: "// Type your code below - use console.log()\n\n",
    expectedOutput: "Hello, World!",
    hint: "Just type: console.log(\"Hello, World!\")",
    solution: "console.log(\"Hello, World!\");",
    language: "javascript"
  },
  {
    id: "ch-free-js-2", lessonId: "free-js-2",
    prompt: "Create a const called 'name' set to \"Alex\". Then log it.",
    starterCode: "// Step 1: Create a variable\n// Step 2: Log it\n\nconst name = ___; // Replace ___ with \"Alex\"\nconsole.log(name);\n",
    expectedOutput: "Alex",
    hint: "Replace ___ with \"Alex\" (with quotes!)",
    solution: "const name = \"Alex\";\nconsole.log(name);",
    language: "javascript"
  },
  {
    id: "ch-free-js-3", lessonId: "free-js-3",
    prompt: "The variable 'age' is 20. If age >= 18, log \"You can vote!\". Otherwise log \"Too young\".",
    starterCode: "const age = 20;\n\nif (age >= 18) {\n    console.log(___); // What message?\n} else {\n    console.log(___); // What message?\n}\n",
    expectedOutput: "You can vote!",
    hint: "Replace the first ___ with \"You can vote!\" and the second with \"Too young\"",
    solution: "const age = 20;\n\nif (age >= 18) {\n    console.log(\"You can vote!\");\n} else {\n    console.log(\"Too young\");\n}",
    language: "javascript"
  },
  {
    id: "ch-free-js-4", lessonId: "free-js-4",
    prompt: "Use a for loop to log the numbers 1, 2, and 3.",
    starterCode: "// Use a for loop to log 1, 2, 3\n\nfor (let i = 1; i <= 3; i++) {\n    console.log(___); // What goes here?\n}\n",
    expectedOutput: "1\n2\n3",
    hint: "Replace ___ with just the letter i",
    solution: "for (let i = 1; i <= 3; i++) {\n    console.log(i);\n}",
    language: "javascript"
  },
  {
    id: "ch-free-js-5", lessonId: "free-js-5",
    prompt: "Complete the function so it adds two numbers. Then log add(3, 5).",
    starterCode: "const add = (a, b) => {\n    return ___; // What should this return?\n};\n\nconsole.log(add(3, 5));\n",
    expectedOutput: "8",
    hint: "Replace ___ with: a + b",
    solution: "const add = (a, b) => {\n    return a + b;\n};\n\nconsole.log(add(3, 5));",
    language: "javascript"
  },
  {
    id: "ch-free-js-6", lessonId: "free-js-6",
    prompt: "An array of fruits is given. Log how many there are using .length.",
    starterCode: "const fruits = [\"apple\", \"banana\", \"cherry\"];\n\n// Log the number of fruits\nconsole.log(___); // Use .length\n",
    expectedOutput: "3",
    hint: "Replace ___ with: fruits.length",
    solution: "const fruits = [\"apple\", \"banana\", \"cherry\"];\n\nconsole.log(fruits.length);",
    language: "javascript"
  },
  {
    id: "ch-free-js-7", lessonId: "free-js-7",
    prompt: "An object is given. Log the value of the 'name' property.",
    starterCode: "const person = { name: \"Sam\", age: 30 };\n\n// Log Sam's name\nconsole.log(___); // Access the name property\n",
    expectedOutput: "Sam",
    hint: "Replace ___ with: person.name",
    solution: "const person = { name: \"Sam\", age: 30 };\n\nconsole.log(person.name);",
    language: "javascript"
  },
  {
    id: "ch-free-js-8", lessonId: "free-js-8",
    prompt: "Use a template literal to log \"Hello, Alice!\" where Alice comes from a variable.",
    starterCode: "const name = \"Alice\";\n\n// Use backticks and ${} to log the greeting\nconsole.log(___); // Use template literal\n",
    expectedOutput: "Hello, Alice!",
    hint: "Replace ___ with: `Hello, ${name}!`",
    solution: "const name = \"Alice\";\n\nconsole.log(`Hello, ${name}!`);",
    language: "javascript"
  },
  {
    id: "ch-free-js-9", lessonId: "free-js-9",
    prompt: "Complete the try/catch. It tries to parse bad JSON. When it fails, log \"Invalid JSON\".",
    starterCode: "try {\n    JSON.parse(\"not valid\");\n} catch (error) {\n    console.log(___); // What error message?\n}\n",
    expectedOutput: "Invalid JSON",
    hint: "Replace ___ with: \"Invalid JSON\"",
    solution: "try {\n    JSON.parse(\"not valid\");\n} catch (error) {\n    console.log(\"Invalid JSON\");\n}",
    language: "javascript"
  },
  {
    id: "ch-free-js-10", lessonId: "free-js-10",
    prompt: "Log the number 42 and the word \"done\" on separate lines.",
    starterCode: "// Log a number and then a word\n\n",
    expectedOutput: "42\ndone",
    hint: "Use console.log(42) and then console.log(\"done\")",
    solution: "console.log(42);\nconsole.log(\"done\");",
    language: "javascript"
  },
];

function generatePythonChallenge(lessonId: string, index: number): Challenge {
  const challenges: [string, string, string, string, string][] = [
    ["Print your Python version using the sys module.", "import sys\n# Print the version\n", "Use sys.version", "import sys\nprint(sys.version.split()[0])", ""],
    ["Create an integer, float, and complex number. Print their types.", "# Create three variables\n", "Use type() function", "x = 42\ny = 3.14\nz = 2+3j\nprint(type(x).__name__)\nprint(type(y).__name__)\nprint(type(z).__name__)", "int\nfloat\ncomplex"],
    ["Format a price of 49.99 to show as '$49.99' and right-align it in 20 characters.", "price = 49.99\n", "Use f-string formatting with :>20", "price = 49.99\nprint(f\"${price:>19.2f}\")", ""],
    ["Create a list of squares from 1-10 using list comprehension. Print it.", "# List comprehension for squares\n", "Use [x**2 for x in range(1, 11)]", "squares = [x**2 for x in range(1, 11)]\nprint(squares)", "[1, 4, 9, 16, 25, 36, 49, 64, 81, 100]"],
    ["Create a set from [1,2,2,3,3,4] and print the unique values sorted.", "nums = [1, 2, 2, 3, 3, 4]\n", "Convert to set, then sort", "nums = [1, 2, 2, 3, 3, 4]\nprint(sorted(set(nums)))", "[1, 2, 3, 4]"],
    ["Create a dict mapping numbers 1-5 to their squares using dict comprehension.", "", "Use {x: x**2 for x in range(...)}", "squares = {x: x**2 for x in range(1, 6)}\nprint(squares)", "{1: 1, 2: 4, 3: 9, 4: 16, 5: 25}"],
    ["Write a function that accepts *args and returns their sum.", "", "def total(*args): return sum(args)", "def total(*args):\n    return sum(args)\nprint(total(1, 2, 3, 4, 5))", "15"],
    ["Use a lambda to sort a list of tuples by the second element.", "pairs = [(1, 'b'), (2, 'a'), (3, 'c')]\n", "Use sorted() with key=lambda x: x[1]", "pairs = [(1, 'b'), (2, 'a'), (3, 'c')]\nresult = sorted(pairs, key=lambda x: x[1])\nprint(result)", "[(2, 'a'), (1, 'b'), (3, 'c')]"],
    ["Write a decorator that prints 'Before' and 'After' around a function call.", "", "Define a wrapper function inside the decorator", "def wrap(func):\n    def wrapper(*args):\n        print(\"Before\")\n        result = func(*args)\n        print(\"After\")\n        return result\n    return wrapper\n\n@wrap\ndef hello():\n    print(\"Hello!\")\n\nhello()", "Before\nHello!\nAfter"],
    ["Write a decorator that takes a prefix parameter and prints it before the function.", "", "Create a three-level nested function", "def prefix(text):\n    def decorator(func):\n        def wrapper(*args):\n            print(text)\n            return func(*args)\n        return wrapper\n    return decorator\n\n@prefix(\"LOG:\")\ndef greet():\n    print(\"Hi!\")\n\ngreet()", "LOG:\nHi!"],
  ];

  const moreC: [string, string, string, string, string][] = [
    ["Write a generator that yields even numbers from 0 to 10.", "", "Use yield in a for loop", "def evens():\n    for i in range(0, 11, 2):\n        yield i\n\nfor n in evens():\n    print(n)", "0\n2\n4\n6\n8\n10"],
    ["Write a context manager class that prints 'Enter' and 'Exit'.", "", "Implement __enter__ and __exit__", "class MyCtx:\n    def __enter__(self):\n        print(\"Enter\")\n        return self\n    def __exit__(self, *args):\n        print(\"Exit\")\n\nwith MyCtx():\n    print(\"Inside\")", "Enter\nInside\nExit"],
    ["Create a class 'Car' with make and year. Print a car's info.", "", "Use __init__ and a method or __str__", "class Car:\n    def __init__(self, make, year):\n        self.make = make\n        self.year = year\n    def info(self):\n        return f\"{self.year} {self.make}\"\n\ncar = Car(\"Toyota\", 2024)\nprint(car.info())", "2024 Toyota"],
    ["Create a base 'Shape' class and 'Square' subclass with area method.", "", "Use inheritance and override area()", "class Shape:\n    def area(self):\n        return 0\n\nclass Square(Shape):\n    def __init__(self, side):\n        self.side = side\n    def area(self):\n        return self.side ** 2\n\ns = Square(5)\nprint(s.area())", "25"],
    ["Create a class with __len__ and __contains__ magic methods.", "", "Implement the dunder methods", "class Bag:\n    def __init__(self, items):\n        self.items = items\n    def __len__(self):\n        return len(self.items)\n    def __contains__(self, item):\n        return item in self.items\n\nb = Bag([1,2,3])\nprint(len(b))\nprint(2 in b)", "3\nTrue"],
  ];

  const allC = [...challenges, ...moreC];
  const c = allC[index % allC.length];

  return {
    id: `ch-${lessonId}`,
    lessonId,
    prompt: c[0],
    starterCode: c[1],
    hint: c[2],
    solution: c[3],
    expectedOutput: c[4],
    language: "python",
  };
}

function generateJSChallenge(lessonId: string, index: number): Challenge {
  const challenges: [string, string, string, string, string][] = [
    ["Log \"Hello from JavaScript!\" to the console.", "// Your code here\n", "Use console.log()", "console.log(\"Hello from JavaScript!\");", "Hello from JavaScript!"],
    ["Declare a const 'PI' = 3.14159 and let 'count' = 0. Increment count and log both.", "", "Use const and let", "const PI = 3.14159;\nlet count = 0;\ncount++;\nconsole.log(PI);\nconsole.log(count);", "3.14159\n1"],
    ["Use template literals to log \"Hello, Alice! You are 25 years old.\"", "const name = \"Alice\";\nconst age = 25;\n", "Use backticks and ${}", "const name = \"Alice\";\nconst age = 25;\nconsole.log(`Hello, ${name}! You are ${age} years old.`);", "Hello, Alice! You are 25 years old."],
    ["Write an arrow function 'double' that doubles a number. Log double(21).", "", "const double = x => x * 2", "const double = x => x * 2;\nconsole.log(double(21));", "42"],
    ["Destructure {name: \"Bob\", age: 30, city: \"NYC\"} and log each value.", "", "Use const { name, age, city } = obj", "const { name, age, city } = { name: \"Bob\", age: 30, city: \"NYC\" };\nconsole.log(name);\nconsole.log(age);\nconsole.log(city);", "Bob\n30\nNYC"],
    ["Merge [1,2,3] and [4,5,6] using spread. Log the result.", "", "Use [...arr1, ...arr2]", "const merged = [...[1,2,3], ...[4,5,6]];\nconsole.log(merged.join(\",\"));", "1,2,3,4,5,6"],
    ["Use map to double [1,2,3,4,5], then filter evens. Log results.", "const nums = [1, 2, 3, 4, 5];\n", "Chain .map() and .filter()", "const nums = [1, 2, 3, 4, 5];\nconst doubled = nums.map(n => n * 2);\nconst evens = doubled.filter(n => n % 2 === 0);\nconsole.log(evens.join(\",\"));", "2,4,6,8,10"],
    ["Create an object with a greet() method that logs \"Hi, I'm [name]\". Call it.", "", "Use method shorthand", "const user = {\n  name: \"Alice\",\n  greet() { console.log(`Hi, I'm ${this.name}`); }\n};\nuser.greet();", "Hi, I'm Alice"],
    ["Create a Promise that resolves with \"Success!\" after logging it.", "", "Use new Promise((resolve) => ...)", "const p = new Promise((resolve) => {\n  resolve(\"Success!\");\n});\np.then(msg => console.log(msg));", "Success!"],
    ["Write an async function that returns \"Hello Async\" and log the result.", "", "Use async/await", "async function greet() {\n  return \"Hello Async\";\n}\ngreet().then(msg => console.log(msg));", "Hello Async"],
    ["Use fetch simulation: create a function that returns user data as JSON.", "", "Return an object from async function", "async function getUser() {\n  return { name: \"Alice\", role: \"admin\" };\n}\ngetUser().then(u => console.log(u.name));", "Alice"],
    ["Log \"DOM Ready!\" (simulate DOMContentLoaded).", "", "Use console.log", "console.log(\"DOM Ready!\");", "DOM Ready!"],
    ["Create an event handler function that logs \"Clicked!\" and call it.", "", "Define and call the function", "function handleClick() {\n  console.log(\"Clicked!\");\n}\nhandleClick();", "Clicked!"],
    ["Simulate event delegation by logging which item was clicked.", "", "Use conditional logic", "const items = [\"Item 1\", \"Item 2\", \"Item 3\"];\nitems.forEach(item => console.log(`Clicked: ${item}`));", "Clicked: Item 1\nClicked: Item 2\nClicked: Item 3"],
    ["Store and retrieve a value using a simple object (simulating localStorage).", "", "Use object get/set", "const storage = {};\nstorage.theme = \"dark\";\nconsole.log(storage.theme);", "dark"],
  ];

  const c = challenges[index % challenges.length];
  return {
    id: `ch-${lessonId}`,
    lessonId,
    prompt: c[0],
    starterCode: c[1],
    hint: c[2],
    solution: c[3],
    expectedOutput: c[4],
    language: "javascript",
  };
}

export function getChallengeForLesson(lessonId: string): Challenge | null {
  const freeChallenge = freeChallenges.find((c) => c.lessonId === lessonId);
  if (freeChallenge) return freeChallenge;

  const freeJsChallenge = freeJsChallenges.find((c) => c.lessonId === lessonId);
  if (freeJsChallenge) return freeJsChallenge;

  if (lessonId.startsWith("python-")) {
    const index = parseInt(lessonId.split("-")[1]) - 1;
    return generatePythonChallenge(lessonId, index);
  }
  if (lessonId.startsWith("js-")) {
    const index = parseInt(lessonId.split("-")[1]) - 1;
    return generateJSChallenge(lessonId, index);
  }

  return null;
}
