import sqlite3

def testDB(): 
    conn = sqlite3.connect('drug.db')
    c = conn.cursor()

    #will select things from table here 

    #EX ONE: Number of name brand drugs: 
    c.execute("SELECT COUNT(*) FROM NBDrugs")
    NB_amt = c.fetchone()[0] #fetches first column of the query (in this case only one)
    print("Number of Drugs: ", NB_amt)

    #EX TWO: print out all the name brand drug info: 
    c.execute("SELECT DrugID, Name, ManID FROM NBDrugs")

    for row in c.fetchall(): 
        drug_ID, drug_name, manu_ID = row
        print(f"Drug ID: {drug_ID}, Drug Name: {drug_name}, Manufacturer: {manu_ID}")
    
    conn.close()

testDB()