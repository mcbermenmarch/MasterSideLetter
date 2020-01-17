export class Fund {
  id: number;
  name: string;
  sponsorId: number;
  sponsorName: string;
  strategyId: number;
  strategyName: string;
  businessUnitId: number;
  businessUnitName: string;
  year: number;
  size: number;
  mslFileName: string;
  mfnFileName: string;
  isFavorite: boolean;
  lastAccessedDate: Date;
  isEditing?: boolean;
  isReadOnly?: boolean;
  isNew?: boolean;
  isSelected?: boolean;

}

