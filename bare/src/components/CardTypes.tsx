export type Disease = {
    GenName: string;
    DiseaseID: number;
    Gprice: number;
    DrugPrice: number;
    drugID: number;
    DiseaseName: string;
    DrugName: string;
  };

export type Drug = {
    name: string;
    drugID: number;
    genID: number;
    diseases: string; // This will be a comma-separated string unless you split it
    gPrice: number;
    dPrice: number;
  };

export type Multi = {
        name: string;
        drugID: number;
        countOfDiseases: number;
        diseaseNames: string;
        manufacturerNames: string;
        price: number;
}
