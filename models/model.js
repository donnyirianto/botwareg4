const conn_ho = require('../services/dbho');
const conn_any = require('../services/anydb');

const DataRo30Menit = async (kdcab) => {
    
    try { 
        const [data] = await conn_ho.query(`SELECT a.* FROM
        (
            select toko,dc,\`status\`,keterangan,
            TIMEDIFF(CURRENT_TIME(),addtime) difftime,
            SEC_TO_TIME(TIME_TO_SEC(addtime))time_req,
            SEC_TO_TIME(TIME_TO_SEC(updtime)) time_finish
            FROM m_pbro_request where date(created_at)=curdate()
            and (\`status\` in('RO REGULER','...') or \`status\` like '%sedang%' OR \`status\` like '%GAGAL%' or keterangan like '%(0 row(s)%')
            and dc ='${kdcab}'
            having SEC_TO_TIME(TIME_TO_SEC(difftime)) >='00:30:00'
        ) a
        left join (select * from m_pbro_request_act where date(created_at)=curdate() and recid = 1 and dc ='${kdcab}') b on a.toko = b.toko and a.dc = b.dc
        where b.recid is null
        group by a.toko, a.dc,a.\`status\`,keterangan,difftime,time_req,time_finish
`)

        return data

    } catch (e) { 
        return "Gagal"
    }
} 

const DataPbHold = async (kdcab) => {
    
    try { 
        
        const [data] = await conn_ho.query(`select
        a.*,b.st,b.nilaipb,avgsales,
        round(avg_stock_0_persen,2) as avg_stock_0_persen,
        round(stock_0_persen,2) as stock_0_persen
        from
        (select toko,dc,right(keterangan,20) as keterangan from m_pbro_request where date(created_at)=curdate()
        and keterangan like '%melebihi 5 kali%' and dc='${kdcab}') a
        right join
        (
          select * from m_pbro_hold_act
          where date(created_at)=curdate()
          and gudang='${kdcab}'
          and recid = 1
          and act rlike '				P' 
        )
        b on a.toko = b.toko;`)

        return data

    } catch (e) { 
        return "Gagal"
    }
} 

const DataPbHoldCabang = async (toko) => {
    await conn_ho.query(`SET sql_mode=' '`);
    await conn_ho.query(`SET sql_mode=' '`);
    await conn_ho.query(`SET sql_mode=' '`);
    try {         

        const [data] = await conn_ho.query(`
        select a.gudang as dc, concat(a.toko,'-', trim(left(ifnull(c.namatoko,''),10))) as toko,left(a.am,15) as am,ifnull(id_chat,'') as id_chat,a.tanggal,a.nilaipb,a.avgsales,
        b.prdcd,b.singkat,b.qty,b.gross
        from
        (select * from m_pbro_hold_act where date(created_at)=curdate() and recid = 1 and sent_wa = 0 and toko='${toko}' ) a
        left join
        (select * from m_pbro_pareto where date(created_at) = curdate() and toko='${toko}') b
        on a.toko = b.toko and a.taskid = b.taskid
        left join posrealtime_base.toko_extended c on a.toko = c.kodetoko
        left join (select nik,nama,id_chat from m_users where id_chat is not null and length(id_chat > 7) and id_chat !='undefined' and left(id_chat,2) = '62') d on left(c.amgr_name,10) = d.nik
        order by b.gross desc limit 5
        `)

        //await conn_ho.query(`UPDATE m_pbro_hold_act set sent_wa = 1, jam_sent_wa = now() where date(created_at)=curdate() and toko='${toko}';`)
        return data

    } catch (e) {
        console.log(e) 
        return "Gagal"
    }
} 

const DataPbHoldEDP = async (kdcab) => {
    
    try { 
        
        const [data] = await conn_ho.query(`select
        a.*,b.st,b.nilaipb,avgsales,
        round(avg_stock_0_persen,2) as avg_stock_0_persen,
        round(stock_0_persen,2) as stock_0_persen
        from
        (select toko,dc,right(keterangan,20) as keterangan from m_pbro_request where date(created_at)=curdate()
        and keterangan like '%melebihi 5 kali%' and dc='${kdcab}') a
        right join
        (
          select * from m_pbro_hold_act
          where date(created_at)=curdate()
          and gudang='${kdcab}'
          and recid = 1
          and act rlike '				P'
          and ket_st !='OK' 
        )
        b on a.toko = b.toko;`)

        return data

    } catch (e) { 
        return "Gagal"
    }
} 

