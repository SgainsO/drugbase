from fastapi import FastAPI, HTTPException
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

@app.get("/Multi_Disease_Treatment/{IDFrom}/{MinDiseases}")
async def get_multi_disease_treatments(IDFrom: int, MinDiseases: int = 2):
    """
    Get drugs that treat multiple diseases
    Uses HAVING clause to filter drugs that treat at least MinDiseases different diseases
    """
    return {"data": client.Multi_Disease_Treatment_Search(IDFrom, MinDiseases)}

@app.get("/dev/manufacturers")
async def get_manufacturers():
    return {"data": client.dev_get_all_manufacturers()}

@app.get("/dev/diseases")
async def get_diseases():
    return {"data": client.dev_get_all_diseases()}

@app.get("/dev/drugs")
async def get_drugs():
    return {"data": client.dev_get_all_drugs()}

@app.get("/dev/generics")
async def get_generics():
    return {"data": client.dev_get_all_generics()}

@app.post("/dev/manufacturer")
async def add_manufacturer(name: str):
    new_id = client.dev_insert_manufacturer(name)
    return {"success": True, "id": new_id}

@app.post("/dev/drug")
async def add_drug(name: str, price: int, purpose: str, man_id: int):
    new_id = client.dev_insert_drug(name, price, purpose, man_id)
    return {"success": True, "id": new_id}

@app.post("/dev/generic")
async def add_generic(name: str, price: int, purpose: str):
    new_id = client.dev_insert_generic(name, price, purpose)
    return {"success": True, "id": new_id}

@app.post("/dev/treatment")
async def add_treatment(disease_id: int, drug_id: int, gen_id: int):
    success = client.dev_insert_treatment(disease_id, drug_id, gen_id)
    return {"success": success}

@app.put("/dev/manufacturer/{man_id}")
async def update_manufacturer(man_id: int, new_name: str):
    success = client.dev_update_manufacturer_name(man_id, new_name)
    return {"success": success}

@app.delete("/dev/drug/{drug_id}")
async def delete_drug(drug_id: int):
    success = client.dev_delete_drug_cascade(drug_id)
    return {"success": success}
