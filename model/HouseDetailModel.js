import {DefaultModel} from "./DefaultModel";

// id 
export class HouseDetailModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "HouseDetailModel"
    }
    
    getIsLocal() {
        return false;
    }
}
