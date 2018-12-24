const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const url = "https://alpha.wallhaven.cc/wallpaper/396523";

request(url, (err, res, html) => {
  if (!err && res.statusCode == 200) {
    const $ = cheerio.load(html);

    const src = $(".scrollbox")
      .children()
      .attr("data-cfsrc")
      .substring(2);
    const wallpaperId = $(".scrollbox")
      .children()
      .attr("data-wallpaper-id");

    console.log(src);
    request
      .get(`https://${src}`)
      .on("error", err => console.log(err))
      .pipe(fs.createWriteStream(`wallpaper-${wallpaperId}.png`));
  }
  console.log("Download done");
});
