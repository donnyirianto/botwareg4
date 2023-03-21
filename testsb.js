
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
( async() => { 
    
  
  const data = await Controller.cekHarianToko('F08C')
  
  console.log(data)
  

})();