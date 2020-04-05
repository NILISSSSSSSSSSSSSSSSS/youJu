import {DefaultModel} from "../DefaultModel";


export class UnReadMsgModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "UnReadMsgModel"
    }
    
    getIsLocal() {
        return true;
    }
}
