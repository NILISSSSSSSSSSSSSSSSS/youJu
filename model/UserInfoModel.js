import {DefaultModel} from "./DefaultModel";

// 包含me，userInfo: {userInfo: {}, 其他的}, telephone, 
export class UserInfoModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "UserInfoDetail"
    }
    
    getIsLocal() {
        return true;
    }
}
