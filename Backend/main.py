from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from crew_agents import run_crew  

class Query(BaseModel):
    query: str

app = FastAPI()

# ✅ CORS Middleware add karo
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://silly-wisp-c41929.netlify.app",
    ],  # frontend origins
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],
)

@app.post("/run")
async def run_agents(data: Query):
    raw = run_crew(data.query)

    # CrewAI output ko force clean string me convert kar do
    try:
        output = str(raw)
    except:
        import json
        output = json.dumps(raw, indent=2, default=str)

    return {"response": output}

