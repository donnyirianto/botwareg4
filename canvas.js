const { createCanvas } = require('canvas');
const fs =require("fs");
const Controller = require("./controllers/controller.js");

( async() => {
    const resp = await Controller.HarianTampung_new_allcabangImage();
    console.log(resp)

})();