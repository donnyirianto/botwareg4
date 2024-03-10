const Models = require("../models/model");
const conn_local = require('../services/dbho');
const zconn = require('../services/anydb');
const Iptoko = require('../helpers/iptoko');
const { Parser } = require('json2csv');
const Papa = require('papaparse');
const fs = require('fs');
const { createCanvas } = require('canvas');
var dayjs = require("dayjs");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// ========================== ANCHOR START ACTION PBRO =========================================

const ServerPbroReg4 = async () => {
    try {
        const data = await Models.ServerPbroReg4()
        return data
    } catch (error) { 
        return "Error"
    }
}
const TeruskanPB = async (toko) => { 
    try {
      
        const result = await Models.TeruskanPB(toko) 
        return result
        
        
    } catch (e) {
        
        return "None"
    }
} 
const HitungRekapHold = async () => { 
    try {
        
        const data = await Models.HitungRekapHold() 
        
        return data
        
    } catch (e) {
        
        return "None"
    }
} 
const HoldPB = async (toko) => { 
    try { 
            const result = await Models.HoldPB(toko)

            return result  
       
    } catch (e) {
        
        return "None"
    }
} 
const cekCabang = async (idgroup) => { 
    try {
        const cekcabang = await Models.cekCabang(idgroup)
        
        return cekcabang       
    } catch (e) {
        
        return "None"
    }
} 
const updateDataOto = async (dc,toko,taskid) => { 
    try {
        
        await Models.updateDataOto(dc,toko,taskid) 
        
        return "Sukses"
        
    } catch (e) {
        console.log(e)
        return "None"
    }
} 

// ========================== ANCHOR END ACTION PBRO =========================================
const DataRo30Menit = async (kdcab) => { 
    try {
        const data = await Models.DataRo30Menit(kdcab)

        var tampil_data = []
        var no = 1;
        data.map( async (r)=>{
            tampil_data.push(`${no} | ${r.dc} | ${r.toko} | ${r.status} | ${r.difftime.substr(0,8)}`)
            no++;
        })

        if(tampil_data.toString().length > 10){
            const header = `⏱️ *Request Lebih dari 30 Menit*\n\n`
            const footer = `*Bapak2 IT Support 24 Jam, mohon bantuannya untuk pengecekan Request lebih 30 Menit berikut*`
            const header2 = `*No | Kdcab | Toko | Status | Menit* \n`
            const respons = `${header}${footer}\n\n${header2} ${tampil_data.join(" \n")} \n\n_Last Update: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}_`
            return respons
        }else{
            return "None"
        } 
    } catch (e) {
        
        return "None"
    }
} 
const DataPbHold = async (kdcab) => { 
    try {
        const data = await Models.DataPbHold(kdcab)

        var tampil_data = []
        var no = 1;
        data.map( async (r)=>{
            tampil_data.push(`${no} | ${r.dc} | ${r.toko} | ${r.nilaipb} | ${r.avgsales} | ${r.st} | ${r.avg_stock_0_persen}% | ${r.stock_0_persen}%`)
            no++;
        })

        if(tampil_data.toString().length > 10){
            const xheader = `*Bapak EDP mohon dibantu untuk koordinasi dengan OPR atas PBHOLD Berikut* \n`
            const header = `📈 *Request PBHOLD Jagaan 5x SPD* \n\n`
            const header2 = `*No | Kdcab | Toko | PB-FT | AvgSales | ST | Avg Qty 0 | Qty 0 Saat ini* \n`            
            const respons = `${xheader}${header}${header2}  ${tampil_data.join(" \n")}  \n\n_Last Update: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}_`
            return respons
        }else{
            return "None"
        } 
    } catch (e) {
        
        return "None"
    }
} 
const DataPbHoldCabang = async (kdtk) => { 
    try {
        const data = await Models.DataPbHoldCabang(kdtk)
        /* if(data != "Gagal"){
            await conn_ho.query(`UPDATE m_pbro_hold_act set sent_wa = 1, jam_sent_wa = now() where date(created_at)=curdate() and toko='${toko}';`)
        } */
        
        var tampil_data = []
        
        data.map( async (r)=>{
            tampil_data.push(`_${r.prdcd}-${r.singkat}_\nPB Qty: ${numberWithCommas(r.qty)}\nPB Gross: ${numberWithCommas(r.gross)}`) 
        })
        var id_chat = data[0].id_chat === "" ? "" : `@${data[0].id_chat}`

        if(tampil_data.toString().length > 10){
            const xheader = `*Bapak ${data[0].am}* ${id_chat}\n*_Mohon dibantu atas Request PBHOLD Jagaan 5x SPD Berikut_*\n\n`
            const xheader_for_am = `*Bapak ${data[0].am}*\n*_Mohon dibantu atas Request PBHOLD Jagaan 5x SPD Berikut_*\n\n`
            const header = `📈 *(${data[0].dc}) ${data[0].toko}*\n`
            const header2 = `*Tanggal PB: ${data[0].tanggal}*\n*PB-FT : ${data[0].nilaipb}*\n*AVG Sales :  ${data[0].avgsales}*\n`            
            const footer = `Untuk mengkonfirmasi, silahkan me-Reply pesan ini dengan format berikut:\n${data[0].toko.substr(0,4)} OK = Untuk mengkonfirmasi di teruskan\ndan\n${data[0].toko.substr(0,4)} HOLD = Untuk mengkonfirmasi Hold/Tidak ada Kiriman `
            const respons = `${xheader}${header}${header2}\n*_Detail Item_*:\n ${tampil_data.join(" \n")} \n\n${footer}`
            const respons_for_am = `${xheader_for_am}${header}${header2}\n*_Detail Item_*:\n ${tampil_data.join(" \n")} \n\n${footer}`
            return {
                data: respons,
                data_for_am: respons_for_am,
                id_chat : data[0].id_chat
            }
        }else{
            return "None"
        } 
    } catch (e) {
        
        return "None"
    }
} 
const DataPbHoldEDP = async (kdcab) => { 
    try {
        const data = await Models.DataPbHoldEDP(kdcab)

        var tampil_data = []
        var no = 1;
        data.map( async (r)=>{
            tampil_data.push(`${no} | ${r.dc} | ${r.toko} | ${r.nilaipb} | ${r.avgsales} | ${r.st} | ${r.avg_stock_0_persen}% | ${r.stock_0_persen}%`)
            no++;
        })

        if(tampil_data.toString().length > 10){
            const xheader = `Bapak EDP REGION Mohon Dilakukan Pengecekan ST PBHOLD Berikut Belum Sesuai! \n`
            const header = `‼️ Pengecekan PBHOLD Jagaan 5x SPD \n\n`
            const header2 = `*No | Kdcab | Toko | PB-FT | AvgSales | ST | Avg Qty 0 | Qty 0 Saat ini* \n`            
            const respons = `${xheader}${header}${header2} ${tampil_data.join(" \n")}\n\n_Last Update: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}_`
            return respons
        }else{
            return "None"
        } 
    } catch (e) {
        
        return "None"
    }
} 
const DataGagalRoReg = async (kdcab) => { 
    try {
        const data = await Models.DataGagalRoReg(kdcab)

        var tampil_data = []
        var no = 1;
        data.map( async (r)=>{
            tampil_data.push(`${no} | ${r.dc} | ${r.toko} | ${r.addtime} || ${r.status_req} | `)
            no++;
        })

        if(tampil_data.toString().length > 10){
            const xheader = `*Team Edp Regional, segera lakukan cek log atas ERROR / GAGAL Berikut* \n`
            const header = `🛠️ *PBRO ERROR / GAGAL* \n\n`
            const header2 = `*No | Kdcab | Toko | Jam Req | Status* \n`            
            const respons = `${xheader}${header}${header2}${tampil_data.join(" \n")}\n\n_Last Update: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}_`
            return respons
        }else{
            return "None"
        } 
    } catch (e) {
        
        return "None"
    }
} 
const getBM = async (kdcab) => { 
    try {
      
        const result = await Models.getBM(kdcab) 
        return result 
        
    } catch (e) { 
        return "None"
    }
} 

