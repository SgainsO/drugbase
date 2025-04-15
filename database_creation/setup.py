import sqlite3

conn = sqlite3.connect('drug.db')
c = conn.cursor(); 

c.execute("""CREATE TABLE Manufacturer ( 
          ManID INTEGER PRIMARY KEY,
          Name TEXT NOT NULL
          )""")

c.execute("""CREATE TABLE NBDrugs (
          DrugID INTEGER PRIMARY KEY,
          Name TEXT NOT NULL, 
          Price INTEGER,
          Purpose TEXT,
          ManID INTEGER, 
          FOREIGN KEY (ManID) REFERENCES Manufacturer (ManID) 
          )""")

c.execute("""CREATE TABLE Disease (
          DiseaseID INTEGER PRIMARY KEY,
          Name TEXT NOT NULL 
          )""")

c.execute("""CREATE TABLE Generics ( 
          GenID INTEGER PRIMARY KEY,
          Name TEXT NOT NULL,
          Price INTEGER,
          Purpose TEXT 
          )""")

c.execute("""CREATE TABLE DrugAlt ( 
          DrugID INTEGER,
          GenID INTEGER,
          PRIMARY KEY (DrugID, GenID), 
          FOREIGN KEY (DrugID) REFERENCES NBDrugs (DrugID),
          FOREIGN KEY (GenID) REFERENCES Generics (GenID)
          )""")

c.execute("""CREATE TABLE Treatment ( 
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
