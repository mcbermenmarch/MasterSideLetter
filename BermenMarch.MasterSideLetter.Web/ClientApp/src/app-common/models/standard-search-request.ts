export class StandardSearchRequest {
  targetText: string;
  fundSearchLimit: number = 10;
  investorSearchLimit: number = 10;
  sideLetterSearchLimit: number = 10;
  provisionSearchLimit: number = 10;
  sponsorValues: string[];
  businessUnitValues: string[];
  strategyValues: string[];
  investorTypeValues: string[];
  entityValues: string[];
  counselValues: string[];
  sizeMin: number;
  sizeMax: number;
  yearMin: number;
  yearMax: number;
  aggregateSizeMin: number;
  aggregateSizeMax: number;

  constructor(public searchCategory: string = 'All',
    public fundId: number = null,
    public investorId: number = null,
    public fundInvestorIds: number[] = null) {

  }
}
