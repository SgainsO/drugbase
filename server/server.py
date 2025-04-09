from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sql

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)


client = sql.database()

@app.get("/")
async def root():
    return {"message" : "This is the drugbase API"}

@app.get("/Drug_Search/{IDFrom}/{QueryName}")
async def get_next_six_drugs(IDFrom: int, QueryName: str):
    return {"data" : client.Drug_Search_Mode_six(IDFrom, QueryName)}
    #Remember this will contain the greated id
    #In case user wants to see next without changing the name
@app.get("/Disease_Search/{IDFrom}/{QueryName}")
async def get_next_six_disease(IDFrom: int, QueryName: str):
    return {"data" : client.Disease_Search_Mode_six(IDFrom, QueryName)}
