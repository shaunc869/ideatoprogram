import { NextRequest, NextResponse } from "next/server";

// AI tutor that gives helpful coding hints without giving away the answer
export async function POST(req: NextRequest) {
  const { question, lessonTitle, language, code, challengePrompt } = await req.json();

  if (!question) {
    return NextResponse.json({ error: "Question is required" }, { status: 400 });
  }

  // If Anthropic API key is set, use Claude
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const Anthropic = (await import("@anthropic-ai/sdk")).default;
      const client = new Anthropic();

      const systemPrompt =
        `You are a friendly coding tutor on IdeaToProgram. Help the student understand concepts, debug code, and solve challenges. Don't give away answers directly - guide them to figure it out. Keep responses concise (under 200 words). The student is working on: ${lessonTitle || "a coding lesson"}. Language: ${language || "python"}.`;

      let userMessage = question;
      if (code) {
        userMessage += `\n\nMy current code:\n\`\`\`\n${code}\n\`\`\``;
      }
      if (challengePrompt) {
        userMessage += `\n\nChallenge: ${challengePrompt}`;
      }

      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: systemPrompt,
        messages: [{ role: "user", content: userMessage }],
      });

      const textBlock = message.content[0];
      const responseText = textBlock.type === "text" ? textBlock.text : "";

      return NextResponse.json({ response: responseText });
    } catch (error) {
      console.error("Anthropic API error, falling back to pattern matching:", error);
      // Fall through to pattern matching
    }
  }

  // Fallback: pattern-matching response
  const response = generateAIResponse(question, lessonTitle, language, code, challengePrompt);
  return NextResponse.json({ response });
}

