import { environment } from '../../environments/environment';
const uiApiUrl = environment.baseUrl + '/api';

export class ServiceConstants {
  public static FundApiUrl = uiApiUrl + '/fund';
  public static InvestorApiUrl = uiApiUrl + '/investor';
  public static BusinessUnitApiUrl = uiApiUrl + '/businessunit';
  public static FundInvestorApiUrl = uiApiUrl + '/fundinvestor';
  public static ProvisionApiUrl = uiApiUrl + '/provision';
  public static SearchApiUrl = uiApiUrl + '/search';
  public static SettingsApiUrl = uiApiUrl + '/settings';
}
