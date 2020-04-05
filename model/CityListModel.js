import {DefaultModel} from "./DefaultModel";


export class CityListModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CityListDetail"
    }
    
    getIsLocal() {
        return true;
    }
}
