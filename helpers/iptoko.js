const axios = require('axios');
//const conn_local = require('../services/db');

const bykdcab =  async(kdcab) => {
  try {
    const payload = {
      "IN_KODE_CABANG": `${kdcab}`, "IN_KODE_TOKO":"","IN_STATION": ""
    }
    const results = await axios.post('http://172.24.52.3:4646/user/GET_Tokomain', payload)
    
    return results.data
   } catch(err) {  
     return "Gagal"     
  } 
  
}

const bykdtk =  async(kdcab,kdtk) => {
  try {
    const payload = {
      "IN_KODE_CABANG": `${kdcab}`, "IN_KODE_TOKO":`${kdtk}`,"IN_STATION": "01"
    } 
    const results = await axios.post('http://172.24.52.3:4646/user/GET_Tokomain', payload)
    //console.log(results.data)
    return results.data
   } catch(err) { 
     console.log(err)     
     return "Gagal"     
  } 
  
}
/*
const bykdtk_local =  async(kdcab,kdtk) => {
  try {
     
    const results = await conn_local.query(`SELECT kdcab, TOKO AS kdtk , nama,IP_INDUK AS IP FROM M_TOKO_IP 
                                            WHERE kdcab = '${kdcab}' and TOKO='${kdtk}'`)
    
    return { "data": [
                    {
                      kdcab : results[0].kdcab,
                      kdtk : results[0].kdtk,
                      nama : results[0].nama,
                      IP : results[0].IP
                    }
                  ]
            }
   } catch(err) { 
     
     return "Gagal"     
  } 
  
}
*/

module.exports = {
  bykdcab,bykdtk
  //,bykdtk_local
}  