const DataGagalRoReg = async (kdcab) => {
    
    try { 
        const [data] = await conn_ho.query(`
        SELECT a.* FROM
        (
            select toko,dc,\`status\`,keterangan,
            TIMEDIFF(CURRENT_TIME(),addtime) difftime,
            SEC_TO_TIME(TIME_TO_SEC(addtime))time_req,
            SEC_TO_TIME(TIME_TO_SEC(updtime)) time_finish
            FROM m_pbro_request where date(created_at)=curdate()
            AND (\`status\` ='GAGAL RO REGULER' or keterangan like '%(0 row(s)%')
            and dc='${kdcab}'
        ) a 
        left join (select * from m_pbro_request_act where date(created_at)=curdate() and recid = 1 and dc ='${kdcab}') b on a.toko = b.toko and a.dc = b.dc
        where b.recid is null
        group by a.toko,a.dc,a.\`status\`,keterangan,difftime,time_req,time_finish;
        
        `)

        return data

    } catch (e) { 
        return "Gagal"
    }
} 

const dataserver = async () => {
    try{
        //'G025','G030','G034','G097','G146','G148','G149','G158','G174','G301','G305') 
        const [rows] = await conn_ho.query(`
            select * from m_server_iris where jenis='IRIS'
            and kdcab in('G004','G025','G030','G034','G097','G146','G148','G149','G158','G174','G177','G301','G305','G224','G232')
            order by kdcab
        `)
        return rows
    }catch(e){
        
        return "Error"
    }
} 

const AkunCabang = async () => { 
    try { 
       
        const [data] = await conn_ho.query(`select gudang as dc, a.taskid, toko, id_group, nama_group from
        m_pbro_hold_act a
        left join m_wa_group b on a.gudang =b.kdcab
        where date(a.created_at)=curdate()
        and a.recid = 1
        and a.sent_wa = 0
        and b.id_group is not null`);
        return data;

    } catch (e) {
        return "Gagal"
    }
}

const updRecid2 = async () => { 
    
    try { 
        const [upd] = await conn_ho.query({ sql : `select concat("'",toko,"'") as kdtk from m_pbro_hold_act where date(created_at)=curdate() and recid = 2 group by toko`, rowsAsArray: true})
        
        await conn_ho.query(`UPDATE m_pbro_hold_act SET sent_wa = 1, recid= 2 where date(created_at) = curdate() and recid != 2 and toko in(${upd.join(",")});`);
         
        //console.log(`UPDATE m_pbro_hold_act SET sent_wa = 1, recid= 2 where date(created_at) = curdate() and recid != 2 and toko in(${upd.join(",")});`)
        return "Sukses"
} catch (e) {
    console.log(e)
    return "Gagal"
}
}

const HitungRekapHold = async () => { 
    
    try { 
        const query_insert =`insert into
        m_pbro_rekap_am (tanggal,dc, am, total, total_konfirm, total_non_konfirm)
        SELECT * FROM (
            select
            curdate() as tanggal,b.kodegudang as dc, ifnull(am,'Vacant') am,
            count(*) as total,
            sum(if(jam_konfirm_am is not null or jam_konfirm_am !='null',1,0)) as total_konfirm,
            sum(if(jam_konfirm_am is null or jam_konfirm_am ='null',1,0)) as total_non_konfirm
            from m_pbro_hold_act a
            left join posrealtime_base.toko_extended b on a.toko = b.kodetoko
            where date(created_at) = curdate() group by dc,a.am) a
        ON DUPLICATE KEY UPDATE total = a.total, total_konfirm = a.total_konfirm, total_non_konfirm = a.total_non_konfirm;
        ;`
        // Update Rekap PB Hold Per AM
        await conn_ho.query(query_insert)

        const query_select =`select
        a.tanggal, a.dc, a.am, a.total, a.total_konfirm, a.total_non_konfirm, ifnull(b.id_group,'') as id_group
        from m_pbro_rekap_am a
        left join m_wa_group b on a.dc = b.kdcab
        where tanggal = curdate()
        and (id_group is not null or id_group !='')
        order by dc,total desc;`
         
        const [data] = await conn_ho.query(query_select)
        
        
        return data
    } catch (e) {
        console.log(e)
        return "Gagal"
    }
}


