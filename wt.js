

const Controller = require("./controllers/controller.js");
const fs = require("fs");
( async() => { 
    try {
        const data_co = await Controller.HarianTokoLiburCabang("g034")    
        console.log(data_co)
    } catch (error) {
        console.log(error)
    }
})();