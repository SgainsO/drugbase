import sqlite3
import pandas as pd

def populate(): 
    conn = sqlite3.connect('drug.db')
    c = conn.cursor()

    #Getting drugID and drug name from FDA data
    df_drugs = pd.read_csv('./drugbase/database_creation/FDAdata.txt', sep='\t', on_bad_lines='skip')

    #Getting manufacturer names from FDA manufacturers data
    df_manu = pd.read_csv('./drugbase/database_creation/FDAManu.txt', sep='\t', on_bad_lines='skip')

    #to see first few rows of data from FDA text files
    #print(df_drugs.head())
    #print(df_manu.head())

    #Merge the manufacturer and NBDrug FDA info
    df_DrugManu = pd.merge(df_drugs, df_manu, on='ApplNo', how='inner')

    #FDA doesnt have IDs for manufacturers so need to assign manually
    allManu = {} #will keep track of all manufacturer names
    manuID = 1

    #iterate through each row in the FDA product data 
    for i, row in df_DrugManu.iterrows(): 
        drug_id = row['ApplNo']
        drug_name = row['DrugName']
        manu_name = row["SponsorName"]

        #only add each manufacturer name once into the Manufacturer table
        if manu_name not in allManu: 
            c.execute("""INSERT OR IGNORE INTO Manufacturer (ManID, Name)
                    VALUES (?, ?)""", (manuID, manu_name))
            allManu[manu_name] = manuID
            manuID += 1   #manually increment manufacturer IDs
        
        #map manufacturer ID to the name 
        manuID = allManu[manu_name]; 

        #Insert drug info into name brand drug table
        c.execute("""INSERT OR IGNORE INTO NBDrugs (DrugID, Name, Price, Purpose, ManID)
            VALUES (?, ?, ?, ?, ?)""", 
            (drug_id, drug_name, 0, 'info', manuID))

    conn.commit()
    conn.close()

if __name__ == "__main__":
    populate()