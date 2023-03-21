
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
( async() => { 
    
  
  const data = await Controller.HarianTokoLiburToko('F08C')
  
  console.log(data)
  

})();