const AkunCabangOto = async () => { 
    try { 
    
        const [data] = await conn_ho.query(`
        select gudang as dc,a.taskid,toko,c.namatoko,ifnull(id_chat,'') as id_chat,id_group,am,nama_group,a.tanggal,a.nilaipb,a.avgsales,TIME_TO_SEC(TIMEDIFF(now(),ifnull(jam_sent_wa,now())))/60 as waktu
        from
        m_pbro_hold_act a
        left join m_wa_group b on a.gudang =b.kdcab
        left join posrealtime_base.toko_extended c on a.toko = c.kodetoko
        left join (select nik,nama,id_chat from m_users where id_chat is not null and length(id_chat > 7) and id_chat !='undefined' and left(id_chat,2) = '62') d on left(c.amgr_name,10) = d.nik
        where date(a.created_at)=curdate()
        and a.recid = 1 and sent_wa = 1
        and b.id_group is not null
        having waktu > 15
        order by waktu desc;`);
            //OR act rlike 'Teruskan PB'

        return data
    } catch (e) {
        return "Gagal"
    }
}


const TeruskanPB = async (toko) => { 
    try { 
        await conn_ho.query(`set sql_mode = ''`);
        await conn_ho.query(`set sql_mode = ''`);
        await conn_ho.query(`set sql_mode = ''`);

        const [cekdata] = await conn_ho.query(`
            select concat(a.toko,'-',trim(namatoko))as nama_toko,a.taskid,
                ifnull(a.jam_konfirm_am,'') as jam_konfirm_am,ifnull(a.jam_konfirm_oto,'') as jam_konfirm_oto,
                ifnull(pbro_status,'') as pbro_status,tanggal
                from m_pbro_hold_act a
                left join posrealtime_base.toko_extended b on a.toko = b.kodetoko
                where toko='${toko}' 
                and date(created_at) = curdate()
                order by taskid desc limit 1
            `);
            console.log(cekdata)
            console.log("=>>>>>>>", cekdata[0])
            console.log("PBRO Status",cekdata[0].pbro_status)

        if(cekdata[0].pbro_status ===""){
            console.log("Sukses Teruskan " + toko)
            await conn_ho.query(`UPDATE m_pbro_hold_act set jam_konfirm_am = now(), pbro_status = 'Teruskan', recid=2
            where toko='${toko}' and taskid = '${cekdata[0].taskid}' and date(created_at) = curdate()`);

            return `Terima Kasih _Reply_ atas informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\n PB akan kami *Teruskan*`

        }else if (cekdata[0].pbro_status === "Teruskan" && cekdata[0].jam_konfirm_oto ===""){
            
            return `Informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nSudah kami Teruskan berdasarkan informasi Bapak di group ini pada tanggal ${cekdata[0].jam_konfirm_am}`

        }else if (cekdata[0].pbro_status === "Teruskan" && cekdata[0].jam_konfirm_oto !=""){
            
            return `Informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nSudah kami Teruskan karena informasi dari Kami telah lebih dari 15 menit belum mendapat jawaban`

        }else if (cekdata[0].pbro_status === "Hold"){
            
            return `Informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nSudah kami Hold berdasarkan informasi Bapak di group ini pada tanggal ${cekdata[0].jam_konfirm_am}`
            
        }else{
            console.log("Gagal Update Teruskan" + toko)
            return "None"
        }
        

    } catch (e) {
        console.log("Gagal Update Teruskan " + toko + e)
        console.log(e)
        return "None"
    }
}

