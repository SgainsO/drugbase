import sqlite3
import random

# Connect to database
conn = sqlite3.connect("fake.db")
cursor = conn.cursor()

# Reset tables
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

prefixes = [
    "Acu", "Ben", "Cetra", "Dolo", "Exo", "Flora", "Geno", "Hema", "Immu", "Juvo",
    "Ketra", "Luma", "Myco", "Neuro", "Ortho", "Pedi", "Quanta", "Rena", "Sero", "Thera",
    "Ultra", "Vira", "Well", "Xeno", "Yura", "Zeno", "Allo", "Bio", "Cardi", "Derm",
    "Endo", "Ferro", "Gluco", "Hydro", "Intra", "Janu", "Kali", "Lacto", "Meta", "Natu",
    "Oxi", "Pura", "Qira", "Reju", "Syno", "Tera", "Uro", "Veno", "Welo", "Xilo", "Zyto",
    "Aero", "Bacto", "Cryo", "Dia", "Ecto", "Fito", "Gyne", "Halo", "Iso", "Juvo",
    "Karyo", "Lipo", "Micro", "Neo", "Osteo", "Pharma", "Quixo", "Ribo", "Seri", "Tricho",
    "Uvia", "Vaxo", "Xantho", "Yello", "Zymo", "Ambi", "Brio", "Cysto", "Delto", "Ergo",
    "Flexo", "Gastro", "Hepato", "Ion", "Jecto", "Kemo", "Lyso", "Medi", "Nexo", "Omni"
]

suffixes = [
    "dol", "vir", "mune", "cillin", "pril", "zol", "pan", "nex", "rel", "med",
    "fen", "line", "done", "xone", "mycin", "thrin", "zine", "zole", "tide", "dopa",
    "pram", "xan", "barb", "mab", "stat", "mide", "prazole", "caine", "sartan", "dine",
    "one", "cort", "lone", "dazole", "phene", "terol", "tadine", "lukast", "mivir", "virin",
    "triptan", "gliptin", "afil", "asone", "setron", "ximab", "zumab", "tuzumab", "rubicin", "cid"
]


def generate_drug_name(existing_names):
    while True:
        name = random.choice(prefixes) + random.choice(suffixes)
        if name not in existing_names:
            existing_names.add(name)
            return name

# Insert manufacturers
for i, name in enumerate(manufacturers, start=1):
    cursor.execute("INSERT INTO Manufacturer VALUES (?, ?)", (i, name))

# Insert diseases
for i, disease in enumerate(diseases, start=1):
    cursor.execute("INSERT INTO Disease VALUES (?, ?)", (i, disease))

# Insert NBDrugs
used_drug_names = set()
for drug_id in range(1, 200):
    name = generate_drug_name(used_drug_names)
    price = random.randint(20, 100)
    purpose = random.choice(purposes)
    man_id = random.randint(1, len(manufacturers))
    cursor.execute("INSERT INTO NBDrugs VALUES (?, ?, ?, ?, ?)", (drug_id, name, price, purpose, man_id))

# Insert Generics
used_generic_names = set()
for gen_id in range(1, 206):
    name = generate_drug_name(used_generic_names)
    price = random.randint(10, 50)
    purpose = random.choice(purposes)
    cursor.execute("INSERT INTO Generics VALUES (?, ?, ?, ?)", (gen_id, name, price, purpose))

# Insert DrugAlt (map drugs 1-199 to generics 1-199)
for i in range(1, 200):
    cursor.execute("INSERT INTO DrugAlt VALUES (?, ?)", (i, i))

# Insert Treatment (random valid IDs)
for i in range(1, 221):
    disease_id = random.randint(1, len(diseases))
    drug_id = random.randint(1, 199)
    gen_id = random.randint(1, 205)
    cursor.execute("INSERT INTO Treatment VALUES (?, ?, ?)", (disease_id, drug_id, gen_id))

# Commit and close
conn.commit()
conn.close()
