//https://github.com/DataGarage/node-xls-json
//use node.js to convert from xls to json
var node_xj = require("xls-to-json");
node_xj({
    input: "material.xls",  // input xls 
    output: "Elements.json", // output json 
    sheet: "Elements"  // specific sheetname 
}, function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
node_xj({
    input: "material.xls",  // input xls 
    output: "Materials.json", // output json 
    sheet: "Materials"  // specific sheetname 
}, function(err, result) {
    if(err) {
        console.error(err);
    } else {
        console.log(result);
    }
});
