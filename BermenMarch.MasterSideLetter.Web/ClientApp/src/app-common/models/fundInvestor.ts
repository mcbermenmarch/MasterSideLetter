export class FundInvestor {
  id: number;

  investorId: number;
  investorName: string;
  investorType: string;

  fundId: number;
  fundName : string;
  fundSponsorName: string;
  fundBusinessUnitName: string;
  fundStrategyName: string;
  fundYear: number;
  fundSize: number;

  entity: string;
  commitment: string;
  counsel: string;
  notes: string;
  sideLetterFileName: string;

  isEditing?: boolean;
  isReadOnly?: boolean;
  isNew?: boolean;
  isSelected?: boolean;

  constructor() {
    this.id = 0;
  }
}
