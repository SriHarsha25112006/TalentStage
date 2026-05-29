import os
import logging
from typing import List
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import PromptTemplate
from core.config import settings

logger = logging.getLogger("uvicorn.error")

class MCQQuestion(BaseModel):
    question_text: str = Field(description="The question. For code snippets, use \\n to separate lines of code so they are readable.")
    option_a: str = Field(description="Option A text")
    option_b: str = Field(description="Option B text")
    option_c: str = Field(description="Option C text")
    option_d: str = Field(description="Option D text")
    correct_answer: str = Field(description="MUST be EXACTLY one of: 'A', 'B', 'C', or 'D'. This must be 100% technically correct. Double-check before answering.")

class SkillTest(BaseModel):
    questions: List[MCQQuestion] = Field(description="Exactly 10 multiple choice questions.")

class SkillTestGenerator:
    def __init__(self):
        try:
            self.llm = ChatGoogleGenerativeAI(
                model="gemini-2.5-flash",
                google_api_key=settings.GEMINI_API_KEY,
                temperature=0.3
            )
        except Exception as e:
            logger.error(f"Failed to initialize Gemini Client: {e}")
            self.llm = None

    async def generate_test(self, skill: str) -> dict:
        if self.llm:
            try:
                prompt = PromptTemplate.from_template("""
You are a senior software engineer and technical exam creator. Generate a 10-question multiple-choice quiz to assess a candidate's knowledge of {skill}.

STRICT RULES:
1. Difficulty: MEDIUM — test real understanding, not trivia.
2. Each question must have exactly 4 options (A, B, C, D).
3. The correct_answer field MUST be factually and technically 100% correct.
4. CRITICAL MATH/CODE VERIFICATION: Double-check all math operations and code outputs line-by-line before generating the correct_answer option. (e.g. if code is `x = 5; print(x * 2)`, the output is `10`, not `25`. Ensure you do not confuse operators).
5. For questions with CODE SNIPPETS: Wrap all code strictly within markdown triple backticks (e.g. ```python\n...\n```). Ensure all newlines inside the code block use literal \n formatting.
6. Do NOT include ambiguous questions where multiple answers could be correct.
7. Test practical, real-world knowledge: syntax, output prediction, best practices, common errors.
8. Provide EXACTLY 10 unique questions.
""")
                structured_llm = self.llm.with_structured_output(SkillTest)
                result = await structured_llm.ainvoke(prompt.format(skill=skill))
                return result.model_dump()
            except Exception as e:
                logger.error(f"Gemini generation failed for {skill}, falling back to static questions. Error: {e}")
                
        # Return fallback quiz
        return self.get_fallback_quiz(skill)

    def get_fallback_quiz(self, skill: str) -> dict:
        skill_lower = skill.lower()
        if 'python' in skill_lower:
            return {
                "questions": [
                    {
                        "question_text": "What is the output of the following Python code?\n```python\nx = [1, 2, 3]\ny = x\ny.append(4)\nprint(len(x))\n```",
                        "option_a": "3", "option_b": "4", "option_c": "5", "option_d": "Raises an AttributeError",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "In Python, which of the following is true about lists and tuples?",
                        "option_a": "Lists are immutable, Tuples are mutable.",
                        "option_b": "Both lists and tuples are mutable.",
                        "option_c": "Lists are mutable, Tuples are immutable.",
                        "option_d": "Both lists and tuples are immutable.",
                        "correct_answer": "C"
                    },
                    {
                        "question_text": "What is the output of the following slice operation?\n```python\ns = 'TalentStage'\nprint(s[1:5])\n```",
                        "option_a": "alen", "option_b": "lent", "option_c": "Talen", "option_d": "alent",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": "Which keyword is used to create a generator function in Python?",
                        "option_a": "yield", "option_b": "return", "option_c": "generator", "option_d": "raise",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": "What is the output of `type(lambda x: x)` in Python?",
                        "option_a": "<class 'function'>", "option_b": "<class 'lambda'>", "option_c": "<class 'object'>", "option_d": "<class 'type'>",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": "How do you handle exceptions in Python?",
                        "option_a": "try-catch block", "option_b": "try-except block", "option_c": "do-catch block", "option_d": "try-handle block",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What is the output of the following code?\n```python\nprint(2 ** 3 ** 2)\n```",
                        "option_a": "64", "option_b": "512", "option_c": "256", "option_d": "4096",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What does the `__init__` method do in a Python class?",
                        "option_a": "Destroys the object", "option_b": "Initializes class variables", "option_c": "Serves as the class constructor", "option_d": "Registers the class namespace",
                        "correct_answer": "C"
                    },
                    {
                        "question_text": "Which of the following creates a shallow copy of a list `lst` in Python?",
                        "option_a": "copy_lst = lst[:]", "option_b": "copy_lst = list(lst)", "option_c": "copy_lst = lst.copy()", "option_d": "All of the above",
                        "correct_answer": "D"
                    },
                    {
                        "question_text": "What is the output of `bool([])` in Python?",
                        "option_a": "True", "option_b": "False", "option_c": "None", "option_d": "Raises a TypeError",
                        "correct_answer": "B"
                    }
                ]
            }
        elif 'javascript' in skill_lower or 'js' in skill_lower or 'typescript' in skill_lower:
            return {
                "questions": [
                    {
                        "question_text": "What is the output of the following JavaScript code?\n```javascript\nconsole.log(typeof NaN);\n```",
                        "option_a": "'number'", "option_b": "'NaN'", "option_c": "'undefined'", "option_d": "'object'",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": "Which of the following is true about JavaScript comparison operators?",
                        "option_a": "== checks value and type, === checks value only.",
                        "option_b": "== checks value only, === checks value and type.",
                        "option_c": "Both == and === check value and type.",
                        "option_d": "Neither == nor === checks type.",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What is the output of the following block?\n```javascript\nconst obj = { a: 1 };\nconst copy = obj;\ncopy.a = 2;\nconsole.log(obj.a);\n```",
                        "option_a": "1", "option_b": "2", "option_c": "undefined", "option_d": "Raises a ReferenceError",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "How do you declare a block-scoped variable in modern JavaScript?",
                        "option_a": "var", "option_b": "let", "option_c": "const", "option_d": "Both let and const",
                        "correct_answer": "D"
                    },
                    {
                        "question_text": "What is the output of the following array operation?\n```javascript\nconst arr = [1, 2, 3];\nconst res = arr.map(x => x * 2);\nconsole.log(arr);\n```",
                        "option_a": "[1, 2, 3]", "option_b": "[2, 4, 6]", "option_c": "undefined", "option_d": "Raises an Error",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": "What is the value of `x` after this operation?\n```javascript\nconst x = false || 'hello' && 'world';\n```",
                        "option_a": "false", "option_b": "'hello'", "option_c": "'world'", "option_d": "true",
                        "correct_answer": "C"
                    },
                    {
                        "question_text": "What is the primary purpose of a Promise in JavaScript?",
                        "option_a": "To secure variables in global scopes", "option_b": "To represent completion of asynchronous tasks", "option_c": "To iterate through an array faster", "option_d": "To compile TypeScript modules",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "Which method is used to register event handlers in modern JavaScript?",
                        "option_a": "attachEvent()", "option_b": "addEventListener()", "option_c": "on()", "option_d": "bindEvent()",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What is the output of `console.log(1 + '1')` in JavaScript?",
                        "option_a": "2", "option_b": "'11'", "option_c": "NaN", "option_d": "Raises a TypeError",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What is closure in JavaScript?",
                        "option_a": "A block that deletes variables from active memory", "option_b": "An inner function that retains access to outer scopes", "option_c": "A method to close browser tabs", "option_d": "A compiled class interface",
                        "correct_answer": "B"
                    }
                ]
            }
        elif 'react' in skill_lower:
            return {
                "questions": [
                    {
                        "question_text": "What is the main purpose of the `useState` hook in React?",
                        "option_a": "To fetch data from external APIs", "option_b": "To declare state variables in functional components", "option_c": "To manage lifecycle methods in class components", "option_d": "To route between separate pages",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "When does the dependency array of a `useEffect` hook trigger execution?",
                        "option_a": "Every time the component updates, if empty",
                        "option_b": "Only when the specified variables in the array change value",
                        "option_c": "Only during the initial render mounting, regardless of values",
                        "option_d": "Only when local storage updates",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What is Virtual DOM in React?",
                        "option_a": "An exact direct link to the browser HTML tree",
                        "option_b": "An in-memory representation of the real DOM used for reconciliation",
                        "option_c": "A separate rendering engine installed on servers",
                        "option_d": "A state management context library",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "Why must you provide a unique `key` prop when rendering lists of elements?",
                        "option_a": "To style elements individually",
                        "option_b": "To help React identify which items have changed, been added, or removed",
                        "option_c": "To bind event listeners to specific components",
                        "option_d": "To encrypt sensitive list data",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "In React, what are `props`?",
                        "option_a": "Internal state values that can be modified by the component",
                        "option_b": "Read-only arguments passed from parent to child components",
                        "option_c": "Configuration objects containing API links",
                        "option_d": "System functions inside package packages",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "Which Hook should you use to share values globally without passing props down multiple levels?",
                        "option_a": "useReducer", "option_b": "useMemo", "option_c": "useContext", "option_d": "useCallback",
                        "correct_answer": "C"
                    },
                    {
                        "question_text": "What is the output of trying to update state directly in React (e.g. `state.val = 5`)?",
                        "option_a": "The component immediately re-renders with the new value",
                        "option_b": "No re-render is triggered and state updates are ignored or unstable",
                        "option_c": "React raises a CompileTime error",
                        "option_d": "The component is deleted",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "Which React hook is used to optimize performance by memoizing computed values?",
                        "option_a": "useRef", "option_b": "useMemo", "option_c": "useCallback", "option_d": "useLayoutEffect",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What is the purpose of `useRef` in React?",
                        "option_a": "To trigger re-renders on variable changes",
                        "option_b": "To persist mutable values without causing re-renders, or reference DOM nodes",
                        "option_c": "To route between different components",
                        "option_d": "To handle form validation events",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": "What does `React.StrictMode` do in development mode?",
                        "option_a": "Prevents any network requests from succeeding",
                        "option_b": "Enforces TypeScript usage across files",
                        "option_c": "Highlights potential problems in an application by double-invoking lifecycles",
                        "option_d": "Speeds up loading speeds by bypassing security checks",
                        "correct_answer": "C"
                    }
                ]
            }
        else:
            # High quality generic skill fallback customized dynamically
            return {
                "questions": [
                    {
                        "question_text": f"What is a primary best practice when designing a modern application using {skill}?",
                        "option_a": "Writing modular, reusable, and well-tested code interfaces",
                        "option_b": "Writing all implementation details inside a single global file",
                        "option_c": "Avoiding all automated documentation systems",
                        "option_d": "Using plain, unencrypted database storage",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": f"Which of the following is considered a core principle of high-performance development in {skill}?",
                        "option_a": "Using infinite loops to poll resource status",
                        "option_b": "Optimizing algorithmic complexity and managing active memory handles",
                        "option_c": "Increasing hardware processors without optimizing software scripts",
                        "option_d": "Disabling compiler error checking mechanisms",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": f"When configuring a project utilizing {skill}, how should sensitive configuration variables be managed?",
                        "option_a": "Committed directly to public GitHub repositories",
                        "option_b": "Stored in secure local environment variables (.env files)",
                        "option_c": "Written as hardcoded strings in front-facing UI files",
                        "option_d": "Emailed to all project stakeholders",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": f"What does semantic versioning (e.g. v2.4.1) mean for a dependency in {skill}?",
                        "option_a": "Major revision (2), Minor revision (4), Patch bugfix (1)",
                        "option_b": "Author ID (2), Project code (4), Revision number (1)",
                        "option_c": "Compiler version (2), Speed scale (4), Debug state (1)",
                        "option_d": "Release index (2), Speed score (4), Error index (1)",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": f"In {skill} development, what is the role of automated continuous integration (CI) pipelines?",
                        "option_a": "To delete old repository history",
                        "option_b": "To automatically compile, test, and validate changes before deployment",
                        "option_c": "To generate marketing copy",
                        "option_d": "To increase computing power for graphic designs",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": f"Which approach is highly recommended to prevent code duplication in {skill} architectures?",
                        "option_a": "Applying DRY (Don't Repeat Yourself) guidelines and writing helper utils",
                        "option_b": "Copy-pasting components into multiple subfolders",
                        "option_c": "Refusing to use third-party libraries for helpers",
                        "option_d": "Disabling code-linting configurations",
                        "correct_answer": "A"
                    },
                    {
                        "question_text": f"Why is comprehensive code documentation important in team projects focusing on {skill}?",
                        "option_a": "To slow down loading speeds of IDE compilers",
                        "option_b": "To ensure maintainability, clear onboarding, and rapid debug flows",
                        "option_c": "To prevent any modifications to the code by other members",
                        "option_d": "To comply with graphic layout designs",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": f"Which of the following is considered a best practice for API integrations using {skill}?",
                        "option_a": "Omitting error blocks for failed requests",
                        "option_b": "Implementing structured try-catch exception checking and retry policies",
                        "option_c": "Sending unencrypted user credentials inside URL paths",
                        "option_d": "Running requests inside blocking global loops",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": f"What is the advantage of using a dedicated package manager when working with {skill} packages?",
                        "option_a": "It deletes local folders to make space",
                        "option_b": "It resolves dependencies, lock versions, and simplifies installs",
                        "option_c": "It formats graphic assets",
                        "option_d": "It routes website traffic",
                        "correct_answer": "B"
                    },
                    {
                        "question_text": f"In software engineering, what is the primary benefit of Git code reviews prior to merging?",
                        "option_a": "It compiles packages faster",
                        "option_b": "It ensures code quality, captures bugs, and maintains architectural alignments",
                        "option_c": "It decreases server hosting fees",
                        "option_d": "It deletes unused accounts",
                        "correct_answer": "B"
                    }
                ]
            }
