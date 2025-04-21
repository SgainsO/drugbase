import sqlite3
import pandas as pd
import setup

#TO RUN: 
#python3 populateDB.py 

#TO LOOK AT drug.db file
#sqlite3 drug.db
#.tables lists the tables 
#.quit to quit

#you may do queries as well in the drug.db file, just make sure to use semicolon
#Example: SELECT COUNT(*) FROM NBDrugs; (will print the amount of entries)
#Example: SELECT * FROM NBDrugs; (will print all entries)



#def sideEffects(drug_name): 
    # idMap = {}
    # effectMap = {}

    # df = pd.read_csv('drug_namesSIDER.tsv', sep='\t')


def populate(): 
    conn = sqlite3.connect('drug.db')
    c = conn.cursor()

    #Get medicare data 
    df_data = pd.read_csv('Medicare.csv', usecols = ['Brnd_Name', 'Gnrc_Name', 'Mftr_Name', 'Avg_Spnd_Per_Bene_2022'])

    #to see first few rows of data from file
    #print(df_data.head())

    #iterate through each row in the FDA product data 
    for i, row in df_data.iterrows(): 
        brand_name = row['Brnd_Name']
        gen_name = row['Gnrc_Name']
        manu_name = row['Mftr_Name']
        price = row['Avg_Spnd_Per_Bene_2022']

        #check if manufacturer exists
        c.execute("SELECT ManID FROM Manufacturer WHERE Name = ?", (manu_name,))
        manuID = c.fetchone()

        #only add each manufacturer name once into the Manufacturer table
        if manuID is None: 
            c.execute("""INSERT OR IGNORE INTO Manufacturer (Name) VALUES (?)""", (manu_name,))
            manuID = c.lastrowid #autogenerates an ID
        else: 
            manuID = manuID[0]
        
        #its a generic drug if brand name = generic name in the csv
        if brand_name == gen_name: 
            c.execute("INSERT INTO Generics (Name, Price, Purpose) VALUES (?, ?, ?)", 
                      (gen_name, price, 'purpose'), )
            genID = c.lastrowid
        else: 
            c.execute("INSERT INTO NBDrugs (Name, Price, Purpose, ManID) VALUES (?, ?, ?, ?)", 
                      (brand_name, price, 'purpose', manuID), )
            drugID = c.lastrowid

            #insert to generic (if not added)
            c.execute("SELECT GenID FROM Generics WHERE Name = ?", (gen_name,))
            gen = c.fetchone()
            if gen is None: 
                c.execute("INSERT INTO Generics (Name, Price, Purpose) VALUES (?, ?, ?)", 
                          (gen_name, price, 'purpose'))
                genID = c.lastrowid
            else:
                genID = gen[0]

            # Insert into DrugAlt to map NBDrug to Generic
            c.execute("INSERT INTO DrugAlt (DrugID, GenID) VALUES (?, ?)", (drugID, genID))

    conn.commit()
    conn.close()

def main(): 
    #populate the database with data
    setup.reset()
    setup.create_tables()
    populate()

if __name__ == "__main__":
    main()
