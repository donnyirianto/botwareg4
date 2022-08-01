
const Controller = require("./controllers/controller.js");
const dayjs = require("dayjs");
const fs = require('fs');
( async() => { 
    
    var today = dayjs().format("YYYY-MM-DD")
    //var today2 = dayjs().format("MMDD")
    var today2 = "0731"
        /*
    await Controller.DownloadWT("2022-07-30","G236","T84M",`WT${today2}T.84M`)

    await Controller.DownloadWT(today,"G236","TBZF",`WT${today2}T.BZF`) 
    await Controller.DownloadWT(today,"G236","THOD",`WT${today2}T.HOD`) 
    await Controller.DownloadWT(today,"G236","TX3U",`WT${today2}T.X3U`) 
    await Controller.DownloadWT(today,"G236","T1KT",`WT${today2}T.1KT`) 
    await Controller.DownloadWT(today,"G236","T1KT",`WT${today2}T.1KT`) 
    await Controller.DownloadWT(today,"G236","THM9",`WT${today2}T.HM9`) 
    await Controller.DownloadWT(today,"G236","TXYX",`WT${today2}T.XYX`) 
    await Controller.DownloadWT(today,"G236","TW87",`WT${today2}T.W87`) 
    await Controller.DownloadWT(today,"G236","T4ZW",`WT${today2}T.4ZW`) 
    await Controller.DownloadWT(today,"G236","TC0Z",`WT${today2}T.C0Z`) 
    await Controller.DownloadWT(today,"G236","TP9O",`WT${today2}T.P9O`) 
    await Controller.DownloadWT(today,"G236","TFIG",`WT${today2}T.FIG`) 
    await Controller.DownloadWT(today,"G236","TW4T",`WT${today2}T.W4T`) 
    */
    if (fs.existsSync(`./filewt/WT${today2}T.YJO`)) {
        // enter the code to excecute after the folder is there.
        console.log("File Ditemukan")
      }
      else{
        // Below code to create the folder, if its not there
       console.log("Tidak ada File")
      }
 
    console.log("Sukses")
})();