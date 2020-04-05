import {DefaultModel} from "./DefaultModel";


export class BehaviorPageConfigModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "BehaviorPageInfo"
    }
    
    getIsLocal() {
        return true;
    }
}