const HoldPB = async (toko) => { 
    try { 

        await conn_ho.query(`set sql_mode = ''`);
        await conn_ho.query(`set sql_mode = ''`);
        await conn_ho.query(`set sql_mode = ''`);

        const [cekdata] = await conn_ho.query(`select concat(a.toko,'-',trim(namatoko))as nama_toko,a.taskid,
        ifnull(a.jam_konfirm_am,'') as jam_konfirm_am,ifnull(a.jam_konfirm_oto,'') as jam_konfirm_oto,
        ifnull(pbro_status,'') as pbro_status,tanggal
        from m_pbro_hold_act a
        left join posrealtime_base.toko_extended b on a.toko = b.kodetoko
        where toko='${toko}' 
        and date(created_at) = curdate()
        order by taskid desc limit 1`);
 
        
        if(cekdata[0].pbro_status === "" ){
            console.log("Sukses Hold" + toko)

            await conn_ho.query(`UPDATE m_pbro_hold_act set jam_konfirm_am = now(), pbro_status = 'HOLD', recid=2
            where toko='${toko}' and taskid = '${cekdata[0].taskid}' and date(created_at) = curdate()`);
            
            return `Terima Kasih _Reply_ atas informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nPB akan kami Hold`
             

        }else if (cekdata[0].pbro_status === "Hold"){
            
            return `Informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nSudah kami Hold berdasarkan informasi Bapak di group ini pada tanggal ${cekdata[0].jam_konfirm_am}`
            
        }else if (cekdata[0].pbro_status === "Teruskan" && cekdata[0].jam_konfirm_oto ===""){
            
            return `Informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nSudah kami Teruskan berdasarkan informasi Bapak di group ini pada tanggal ${cekdata[0].jam_konfirm_am}`

        }else if (cekdata[0].pbro_status === "Teruskan" && cekdata[0].jam_konfirm_oto !=""){
            
            return `Informasi _PBHOLD_ :\nToko: ${cekdata[0].nama_toko}\nTanggal : ${cekdata[0].tanggal}\nSudah kami Teruskan karena informasi dari Kami telah lebih dari 15 menit belum mendapat jawaban`

        }else{ 
            console.log("Gagal Update Hold" + toko)
            return "None"
        }
 
    } catch (e) {
        console.log(e)
        return "None"
    }
}

const getBM= async (kdcab) => { 
    try {  
        const [id_cab] = await conn_ho.query(`SELECT id from m_branch where branch_code = '${kdcab}'`);

        const [data] = await conn_ho.query(`
        select nama,ifnull(id_chat,'-') as id_chat,concat('#',replace(cover,',','##'),'#') as coverage
            from m_users a
            left join m_branch b on a.kdcab = b.id
            where
            a.id_jabatan = 2
            and kdcab not in(1,41,42,43,44,47,48,49,50,51,52)
            and concat('#',replace(cover,',','##'),'#') regexp '#${id_cab[0].id}#';
        `); 
        return data
    } catch (e) {
        console.log(e)
        return "Gagal"
    }
}

const updateDataOto= async (dc,toko,taskid) => { 
    try {  

        await conn_ho.query(`
        UPDATE m_pbro_hold_act
        SET
            recid = 2,
            pbro_status = 'Teruskan',
            jam_konfirm_oto = now(),
            keterangan = 'Teruskan Otomatis, lebih dari 15 menit belum ada konfirmasi'
        where toko='${toko}' and gudang= '${dc}' and date(created_at) = curdate() and taskid='${taskid}'
        `); 

    } catch (e) {
        console.log(e)
        return "Gagal"
    }
}

const cekCabang = async (id) => { 
    try { 

        const [data] = await conn_ho.query(`SELECT kdcab,count(*) as total FROM m_wa_group where id_group='${id}' group by kdcab`);
       
        return data
    } catch (e) {
        return "Gagal"
    }
}
const getipiriscab = async (kdcab) => { 
    try {
        const [data] = await conn_ho.query(`SELECT * FROM m_server_iris where kdcab = '${kdcab}'  and jenis='IRIS'`);
        return data
    } catch (e) {
        return "Gagal"
    }
}
//================================== HARIAN IRIS ==================