const DataHarianKoneksi = async () => {
    try{
        
        var tampil_data = []
        var no = 1;
        var date =  new Date()
        var yesterday = date.setDate(date.getDate()-1);
        var tanggal = dayjs(yesterday).format("YYYY-MM-DD")
        var data_all = []
        const ipnya = await Models.dataserver()
        
        for(var rip of ipnya){
            const queryx = ` 
                SELECT concat("'",toko,"'") as toko from m_toko
                where (tglbuka <= '${tanggal}' and tglbuka <>'0000-00-00')
                and (
                    tok_tgl_tutup is null
                    or tok_tgl_tutup in('', '0000-00-00') and tok_tgl_tutup <'${tanggal}'
                )
                and toko not in
                (
                    select kdtk from 
                    (
                    select toko as kdtk
                    from m_toko_tutup_his where tgl_tutup='${tanggal}'
                    union all
                    select toko as kdtk from m_toko_libur_his
                    where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${tanggal}') as mingguke),1) ='Y' and tgl_his='${tanggal}'
                    ) a group by kdtk
                )
                UNION
                select concat("'",toko,"'") as toko from m_toko where tok_tgl_tutup >'${tanggal}' 
                and toko not in (select toko from m_toko_tutup_his where tgl_tutup= '${tanggal}')
                ` 
               
        
            const xd  = await zconn.zconn(rip.ipserver,rip.user,rip.pass,rip.database, 3306, { sql: queryx, rowsAsArray: true })
            if(xd !="Error"){
                data_all.push(xd.toString())
            }
            
       
        }
        const acuan = data_all.toString().replace(/"/g, '')
        var query_ho_belum="";
        const cekTokoExt = await conn_local.query(`Select count(*) as total from posrealtime_base.toko_extended`) 
        
        if(cekTokoExt[0].total > 0){
            
            query_ho_belum = ` 
            SELECT a.KodeGudang as kdcab, 
                a.Kodetoko as kdtk, a.NamaToko as nama
            FROM posrealtime_base.toko_extended a 
            LEFT JOIN
            (
                select kdtk,nama_file 
                from m_abs_harian_file 
                where tanggal_harian='${tanggal}'
            ) b on a.Kodetoko = b.kdtk 
            WHERE a.Kodetoko in(${acuan})
            and a.kodegudang not in('G097')                     
            and b.nama_file is null
            order by a.kodegudang
        `
        }
        else{

            query_ho_belum = ` 
            SELECT a.KodeGudang as kdcab, 
                a.Kodetoko as kdtk, a.NamaToko as nama
            FROM m_toko a 
            LEFT JOIN
            (
                select kdtk,nama_file 
                from m_abs_harian_file 
                where tanggal_harian='${tanggal}'
            ) b on a.Kodetoko = b.kdtk 
            WHERE a.Kodetoko in(${acuan})    
            AND a.kodegudang not in('G097')
            and b.nama_file is null
            order by a.kodegudang
        `
        }
        
        const belum = await conn_local.query(query_ho_belum)  
        
        var detailbelum = []
        if(belum.length > 0){
            const detail = belum.map( (r) =>{
                return `'${r.kdtk}'`
            }).toString()
            
            const keterquery = `select toko as kdtk,log as keterangan from temp_cek_clos_toko where tanggal='${tanggal}' and toko in(${detail})`
            const keterangan  = await zconn.zconn("192.168.131.50","edp1","abcd@1234","management_co", 3306, { sql: keterquery })
            
            const a = belum.map(v => Object.assign({}, v));
            const b = keterangan.map(v => Object.assign({}, v));
            
            const mergeById = (a1, a2) =>
                a1.map(itm => (
                        {
                            ...a2.find((item) => (item.kdtk === itm.kdtk) && item),
                            ...itm
                        }
                    )
                )
        
            detailbelum = mergeById(a, b)  
        }
        
        detailbelum.map( async (r)=>{
            if(r.keterangan === "4.Koneksi Time Out "){
                tampil_data.push(`${no} | ${r.kdcab} | ${r.kdtk}-${r.nama} | ${r.keterangan} `)
                no++;
            }            
        })
        
        //console.log(tampil_data.sort((a, b) => (a.kdcab > b.kdcab ? 1 : 1)).toString())
        if(tampil_data.toString().length > 10){
            const xheader = `*FYI: Bapak2 EDPM mohon bantuannya atas kendala koneksi toko berikut* \n`
            const header = `🛠️ *Data Harian Belum Masuk* \n\n`
            const header2 = `*No | Kdcab | Toko | keterangan* \n`            
            const respons = `${xheader}${header}${header2}${tampil_data.join(" \n")}\n\n_Last Update: ${dayjs().format("YYYY-MM-DD HH:mm:ss")}_`
            return respons
        }else{
            return "None"
        } 

    }catch(e){ 
        console.log(e)
        return "None"
    }
}

const DataHarianLebih9 = async () => {
    try{
        
        var tampil_data = []
        var no = 1;
        var date =  new Date()
        var yesterday = date.setDate(date.getDate()-1);
        var tanggal = dayjs(yesterday).format("YYYY-MM-DD")
        var data_all = []
        const ipnya = await Models.dataserver()
        
        for(var rip of ipnya){
            const queryx = ` 
                SELECT concat("'",toko,"'") as toko from m_toko
                where (tglbuka <= '${tanggal}' and tglbuka <>'0000-00-00')
                and (
                    tok_tgl_tutup is null
                    or tok_tgl_tutup in('', '0000-00-00') and tok_tgl_tutup <'${tanggal}'
                )
                and toko not in
                (
                    select kdtk from 
                    (
                    select toko as kdtk
                    from m_toko_tutup_his where tgl_tutup='${tanggal}'
                    union all
                    select toko as kdtk from m_toko_libur_his
                    where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${tanggal}') as mingguke),1) ='Y' and tgl_his='${tanggal}'
                    ) a group by kdtk
                )
                UNION
                select concat("'",toko,"'") as toko from m_toko where tok_tgl_tutup >'${tanggal}' 
                and toko not in (select toko from m_toko_tutup_his where tgl_tutup= '${tanggal}')
                ` 
               
        
            const xd  = await zconn.zconn(rip.ipserver,rip.user,rip.pass,rip.database, 3306, { sql: queryx, rowsAsArray: true })
            if(xd !="Error"){
                data_all.push(xd.toString())
            }
            
       
        }
        const acuan = data_all.toString().replace(/"/g, '')
        
        const query_ho_belum = ` 
                    SELECT a.KodeGudang as kdcab, 
                        a.Kodetoko as kdtk, a.NamaToko as nama
                    FROM posrealtime_base.toko_extended a 
                    LEFT JOIN
                    (
                        select kdtk,nama_file 
                        from m_abs_harian_file 
                        where tanggal_harian='${tanggal}'
                    ) b on a.Kodetoko = b.kdtk 
                    WHERE a.Kodetoko in(${acuan})                     
                    and b.nama_file is null
                    order by a.kodegudang
                `
        
        const [belum] = await conn_local.query(query_ho_belum)  
     
        var detailbelum = []
        if(belum.length > 0){
            const detail = belum.map( (r) =>{
                return `'${r.kdtk}'`
            }).toString()
            
            const keterquery = `select toko as kdtk,log as keterangan from temp_cek_clos_toko where tanggal='${tanggal}' and toko in(${detail})`
            const keterangan  = await zconn.zconn("192.168.131.50","edp1","abcd@1234","management_co", 3306, { sql: keterquery })
            
            const a = belum.map(v => Object.assign({}, v));
            const b = keterangan.map(v => Object.assign({}, v));
            
            const mergeById = (a1, a2) =>
                a1.map(itm => (
                        {
                            ...a2.find((item) => (item.kdtk === itm.kdtk) && item),
                            ...itm
                        }
                    )
                )
        
            detailbelum = mergeById(a, b)  
        }
        
        detailbelum.map( async (r)=>{            
            tampil_data.push(`('${r.kdcab}','${r.kdtk}','${r.nama}','${tanggal}','${r.keterangan}')`)
        })
        
        await Models.insertHarianJam9(tampil_data.join(","));
        
        return "Sukses"
        
    }catch(e){ 
        
        return "None"
    }
}

const AkunCabang = async () => {
    try {
        const data = await Models.AkunCabang()
        return data
    } catch (error) {
        
        return "Error"
    }
}

const AkunCabangOto = async () => {
    try {
        const data = await Models.AkunCabangOto()
        return data
    } catch (error) {
        
        return "Error"
    }
}
const updRecid2 = async () => { 
    try {
        const data = await Models.updRecid2()
        return data
    } catch (error) {
        
        return "Error"
    }
}
// ======================================================= HARIAN =========================================
var acuan_kode_cabang = "G004,G025,G034,G097,G030,G149,G146,G148,G158,G174,G301,G305,G177,G224,G232,G234,G236,G237"

const HarianIris = async () => {
    try {
        var date =  new Date()
        var kemarin = date.setDate(date.getDate()-1);
        var yesterday = dayjs(kemarin).format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")
      
        var tampil_data = [] 
        var toko_aktif = 0;
        var proses = 0;
        var blmproses = 0;
        var proses_sales = 0;
        var blmproses_sales = 0; 

        var ipnya = await Models.getipiriscab_reg4()

        const promise = ipnya.map((r)=>{ 
            return Models.HarianIris(r, yesterday)
        })

        const result = await Promise.allSettled(promise); 

        let datarekap = [];
        let datarekap_nok = [];
       
        const hasil = result.map((r)=> {return r.value})
        
        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });
        hasil.filter((r) => r.status == "NOK").forEach(r => {
            datarekap_nok.push(r.datarekap)
        });

        datarekap.map( async (xd)=>{
            tampil_data.push(`${xd.kdcab}-${xd.namacabang} | ${xd.total_toko_aktif} | ${xd.proses} | ${xd.belum_proses} | ${xd.proses_sales} | ${xd.belum_proses_sales}`)
            toko_aktif += parseInt(xd.total_toko_aktif)
            proses += parseInt(xd.proses)
            blmproses += parseInt(xd.belum_proses)
            proses_sales += parseInt(xd.proses_sales)
            blmproses_sales += parseInt(xd.belum_proses_sales)
        }) 
 
        const header = `📚 *Server Iris*\n*Absensi Data Harian ${yesterday}*\n\n`
        const header2 = `*Kdcab | Toko Aktif | Proses | Blm Proses | Proses Sales | Blm Proses Sales*\n`
        const footer = `*Grand Total | ${toko_aktif} | ${proses} | ${blmproses} | ${proses_sales}| ${blmproses_sales}*`
        let irisnok= ""
        if(datarekap_nok.length > 0){
            irisnok = `\n\n*WARNING - IRIS CABANG DOWN!!*\n\n${datarekap_nok.join("\n")}`
        } 
        const respons = `${header}${header2}${tampil_data.join("\n")}\n${footer}${irisnok}\n\n_Last Update: ${yesterday2}_`
        
        return respons
    } catch (e) {  
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
}
const HarianIrisAll = async () => {
    try {
        var date =  new Date()
        var kemarin = date.setDate(date.getDate()-1);
        var yesterday = dayjs(kemarin).format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")
      
        var tampil_data = [] 
        var toko_aktif = 0;
        var proses = 0;
        var blmproses = 0;
        var proses_sales = 0;
        var blmproses_sales = 0; 

        var ipnya = await Models.getipiriscab_allcabang()
        
        const promise = ipnya.map((r)=>{ 
            return Models.HarianIris(r, yesterday)
        })

        const result = await Promise.allSettled(promise); 

        let datarekap = [];
        let datarekap_nok = [];
       
        const hasil = result.map((r)=> {return r.value})
        
        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });
        hasil.filter((r) => r.status == "NOK").forEach(r => {
            datarekap_nok.push(r.datarekap)
        });

        datarekap.map( async (xd)=>{
            tampil_data.push(`${xd.kdcab}-${xd.namacabang} | ${xd.total_toko_aktif} | ${xd.proses} | ${xd.belum_proses} | ${xd.proses_sales} | ${xd.belum_proses_sales}`)
            toko_aktif += parseInt(xd.total_toko_aktif)
            proses += parseInt(xd.proses)
            blmproses += parseInt(xd.belum_proses)
            proses_sales += parseInt(xd.proses_sales)
            blmproses_sales += parseInt(xd.belum_proses_sales)
        }) 
 
        const header = `📚 *Server Iris*\n*Absensi Data Harian ${yesterday}*\n\n`
        const header2 = `*Kdcab | Toko Aktif | Proses | Blm Proses | Proses Sales | Blm Proses Sales*\n`
        const footer = `*Grand Total | ${toko_aktif} | ${proses} | ${blmproses} | ${proses_sales}| ${blmproses_sales}*`
        let irisnok= ""
        if(datarekap_nok.length > 0){
            irisnok = `\n\n*WARNING - IRIS CABANG DOWN!!*\n\n${datarekap_nok.join("\n")}`
        } 
        const respons = `${header}${header2}${tampil_data.join("\n")} \n${footer}${irisnok}\n\n_Last Update: ${yesterday2}_`
        
        return respons
    } catch (e) {  
        
        return "None"
    }
}

