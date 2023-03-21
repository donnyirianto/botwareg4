const Models = require("../models/model");
const conn_local = require('../services/dbho');
const zconn = require('../services/anydb');
const Iptoko = require('../helpers/iptoko');
const { Parser } = require('json2csv');
const fs = require('fs');
var dayjs = require("dayjs");

function numberWithCommas(x) {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
}

// ========================== ANCHOR START ACTION PBRO =========================================
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
            const xheader = `*Bapak EDPM mohon dibantu untuk koordinasi dengan OPR atas PBHOLD Berikut* \n`
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
        const [cekTokoExt] = await conn_local.query({ sql: `Select count(*) as total from posrealtime_base.toko_extended` }) 
        if(cekTokoExt.total > 0){

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
            and b.nama_file is null
            order by a.kodegudang
        `
        }
        
        const [belum] = await conn_local.query({ sql: query_ho_belum })  
     
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
        
        const [belum] = await conn_local.query({ sql: query_ho_belum })  
     
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
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!"
    }
 
}
 
const HarianTokoLibur = async () => {
    try {

        var today = ""
        var now = new Date();
        const jam = dayjs(now).format("HH")
        const sekarang = dayjs(now).format("YY-MM-DD HH:mm")
        if(jam < 8 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YY-MM-DD")
        }

        var toko_aktif = 0;
        var masuk = 0; 
        var belum = 0; 
        var tampil_data = []
        
        const data = await Models.HarianTokoLibur(today)
        
        data.map( async (r)=>{
            tampil_data.push(`${r.kdcab}-${r.nama} | ${r.total_toko} | ${r.sudah} | ${r.belum} | ${Number(((r.belum)/r.total_toko * 100).toFixed(2))}%`)
            toko_aktif += r.total_toko;
            masuk += parseInt(r.sudah); 
            belum += parseInt(r.belum); 
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian Toko Libur 2023-03-22*\n\n`
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
        if(jam < 8 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YYYY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YYYY-MM-DD")
        }

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

        const data = await Models.HarianTokoLiburCabang(kdcab,today)
        for (let i = 0; i < data.length; i++) {
            if (i > 0 && data[i].kdam !== data[i-1].kdam) {
                tampil_data.push("\n*AM | AS | Nama Toko*");
            } else {
                tampil_data.push(`${data[i].kdam} | ${data[i].kdas} | _${data[i].toko}-${data[i].nama}_`)
            }
          }
        // console.log(newArray)
        // data.map( async (r)=>{
        //     tampil_data.push(`*${r.kdam} | ${r.kdas} | ${r.toko}-${r.nama}* | ${r.keterangan}`)
        // })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian Toko Libur 2023-03-22*\nCabang: ${kdcab.toUpperCase()}\n\n`
        const header_am = `*No | AM | Total | Sudah Masuk | % | Belum Masuk| %* \n`
        const header2 = `_Detail Toko Data Harian Belum Terkirim ke Server Tampung_\n\n*AM | AS | Nama Toko*\n`

        const respons = `${header}${header_am}${tampil_am.join("\n")}\n${tampil_am_footer}\n\n${header2}${tampil_data.join("\n")}\n\n_Last Update: ${sekarang}_`
        return respons

    } catch (e) {
        
        return "🛠️ Server sedang dalam perbaikan, Mohon hubungi Administrator Anda!!" 
    }
}


 
const HarianTokoLiburToko = async (kdtk) => {
    try {
       
        var today = ""
        var now = new Date();
        const jam = dayjs(now).format("HH")
        const sekarang = dayjs(now).format("YY-MM-DD HH:mm")
        if(jam < 8 ){
            var date =  new Date()
            var yesterday = date.setDate(date.getDate()-1);
            today = dayjs(yesterday).format("YYYY-MM-DD")
        }else{
            var yesterday = now
            today = dayjs(now).format("YYYY-MM-DD")
        }
 
        const data = await Models.HarianTokoLiburToko(kdtk,today)
        let tampil_data = []
        data.map( async (r)=>{
            tampil_data.push(`*${r.kdam} | ${r.kdas} | ${r.toko}-${r.nama}* | ${r.keterangan}`)
        })
        const header = `📚 *Server Tampung*\n*Absensi Data Harian*\n\n` 

        const respons = `${header}\n*AM | AS | Nama Toko | Status*\n${tampil_data.join("\n")}\n\n_Last Update: ${sekarang}_`
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
                const json2csvParser = new Parser({ delimiter: '|', quote: '',eol:'\r\n' });
                const csv = json2csvParser.parse(getWT);
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



module.exports = {
    DataRo30Menit,DataPbHold,DataGagalRoReg,DataHarianKoneksi,
    HarianIris,HarianIrisAll, HarianIrisCabang, 
    HarianTampung_new,HarianTampung_new_allcabang,HarianTampungCabang, 
    HarianSalah,HarianTokoLibur,HarianTokoLiburCabang,
    DataPbHoldEDP,
    DataPbHoldCabang,HarianTokoLiburToko,
    AkunCabang,
    TeruskanPB,HoldPB,
    cekCabang,AkunCabangOto,
    updateDataOto,updRecid2,HitungRekapHold,getBM,
    DownloadWT,dataTokoWT,DataHarianLebih9,DownloadSB
  }
 