function generateAIResponse(
  question: string,
  lessonTitle: string,
  language: string,
  code: string,
  challengePrompt: string
): string {
  const q = question.toLowerCase();
  const lang = language || "python";

  // Detect question type and respond helpfully

  // Error help
  if (q.includes("error") || q.includes("bug") || q.includes("not working") || q.includes("doesn't work") || q.includes("wrong")) {
    if (code) {
      // Analyze common errors
      if (lang === "python") {
        if (!code.includes(":") && (code.includes("if ") || code.includes("for ") || code.includes("def ") || code.includes("while "))) {
          return "It looks like you might be missing a colon `:` at the end of your `if`, `for`, `def`, or `while` statement. In Python, these control structures need a colon at the end of the line.\n\n**Example:**\n```python\nif x > 5:  # <-- don't forget the colon!\n    print(\"big\")\n```";
        }
        if (code.includes("print") && !code.includes("print(")) {
          return "In Python 3, `print` is a function and needs parentheses. Try `print(\"hello\")` instead of `print \"hello\"`.";
        }
        if (code.includes("  ") && code.includes("\t")) {
          return "You might have mixed tabs and spaces for indentation. Python is picky about this! Stick to either all spaces (recommended: 4 spaces) or all tabs.";
        }
      }
      if (lang === "javascript") {
        if (code.includes("const") && code.includes("=") && code.split("const").length > 2) {
          return "Make sure you're not trying to reassign a `const` variable. If you need to change a value, use `let` instead of `const`.";
        }
      }
      return `Let me help debug this! Here are common things to check:\n\n1. **Syntax**: Make sure all brackets, parentheses, and quotes are matched\n2. **Spelling**: Check variable and function names for typos\n3. **Logic**: Walk through your code line by line - does each step do what you expect?\n4. **Types**: Make sure you're using the right data types\n\nTry adding a \`${lang === "python" ? "print()" : "console.log()"}\` statement to see what your variables contain at different points.`;
    }
    return "Can you share the error message or your code? That will help me point you in the right direction!";
  }

  // Concept explanations
  if (q.includes("what is") || q.includes("what are") || q.includes("explain") || q.includes("how does") || q.includes("what does")) {
    if (q.includes("variable")) {
      return "A **variable** is like a labeled container that holds data. You create one by giving it a name and assigning a value:\n\n" +
        (lang === "python"
          ? "```python\nname = \"Alice\"  # string variable\nage = 25         # number variable\n```"
          : "```javascript\nlet name = \"Alice\";  // string variable\nconst age = 25;      // number variable\n```") +
        "\n\nYou can then use the variable name anywhere to access the stored value.";
    }
    if (q.includes("function")) {
      return "A **function** is a reusable block of code that performs a specific task. Think of it as a recipe:\n\n" +
        (lang === "python"
          ? "```python\ndef greet(name):       # define the function\n    return f\"Hi, {name}!\"\n\ngreet(\"Alice\")         # call it\n```"
          : "```javascript\nfunction greet(name) {   // define the function\n    return `Hi, ${name}!`;\n}\n\ngreet(\"Alice\");          // call it\n```") +
        "\n\nFunctions help you avoid repeating code and keep things organized.";
    }
    if (q.includes("loop")) {
      return "A **loop** repeats a block of code multiple times. The two main types are:\n\n" +
        "**For loop** - when you know how many times to repeat:\n" +
        (lang === "python"
          ? "```python\nfor i in range(5):\n    print(i)  # prints 0,1,2,3,4\n```"
          : "```javascript\nfor (let i = 0; i < 5; i++) {\n    console.log(i);  // prints 0,1,2,3,4\n}\n```") +
        "\n\n**While loop** - when you repeat until a condition changes:\n" +
        (lang === "python"
          ? "```python\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n```"
          : "```javascript\nlet count = 0;\nwhile (count < 3) {\n    console.log(count);\n    count++;\n}\n```");
    }
    if (q.includes("list") || q.includes("array")) {
      return "A **list** (array in JS) is an ordered collection of items:\n\n" +
        (lang === "python"
          ? "```python\nfruits = [\"apple\", \"banana\", \"cherry\"]\nprint(fruits[0])    # \"apple\"\nfruits.append(\"date\")  # add item\nprint(len(fruits))  # 4\n```"
          : "```javascript\nconst fruits = [\"apple\", \"banana\", \"cherry\"];\nconsole.log(fruits[0]);   // \"apple\"\nfruits.push(\"date\");       // add item\nconsole.log(fruits.length); // 4\n```") +
        "\n\nLists are great for storing collections of related items.";
    }
    if (q.includes("dictionary") || q.includes("object") || q.includes("dict")) {
      return "A **dictionary** (object in JS) stores data as key-value pairs:\n\n" +
        (lang === "python"
          ? "```python\nperson = {\"name\": \"Alice\", \"age\": 25}\nprint(person[\"name\"])  # \"Alice\"\nperson[\"city\"] = \"NYC\"  # add new pair\n```"
          : "```javascript\nconst person = { name: \"Alice\", age: 25 };\nconsole.log(person.name);  // \"Alice\"\nperson.city = \"NYC\";       // add new pair\n```") +
        "\n\nPerfect for structured data like user profiles or settings.";
    }
    return `Great question about **${lessonTitle}**! Here's a helpful way to think about it:\n\n` +
      `The key concept here is to break the problem into small steps. Try to:\n` +
      `1. Read the challenge prompt carefully\n` +
      `2. Think about what input you have and what output you need\n` +
      `3. Write the simplest version first, then improve it\n\n` +
      `Would you like me to explain a specific concept from this lesson?`;
  }

  // Help with the challenge
  if (q.includes("challenge") || q.includes("stuck") || q.includes("help") || q.includes("hint") || q.includes("how do i") || q.includes("how to")) {
    if (challengePrompt) {
      return `Let me help with this challenge!\n\n**Challenge:** ${challengePrompt}\n\n` +
        `**Approach:**\n` +
        `1. First, identify what the challenge is asking you to **output**\n` +
        `2. Think about what ${lang} features you need (variables, loops, functions, etc.)\n` +
        `3. Start by writing the simplest version\n` +
        `4. Check the **Expected Output** section to verify your answer\n\n` +
        `**Tips:**\n` +
        `- Use \`${lang === "python" ? "print()" : "console.log()"}\` to see intermediate values\n` +
        `- Check the **Hint** button below the editor for a more specific clue\n` +
        `- Make sure your output matches **exactly** (including spacing and capitalization)`;
    }
    return `I'm here to help! Here are some general tips:\n\n` +
      `1. **Read the challenge carefully** - pay attention to exact output format\n` +
      `2. **Start simple** - get something working, then refine\n` +
      `3. **Use the hint button** for a targeted clue\n` +
      `4. **Check expected output** - your output must match exactly\n\n` +
      `What specifically are you stuck on? I can explain any concept!`;
  }

  // General coding questions
  if (q.includes("syntax") || q.includes("how to write")) {
    return `Here's a quick ${lang} syntax reference:\n\n` +
      (lang === "python"
        ? "```python\n# Variables\nx = 10\nname = \"hello\"\n\n# If statement\nif x > 5:\n    print(\"big\")\n\n# Loop\nfor i in range(5):\n    print(i)\n\n# Function\ndef add(a, b):\n    return a + b\n\n# List\nnums = [1, 2, 3]\n```"
        : "```javascript\n// Variables\nlet x = 10;\nconst name = \"hello\";\n\n// If statement\nif (x > 5) {\n    console.log(\"big\");\n}\n\n// Loop\nfor (let i = 0; i < 5; i++) {\n    console.log(i);\n}\n\n// Function\nfunction add(a, b) {\n    return a + b;\n}\n\n// Array\nconst nums = [1, 2, 3];\n```") +
      `\n\nWhich part of the syntax would you like me to explain more?`;
  }

  // Default helpful response
  return `I'm your AI coding tutor! Here's how I can help:\n\n` +
    `- **Explain concepts** - ask "what is a variable?" or "explain loops"\n` +
    `- **Debug your code** - paste your code and describe the problem\n` +
    `- **Help with challenges** - tell me where you're stuck\n` +
    `- **Syntax help** - ask "how to write a function in ${lang}"\n\n` +
    `I won't give you the answer directly (that's what the Answer Key is for!), but I'll guide you to figure it out yourself. What do you need help with?`;
}