const HarianIris = async (ipnya,yesterday) => { 
    try {
        const queryx = `
        select kdcab,'${ipnya[0].namacabang}' as namacabang, count(*) as total_toko_aktif,
sum(if(proses ='Sudah Proses',1,0))  as proses,
sum(if(proses !='Sudah Proses',1,0))  as belum_proses,
sum(if(proses_dt ='Sudah Proses',1,0))  as proses_sales,
sum(if(proses_dt !='Sudah Proses',1,0))  as belum_proses_sales
from 
(
select a.kdcab,a.toko as kdtk,nama,nama_spv,nama_mgr,tglbuka,
        if(b.t_proses is null, 0, b.t_proses) as t_proses,
        if(b.t_belum is null, 0, b.t_belum) as t_belum, 
        if(c.t_proses_dt is null, 0, c.t_proses_dt) as t_proses_dt,
        if(c.t_belum_dt is null, 0, c.t_belum_dt) as t_belum_dt,
        if(b.proses is null,'Belum Proses',b.proses) as proses,
        if(c.proses_dt is null,'Belum Proses',c.proses_dt) as proses_dt,
        (select count(*) from m_toko_tutup_his where tgl_tutup='${yesterday}') as ket_ts,
        (select count(*) from m_toko_libur_his where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y' and tgl_his='${yesterday}') as ket_lr
        from
        (
            select kdcab,toko,nama,nama_spv,nama_mgr,tglbuka  from m_toko
            where (tglbuka <= '${yesterday}' and tglbuka <>'0000-00-00')
            and (
                tok_tgl_tutup is null
                or tok_tgl_tutup in('', '0000-00-00') and tok_tgl_tutup <'${yesterday}'
            )
            and toko not in
            (
                select kdtk from 
                (
                  select toko as kdtk
                  from m_toko_tutup_his where tgl_tutup='${yesterday}'
                  union all
                  select toko as kdtk from m_toko_libur_his
                  where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y' and tgl_his='${yesterday}'
                ) a group by kdtk
            )
            UNION
            select kdcab,toko,nama,nama_spv,nama_mgr,tglbuka  from m_toko where tok_tgl_tutup >'${yesterday}'
            	and toko not in (select toko from m_toko_tutup_his where tgl_tutup= '${yesterday}')
        ) a
        left join(
            select *, if(t_belum > 0 OR t_proses < 6,'Belum Proses','Sudah Proses') as proses
            from (
            SELECT toko as kdtk, SUM(IF(FLAG >= 1,1,0)) AS t_proses, SUM(IF(FLAG = 0,1,0)) AS t_belum
            FROM m_absen_proses where tanggal = '${yesterday}' group by toko
            ) a
        ) b on a.toko = b.kdtk 
        left join(
            select *, if(t_belum_dt > 0,'Belum Proses','Sudah Proses') as proses_dt
            from (
              SELECT toko as kdtk, SUM(IF(FLAG >= 1,1,0)) AS t_proses_dt, SUM(IF(FLAG = 0,1,0)) AS t_belum_dt
              FROM m_absen_proses where tanggal = '${yesterday}'
              and \`file\` like 'DT%' group by toko
            ) a
        ) c on a.toko = c.kdtk 
) a ;  ` 
        const rows = await conn_any.zconn(ipnya[0].ipserver,ipnya[0].user,ipnya[0].pass,ipnya[0].database, 3306, queryx)
        
        return rows

    } catch (e) {
        
        return "Gagal"
    }
}

