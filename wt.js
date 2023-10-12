

const Controller = require("./controllers/controller.js");
const fs = require("fs");
( async() => { 
  
    try {
        const data_co = await Controller.DownloadWT("2023-10-11","G004","F04r","Sukosari","WT231011F.04R")    
        console.log(data_co)
    } catch (error) {
        console.log(error)
    }
    
    
                    
     

})();