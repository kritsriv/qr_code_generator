var Handlebars = require("handlebars");
var QRCode = require('qrcode');
var asyncHelpers = require('handlebars-async-helpers');
var fs = require("fs");
var path = require("path");
// Read HTML Template
var html = fs.readFileSync(path.join(__dirname, "./template.html"), "utf8");
var alasql = require('alasql');

Handlebars = asyncHelpers(Handlebars)
Handlebars.registerHelper("qrcode",  async (text) => {
  // Some async work that uses `someVar`, could be anything
  return await QRCode.toDataURL(text);
})

var pathname = 'batch1';

var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

function create (document, filename , options) {
    return new Promise(async (resolve, reject) => {
      if (!document || !document.html || !document.data) {
        reject(new Error("Some, or all, options are missing."));
      }
      // Compiles a template
      var html = await Handlebars.compile(document.html)(document.data);
  
        fs.writeFile(path.join(__dirname, `./${filename}.html`), html, err => {
          if (err) {
            console.error(err);
          } else {
            // file written successfully
          }
        });
    });
  };

  fs.readdir(path.join(__dirname, `./${pathname}/`), (error, fileNames) => {
    if (error) throw error;

    fileNames.forEach((file) => {
        var name = path.parse(file).name;
        console.log(name)

            // Read CSV
alasql.promise(`SELECT AssetNumber,AssetTypeName FROM CSV("./batch1/${file}",{headers:true})`).then(function(assets){
    console.log(assets)
    console.log(`Total Assets: ${assets.length}`)
    var document = {
        html: html,
        data: {
          assets,
        },
        path: "./output.pdf",
        type: "", // "stream" || "buffer" || "" ("" defaults to pdf)
    };

    create(document,name, options)
    .then((res) => {
      console.log(res);
    })
    .catch((error) => {
      console.error(error);
    });
    // results from the file asia.xlsx
});
    })
   

  
    }
  )








