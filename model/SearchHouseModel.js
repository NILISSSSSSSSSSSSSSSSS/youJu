import {DefaultModel} from "./DefaultModel";


export class SearchHouseModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "SearchHouseModel"
    }
    
    getIsLocal() {
        return false;
    }
}
