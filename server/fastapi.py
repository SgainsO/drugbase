from fastapi import FastAPI


app = FastAPI()


@app.get("/")
async def root():
    return {"message" : "This is the drugbase API"}

@app.get("/first")
async def get_next_six():
    return {}
