const cheerio = require("cheerio");
const fs = require("fs");
const request = require("request");

const url = "https://alpha.wallhaven.cc/wallpaper/79283";

request(url, (err, res, html) => {
  if (!err && res.statusCode == 200) {
    const $ = cheerio.load(html);

    const scrollBox = $(".scrollbox");

    
  }
});