const HarianIrisAllImage = async () => {
    try {
        var date =  new Date()
        var kemarin = date.setDate(date.getDate()-1);
        var yesterday = dayjs(kemarin).format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")
      
        var tampil_data = [] 
        var toko_aktif = 0;
        var proses = 0;
        var blmproses = 0;
        var proses_sales = 0;
        var blmproses_sales = 0; 

        var ipnya = await Models.getipiriscab_allcabang()
        
        const promise = ipnya.map((r)=>{ 
            return Models.HarianIris(r, yesterday)
        })

        const result = await Promise.allSettled(promise); 

        let datarekap = [];
        let datarekap_nok = [];
       
        const hasil = result.map((r)=> {return r.value})
        
        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });
        hasil.filter((r) => r.status == "NOK").forEach(r => {
            datarekap_nok.push(r.datarekap)
        });

        datarekap.map( async (xd)=>{
            tampil_data.push(`${xd.kdcab}-${xd.namacabang} | ${xd.total_toko_aktif} | ${xd.proses} | ${xd.belum_proses} | ${xd.proses_sales} | ${xd.belum_proses_sales}`)
            toko_aktif += parseInt(xd.total_toko_aktif)
            proses += parseInt(xd.proses)
            blmproses += parseInt(xd.belum_proses)
            proses_sales += parseInt(xd.proses_sales)
            blmproses_sales += parseInt(xd.belum_proses_sales)
        }) 
 
        let irisnok= ""
        if(datarekap_nok.length > 0){
            irisnok = `\n\n*WARNING - IRIS CABANG DOWN!!*\n\n${datarekap_nok.join("\n")}`
        } 
        
        
        const resp = {
            status: "OK",
            title: `📚 Server IRIS`,
            subtitle: `Absensi Data Harian Tgl ${yesterday}\n\n`,
            last_upd: `Last Update : ${yesterday2}`,
            message : irisnok,
            data: datarekap,
            total: {
                toko_aktif: toko_aktif,
                proses: proses,
                blmproses: blmproses,
                proses_sales: proses_sales,
                blmproses_sales: blmproses_sales,
            }
        }


        const canvasWidth = 1000;
        const canvasHeight = 33.5 * resp.data.length;
        const padding = 10;
        const cellWidth = 165;
        const cellHeight = 30;
        const headerColor = '#d0abf5';
        const headerTextColor = '#333';
        const cellColor = '#f9f9f9';
        const cellTextColor = '#333';
        const fontSize = 12;
        const lineWidth = 1;
        const titleFontSize = 20;
        const subtitleFontSize = 16;
        const tableFontSize = 12;

        // Create a canvas
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d');

        // Set canvas background to white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw title
        ctx.font = `bold ${titleFontSize}px Arial`;
        ctx.fillStyle = '#000';
        ctx.fillText(resp.title, padding, padding + titleFontSize);

        //Draw subtitle
        ctx.font = `bold ${subtitleFontSize}px Arial`;
        ctx.fillStyle = '#555';
        ctx.fillText(resp.subtitle, padding, padding + titleFontSize + subtitleFontSize + 10);

        //Draw subtitle
        ctx.font = `bold 14px Arial`;
        ctx.fillStyle = 'rgb(2, 150, 167)';
        ctx.fillText(resp.last_upd, padding, padding + titleFontSize + subtitleFontSize + 10 + 20);

        const tableX = padding;
        const tableY = padding + titleFontSize + subtitleFontSize + 55;
        const tableWidth = cellWidth * 6;
        //const tableHeight = (jsonData.length + 1) * cellHeight;

        ctx.font = `bold ${tableFontSize}px Arial`;
        ctx.fillStyle = headerColor;
        ctx.fillRect(tableX, tableY, tableWidth, cellHeight);
        ctx.fillStyle = headerTextColor;
        ctx.fillText('CABANG', tableX + 5 + 30, tableY + tableFontSize + 5);
        ctx.fillText('TOTAL TOKO', tableX + cellWidth  + 25, tableY + tableFontSize + 5);
        ctx.fillText('PROSES', tableX + cellWidth * 2 + 40, tableY + tableFontSize + 5);
        ctx.fillText('BLM PROSES', tableX + cellWidth * 3 + 32, tableY + tableFontSize + 5);
        ctx.fillText('PROSES SALES', tableX + cellWidth * 4 + 30, tableY + tableFontSize + 5);
        ctx.fillText('BLM PROSES SALES', tableX + cellWidth * 5 + 18, tableY + tableFontSize + 5);

        //Gambar Rows data
        ctx.font = `${fontSize}px Calibri`;
        resp.data.forEach((data, index) => {

            const rowX = tableX;
            const rowY = tableY + (index + 1) * cellHeight;

            // Draw row borders
            ctx.strokeStyle = '#949191';
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(rowX, rowY);
            ctx.lineTo(rowX + cellWidth * 6, rowY);
            ctx.stroke();

            ctx.fillStyle = cellColor;
            ctx.fillRect(rowX, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(`${data.kdcab} - ${data.namacabang}`, rowX + 5, rowY + fontSize + 5);

            ctx.fillStyle = cellColor;
            ctx.fillRect(rowX + cellWidth, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.total_toko_aktif, rowX + cellWidth + 55, rowY + fontSize + 5);

            ctx.fillStyle = data.proses != data.total_toko_aktif ? "#dbc884" : "#d7f5d5";
            ctx.fillRect(rowX + cellWidth * 2, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.proses, rowX + cellWidth * 2 + 55, rowY + fontSize + 5);

            ctx.fillStyle = data.belum_proses > 0 ? "#f5a6b4" : cellColor;
            ctx.fillRect(rowX + cellWidth * 3, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.belum_proses, rowX + cellWidth * 3 + 65, rowY + fontSize + 5);

            ctx.fillStyle = data.proses_sales != data.total_toko_aktif ? "#dbc884" : "#d7f5d5";
            ctx.fillRect(rowX + cellWidth * 4, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.proses_sales, rowX + cellWidth * 4 + 65, rowY + fontSize + 5);

            ctx.fillStyle = data.belum_proses_sales > 0 ? "#f5a6b4" : cellColor;
            ctx.fillRect(rowX + cellWidth * 5, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.belum_proses_sales, rowX + cellWidth * 5 + 65, rowY + fontSize + 5);

        })

        const rowX2 = tableX;
        const rowY2 = tableY + (resp.data.length + 1) * cellHeight;

        ctx.strokeStyle = '#949191';
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(rowX2, rowY2);
        ctx.lineTo(rowX2 + cellWidth * 4, rowY2);
        ctx.stroke();

        ctx.font = `bold 14px Arial`;
        ctx.fillStyle = cellColor;
        ctx.fillRect(rowX2, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(`TOTAL`, rowX2 + 85, rowY2 + fontSize + 5);

        ctx.fillStyle = cellColor;
        ctx.fillRect(rowX2 + cellWidth, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(resp.total.toko_aktif), rowX2 + cellWidth + 45, rowY2 + fontSize + 5);

        ctx.fillStyle = "#d7f5d5";
        ctx.fillRect(rowX2 + cellWidth * 2, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(resp.total.proses), rowX2 + cellWidth * 2 + 45, rowY2 + fontSize + 5);

        ctx.fillStyle = resp.total.blmproses != resp.total.toko_aktif ? "#f5a6b4" : "#d7f5d5";
        ctx.fillRect(rowX2 + cellWidth * 3, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(resp.total.blmproses), rowX2 + cellWidth * 3 + 55, rowY2 + fontSize + 5);

        ctx.fillStyle = "#d7f5d5";
        ctx.fillRect(rowX2 + cellWidth * 4, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(resp.total.proses_sales), rowX2 + cellWidth * 4 + 55, rowY2 + fontSize + 5);

        ctx.fillStyle = resp.total.blmproses_sales != resp.total.toko_aktif ? "#f5a6b4" : "#d7f5d5";
        ctx.fillRect(rowX2 + cellWidth * 5, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(resp.total.blmproses_sales), rowX2 + cellWidth * 5 + 55, rowY2 + fontSize + 5);

        // Convert the canvas to a buffer
        const buffer = canvas.toBuffer('image/png');

        // Save the buffer as an image file
        fs.writeFileSync('./images/AbsFileHRServerIris.png', buffer);

        return resp


    } catch (e) {  
        
        return "None"
    }
}

