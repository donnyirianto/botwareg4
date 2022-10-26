const wa = require('@open-wa/wa-automate');
var cron = require('node-cron');
const fs = require('fs');
var dayjs = require("dayjs");
const Controller = require("./controllers/controller.js");
const conn_ho = require('./services/dbho');

// LIST TASK ======== 
var taskPBReq30 = true
var taskPBHOLD = true
var taskGagalRoReg = true
var taskDataHarianKoneksi = true
var taskHarianTampung = true 
var taskHarianIris = true
var taskPBHOLDEDP = true
var taskPBHOLDCabang = true
var taskOto = true
var taskOto = true
var taskExportWT = true
//var taskUpdRecid = true
var taskRekapHold = true
var taskDataHarianjam9 = true
// LIST CONTACT ======== 
const group_testbot = `120363038749627074@g.us`
// const group_ho_pbro = `628999226654-1461653082@g.us`;
// pmconst group_ho_igr = `xx628999226654-1461653082@g.us`;
const group_edpreg_mgrspv = "6287745821811-1585040124@g.us";
const user_reg4_imam = `6285855835780@c.us`
const user_reg4_donny = `6282137098104@c.us`
const user_reg4_panca = `6282230158808@c.us`
const user_reg4_gama = `6281999186169@c.us`
const user_reg4_fariz = `628563600323@c.us`
const user_reg4_rianto = `6285645595869@c.us`
const user_reg4_putra = `6283847102754@c.us`


// ================================
wa.create({
    sessionId: "EDPREG4mlg",
    multiDevice: true, //required to enable multiDevice support
    authTimeout: 0, //wait only 60 seconds to get a connection with the host account device
    blockCrashLogs: true,
    disableSpins: true,
    headless: true,
    hostNotificationLang: 'PT_BR',
    logConsole: true,
    popup: true,
    qrTimeout: 0, //0 means it will wait forever for you to scan the qr code
    restartOnCrash: start, 
    cacheEnabled: false, 
    useChrome: true, 
    killProcessOnBrowserClose: true, 
    throwErrorOnTosBlock: false, 
    chromiumArgs: [ '--no-sandbox', 
                    '--disable-setuid-sandbox', 
                    '--aggressive-cache-discard', 
                    '--disable-cache', '--disable-application-cache', 
                    '--disable-offline-load-stale-cache', 
                    '--disk-cache-size=0' 
    ]
}).then(client => start(client));

