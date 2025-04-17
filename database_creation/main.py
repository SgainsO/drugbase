import setup
import populateDB

def main(): 
    print("Creating tables...")
    setup.create_tables()

    print("Populating tables...")
    populateDB.populate()

if __name__ == "__main__": 
    main()
