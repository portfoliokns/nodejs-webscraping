const PORT = 8000;

const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const app = express();

//ウェブスクレイピング
const URL = "https://search.rakuten.co.jp/search/mall/%E3%82%AD%E3%83%BC%E3%83%9C%E3%83%BC%E3%83%89/303087/?p=2";
const data = []
axios(URL).then((response) => {
  const htmlParser = response.data;
  // console.log(htmlParser);
  const $ = cheerio.load(htmlParser);

  $(".searchresultitem", htmlParser).each(function() {
    const title = $(this).find(".title-link--3Ho6z").text();
    const price = $(this).find(".price--OX_YW").text();
    data.push({ title, price});
    // console.log(data);
  });

  //CSVへの書き込み
  const csvWriter = createCsvWriter({
    path: "data.csv",
    header: [
      { id: "title", title: "Title"},
      { id: "price", title: "Price"},
    ]
  });

  csvWriter
    .writeRecords(data)
    .then(() => console.log("CSV file successfully written."));

}).catch(error => console.log(error));

app.listen(PORT, console.log("server running!"));
