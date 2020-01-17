import { HttpService } from '../../app-common/services';
import { ServiceConstants } from '../../app-common/constants/service.constant';
declare const Mark: any;

export class SearchTools {
  public highlight(http: HttpService, text: string, container: HTMLElement) {
    if (text && text.length > 0) {
      http.get(ServiceConstants.SearchApiUrl + '/GetPhrases/' + text).subscribe((results) => {
        const elements = Array.from(container.getElementsByClassName("highlight-text"));
        for (var element of elements) {
          var instance = new Mark(element);
          for (var result of results) {
            instance.mark(result, { separateWordSearch: false });
          }
        }
      });
    }
  }
}


