

const Controller = require("./controllers/controller.js");
const fs = require("fs");
( async() => { 
  
    const data_co = await Controller.coResolved()
    for(let r_co of data_co){
        console.log(r_co.id_chat)
        let pesanResolved = `\`\`\`Segera Tutup CO Resolved Anda!!\nNo Komplain: ${r_co.No_Komplain}\nToko: ${r_co.Toko}\nTgl Selesai Cbg: ${r_co.tanggal_selesai}\nCO Toko: ${r_co.co_toko}\n\nJawaban CO Relasi: ${r_co.jawaban_cabang}\`\`\``
        //await client.sendText(r_co.id_chat, pesanResolved);  

        console.log(`Task CO Resolved - Ada :: ${pesanResolved}`)  
            
    }
                    
     

})();