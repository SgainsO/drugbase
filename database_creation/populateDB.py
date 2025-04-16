import sqlite3
import pandas as pd

conn = sqlite3.connect('drug.db')
c = conn.cursor()

#giving an error on some lines but this skips those lines 
df = pd.read_csv('./drugbase/database_creation/FDAdata.txt', sep='\t', on_bad_lines='skip')

#to see first few 
#print(df.head())

#iterate through each row in the FDA product data 
for index, row in df.iterrows(): 
    id = row['ApplNo']
    name = row['DrugName']
    form = row['Form']

c.execute("""INSERT OR IGNORE INTO NBDrugs (DrugID, Name, Price, Purpose, ManID)
          VALUES (?, ?, ?, ?, ?)""", 
          (id, name, 0, 'info', None))
#need to figure out how to have a placeholder for the foriegn key manufacturer (FDA doesnt have this info)

conn.commit()
conn.close()