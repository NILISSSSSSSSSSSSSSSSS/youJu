import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 楼盘图库
export class GetLouPanTuKuList extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getBuildPhotoList";
    }
}
