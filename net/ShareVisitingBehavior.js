import {RequestApi, RequestApiItem} from "../utils/RequestApi";

export class ShareVisitingBehavior extends RequestApi{
  constructor(responseData) {
      let item = new RequestApiItem();
      item.domain = "uuhf";
      item.data = responseData;
      item.method = "post";
      item.header = 'application/json';
      super(item);
  }

  getUrl() {
      return "/uuhfWeb/openApi/statistic/shareVisiting/behavior";
  }
}

// export class LogRecord extends RequestApi{
//   constructor(responseData) {
//       let item = new RequestApiItem();
//       item.domain = "uuweb";
//       item.data = responseData;
//       super(item);
//   }

//   getUrl() {
//       return "/Mini/LogRecord/logRecord";
//   }
// }
