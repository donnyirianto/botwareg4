
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
( async() => { 
    
  
  const data = await Controller.absenPbbh()
  
  console.log(data)
  

})();