import {DefaultModel} from "./DefaultModel";

// 用户统计次数的model
export class StoreCountModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "StoreCountModel"
    }
}