async function start(client) {
    
    
    const Irisshortcut = `👋 *Selamat Datang,*
    *_Silahkan Ketik Angka Berikut Sesuai Format pada Contoh :_*
    1. Server Iris 
    2. Server Tampung 
    3. Peletakan File Harian Salah Server
    4. Absensi File Harian Toko Libur
    5. Download WT Toko

    *_Contoh:_*
    1 (ketik 1 untuk Absensi Iris)
    2 (ketik 2 untuk Absensi Server Tampung)
    1 G001 (ketik 1 KODECABANG untuk Absensi Iris Per Cabang)
    2 G001 (ketik 2 KODECABANG untuk Absensi Tampung Per Cabang)
    4 G001 (ketik 4 KODECABANG untuk Absensi File Harian Toko Libur)
    5 G237 TDHB 2022-08-20 (ketik 5 KODECABANG KODETOKO TANGGAL untuk download WT Toko)
    `
    const IrisNotice = `👋Maaf, Pesan Anda tidak dapat kami proses. silahkan jawab dengan format\n\nKDTK OK \nAtau\nKDTK HOLD\n\n Terima kasih.`
    
    client.onMessage(async (message) => {
        try{
            console.log(message.from);
        
            var Inpesan = message.body.toUpperCase()        
            var pesan = Inpesan.split(" ")  
            
            const cekcabang = await Controller.cekCabang(message.from)

            if(pesan[0] === "IRISID"){
                    
                await client.sendText(message.from, `ID Anda:` + message.from);
                    
            }
            
            if(cekcabang.length > 0 || message.from === group_testbot){
                
                if(pesan[0] === "TAG"){
                    console.log("TAG")
                        
                    var a = message.author.split("@");
                    var usermention = `@${a[0]}`
                    const jam = dayjs().format("HH")
                    if(jam > 5 && jam < 12){ 
                        await client.sendTextWithMentions(message.from,`Selamat Pagi Pak ${usermention}, ada yg bisa kami bantu?`); 
                    }else if(jam > 11 && jam < 16){
                        await client.sendTextWithMentions(message.from,`Selamat Siang Pak ${usermention}, ada yg bisa kami bantu?`); 
                    }else if(jam > 15 && jam < 19){
                        await client.sendTextWithMentions(message.from,`Selamat Sore Pak ${usermention}, ada yg bisa kami bantu?`); 
                    }else{
                        await client.sendTextWithMentions(message.from,`Selamat Malam Pak ${usermention}, ada yg bisa kami bantu?`); 
                    }
                
                } 

                if(pesan[0].length === 4 && pesan.length === 2){
                    
                    switch (pesan[1]) {
                        case 'OK':
                            console.log("OK")
                                const teruskanpb = await Controller.TeruskanPB(pesan[0])
                                if(teruskanpb != "None"){
                                    await client.sendText(message.from, teruskanpb);
                                } 
                            break; 
                        case 'HOLD':
                            console.log("HOLD")
                                const holdpb = await Controller.HoldPB(pesan[0])
                                if(holdpb != "None"){
                                    await client.sendText(message.from, holdpb);
                                } 
                            break; 
                            
                        default:
                            console.log("Group Cabang : No Data")
                            //await client.sendText(message.from, IrisNotice);
                            break;
                    }
                } 
                
            }else{
                
                    //if(message.from != "628888300878-1455854663@g.us" || message.from != "628999226654-1461653082@g.us" || message.from !="6287745821811-1585040124@g.us ||")
                    if(message.from.split("@")[1] != "g.us")
                    {
                        if(pesan[0].length === 4 && pesan.length === 2){
                    
                            switch (pesan[1]) {
                                case 'OK':
                                    console.log("OK")
                                        const teruskanpb = await Controller.TeruskanPB(pesan[0])
                                        if(teruskanpb != "None"){
                                            await client.sendText(message.from, teruskanpb);
                                        } 
                                    break; 
                                case 'HOLD':
                                    console.log("HOLD")
                                        const holdpb = await Controller.HoldPB(pesan[0])
                                        if(holdpb != "None"){
                                            await client.sendText(message.from, holdpb);
                                        } 
                                    break; 
                                    
                                default:
                                    console.log("Group Cabang : No Data")
                                    //await client.sendText(message.from, IrisNotice);
                                    break;
                            }
                        } 

                        switch (pesan[0]) {
                            case 'START':
                                await client.sendText(message.from, Irisshortcut);
                                
                                break;  
                
                            case '1':
                                await client.sendText(message.from, "🕛 Mohon ditunggu, kami sedang proses data");
                                if(typeof pesan[1] === "undefined"){ 
                                    const res1 = await Controller.HarianIris()
                                    await client.sendText(message.from, res1);
                                    
                                }else{
                                    const res1 = await Controller.HarianIrisCabang(pesan[1])
                                    await client.sendText(message.from, res1);
                                }
                
                                break;
                            
                            case '2':
                                
                                await client.sendText(message.from, "🕛 Mohon ditunggu, kami sedang proses data");
                                if(typeof pesan[1] === "undefined"){
                                    const res2 = await Controller.HarianTampung()
                                    await client.sendText(message.from, res2);
                                }else{
                                    const res2 = await Controller.HarianTampungCabang(pesan[1])
                                    await client.sendText(message.from, res2);
                                }
                                break; 
                            
                            case '3':
                                    const res3 = await Controller.HarianSalah()
                                    await client.sendText(message.from, res3);
                                    break; 
                            
                            case '4':
                                    await client.sendText(message.from, "🕛 Mohon ditunggu, kami sedang proses data");
                                    if(typeof pesan[1] === "undefined"){
                                        const res4 = await Controller.HarianTokoLibur()
                                        await client.sendText(message.from, res4);
                                    }else{
                                        const res4 = await Controller.HarianTokoLiburCabang(pesan[1])
                                        await client.sendText(message.from, res4);
                                    } 
                                    break; 
                            
                            case '5':
                                    
                                    if(typeof pesan[1] === "undefined"){
                                        await client.sendText(message.from, "Format Anda Salah!!");
                                    }else{
                                        
                                        var today = pesan[3]
                                        var today2 = `${pesan[3].substr(5,2)}${pesan[3].substr(8,2)}`
                                        
                                        const kdcab = pesan[1]
                                        const kdtk = pesan[2]

                                        const pesanwa= await Controller.DownloadWT(today,kdcab,kdtk,'', `WT${today2}${kdtk.substr(0,1)}.${kdtk.substr(1,3)}`)                                        
                                        
                                        if (fs.existsSync(`./filewt/WT${today2}${kdtk.substr(0,1)}.${kdtk.substr(1,3)}`)) {
                                            await client.sendFile(message.from, `./filewt/WT${today2}${kdtk.substr(0,1)}.${kdtk.substr(1,3)}`, `WT${today2}${kdtk.substr(0,1)}.${kdtk.substr(1,3)}`, `File WT ${kdtk}`)
                                        } 
                                         
                                        await client.sendText(message.from, `📚 *Hasil Export WT*\n${pesanwa}`);
                                        
                                    } 
                                    break;
                
                            default:
                                console.log("GROUP IRIS : No Data")
                                break;
                        }
                    }
                    
                console.log("Guys Chat : " + message.from )
            } 
        } catch(error){
            console.log(`WARNIIIINGGGG!!!!!!!`);
            console.log(`--------------------------------------------------------`);
            console.log(error);
            console.log(`--------------------------------------------------------`);
        }
         
    }) 
     /* 
    ==================================================================================
    ANCHOR                                 ON SCHEDULE
    ==================================================================================
    ==================================================================================
    ==================================================================================
    */
 
    cron.schedule('00 12,20 * * *', async() => { 
        console.log("Kirim Informasi Rekap PB Hold : " + dayjs().format("YYYY-MM-DD HH:mm:ss"))     
        if (taskRekapHold) { 
            taskRekapHold = false    
                try {         
                     
                    const data_rekap_hold_am = await Controller.HitungRekapHold();
    
                    if(data_rekap_hold_am != "None" && data_rekap_hold_am.length > 0){
                
                        const groupBy = (items, key) => items.reduce(
                                (result, item) => ({
                                ...result,
                                [item[key]]: [
                                    ...(result[item[key]] || []),
                                    item,
                                ],
                                }), 
                            {},
                          );
                        
                        const grouped = await groupBy(data_rekap_hold_am, "dc");
                        
                        for(r of Object.keys(grouped)){
                            var pesan = []
                            //var kdcabx = r
                            var am_tidak_jawab = []
                            const bm = await Controller.getBM(r)
                            var header = ``

                            if(bm.length > 0 ){
                                if(bm[0].id_chat === "-"){
                                    header = `*Bapak ${bm[0].nama}*\nBerikut kami sampaikan\n*Rekap Action PBHOLD - ${r}*\n*Tanggal ${dayjs().format("DD MMM YYYY")}*\n\n`
                                }else{
                                    header = `*Bapak ${bm[0].nama}* @${bm[0].id_chat} \nBerikut kami sampaikan\n*Rekap Action PBHOLD - ${r}*\n*Tanggal ${dayjs().format("DD MMM YYYY")}*\n\n`
                                }
                            }else{
                                header = `*Berikut kami sampaikan\n*Rekap Action PBHOLD - ${r}*\n*Tanggal ${dayjs().format("DD MMM YYYY")}*\n\n`
                            }

                            const dataku = await data_rekap_hold_am.filter(item => item.dc === r)
                            
                            dataku.map( async (r)=>{
                                if(r.total_non_konfirm > 0){
                                  am_tidak_jawab.push(`- *${r.am}* Yg diteruskan by sistem: ${r.total_non_konfirm}`)
                                }
                                pesan.push(`*${r.am}*\nJml toko PBHOLD : ${r.total}\nYg dikonfirmasi : ${r.total_konfirm}\nYg diteruskan by sistem: ${r.total_non_konfirm}\n`)
                            })
                            
                            const respons = `${header}${pesan.join(" \n")}\nRekap AM yang tidak memberikan Konfirmasi:\n${am_tidak_jawab.join(" \n")}`
                            
                            if(dataku[0].id_group != "" && dataku.length > 0){
                                if(bm.length > 0 ){
                                    if(bm[0].id_chat === "-"){
                                        await client.sendText(dataku[0].id_group, respons);
                                    }else{
                                        await client.sendTextWithMentions(dataku[0].id_group, respons);
                                    }
                                }else{
                                    await client.sendText(dataku[0].id_group, respons);
                                }
                                
                                console.log("Kirim Pesan ke Group WA", dataku[0].dc, dataku[0].id_group)
                            }
                            
                        }
                    }else{
                        console.log("Data rekap kosong")
                    }
                    taskRekapHold = true
                    console.log("[END] Sukses - Kirim Informasi Rekap PB Hold :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
            } catch (err) {
                    console.log("[END] ERROR !!! Kirim Informasi Rekap PB Hold :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskRekapHold = true
                    console.log(err);
            }
          } 
    }); 
    
    // Penjawabamn Otomatis 15 menit
    cron.schedule('*/2 * * * *', async() => { 
        
          if (taskOto) { 
            taskOto = false    
                try {         
                    const data_otox = await Controller.AkunCabangOto() 

                    for(roto of data_otox){  
                        var id_chat = roto.id_chat === "" ? "" : `@${roto.id_chat}`
                        //var pesan_oto = `Bapak ${roto.am} ${id_chat}\n📈 (${roto.dc}) ${roto.toko}-${roto.namatoko}\nTanggal PB: ${roto.tanggal}\nPB-FT : ${roto.nilaipb}\nAVG Sales :  ${roto.avgsales}\nAkan kami *Teruskan* karena informasi kami telah lebih dari 15 menit belum mendapat jawaban.`
                        var pesan_oto_for_am = `Bapak ${roto.am}\n📈 (${roto.dc}) ${roto.toko}-${roto.namatoko}\nTanggal PB: ${roto.tanggal}\nPB-FT : ${roto.nilaipb}\nAVG Sales :  ${roto.avgsales}\nAkan kami *Teruskan* karena informasi kami telah lebih dari 15 menit belum mendapat jawaban.`
                        var r_data_oto  = await Controller.updateDataOto(roto.dc,roto.toko,roto.taskid)
                        if(r_data_oto === "Sukses" && roto.id_group != ""){
                            
                            if( roto.id_chat !=""){
                                try {
                                    await client.sendText(`${roto.id_chat}@c.us`, pesan_oto_for_am);    
                                } catch (error) {
                                    console.log("ERROR Penjawaban OTO: " + error)
                                }
                                
                                console.log(`${roto.id_chat}@c.us`, pesan_oto_for_am)    
                            }
                            

                        } 
                    }
                   
                    taskOto = true

            } catch (err) {
                    console.log("[END] ERROR !!! Update Otomatis PBHOLD Cabang :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskOto = true
                    console.log(err);
            }
          } 
    });

    /* 
    ============================================
    ANCHOR Pengecekan Request PBHOLD Jagaan 5x SPD Ke Grup Cabang 
    ============================================
    */
    cron.schedule('*/24 * * * * *', async() => { 
        //( async() => {    
          if (taskPBHOLDCabang) { 
                taskPBHOLDCabang = false    
                //console.log("[START] INFO Request PBHOLD Cabang: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         
                    
                    const akunCabang = await Controller.AkunCabang()
                    
                    for(var r_akun of akunCabang){ 

                        const data_pb_hold_cabang = await Controller.DataPbHoldCabang(r_akun.toko);
                        console.log(data_pb_hold_cabang)
                        if(data_pb_hold_cabang != "None"){
                            //console.log(data_pb_hold_cabang)
                            //await client.sendTextWithMentions(r_akun.id_group, data_pb_hold_cabang.data);

                            if(data_pb_hold_cabang.id_chat !=""){
                                try {
                                    await client.sendText(`${data_pb_hold_cabang.id_chat}@c.us`, data_pb_hold_cabang.data_for_am);
                                    console.log(`${data_pb_hold_cabang.id_chat}@c.us`, data_pb_hold_cabang.data_for_am)
                                    //await client.sendText(`6285156557808@c.us`, data_pb_hold_cabang.data_for_am);    
                                } catch (error) {
                                    console.log("ERROR Info Hold ke AM: " + error)
                                } 

                            }
                             
                            await conn_ho.query(`UPDATE m_pbro_hold_act set sent_wa = 1, jam_sent_wa = now() where date(created_at)=curdate() and toko='${r_akun.toko}' and taskid = '${r_akun.taskid}' and gudang = '${r_akun.dc}';`)
                            console.log(`UPDATE m_pbro_hold_act set sent_wa = 1, jam_sent_wa = now() where date(created_at)=curdate() and toko='${r_akun.toko}' and taskid = '${r_akun.taskid}' and gudang = '${r_akun.dc}';`)
                            
                            console.log("INFO Request PBHOLD Cabang - Ada :: Toko " + r_akun.toko+ " Jam :" +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                        } 
                    }
                  
                    //console.log("[END] INFO Request PBHOLD Cabang:: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBHOLDCabang = true
            } catch (err) {
                    console.log("[END] ERROR !!! INFO Request PBHOLD Cabang:: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBHOLDCabang = true
                    console.log(err);
            }
          } 
    });

    /* 
    =========================================
        Pengecekan Request Lebih dari 30 Menit 
    =========================================
    */
    cron.schedule('*/10 * * * *', async() => { 
        //( async() => {    
          if (taskPBReq30) { 
                taskPBReq30 = false    
                console.log("[START] PB Request Lebih 30 Menit : " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         

                        const cabPBReq30 = `G004,G025,G030,G034,G097,G144,G146,G148,G149,G158,G177,G301,G305,GI28,GI33`
                        const xplode_cabPBReq30 = cabPBReq30.split(",")
                        for(var r of xplode_cabPBReq30){
                            var data_ro_30m = await Controller.DataRo30Menit(r);
                            if(data_ro_30m != "None"){
                                if(r.substr(0,2) != "GI"){
                                    await client.sendText(group_testbot, data_ro_30m); 
                                }else{
                                    await client.sendText(group_testbot, data_ro_30m);   
                                    
                                } 
                            }  
                        }
                         
                    console.log("[END] PB Request Lebih 30 Menit :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBReq30 = true
            } catch (err) {
                    console.log("[END] ERROR !!! PB Request Lebih 30 Menit :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBReq30 = true
                    console.log(err);
            }
          } 
    });

    /* 
    ============================================
    ANCHOR Pengecekan Request PBHOLD Jagaan 5x SPD 
    ============================================
    */
    cron.schedule('*/5 * * * *', async() => { 
        //( async() => {    
          if (taskPBHOLD) { 
                taskPBHOLD = false    
                console.log("[START] Request PBHOLD: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {     

                    const cabPbHold = `G004,G025,G030,G034,G097,G144,G146,G148,G149,G158,G177,G301,G305,GI28,GI33`
                    const xplode_cabPbHold = cabPbHold.split(",")
                    for(var r_hold of xplode_cabPbHold){
                        const data_pb_hold = await Controller.DataPbHold(r_hold);
                        if(data_pb_hold != "None"){
                            
                            await client.sendText(group_testbot, data_pb_hold);  

                            console.log("Request PBHOLD - Ada :: "+ r_hold + " Jam" +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                        } 
                    }
                    
                    console.log("[END] Request PBHOLD :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBHOLD = true
            } catch (err) {
                    console.log("[END] ERROR !!! Request PBHOLD :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBHOLD = true
                    console.log(err);
            }
          } 
    });

    

    /* 
    ============================================
        Pengecekan PBHOLD Jagaan 5x SPD OLEH EDP
    ============================================
    */
    cron.schedule('*/4 * * * *', async() => { 
        //( async() => {    
          if (taskPBHOLDEDP) { 
                taskPBHOLDEDP = false    
                console.log("[START] Request PBHOLD EDP: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {          
                        const cabPbHoldEDP = `G004,G025,G030,G034,G097,G144,G146,G148,G149,G158,G177,G301,G305,GI28,GI33`
                        const xplode_cabPbHoldEDP = cabPbHoldEDP.split(",")
                        for(var r_holdedp of xplode_cabPbHoldEDP){
                            const data_pb_holdedp = await Controller.DataPbHoldEDP(r_holdedp);
                            if(data_pb_holdedp != "None"){
                                
                                await client.sendText(group_testbot, data_pb_holdedp);   

                                console.log("Request PBHOLD EDP- Ada :: " + r_holdedp + " - " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                            }
                        }
                    
                    console.log("[END] Request PBHOLD EDP:: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBHOLDEDP = true
            } catch (err) {
                    console.log("[END] ERROR !!! Request PBHOLD EDP:: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskPBHOLDEDP = true
                    console.log(err);
            }
          } 
    });

    /* 
    ============================================
        PENGECEKAN GAGAL RO REGULER => KONFIRM KE HO
    ============================================
    */
    cron.schedule('*/4 * * * *', async() => { 
        //( async() => {    
          if (taskGagalRoReg) { 
                taskGagalRoReg = false    
                console.log("[START] Pengecekan Gagal RO Reguler: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         
                    const jam = dayjs().format("HH")
                   
                        const cabGagal = `G004,G025,G030,G034,G097,G144,G146,G148,G149,G158,G177,G301,G305,GI28,GI33`
                        const xplode_cabGagal = cabGagal.split(",")
                        for(var r_gagal of xplode_cabGagal){
                            const data_gagal_ro_reg = await Controller.DataGagalRoReg(r_gagal);
                            if(data_gagal_ro_reg != "None"){
                            
                                    await client.sendText(group_testbot, data_gagal_ro_reg);   

                                    console.log("Gagal RO Reguler - Ada :: " + r_gagal + " - "+  dayjs().format("YYYY-MM-DD HH:mm:ss")) 
                                
                            } 
                        }
                  
                    console.log("[END] Pengecekan Gagal RO Reguler :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskGagalRoReg = true
            } catch (err) {
                    console.log("[END] ERROR !!! Pengecekan Gagal RO Reguler:: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskGagalRoReg = true
                    console.log(err);
            }
          } 
    });

    /* 
    ============================================
        Pengecekan Data Harian terkendala koneksi
    ============================================
    */
    cron.schedule('*/30 * * * *', async() => { 
        //( async() => {    
          if (taskDataHarianKoneksi) { 
                taskDataHarianKoneksi = false    
                console.log("[START] Data Harian Terkendala Koneksi: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         
                    const jam = dayjs().format("HH")
                    if(jam > 6 && jam < 11 ){ 
                        const data_harian_koneksi = await Controller.DataHarianKoneksi();
                        if(data_harian_koneksi != "None"){
                            
                             await client.sendText(group_testbot, data_harian_koneksi);   
                             await client.sendText(group_edpreg_mgrspv, data_harian_koneksi);   
                            
                            console.log("Data Harian Terkendala Koneksi - Ada :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                        }
                    }else{
                        console.log("Data Harian Terkendala Koneksi Just Running at 00:00 - 09:00 :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))
                        
                    } 
                    console.log("[END] Data Harian Terkendala Koneksi :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskDataHarianKoneksi = true
            } catch (err) {
                    console.log("[END] Data Harian Terkendala Koneksi :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskDataHarianKoneksi = true
                    console.log(err);
            }
          } 
    });

    /* 
    ============================================
    Pengecekan Data Harian Lebih dari jam 09
    ============================================
    */
    cron.schedule('00 09 * * *', async() => { 
        //( async() => {    
          if (taskDataHarianjam9) { 
                taskDataHarianjam9 = false    
                console.log("[START] Data Harian Lebih dari jam 09: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         
                    
                    const harian_lebih_9 = await Controller.DataHarianLebih9();
                    if(harian_lebih_9 != "None"){
                        
                        console.log("Data Harian Lebih dari jam 09 - Ada :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                    }
                     
                    console.log("[END] Data Harian Lebih dari jam 09 :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskDataHarianjam9 = true
            } catch (err) {
                    console.log("[END] Data Harian Lebih dari jam 09 :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskDataHarianjam9 = true
                    console.log(err);
            }
          } 
    });

    /* =================================================*/
    //          Report Data Harian Tampung
    /* =================================================*/
    cron.schedule('*/30 * * * *', async() => { 
        //( async() => {    
          if (taskHarianTampung) { 
            taskHarianTampung = false    
                console.log("[START] Report Harian Tampung: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         
                    const jam = dayjs().format("HH")
                    if(jam < 10 ){ 
                        
                        var data_Hr_Tampung = await Controller.HarianTampung();
                        if(data_Hr_Tampung != "None"){
                                
                            await client.sendText(group_testbot, data_Hr_Tampung); 
                            
                            console.log("Report Harian Tampung :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                        }   
                    }
                         
                    console.log("[END] Report Harian Tampung :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskHarianTampung = true
            } catch (err) {
                    console.log("[END] ERROR !!! Report Harian Tampung :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskHarianTampung = true
                    console.log(err);
            }
          } 
    });
 
    /* =================================================*/
    //          Report Data Harian IRIS
    /* =================================================*/
    cron.schedule('*/45 * * * *', async() => { 
        //( async() => {    
          if (taskHarianIris) { 
            taskHarianIris = false    
                console.log("[START] Report Harian Iris: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         
                    const jam = dayjs().format("HH")
                    if(jam < 10 ){ 
                        
                        var data_Hr_iris = await Controller.HarianIris();
                        if(data_Hr_iris != "None"){
                                
                            await client.sendText(group_testbot, data_Hr_iris); 
                            
                            console.log("Report Harian Iris :: " +  dayjs().format("YYYY-MM-DD HH:mm:ss"))  
                        }    
                    }
                         
                    console.log("[END] Report Harian Iris :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskHarianIris = true
            } catch (err) {
                    console.log("[END] ERROR !!! Report Harian Iris :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                    taskHarianIris = true
                    console.log(err);
            }
          } 
    });


     /* =================================================*/
    //          Send File WT
    /* =================================================*/
    cron.schedule('00 19,20 * * *', async() => { 
       //( async() => {    
          if (taskExportWT) { 
                taskExportWT = false    
                console.log("[START] Export WT: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                try {         

                    var today = dayjs().format("YYYY-MM-DD")
                    var today2 = dayjs().format("MMDD") 
                    const dataTokoWT = await Controller.dataTokoWT();
                    var pesan =  []
                    console.log(dataTokoWT)
                    for(r of dataTokoWT){

                        const datanyawt = await Controller.DownloadWT(today,r.kdcab,r.kdtk,r.namatoko,`WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`)
                        console.log(datanyawt)
                        pesan.push(datanyawt)
                        
                        if (fs.existsSync(`./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`)) {
                            await client.sendFile(user_reg4_donny, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                            await client.sendFile(user_reg4_gama, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                            await client.sendFile(user_reg4_panca, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                            await client.sendFile(user_reg4_imam, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                            await client.sendFile(user_reg4_fariz, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                            await client.sendFile(user_reg4_rianto, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                            await client.sendFile(user_reg4_putra, `./filewt/WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `WT${today2}${r.kdtk.substr(0,1)}.${r.kdtk.substr(1,3)}`, `File WT ${r.kdtk}`)
                        } 
                    }
                    await client.sendText(user_reg4_donny, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                    await client.sendText(user_reg4_gama, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                    await client.sendText(user_reg4_panca, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                    await client.sendText(user_reg4_imam, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                    await client.sendText(user_reg4_fariz, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                    await client.sendText(user_reg4_rianto, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                    await client.sendText(user_reg4_putra, `📚 *Report Export WT*\n *Cabang G236-Sorong dan G237- Kupang*\n _Tanggal ${today}_\n\n${pesan.join('\n')}`);
                        
                    taskExportWT = true

                } catch (err) {
                        console.log("[END] ERROR !!! Export WT :: " + dayjs().format("YYYY-MM-DD HH:mm:ss") )
                        taskExportWT = true
                        console.log(err);
                }
          } 
    });

    
     
}