const HarianIrisCabang = async (kdcab) => {
    try {
        var date =  new Date()
        var kemarin = date.setDate(date.getDate()-1);
        var yesterday = dayjs(kemarin).format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")

        var tampil_data = [] 

        var ipnya = await Models.getipiriscab(kdcab)
        var rx = await Models.HarianIrisCabang(ipnya, kdcab, yesterday)
        
        rx.map( async (xd)=>{
            if(xd != "Gagal"){

                tampil_data.push(`${xd.kdcab} | ${xd.kdtk} | ${xd.nama} | ${xd.nama_mgr} | ${xd.nama_spv}`)                
                
            }else{
                tampil_data.push(`${ipnya[0].kdcab} | ${ipnya[0].namacabang} | Gagal Konek Server Iris`)
            }
        })

        
        const header = `📚 *Server Iris*\n*Absensi Data Harian ${yesterday}*\n\n`
        const header2 = `*Kdcab | Kdtk | Nama | Amgr | Aspv*\n`

        const respons = `${header}${header2} ${tampil_data.join("\n")}  \n\n_Last Update: ${yesterday2}_`
        
        return respons
    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
}
const HarianTampung_new = async () => {
    try {
        
        var yesterday = dayjs().add(-1, 'day').format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")
        
        var ipnya = await Models.getipiriscab_reg4()

        const promise = ipnya.map((r)=>{ 
            return Models.HarianTampung_new(r, yesterday)
        })
        const result = await Promise.allSettled(promise); 
        
        let datarekap = [];
       
        const hasil = result.map((r)=> {return r.value})
        
        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });
 
        var toko_aktif = 0;
        var masuk = 0; 
        var tampil_data = [] 

        datarekap.map( async (r)=>{
            tampil_data.push(`${r.kdcab}-${r.nama} | ${r.total_toko} | ${r.sudah} | ${r.belum} | ${Number(((r.belum)/r.total_toko * 100).toFixed(2)) }%`)
            toko_aktif += parseInt(r.total_toko);
            masuk += parseInt(r.sudah); 
        })

        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${yesterday}*\n\n`
        const header2 = `*Kdcab | Toko Aktif | HR Masuk | HR Blm Masuk | %* \n`
        const footer = `*Total | ${toko_aktif} | ${masuk} | ${toko_aktif - masuk} | ${Number(((toko_aktif - masuk)/toko_aktif * 100).toFixed(2))}%*`

        const respons = `${header}${header2}${tampil_data.join("\n")}\n${footer}\n\n_Last Update: ${yesterday2}_` 
        return respons
    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
}
const HarianTampung_new_allcabang = async () => {
    try {
        
        var yesterday = dayjs().add(-1, 'day').format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")
        
        var ipnya = await Models.getipiriscab_allcabang()

        const promise = ipnya.map((r)=>{ 
            return Models.HarianTampung_new(r, yesterday)
        })
        const result = await Promise.allSettled(promise); 
        
        let datarekap = [];
        let datarekap_nok = [];
       
        const hasil = result.map((r)=> {return r.value})

        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });

        hasil.filter((r) => r.status == "NOK").forEach(r => {
            datarekap_nok.push(r.datarekap)
        });
 
        var toko_aktif = 0;
        var masuk = 0; 
        var tampil_data = [] 

        datarekap.map( async (r)=>{
            tampil_data.push(`${r.kdcab}-${r.nama} | ${r.total_toko} | ${r.sudah} | ${r.belum} | ${Number(((r.belum)/r.total_toko * 100).toFixed(2))}%`)
            toko_aktif += parseInt(r.total_toko);
            masuk += parseInt(r.sudah); 
        })

        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${yesterday}*\n\n`
        const header2 = `*Kdcab | Toko Aktif | HR Masuk | HR Blm Masuk | %* \n`
        const footer = `*Total | ${toko_aktif} | ${masuk} | ${toko_aktif - masuk} | ${Number(((toko_aktif - masuk)/toko_aktif * 100).toFixed(2))}%*`
        let irisnok= ""
        if(datarekap_nok.length > 0){
            irisnok = `\n\n*WARNING - IRIS CABANG DOWN!!*\n\n${datarekap_nok.join("\n")}`
        } 
        const respons = `${header}${header2}${tampil_data.join("\n")}${irisnok}\n\n${footer}\n\n_Last Update: ${yesterday2}_` 
        return respons
    } catch (e) {
        
        return "None"
    }
}

