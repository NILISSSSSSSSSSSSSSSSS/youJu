import {RequestApi, RequestApiItem} from "../../utils/RequestApi";

// 获取经纪人信息
export class GetArchiveInfo{
    responseData = {};
    constructor(responseData) {
        this.responseData = responseData;
    }

    send() {
        return new GetArchiveInfoRequest(this.responseData).send()
            // .then(res => {
            //     let obj = {};
            //     let data = res.data || {};
            //     for (let key in data) {
            //         obj[key] = data[key];
            //     }
            //     obj.data = data;
            //     return obj;
            // });
    }
}
class GetArchiveInfoRequest extends RequestApi{
    constructor(responseData) {
        let item = new RequestApiItem();
        item.domain = "kaidanbao";
        item.data = responseData;
        super(item);
    }

    getUrl() {
        return "/Mini/App/getArchiveInfo";
    }
}
