

const Controller = require("./controllers/controller.js");
const fs = require("fs");
( async() => { 
    try {
        const data_co = await Controller.DownloadWT("240414","g004","f04r","X","WT240414")    
        console.log(data_co)
    } catch (error) {
        console.log(error)
    }
})();