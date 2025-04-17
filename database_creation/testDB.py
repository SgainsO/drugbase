import sqlite3

def testDB(): 
    conn = sqlite3.connect('drug.db')
    c = conn.cursor()

    