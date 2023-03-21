
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
( async() => { 
    
  
  const data = await Controller.HarianTokoLiburCabang('g146')
  
  console.log(data)
  

})();