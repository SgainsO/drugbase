import sqlite3

def reset():
    conn = sqlite3.connect('drug.db')
    c = conn.cursor()

    c.execute("DROP TABLE IF EXISTS Manufacturer")
    c.execute("DROP TABLE IF EXISTS NBDrugs")
    c.execute("DROP TABLE IF EXISTS Disease")
    c.execute("DROP TABLE IF EXISTS Generics")
    c.execute("DROP TABLE IF EXISTS DrugAlt")
    c.execute("DROP TABLE IF EXISTS Treatment")

    conn.commit()
    conn.close()


def create_tables(): 
    conn = sqlite3.connect('drug.db')
    c = conn.cursor(); 

    c.execute("""CREATE TABLE IF NOT EXISTS Manufacturer ( 
            ManID INTEGER PRIMARY KEY,
            Name TEXT NOT NULL
            )""")

    c.execute("""CREATE TABLE IF NOT EXISTS NBDrugs (
            DrugID INTEGER PRIMARY KEY,
            Name TEXT NOT NULL, 
            Price INTEGER,
            Purpose TEXT,
            ManID INTEGER, 
            FOREIGN KEY (ManID) REFERENCES Manufacturer (ManID) 
            )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Disease (
            DiseaseID INTEGER PRIMARY KEY,
            Name TEXT NOT NULL 
            )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Generics ( 
            GenID INTEGER PRIMARY KEY,
            Name TEXT NOT NULL,
            Price INTEGER,
            Purpose TEXT 
            )""")

    c.execute("""CREATE TABLE IF NOT EXISTS DrugAlt ( 
            DrugID INTEGER,
            GenID INTEGER,
            PRIMARY KEY (DrugID, GenID), 
            FOREIGN KEY (DrugID) REFERENCES NBDrugs (DrugID),
            FOREIGN KEY (GenID) REFERENCES Generics (GenID)
            )""")

    c.execute("""CREATE TABLE IF NOT EXISTS Treatment ( 
            DiseaseID INTEGER,
            DrugID INTEGER,
            GenID INTEGER, 
            PRIMARY KEY (DiseaseID, DrugID, GenID), 
            FOREIGN KEY (DiseaseID) REFERENCES Disease (DiseaseID),
            FOREIGN KEY (DrugID) REFERENCES NBDrugs (DrugID),
            FOREIGN KEY (GenID) REFERENCES Generics (GenID)
            )""")

    conn.commit()
    conn.close()
