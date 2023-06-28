

const Controller = require("./controllers/controller.js");
const fs = require("fs");
( async() => { 
  
    const data_harian_koneksi = await Controller.DataHarianKoneksi();
    console.log(data_harian_koneksi) 
     

})();