const HarianIrisCabang = async (ipnya,kdcab, yesterday) => { 
    try {
        const queryx = `
        select kdcab,kdtk,nama, nama_mgr,nama_spv
from 
(
select a.kdcab,a.toko as kdtk,nama,nama_spv,nama_mgr,tglbuka,
        if(b.t_proses is null, 0, b.t_proses) as t_proses,
        if(b.t_belum is null, 0, b.t_belum) as t_belum, 
        if(c.t_proses_dt is null, 0, c.t_proses_dt) as t_proses_dt,
        if(c.t_belum_dt is null, 0, c.t_belum_dt) as t_belum_dt,
        if(b.proses is null,'Belum Proses',b.proses) as proses,
        if(c.proses_dt is null,'Belum Proses',c.proses_dt) as proses_dt,
        (select count(*) from m_toko_tutup_his where tgl_tutup='${yesterday}') as ket_ts,
        (select count(*) from m_toko_libur_his where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y' and tgl_his='${yesterday}') as ket_lr
        from
        (
            select kdcab,toko,nama,nama_spv,nama_mgr,tglbuka  from m_toko
            where (tglbuka <= '${yesterday}' and tglbuka <>'0000-00-00')
            and (
                tok_tgl_tutup is null
                or tok_tgl_tutup in('', '0000-00-00') and tok_tgl_tutup <'${yesterday}'
            )
            and toko not in
            (
                select kdtk from 
                (
                  select toko as kdtk
                  from m_toko_tutup_his where tgl_tutup='${yesterday}'
                  union all
                  select toko as kdtk from m_toko_libur_his
                  where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y' and tgl_his='${yesterday}'
                ) a group by kdtk
            )
            UNION
            select kdcab,toko,nama,nama_spv,nama_mgr,tglbuka  from m_toko where tok_tgl_tutup >'${yesterday}' 
            	and toko not in (select toko from m_toko_tutup_his where tgl_tutup= '${yesterday}')
        ) a
        left join(
            select *, if(t_belum > 0 OR t_proses < 6,'Belum Proses','Sudah Proses') as proses
            from (
            SELECT toko as kdtk, SUM(IF(FLAG >= 1,1,0)) AS t_proses, SUM(IF(FLAG = 0,1,0)) AS t_belum
            FROM m_absen_proses where tanggal = '${yesterday}' group by toko
            ) a
        ) b on a.toko = b.kdtk 
        left join(
            select *, if(t_belum_dt > 0,'Belum Proses','Sudah Proses') as proses_dt
            from (
              SELECT toko as kdtk, SUM(IF(FLAG >= 1,1,0)) AS t_proses_dt, SUM(IF(FLAG = 0,1,0)) AS t_belum_dt
              FROM m_absen_proses where tanggal = '${yesterday}'
              and \`file\` like 'DT%' group by toko
            ) a
        ) c on a.toko = c.kdtk 
) a where proses like 'Belum%';  `
        
        const rows = await conn_any.zconn(ipnya[0].ipserver,ipnya[0].user,ipnya[0].pass,ipnya[0].database, 3306, queryx)
        
        return rows

    } catch (e) {
        console.log(e)
        return "Gagal"
    }
}

const HarianTampung = async (libur,yesterday) => {
    
    try { 
        const [data] = await conn_ho.query(`select a.kdcab, b.total_toko_aktif,a.TotalFile,
        if(b.total_toko_aktif - a.TotalFile < 0, 0,(b.total_toko_aktif - a.TotalFile))  as kurang,
        if(round((b.total_toko_aktif - a.TotalFile)/b.total_toko_aktif * 100,2) < 0,0,round((b.total_toko_aktif - a.TotalFile)/b.total_toko_aktif * 100,2))  as kurang_persen
        from 
        (
            select * from (
                select kdcab , count(*) TotalFile
                from m_abs_harian_file 
                where tanggal_harian = '${yesterday}'
                and kdtk not in(${libur})
                and concat(kdcab,kdtk) in (select concat(kodegudang,kodetoko) from posrealtime_base.toko_extended)
                and kdcab in('G004','G025','G034','G097','G030','G149','G146','G148','G158','G174','G301','G305','G177','G224')
                group by kdcab order by kdcab
            ) a
        ) a
        left join  
        (
            select kodegudang as kdcab, count(*) as total_toko_aktif from 
            (
                select kodegudang,kodetoko  from posrealtime_base.toko_extended
                where (tglbuka <= '${yesterday}' and tglbuka <>'0000-00-00')
                and kodetoko not in(${libur})
                and (
                    tok_tgl_tutup is null
                    or tok_tgl_tutup in('', '0000-00-00') and tok_tgl_tutup <  '${yesterday}'
                )
                and kodetoko not in
                (
                    select kdtk from 
                    (
                      select KODE_TOKO as kdtk
                        from posrealtime_base.toko_ts tt where tgl_tutup= '${yesterday}'
                        union all
                        select KODETOKO as kdtk from posrealtime_base.toko_lr tl 
                        where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y'
                    ) a group by kdtk
                )
                union 
                select kodegudang,kodetoko  
                    from posrealtime_base.toko_extended 
                    where tok_tgl_tutup > '${yesterday}'
                    and kodetoko not in(${libur})
                    and kodetoko not in (
                        select kdtk from 
                        (
                          select KODE_TOKO as kdtk
                            from posrealtime_base.toko_ts tt where tgl_tutup= '${yesterday}'
                            union all
                            select KODETOKO as kdtk from posrealtime_base.toko_lr tl 
                            where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y'
                        ) a group by kdtk
                    )
            ) a 
            
            group by kodegudang
            order by kodegudang
        ) b on a.kdcab = b.kdcab
        order by a.kdcab`)

        return data

    } catch (e) { 
        return "Gagal"
    }
}

