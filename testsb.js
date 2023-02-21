
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
const fs = require('fs');
( async() => { 
    
  var today = "2023-02-20"
  var today2 = "0820"
  var pesan =  []
  
  await Controller.DownloadWT(today,"G004","F04r","Sukosari",`WT${today2}F.04R`)
  
  console.log(`📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n Tanggal ${today}\n\n${pesan.join('\n')}`)
  

})();