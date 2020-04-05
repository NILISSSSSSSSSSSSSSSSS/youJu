import {DefaultModel} from "./DefaultModel";


// 委托签订 页面参数
export class StandingOrderModel extends DefaultModel{
    constructor() {
        super();
    }
    
    getKey() {
        return "StandingOrderModel"
    }
    
    getIsLocal() {
        return false;
    }
}

// 带看房源 页面参数
export class TakeLookHouseModel extends DefaultModel{
    constructor() {
        super();
    }
    
    getKey() {
        return "TakeLookHouseModel"
    }
    
    getIsLocal() {
        return false;
    }
}