const HarianTampungCabang = async (kdcab, libur, yesterday) => {
    
    try {
        const [data] = await conn_ho.query(`select * from 
        (  
            select kodegudang,kodetoko,namatoko,mid(aspv_name,12,20) as aspv_name,mid(amgr_name,12,20) as amgr_name 
            from posrealtime_base.toko_extended
            WHERE 
            kodegudang = '${kdcab}'
            and kodetoko not in(${libur})
            and (tglbuka <= '${yesterday}' and tglbuka <>'0000-00-00')
            and (
                tok_tgl_tutup is null
                or tok_tgl_tutup in('', '0000-00-00') and tok_tgl_tutup <'${yesterday}'
            )
            and kodetoko not in
            (
                select kdtk from 
                (
                  select KODE_TOKO as kdtk
                    from posrealtime_base.toko_ts tt WHERE tgl_tutup='${yesterday}'
                    union all
                    select KODETOKO as kdtk from posrealtime_base.toko_lr tl 
                    WHERE SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y'
                ) a group by kdtk
            )
            union 
            select kodegudang,kodetoko,namatoko,mid(aspv_name,12,20) as aspv_name,mid(amgr_name,12,20) as amgr_name  
            from posrealtime_base.toko_extended 
            WHERE 
            kodetoko not in(${libur})
            and tok_tgl_tutup >'${yesterday}' 
            and kodegudang = '${kdcab}' and kodetoko not in 
                (
                    select kdtk from 
                    (
                      select KODE_TOKO as kdtk
                        from posrealtime_base.toko_ts tt WHERE tgl_tutup='${yesterday}'
                        union all
                        select KODETOKO as kdtk from posrealtime_base.toko_lr tl 
                        WHERE SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${yesterday}') as mingguke),1) ='Y'
                    ) a group by kdtk
                )  
        ) a 
        LEFT JOIN
        ( 
            select kdcab , kdtk
            from m_abs_harian_file 
            where tanggal_harian = '${yesterday}'
            and kdcab='${kdcab}'
            and kdtk not in(${libur})
            and concat(kdcab,kdtk) in (select concat(kodegudang,kodetoko) from posrealtime_base.toko_extended)
        ) b on a.kodegudang = b.kdcab and a.kodetoko = b.kdtk
        having b.kdtk is null;
         `)
         
        return data

    } catch (e) { 
        return "Gagal"
    }
}

const TokoLibur = async (ipnya,tanggal) => { 
    try {
        const queryx = `select kdtk from 
        (
          select toko as kdtk
          from m_toko_tutup_his where tgl_tutup='${tanggal}'
          union all
          select toko as kdtk from m_toko_libur_his
          where SUBSTR(HARILIBUR,(SELECT DAYOFWEEK('${tanggal}') as mingguke),1) ='Y' and tgl_his='${tanggal}'
        ) a group by kdtk`
        const rows = await conn_any.zconn(ipnya[0].ipserver,ipnya[0].user,ipnya[0].pass,ipnya[0].database, 3306, queryx)
        
        return rows

    } catch (e) { 
     
        return "Gagal"
    }
}

const HarianSalah = async (yesterday) => { 
    try {
        const queryx = `select a.*,b.kodegudang from 
        (
            select kdcab,kdtk from m_abs_harian_file where tanggal_harian ='${yesterday}' and 
            concat(kdcab,kdtk) not in
            (select concat(kodegudang,kodetoko) from posrealtime_base.toko_extended)
        ) a
        left join (select kodegudang,kodetoko from posrealtime_base.toko_extended) b on a.kdtk = b.kodetoko`
        const [rows] = await conn_ho.query(queryx)
        
        return rows

    } catch (e) { 
     
        return "Gagal"
    }
}

