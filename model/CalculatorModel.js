import {DefaultModel} from "./DefaultModel";

// , 
export class CalculatorModel extends DefaultModel{
    constructor() {
        super();
    }

    getKey() {
        return "CalculatorModel"
    }
    
    getIsLocal() {
        return false;
    }
}
