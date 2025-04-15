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
        SELECT nbd.Name, nbd.DrugID, g.Name,
                     GROUP_CONCAT(DISTINCT d.Name),
                     m.Name, g.price, nbd.price 
        FROM Manufacturer AS m
        JOIN NBDrugs AS nbd ON m.ManID = nbd.ManID
        JOIN Treatment AS t ON t.DrugID = nbd.DrugID
        JOIN Generics AS g ON t.GenID = g.GenID
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
        cur.execute("""SELECT d.DiseaseID, g.Name, d.Name, m.Name, g.price, nbd.price 
                    FROM Manufacturer AS m
                    JOIN NBDrugs AS nbd ON m.ManID = nbd.ManID
                    JOIN Treatment AS t ON t.DrugID = nbd.DrugID
                    JOIN Generics AS g ON t.GenID = g.GenID
                    JOIN Disease AS d ON d.DiseaseID = t.DiseaseID
                    WHERE substr(d.Name, 1, ?) = ? AND nbd.DrugID > ?
                    ORDER BY nbd.DrugID ASC
                    LIMIT 8""", (len(filter), filter, num))
        results = cur.fetchall()
        cur.close()
        return results

    
test = database()
print(test.Drug_Search_Mode_six(0,"Acu"))
print(test.Disease_Search_Mode_six(0, "Arthritis"))
