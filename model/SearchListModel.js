import {DefaultModel} from "./DefaultModel";


export class SearchListModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "searchListDetail"
    }
    
    getIsLocal() {
        return true;
    }
}
