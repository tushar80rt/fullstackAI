import os
import groq
from crewai import Agent, Task, Crew, LLM
from dotenv import load_dotenv

# api.env file se env load karo
load_dotenv("api.env")

GROQ_API_KEY = os.getenv("GROQ_API_KEY")

groq_llm = LLM(
    model="groq/meta-llama/llama-4-maverick-17b-128e-instruct",  
    api_key=GROQ_API_KEY
)

def run_crew(user_query: str):

    # 🧠 Researcher Agent – Highly optimized prompt
    researcher = Agent(
        role="Senior Research Analyst",
        goal=(
            "Extract accurate, high-value insights from trusted sources. "
            "Break complex topics into clear, logical components. "
            "Provide verified, unbiased, structured knowledge."
        ),
        backstory=(
            "You are a world-class research expert trained to gather information "
            "with precision. You specialize in summarizing complex concepts into "
            "digestible insights. You always think step-by-step, verify facts, "
            "eliminate fluff, and provide only essential knowledge."
        ),
        verbose=True,
        allow_delegation=False,
        llm=groq_llm
    )

    # ✍️ Writer Agent – Formatting-focused
    writer = Agent(
        role="Expert Technical Writer & Formatter",
        goal=(
            "Transform the research into a clean, well-formatted markdown answer "
            "that is very easy to read on a website."
        ),
        backstory=(
            "You are an expert at writing and formatting explanations for the web. "
            "You always use proper markdown headings, short paragraphs and bullet points "
            "so that the content looks clean in a UI."
        ),
        verbose=True,
        allow_delegation=False,
        llm=groq_llm
    )

    # 🔍 Research Task
    research_task = Task(
        description=(
            f"Perform deep research on: {user_query}\n\n"
            "Instructions:\n"
            "- Break down the topic into clear sections.\n"
            "- Identify key concepts, definitions, facts, and workflows.\n"
            "- Extract only accurate, essential information.\n"
            "- Think step-by-step.\n"
            "- Prefer bullet points instead of long paragraphs.\n"
        ),
        expected_output=(
            "A structured bullet-point research summary that includes:\n"
            "- Key definitions\n"
            "- Core concepts\n"
            "- Important facts\n"
            "- Practical examples\n"
            "- Real-world relevance\n"
        ),
        agent=researcher,
    )

    # 🧾 Writing Task – STRICT markdown format
    writing_task = Task(
        description=(
            f"Using the researcher's output, write a **clean, markdown-formatted** "
            f"explanation for this query: {user_query}.\n\n"
            "FOLLOW THESE STRICT FORMAT RULES:\n"
            "- Do NOT wrap the answer inside ``` or any code block.\n"
            "- Start with a main title using: `# Title`.\n"
            "- Then use sections with `##` headings (e.g., `## Overview`, `## Key Concepts`).\n"
            "- Use short paragraphs (2–3 lines max).\n"
            "- Use bullet points (`-`) wherever possible instead of long text.\n"
            "- You may use `---` as a divider between major sections.\n"
            "- End with a small `## Summary` section.\n"
            "- The tone should be simple, beginner-friendly, and slightly conversational.\n"
        ),
        expected_output=(
            "A 250–400 word markdown answer with:\n"
            "- One `#` main title\n"
            "- 3–5 `##` section headings\n"
            "- Bullet points in relevant places\n"
            "- Short, readable paragraphs\n"
            "- A final `## Summary` section\n"
            "- NO ``` code fences anywhere\n"
        ),
        agent=writer,
    )

    # 🧑‍🚀 Multi-Agent Crew
    crew = Crew(
        agents=[researcher, writer],
        tasks=[research_task, writing_task],
    )

    output = crew.kickoff()
    return output