const HarianTokoLibur = async (yesterday) => { 
    try {
        const queryx = `select a.kdcab,
        count(*) as total_toko,
            sum(if(c.nama_file is not null,1,0)) as sudah,
            sum(if(c.nama_file is null,1,0)) as belum
            from
            m_toko_libur_acuan a
            left join
            posrealtime_base.toko_extended b on concat(a.toko,a.kdcab) = concat(b.kodetoko,b.kodegudang)
            left join
            m_abs_harian_file c on a.toko = c.kdtk and a.tanggal = c.tanggal_harian
            where
            a.recid=''
            and a.tanggal='${yesterday}'
            group by a.kdcab
            order by belum desc;`
        const [rows] = await conn_ho.query(queryx)
        console.log(queryx)
        
        return rows

    } catch (e) { 
        
        return "Gagal"
    }
}

const HarianTokoLiburCabang = async (kdcab,yesterday) => { 
    try {
        const queryx = `select a.*,b.namatoko,
            substr(b.amgr_name,12,10) as amgr_name,substr(b.aspv_name,12,10) as aspv_name ,
            c.nama_file       
            from
            m_toko_libur_acuan a
            left join
            posrealtime_base.toko_extended b on concat(a.toko,a.kdcab) = concat(b.kodetoko,b.kodegudang)
            left join
            m_abs_harian_file c on a.toko = c.kdtk and a.tanggal = c.tanggal_harian
            where
            a.recid=''
            and a.kdcab='${kdcab}'
            and a.tanggal = '${yesterday}'
            and c.nama_file is null
            order by amgr_name,aspv_name,toko;`
        const [rows] = await conn_ho.query(queryx)
        
        return rows

    } catch (e) { 
        console.log(e)
        return "Gagal"
    }
}


const HarianTokoLiburCabangAm = async (kdcab,yesterday) => { 
    try {
        const queryx = `
        select
        am,total,belum,sudah,round((belum/total) * 100,2) as persen_belum,round((sudah/total) * 100,2) as persen_sudah
        from (
        select
        if(left(substr(b.amgr_name,12,10),4) ='cant','Vacant', substr(b.amgr_name,12,10)) as am,COUNT(*) AS total,
        sum(if(nama_file is null,1,0)) as belum,
        sum(if(nama_file is not null,1,0)) as sudah
        from
        m_toko_libur_acuan a
        left join
        posrealtime_base.toko_extended b on concat(a.toko,a.kdcab) = concat(b.kodetoko,b.kodegudang)
        left join
        m_abs_harian_file c on a.toko = c.kdtk and a.tanggal = c.tanggal_harian
        where
        a.recid=''
        and a.kdcab='${kdcab}'
        and a.tanggal = '${yesterday}'
        GROUP BY am) a order by persen_belum desc,total desc
        ;`
        const [rows] = await conn_ho.query(queryx)
        
        return rows

    } catch (e) { 
        console.log(e)
        return "Gagal"
    }
}

const HarianTokoLiburCabangAmFooter = async (kdcab,yesterday) => { 
    try {
        const queryx = `
        select
        total,belum,sudah,round((belum/total) * 100,2) as persen_belum,round((sudah/total) * 100,2) as persen_sudah
from(
        select
        COUNT(*) AS total,
        sum(if(nama_file is null,1,0)) as belum,
        sum(if(nama_file is not null,1,0)) as sudah
        from
        m_toko_libur_acuan a
        left join
        posrealtime_base.toko_extended b on concat(a.toko,a.kdcab) = concat(b.kodetoko,b.kodegudang)
        left join
        m_abs_harian_file c on a.toko = c.kdtk and a.tanggal = c.tanggal_harian
        where
        a.recid=''
        and a.tanggal='${yesterday}'
        and a.kdcab='${kdcab}') a
        ;`
        const [rows] = await conn_ho.query(queryx)
        
        return rows

    } catch (e) { 
        console.log(e)
        return "Gagal"
    }
}


module.exports = {
    DataRo30Menit, DataPbHold, DataGagalRoReg,dataserver,
    getipiriscab,HarianIrisCabang,HarianIris,HarianTampung,HarianTampungCabang,TokoLibur,HarianSalah,
    HarianTokoLibur,HarianTokoLiburCabang,DataPbHoldEDP,AkunCabang,DataPbHoldCabang,
    TeruskanPB,HoldPB,cekCabang,AkunCabangOto,updateDataOto,
    HarianTokoLiburCabangAm,HarianTokoLiburCabangAmFooter,updRecid2,HitungRekapHold,getBM
}