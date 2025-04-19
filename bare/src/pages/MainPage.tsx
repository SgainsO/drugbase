import React from 'react';
import Button from 'react-bootstrap/Button';
import DrugInfoCard from '../components/cards/clickDrug';
import MDrugInfoCard from '../components/cards/clickDisease';
import MultiInfoCard from '../components/cards/clickMulti';
import { fetchDrugData } from '../utils/api';

const MainPage: React.FC = () => {
  const [Search_Hold, ChangeSearchTerm] = React.useState<string>('');
  const [currentMode, ChangeMode] = React.useState<string>('drug');
  const [lastId, changeLastId] = React.useState<number>(0);
  const [minD, changeMinD] = React.useState<number>(2);
  const [currentApiData, changeApiData] = React.useState<any[]>([]);

  console.log(minD)
  React.useEffect(() => {
    const loadData = async () => {
      console.log(currentMode)
      const data = await fetchDrugData(Search_Hold, lastId, currentMode, minD);
      changeApiData(data);
      if (data.length > 0) {
        const idField = currentMode === 'disease' ? 'DiseaseID' : 'drugID';
        if (currentMode === 'disease')
          {
            changeLastId(data[data.length - 1][1]);
          } 
          else if(currentMode === 'drug')
          {
            changeLastId(data[data.length - 1][1]);
          }
          else
          {
            changeLastId(data[data.length - 1][1])
          }
        
      }
    };

    loadData();
    
  }, [Search_Hold, currentMode, minD]);

  const renderContent = () => {
    if (currentMode === 'drug') {
      return currentApiData.map((drug: any[], i: number) => (
        <DrugInfoCard
          key={i}
          name={drug[0]}
          drugID={drug[1]}
          genID={drug[2]}
          diseases={drug[3]}
          gPrice={drug[4]}
          dPrice={drug[5]}
        />
      ));
    } else if (currentMode === 'disease') {
      return currentApiData.map((disease: any[], i: number) => (
        <MDrugInfoCard
          key={i}
          GenName={disease[0]}
          DiseaseID={disease[1]}
          Gprice={disease[2]}
          DrugPrice={disease[3]}
          drugID={disease[4]}
          DiseaseName={disease[5]}
          DrugName={disease[6]}
        />
      ));
    } else if (currentMode === 'multi') {
      return currentApiData.map((entry: any[], i: number) => (
        <MultiInfoCard
          key={i}
          name={entry[0]}
          drugID={entry[1]}
          countOfDiseases={entry[2]}
          diseaseNames={entry[3]}
          manufacturerNames={entry[4]}
          price={entry[5]}
        />
      ));
    } else {
      return <p>Unknown mode</p>;
    }
  };

  const save = (result: string) => {
    ChangeSearchTerm(result);
  };

  const newAmDisease = (d : number) => {
    changeMinD(d)
    changeLastId(0)
    //Restart
    console.log(d)
  } 

  const newMode = () => {
    changeApiData([])
    if (currentMode === 'drug') {
      ChangeMode('disease');
    } else if (currentMode === 'disease') {
      ChangeMode('multi');
    } else {
      ChangeMode('drug');
    }
    changeLastId(0);
  };

  return (
    <div>
      <h1>Welcome to the bare drug base</h1>
      <button onClick={newMode}>Change Mode</button>
      <div className="content">
        <div className="search">
          
          { currentMode !== "multi" && (<input
            type="text"
            placeholder="Search..."
            onChange={(e) => save(e.target.value)}
            className="form-control"
          />)}
          { currentMode === "multi" &&
          (<input
            type="number"
            placeholder="Amount of Diseases"
            onChange={(e) => newAmDisease(parseInt(e.target.value))}
            className="form-control"
          /> )}
        </div>
        <Button>Previous</Button>
        <Button>Next</Button>
      </div>
      {renderContent()}
    </div>
  );
};

export default MainPage;
