"use strict";
const axios = require("axios");
const fs = require("fs");
const output = "./output";
require("dotenv").config();

const now = Date.now();
const standardDate = now - process.env.NOT_LOGGED_IN_DAYS * 24 * 60 * 60 * 1000;

const asyncFunc = async () => {
  const result = await axios
    .get(`${process.env.MY_SPACE}/api/v2/users?apiKey=${process.env.API_KEY}`)
    .catch(() => console.log("エラー"));
  const usersNotLoggedIn = result.data
    .map((e) => [e.id, e.name, e.mailAddress, new Date(e.lastLoginTime)])
    .filter((val) => val[3].getTime() <= standardDate);
  console.log("全ユーザー数: ", result.data.length);
  console.log(
    `${process.env.NOT_LOGGED_IN_DAYS}日間ログインしていないユーザー数: `,
    usersNotLoggedIn.length
  );
  let usersNotLoggedInCSV = "";
  usersNotLoggedIn.map((e) => (usersNotLoggedInCSV += e.join(",") + "\n"));
  fs.writeFileSync(`${output}/usersNotLoggedIn.csv`, usersNotLoggedInCSV);
};

asyncFunc().finally(() => console.log("done"));