const HarianTampungCabang = async (kdcab) => {
    
    try {
        
        var yesterday = dayjs().add(-1, 'day').format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")
        
        var ipnya = await Models.getipiriscab(kdcab)

        const promise = ipnya.map((r)=>{ 
            return Models.HarianTampungCabang_new(r, yesterday)
        })
        const result = await Promise.allSettled(promise); 
        
        let datarekap = [];
        
        const hasil = result.map((r)=> {return r.value})
        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });
    
        var tampil_data = [] 

        datarekap.map( async (r)=>{
            tampil_data.push(`${r.kdcab} | ${r.kdtk}-${r.nama}`)
        })

        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${yesterday}*\n\n`
        const header2 = `*Kdcab | Toko* \n` 
        const respons = `${header}${header2}${tampil_data.join("\n")}\n\n_Last Update: ${yesterday2}_` 
        return respons
    } catch (e) {
        console.log(e)
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
 
}

const HarianTampung_new_allcabangImage = async () => {
    
    try {
        
        var yesterday = dayjs().add(-1, 'day').format("YYYY-MM-DD") 
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm:ss") 
        
        var ipnya = await Models.getipiriscab_allcabang()

        const promise = ipnya.map((r)=>{ 
            return Models.HarianTampung_new(r, yesterday)
        })
        const result = await Promise.allSettled(promise); 
        
        let datarekap = [];
       
        const hasil = result.map((r)=> {return r.value})
        
        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });

        const resp = {
            status: "OK",
            title: `📚 Server Tampung`,
            subtitle: `Absensi Data Harian ${yesterday}\n\n`,
            last_upd: `Last Update : ${yesterday2}\n\n`,
            data: datarekap
        }

        const canvasWidth = 640;
        const canvasHeight = 33.5 * resp.data.length;
        const padding = 10;
        const cellWidth = 165;
        const cellHeight = 30;
        const headerColor = '#d0abf5';
        const headerTextColor = '#333';
        const cellColor = '#f9f9f9';
        const cellTextColor = '#333';
        const fontSize = 12;
        const lineWidth = 1;
        const titleFontSize = 20;
        const subtitleFontSize = 16;
        const tableFontSize = 12;
        
        // Create a canvas
        const canvas = createCanvas(canvasWidth, canvasHeight);
        const ctx = canvas.getContext('2d'); 

        // Set canvas background to white
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw title
        ctx.font = `bold ${titleFontSize}px Arial`;
        ctx.fillStyle = '#000';
        ctx.fillText(resp.title, padding, padding + titleFontSize);

        //Draw subtitle
        ctx.font = `bold ${subtitleFontSize}px Arial`;
        ctx.fillStyle = '#555';
        ctx.fillText(resp.subtitle, padding, padding + titleFontSize + subtitleFontSize + 10);

        //Draw subtitle
        ctx.font = `bold 14px Arial`;
        ctx.fillStyle = 'rgb(2, 150, 167)';
        ctx.fillText(resp.last_upd, padding, padding + titleFontSize + subtitleFontSize + 10 + 20);

        
        const tableX = padding;
        const tableY = padding + titleFontSize + subtitleFontSize + 55;
        const tableWidth = cellWidth * 4;
        //const tableHeight = (jsonData.length + 1) * cellHeight;

        ctx.font = `bold ${tableFontSize}px Arial`;
        ctx.fillStyle = headerColor;
        ctx.fillRect(tableX, tableY, tableWidth, cellHeight);
        ctx.fillStyle = headerTextColor;
        ctx.fillText('CABANG', tableX + 5 + 30, tableY + tableFontSize + 5);
        ctx.fillText('TOTAL TOKO', tableX + cellWidth  + 25, tableY + tableFontSize + 5);
        ctx.fillText('HR TERSEDIA', tableX + cellWidth * 2 + 25, tableY + tableFontSize + 5);    
        ctx.fillText('HR BLM TERSEDIA', tableX + cellWidth * 3 + 18, tableY + tableFontSize + 5);
    
        //Gambar Rows data
        ctx.font = `${fontSize}px Calibri`;
        let total_toko = 0;
        let hr_tersedia = 0;
        let hr_blm_tersedia = 0;
        resp.data.forEach((data, index) => { 

            const rowX = tableX;
            const rowY = tableY + (index + 1) * cellHeight;
        
            // Draw row borders
            ctx.strokeStyle = '#949191';
            ctx.lineWidth = lineWidth;
            ctx.beginPath();
            ctx.moveTo(rowX, rowY);
            ctx.lineTo(rowX + cellWidth * 4, rowY);
            ctx.stroke();
        
            ctx.fillStyle = cellColor;
            ctx.fillRect(rowX, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(`${data.kdcab} - ${data.nama}`, rowX + 5, rowY + fontSize + 5);

            ctx.fillStyle = cellColor;
            ctx.fillRect(rowX + cellWidth, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.total_toko, rowX + cellWidth + 55, rowY + fontSize + 5);

            ctx.fillStyle = data.sudah != data.total_toko ? "#dbc884" : "#aff7ab";
            ctx.fillRect(rowX + cellWidth * 2, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.sudah, rowX + cellWidth * 2 + 55, rowY + fontSize + 5);        
            
            ctx.fillStyle = data.belum > 0 ? "#fc8b9e" : cellColor;
            ctx.fillRect(rowX + cellWidth * 3, rowY, cellWidth, cellHeight);
            ctx.fillStyle = cellTextColor;
            ctx.fillText(data.belum, rowX + cellWidth * 3 + 65, rowY + fontSize + 5);
            
            total_toko += parseInt(data.total_toko);
            hr_tersedia += parseInt(data.sudah);
            hr_blm_tersedia += parseInt(data.belum);
        
        })

        const rowX2 = tableX;
        const rowY2 = tableY + (resp.data.length + 1) * cellHeight;  

        ctx.strokeStyle = '#949191';
        ctx.lineWidth = lineWidth;
        ctx.beginPath();
        ctx.moveTo(rowX2, rowY2);
        ctx.lineTo(rowX2 + cellWidth * 4, rowY2);
        ctx.stroke();

        ctx.font = `bold 14px Arial`;
        ctx.fillStyle = cellColor;
        ctx.fillRect(rowX2, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(`TOTAL`, rowX2 + 85, rowY2 + fontSize + 5);

        ctx.fillStyle = cellColor;
        ctx.fillRect(rowX2 + cellWidth, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(total_toko), rowX2 + cellWidth + 45, rowY2 + fontSize + 5);

        ctx.fillStyle = "#aff7ab";
        ctx.fillRect(rowX2 + cellWidth * 2, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(hr_tersedia), rowX2 + cellWidth * 2 + 45, rowY2 + fontSize + 5);        
        
        ctx.fillStyle = cellColor;
        ctx.fillRect(rowX2 + cellWidth * 3, rowY2, cellWidth, cellHeight);
        ctx.fillStyle = cellTextColor;
        ctx.fillText(new Intl.NumberFormat().format(hr_blm_tersedia), rowX2 + cellWidth * 3 + 55, rowY2 + fontSize + 5);

        // Convert the canvas to a buffer
        const buffer = canvas.toBuffer('image/png');

        // Save the buffer as an image file
        fs.writeFileSync('./images/AbsFileHRServerTampung.png', buffer);
                
        return resp

    } catch (e) {
        console.log(e)
        return {
            status: "NOK",
            message: "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
            
        }
        
    }
 
}
 
const HarianTokoLibur = async () => {
    try {

        var today = ""
        var now = new Date();
        const jam = dayjs(now).format("HH")
        const sekarang = dayjs(now).format("YY-MM-DD HH:mm")
        if(jam < 14 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YY-MM-DD")
        }
        today = "2024-03-10"
        var toko_aktif = 0;
        var masuk = 0; 
        var belum = 0; 
        var tampil_data = []
        
        const data = await Models.HarianTokoLibur(today)
        
        data.map( async (r)=>{
            tampil_data.push(`${r.kdcab}-${r.nama} | ${r.total_toko} | ${r.sudah} | ${r.belum} | ${Number(((r.belum)/r.total_toko * 100).toFixed(2))}%`)
            toko_aktif += parseInt(r.total_toko);
            masuk += parseInt(r.sudah); 
            belum += parseInt(r.belum); 
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${today}\nToko Libur*\n\n`
        const header2 = `*Kdcab | Toko Aktif | Sudah Masuk | Belum Masuk | %* \n`
        const footer = `*Total | ${toko_aktif} | ${masuk} | ${belum} | ${Number(((belum)/toko_aktif * 100).toFixed(2))}%*`

        const respons = `${header}${header2}${tampil_data.join("\n")}\n${footer}\n\n_ Last Update: ${sekarang} _`
        return respons

    } catch (e) {
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!" 
    }
}
 
