import {DefaultModel} from "./DefaultModel";

// 抢单优化 - 委托优惠券
export class EntrustRedpackagesModel extends DefaultModel {
    constructor() {
        super();
    }

    getKey() {
        return "EntrustRedpackagesModel"
    }
    
    getIsLocal() {
        return true;
    }
    
}
