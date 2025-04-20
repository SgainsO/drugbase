import sqlite3

class database:
    def __init__(self):
        self.db = sqlite3.connect("fake.db")
        
    def Multi_Disease_Treatment_Search(self, num, min_diseases=2):
        """
        Find drugs that treat multiple diseases using HAVING clause
        This query finds drugs that treat at least min_diseases different diseases
        """
        cur = self.db.cursor()
        cur.execute("""
        SELECT nbd.Name, nbd.DrugID, COUNT(DISTINCT d.DiseaseID) as disease_count, 
               GROUP_CONCAT(DISTINCT d.Name) as diseases, 
               m.Name as manufacturer, nbd.price
        FROM NBDrugs AS nbd
        JOIN Treatment AS t ON t.DrugID = nbd.DrugID
        JOIN Disease AS d ON d.DiseaseID = t.DiseaseID
        JOIN Manufacturer AS m ON m.ManID = nbd.ManID
        WHERE nbd.DrugID > ?
        GROUP BY nbd.DrugID
        HAVING COUNT(DISTINCT d.DiseaseID) >= ?
        ORDER BY disease_count DESC, nbd.DrugID ASC
        LIMIT 8""", (num, min_diseases))
        results = cur.fetchall()
        cur.close()
        return results
    def Drug_Search_Mode_six(self, num, filter):
        cur = self.db.cursor() 
        cur.execute("""
        SELECT 
            nbd.Name AS name,
            nbd.DrugID AS drugID,
            g.GenID AS genID,
            GROUP_CONCAT(DISTINCT d.Name) AS diseases,
            g.price AS gPrice,
            nbd.price AS dPrice,
            g.Name AS gName
        FROM Manufacturer AS m
        JOIN NBDrugs AS nbd ON m.ManID = nbd.ManID
        JOIN Treatment AS t ON t.DrugID = nbd.DrugID
        JOIN DrugAlt as da ON da.DrugID = t.DrugID
        JOIN Generics AS g ON da.GenID = g.GenID
        JOIN Disease AS d ON d.DiseaseID = t.DiseaseID
        WHERE substr(nbd.Name, 1, ?) = ? AND nbd.DrugID > ?
        GROUP BY nbd.DrugID, g.Name, m.Name
        ORDER BY nbd.DrugID ASC
        LIMIT 8""",  (len(filter), filter, num))
        results = cur.fetchall()
        
        cur.close()
        return results
    def Disease_Search_Mode_six(self, num, filter):
        cur = self.db.cursor() 
        cur.execute("""SELECT 
                    g.Name AS GenName,
                    d.DiseaseID,
                    g.price AS Gprice,
                    nbd.price AS DrugPrice,
                    nbd.DrugID AS drugID,
                    d.Name AS DiseaseName,
                    nbd.Name AS DrugName
                    FROM Manufacturer AS m
                    JOIN NBDrugs AS nbd ON m.ManID = nbd.ManID
                    JOIN Treatment AS t ON t.DrugID = nbd.DrugID
                    JOIN DrugAlt as da ON da.DrugID = t.DrugID
                    JOIN Generics AS g ON da.GenID = g.GenID
                    JOIN Disease AS d ON d.DiseaseID = t.DiseaseID
                    WHERE substr(d.Name, 1, ?) = ? AND nbd.DrugID > ?
                    ORDER BY nbd.DrugID ASC
                    LIMIT 8""", (len(filter), filter, num))
        results = cur.fetchall()
        cur.close()
        return results

    def Get_Description_Drug(self, drugName):
        cur = self.db.cursor()
        cur.execute(
            """
            SELECT Purpose FROM NBDrugs WHERE Name = ?; 
            """, 
            (drugName,)
        ) 
        results = cur.fetchall()
        cur.close()
        return results


    def dev_insert_manufacturer(self, name):
        cur = self.db.cursor()
        cur.execute("SELECT MAX(ManID) FROM Manufacturer")
        max_id = cur.fetchone()[0]
        new_id = 1 if max_id is None else max_id + 1
        
        cur.execute("INSERT INTO Manufacturer (ManID, Name) VALUES (?, ?)", 
                   (new_id, name))
        self.db.commit()
        cur.close()
        return new_id

    def dev_insert_drug(self, name, price, purpose, man_id):
        cur = self.db.cursor()
        cur.execute("SELECT MAX(DrugID) FROM NBDrugs")
        max_id = cur.fetchone()[0]
        new_id = 1 if max_id is None else max_id + 1
        
        cur.execute("""
            INSERT INTO NBDrugs (DrugID, Name, Price, Purpose, ManID) 
            VALUES (?, ?, ?, ?, ?)
        """, (new_id, name, price, purpose, man_id))
        self.db.commit()
        cur.close()
        return new_id

    def dev_insert_generic(self, name, price, purpose):
        cur = self.db.cursor()
        cur.execute("SELECT MAX(GenID) FROM Generics")
        max_id = cur.fetchone()[0]
        new_id = 1 if max_id is None else max_id + 1
        
        cur.execute("""
            INSERT INTO Generics (GenID, Name, Price, Purpose) 
            VALUES (?, ?, ?, ?)
        """, (new_id, name, price, purpose))
        self.db.commit()
        cur.close()
        return new_id

    def dev_insert_treatment(self, disease_id, drug_id, gen_id):
        cur = self.db.cursor()
        cur.execute("""
            INSERT INTO Treatment (DiseaseID, DrugID) 
            VALUES (?, ?)
        """, (disease_id, drug_id))
        cur.execute("INSERT INTO DrugAlt (DrugID, GenID) VALUES (?,?)", (drug_id, gen_id))
        self.db.commit()
        cur.close()
        return True

    def dev_get_all_manufacturers(self):
        cur = self.db.cursor()
        cur.execute("SELECT * FROM Manufacturer ORDER BY ManID")
        results = cur.fetchall()
        cur.close()
        return results

    def dev_get_all_diseases(self):
        cur = self.db.cursor()
        cur.execute("SELECT * FROM Disease ORDER BY DiseaseID")
        results = cur.fetchall()
        cur.close()
        return results

    def dev_get_all_drugs(self):
        cur = self.db.cursor()
        cur.execute("SELECT DrugID, Name FROM NBDrugs ORDER BY DrugID")
        results = cur.fetchall()
        cur.close()
        return results

    def dev_get_all_generics(self):
        cur = self.db.cursor()
        cur.execute("SELECT GenID, Name FROM Generics ORDER BY GenID")
        results = cur.fetchall()
        cur.close()
        return results

    def dev_update_manufacturer_name(self, man_id, new_name):
        cur = self.db.cursor()
        cur.execute("UPDATE Manufacturer SET Name = ? WHERE ManID = ?", 
                   (new_name, man_id))
        self.db.commit()
        cur.close()
        return True

    def dev_delete_drug_cascade(self, drug_id):
        cur = self.db.cursor()
        
        cur.execute("DELETE FROM Treatment WHERE DrugID = ?", (drug_id,))
        cur.execute("DELETE FROM DrugAlt WHERE DrugID = ?", (drug_id,))
        cur.execute("DELETE FROM NBDrugs WHERE DrugID = ?", (drug_id,))

        self.db.commit()
        cur.close()
        return True

test = database()
print(test.Drug_Search_Mode_six(0,"Acu"))
print(test.Disease_Search_Mode_six(0, "Arthritis"))