const HarianTokoLiburCabang = async (kdcab) => {
    try {
       
        var today = ""
        var now = new Date();
        const jam = dayjs(now).format("HH")
        const sekarang = dayjs(now).format("YY-MM-DD HH:mm")
        if(jam < 14 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YYYY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YYYY-MM-DD")
        }

        today = "2024-03-10"
        var no = 1;
        var no_am = 1; 
        var tampil_data = []
        var tampil_am = []
        var tampil_am_footer = []

        const data_am = await Models.HarianTokoLiburCabangAm(kdcab,today)
        data_am.map( async (r_am)=>{
            tampil_am.push(`${no_am} | ${r_am.am} | ${r_am.total} | ${r_am.sudah} | ${r_am.persen_sudah}% | ${r_am.belum}| ${r_am.persen_belum}% `)
            no_am++;
        })

        const data_am_footer = await Models.HarianTokoLiburCabangAmFooter(kdcab,today)
        data_am_footer.map( async (r_am_footer)=>{
            tampil_am_footer.push(`  *Grand Total | ${r_am_footer.total} | ${r_am_footer.sudah} | ${r_am_footer.persen_sudah}% | ${r_am_footer.belum}| ${r_am_footer.persen_belum}%*`)
            no_am++;
        })
        let filter = ""  
        if(parseInt(dayjs().format("H")) === 21){
            filter = `and jam in('21:00','22:00')`
        }else if(parseInt(dayjs().format("H")) === 22){
            filter = `and jam in('21:00','22:00','23:00')`
        }else{
            filter =""
        }
        console.log(filter)
        const data = await Models.HarianTokoLiburCabang2(kdcab,today,filter) 
        data.map( async (r, index)=>{
            tampil_data.push(`${index + 1}. ${r.kdam} | ${r.kdas} | ${r.toko}-${r.nama.substring(0,13)}`)
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${today}\nToko Libur*\nCabang: ${kdcab.toUpperCase()}\n\n`
        const header_am = `*No | AM | Total | Sudah Masuk | % | Belum Masuk| %* \n`
        const header2 = `_Detail Toko Data Harian Belum Terkirim ke Server Tampung_\n\n*AM | AS | Nama Toko*\n`

        const respons = `${header}${header_am}${tampil_am.join("\n")}\n${tampil_am_footer}\n\n${header2}${tampil_data.join("\n")}\n\n_Last Update: ${sekarang}_`
        return respons

    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!" 
    }
}

const HarianTokoLiburCabang2 = async (kdcab) => {
    try {
       
        var today = ""
        var now = new Date();
        const jam = dayjs(now).format("HH")
        const sekarang = dayjs(now).format("YY-MM-DD HH:mm")
        if(jam < 14 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YYYY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YYYY-MM-DD")
        }
        today = "2024-03-10"

        var no = 1;
        var no_am = 1; 
        var tampil_data = []
        var tampil_am = []
        var tampil_am_footer = []
        
        let filter = ""  
        if(parseInt(dayjs().format("H")) === 21){
            filter = `and jam in('21:00','22:00')`
        }else if(parseInt(dayjs().format("H")) === 22){
            filter = `and jam in('21:00','22:00','23:00')`
        }else{
            filter =""
        }

        const data_am = await Models.HarianTokoLiburCabangAm2(kdcab,today,filter)
        data_am.map( async (r_am)=>{
            tampil_am.push(`${no_am} | ${r_am.am} | ${r_am.total} | ${r_am.sudah} | ${r_am.persen_sudah}% | ${r_am.belum}| ${r_am.persen_belum}% `)
            no_am++;
        })

        const data_am_footer = await Models.HarianTokoLiburCabangAmFooter2(kdcab,today,filter)
        data_am_footer.map( async (r_am_footer)=>{
            tampil_am_footer.push(`  *Grand Total | ${r_am_footer.total} | ${r_am_footer.sudah} | ${r_am_footer.persen_sudah}% | ${r_am_footer.belum}| ${r_am_footer.persen_belum}%*`)
            no_am++;
        })

        const data = await Models.HarianTokoLiburCabang2(kdcab,today,filter) 
        data.map( async (r, index)=>{
            tampil_data.push(`${index + 1}. ${r.kdam} | ${r.kdas} | ${r.toko}-${r.nama.substring(0,13)}`)
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${today}\nToko Libur*\nCabang: ${kdcab.toUpperCase()}\n\n`
        const header_am = `*No | AM | Total | Sudah Masuk | % | Belum Masuk| %* \n`
        const header2 = `_Detail Toko Data Harian Belum Terkirim ke Server Tampung_\n\n*AM | AS | Nama Toko*\n`

        const respons = `${header}${header_am}${tampil_am.join("\n")}\n${tampil_am_footer}\n\n${header2}${tampil_data.join("\n")}\n\n_Last Update: ${sekarang}_`
        return respons

    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!" 
    }
}

 
const cekHarianToko = async (kdtk) => {
    try {
       
        var today = ""
        var now = new Date();
        const jam = dayjs(now).format("HH")
        const sekarang = dayjs(now).format("YYYY-MM-DD HH:mm")
        if(jam < 14 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YYYY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YYYY-MM-DD")
        }
        today = "2024-03-10"
        const data = await Models.cekHarianToko(kdtk,today)
        let tampil_data = []
        data.map( async (r)=>{
            tampil_data.push(`Toko  : ${r.kdtk}-${r.nama}\nAM    : ${r.amgr_name} \nAS    : ${r.aspv_name}\nStatus: ${r.keterangan}`)
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian*\nTgl Harian: ${today}` 
        const respons = `${header}\n\n${tampil_data.join("\n")}\n\n_Last Update: ${sekarang}_`
        return respons

    } catch (e) {
        console.log(e)
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!" 
    }
}

const HarianSalah = async () => {
    try {
        var date =  new Date()
        var kemarin = date.setDate(date.getDate()-1);
        var yesterday = dayjs(kemarin).format("YYYY-MM-DD")
        var yesterday2 = dayjs().format("YYYY-MM-DD HH:mm")

        var tampil_data = []
        const data = await Models.HarianSalah(yesterday)
        
        data.map( async (r)=>{
            tampil_data.push(`${r.kdcab} | ${r.kdtk} | ${r.kodegudang}`)
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian ${yesterday}\nKesalahan Peletakan File Harian*\n\n`
        const header2 = `*Kdcab | Toko | Server Cabang Seharusnya*\n`
        const respons = `${header}${header2}${tampil_data.join("\n")}\n\n_Last Update: ${yesterday2}_`
        return respons
    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
}

const DownloadWT = async (today,kdcab,toko,namatoko,namawt) => {
    try {  
        
        var pesan = ""
        const dtoko = await Iptoko.bykdtk(kdcab,toko)
        
        if(dtoko.data.length > 0 && dtoko.data[0].IP.substr(0,3) != "192"){
            const getWT = await Models.getWT(dtoko.data[0],today)
            
            if(getWT.length > 0 && getWT !="Gagal" && getWT !="Error"){
                let opts = {
                    quotes: false, //or array of booleans
                    quoteChar: '',
                    escapeChar: '',
                    delimiter: "|",
                    header: true,
                    newline: "\r\n",
                    skipEmptyLines: true, //other option is 'greedy', meaning skip delimiters, quotes, and whitespace.
                    columns: null //or array of strings
                }
                const csv = Papa.unparse(getWT ,opts);
                //const json2csvParser = new Parser({ delimiter: '|', quote: '',eol:'\r\n' });
                //const csv = json2csvParser.parse(getWT);
                //fs.unlinkSync(`./filewt/${namawt}`)
                
                fs.writeFileSync(`./filewt/${namawt}`, csv);
                
                pesan =`*${kdcab}-${toko}-${namatoko} Export WT =  Ada trx mstran*`    
            }else{
                pesan =`${kdcab}-${toko}-${namatoko} Export WT =  Tidak Ada Trx Mstran`
            }
            
        
        }else{
            
            pesan =`_${kdcab}-${toko}-${namatoko} = IP Tidak Terdaftar_`
        } 
        
        return pesan
    } catch (e) {
        console.log(e)
        return `_${kdcab}-${toko}-${namatoko} = Toko Tidak Dapat Diakses_`
    }
}
 
const DownloadSB = async (today,kdcab,toko,namatoko,namafile) => {
    try {  
        
        var pesan = ""
        const dtoko = await Iptoko.bykdtk(kdcab,toko)
        
        if(dtoko.data.length > 0 && dtoko.data[0].IP.substr(0,3) != "192"){
            const getSB = await Models.getSB(dtoko.data[0],today)
            
            if(getSB.length > 0 && getSB !="Gagal" && getSB !="Error"){
                const json2csvParser = new Parser({ delimiter: '|', quote: '',eol:'\r\n' });
                const csv = json2csvParser.parse(getSB);
                //fs.unlinkSync(`./filewt/${namawt}`)
                
                fs.writeFileSync(`./filesb/${namafile}`, csv);
                
                pesan =`*${kdcab}-${toko}-${namatoko} Export File =  Ada Data*`    
            }else{
                pesan =`${kdcab}-${toko}-${namatoko} Export File =  Tidak Ada Data`
            }
            
        
        }else{
            
            pesan =`_${kdcab}-${toko}-${namatoko} = IP Tidak Terdaftar_`
        } 
        
        return pesan
    } catch (e) {
        return `_${kdcab}-${toko}-${namatoko} = Toko Tidak Dapat Diakses_`
    }
}

const dataTokoWT = async () => {
    try {  
        const data = await Models.dataTokoWT() 
        
        return data
    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
}

const coResolved = async () => {
    try {  

        const data = await Models.coResolved() 
        
        return data
    } catch (e) {
        throw e
    }
}

const absenPbbh = async () => {
    try {
        const jam = dayjs().format("HH")
        var yesterday = ""
        if(jam > 20 ){ 
            yesterday = dayjs().format("YYYY-MM-DD")
        }else{
            yesterday = dayjs().add(-1, 'day').format("YYYY-MM-DD")
        }
        
        //var yesterday = dayjs().format("YYYY-MM-DD")
        
        var ipnya = await Models.getipiriscab_reg4()

        const promise = ipnya.map((r)=>{ 
            return Models.absenPbbh(r, yesterday)
        })
        const result = await Promise.allSettled(promise); 
        
        let datarekap = [];
        let datarekap_nok = [];
       
        const hasil = result.map((r)=> {return r.value})

        hasil.filter((r) => r.status == "OK").forEach(r => {
            r.datarekap.map( r => datarekap.push(r) )
        });

        hasil.filter((r) => r.status == "NOK").forEach(r => {
            datarekap_nok.push(r.datarekap)
        });
 
        var toko_aktif = 0;
        var harian_sudah = 0; 
        var harian_belum = 0; 
        var pbbh_sudah = 0; 
        var pbbh_belum = 0; 
        var tampil_data = [] 

        datarekap.map( async (r)=>{
            tampil_data.push(`\`\`\`${r.kdcab}-${r.nama}|${r.total_toko}|${r.pbbh_sudah}|${r.pbbh_belum}|${r.harian_sudah}|${r.harian_belum}\`\`\``)
            toko_aktif += parseInt(r.total_toko);
            harian_sudah += parseInt(r.harian_sudah);
            harian_belum += parseInt(r.harian_belum);
            pbbh_sudah += parseInt(r.pbbh_sudah);
            pbbh_belum += parseInt(r.pbbh_belum); 
        })
        
        const header = `📚 *Server Tampung*\n*Absensi File PBBH Tgl ${yesterday}*\n\n`
        const header2 = `\`\`\`Kdcab|Toko Aktif|PBBH Sudah|PBBH Blm|HR Sudah|HR Blm\`\`\`\n`
        const footer = `\`\`\`Total|${toko_aktif}|${pbbh_sudah}|${pbbh_belum}|${harian_sudah}|${harian_belum}\`\`\``
        let irisnok= ""
        if(datarekap_nok.length > 0){
            irisnok = `\n\n*WARNING - IRIS CABANG DOWN!!*\n\n${datarekap_nok.join("\n")}`
        } 
        const respons = `${header}${header2}${tampil_data.join("\n")}${irisnok}\n\n${footer}\n\n_Last Update: ${dayjs().format("YYYY-MM-DD HH:mm")}_`
        
        return respons
    } catch (e) {
        console.log(e)
        return "None"
    }
}
module.exports = {
    DataRo30Menit,DataPbHold,DataGagalRoReg,DataHarianKoneksi,coResolved,
    HarianIris,HarianIrisAll, HarianIrisCabang,HarianIrisAllImage, 
    HarianTampung_new,HarianTampung_new_allcabang,HarianTampungCabang, 
    HarianSalah,HarianTokoLibur,HarianTokoLiburCabang,
    DataPbHoldEDP,
    DataPbHoldCabang,cekHarianToko,
    AkunCabang,
    TeruskanPB,HoldPB,
    cekCabang,AkunCabangOto,
    updateDataOto,updRecid2,HitungRekapHold,getBM,
    DownloadWT,dataTokoWT,DataHarianLebih9,DownloadSB,absenPbbh,HarianTampung_new_allcabangImage,
    ServerPbroReg4,HarianTokoLiburCabang2
  }
 
