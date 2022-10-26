
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
const fs = require('fs');
( async() => { 
    
  var today = "2022-08-20"
  var today2 = "0820"
  var pesan =  []
  const dataTokoWT = await Controller.dataTokoWT();
  for(r of dataTokoWT){
    //console.log(r)
    const datanyawt = await Controller.DownloadWT(today,r.kdcab,r.kdtk,r.namatoko,`WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`)
    pesan.push(datanyawt)
  }
  console.log(`📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n Tanggal ${today}\n\n${pesan.join('\n')}`)
  

})();