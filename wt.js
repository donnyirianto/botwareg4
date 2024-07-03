

const Controller = require("./controllers/controller.js");
const fs = require("fs");
( async() => { 
    try {
        const data = [
            ""
        ]
        for(let r of data){
            const tanggal = dayjs(r.tanggal).format("YYMMDD")
            const namafile = `WT${dayjs(r.tanggal).format("YYMMDD")}${r.toko.substring(0,1)}.${r.toko.substring(1,3)}`

            await Controller.DownloadWT2(tanggal,r.kdcab,r.toko,"X",namafile,r.docno)    
        }
        
        
    } catch (error) {
        console.log(error)
    }
})();