import sqlite3
import random

# Connect to database (creates if it doesn't exist)
conn = sqlite3.connect("fake.db")
cursor = conn.cursor()

# Clean start: drop tables if they exist
cursor.executescript("""
DROP TABLE IF EXISTS Manufacturer;
DROP TABLE IF EXISTS NBDrugs;
DROP TABLE IF EXISTS Disease;
DROP TABLE IF EXISTS Generics;
DROP TABLE IF EXISTS DrugAlt;
DROP TABLE IF EXISTS Treatment;

CREATE TABLE Manufacturer(ManID int, Name text);
CREATE TABLE NBDrugs(DrugID int, Name text, Price int, Purpose text, ManID int);
CREATE TABLE Disease(DiseaseID int, Name text);
CREATE TABLE Generics(GenID int, Name text, Price int, Purpose text);
CREATE TABLE DrugAlt(DrugID int, GenID int);
CREATE TABLE Treatment(DiseaseID int, DrugID int, GenID int);
""")

# Sample data
manufacturers = ["PharmaCorp", "MediLife", "HealWell", "BioGen", "CureTech"]
purposes = ["Pain Relief", "Antibiotic", "Anti-inflammatory", "Antiviral", "Blood Pressure"]
diseases = ["Flu", "Cold", "Arthritis", "Hypertension", "Infection", "COVID-19"]

# Insert manufacturers
for i, name in enumerate(manufacturers, start=1):
    cursor.execute("INSERT INTO Manufacturer VALUES (?, ?)", (i, name))

# Insert diseases
for i, disease in enumerate(diseases, start=1):
    cursor.execute("INSERT INTO Disease VALUES (?, ?)", (i, disease))

# Insert brand-name drugs
for drug_id in range(1, 21):
    name = f"NBDrug{drug_id}"
    price = random.randint(20, 100)
    purpose = random.choice(purposes)
    man_id = random.randint(1, len(manufacturers))
    cursor.execute("INSERT INTO NBDrugs VALUES (?, ?, ?, ?, ?)", (drug_id, name, price, purpose, man_id))

# Insert generics
for gen_id in range(1, 16):
    name = f"Generic{gen_id}"
    price = random.randint(10, 50)
    purpose = random.choice(purposes)
    cursor.execute("INSERT INTO Generics VALUES (?, ?, ?, ?)", (gen_id, name, price, purpose))

# Create DrugAlt links (randomly link some drugs to generics)
for _ in range(20):
    drug_id = random.randint(1, 20)
    gen_id = random.randint(1, 15)
    cursor.execute("INSERT INTO DrugAlt VALUES (?, ?)", (drug_id, gen_id))

# Create Treatment links
for _ in range(25):
    disease_id = random.randint(1, len(diseases))
    drug_id = random.randint(1, 20)
    gen_id = random.randint(1, 15)
    cursor.execute("INSERT INTO Treatment VALUES (?, ?, ?)", (disease_id, drug_id, gen_id))

# Commit and close
conn.commit()
conn.close()

print("Fake data inserted successfully.")
