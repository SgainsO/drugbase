import sqlite3

class database:
    def __init__(self):
        self.db = sqlite3.connect("fake.db")
        self.last = -1  # This will hold the last thing for implementing search

    def Drug_Search_Mode_six(self, num, filter):
        cur = self.db.cursor()
        lenOfFilter = len(filter)
        cur.execute(
            """SELECT nbd.DrugID, g.Name, d.Name, m.Name 
               FROM Manufacturer AS m
               JOIN NBDrugs AS nbd ON m.ManID = nbd.ManID
               JOIN Treatment AS t ON t.DrugID = nbd.DrugID
               JOIN Generics AS g ON t.GenID = g.GenID
               JOIN Disease AS d ON d.DiseaseID = t.DiseaseID
               WHERE substr(g.Name, 1, ?) = ? AND nbd.DrugID > ?
               ORDER BY nbd.DrugID ASC
               LIMIT 6""",
            (lenOfFilter, filter, num)
        )
        results = cur.fetchall()
        cur.close()
        return results

    def Disease_Search_Mode_six(self, num, filter):
        cur = self.db.cursor()
        lenOfFilter = len(filter)
        cur.execute(
            """SELECT nbd.DrugID, g.Name, d.Name, m.Name 
               FROM Manufacturer AS m
               JOIN NBDrugs AS nbd ON m.ManID = nbd.ManID
               JOIN Treatment AS t ON t.DrugID = nbd.DrugID
               JOIN Generics AS g ON t.GenID = g.GenID
               JOIN Disease AS d ON d.DiseaseID = t.DiseaseID
               WHERE substr(d.Name, 1, ?) = ? AND nbd.DrugID > ?
               ORDER BY nbd.DrugID ASC
               LIMIT 6""",
            (lenOfFilter, filter, num)
        )
        results = cur.fetchall()
        cur.close()
        return results


test = database()


drug_results = test.Drug_Search_Mode_six(0, "Generic")
print("Drug search results:", drug_results)


disease_results = test.Disease_Search_Mode_six(0, "Flu")
print("Disease search results:", disease_results)
