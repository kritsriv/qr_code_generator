var Handlebars = require("handlebars");
var QRCode = require('qrcode');
var asyncHelpers = require('handlebars-async-helpers');
var fs = require("fs");
var path = require("path");
// Read HTML Template
var html = fs.readFileSync(path.join(__dirname, "./template_team.html"), "utf8");
var alasql = require('alasql');

Handlebars = asyncHelpers(Handlebars)
Handlebars.registerHelper("qrcode",  async (text) => {
  // Some async work that uses `someVar`, could be anything
  return await QRCode.toDataURL(text);
})



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
        fs.writeFile(path.join(__dirname, `./team/${filename}.html`), html, err => {
          if (err) {
            console.error(err);
          } else {
            // file written successfully
          }
        });
    });
  };

  var numbers = []
  for (let i = 1; i <= 240; i++) {
    numbers.push(i)
  }

  var document = {
    html: html,
    data: {
      numbers,
    },
    path: "./output.pdf",
    type: "", // "stream" || "buffer" || "" ("" defaults to pdf)
};

create(document,'team', options)
.then((res) => {
  console.log(res);
})
.catch((error) => {
  console.error(error);
});
