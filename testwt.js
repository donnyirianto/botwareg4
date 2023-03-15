
const Controller = require("./controllers/controller.js");
( async() => { 
    
  const data = await Controller.HarianTampungCabang("G004");
  
  console.log(data)
  

})();