"use strict";
const axios = require("axios");
const fs = require("fs");
const output = "./output";
require("dotenv").config();
const projectIDs = require(`${output}/projectIDs.json`);

const pjMember = [];
let userCSVs = "";

const asyncFunc = async () => {
  let count = 0;
  for (let i = 0; i < projectIDs.length; i++) {
    const result = await axios
      .get(
        `${process.env.MY_SPACE}/api/v2/projects/${projectIDs[i]}/users?apiKey=${process.env.API_KEY}`
      )
      .catch(() => console.log("エラー"));
    const userIds = result.data.map((e) => [e.id, e.name, projectIDs[i]]);
    const userCSV = result.data.map((e) =>
      [e.id, e.name, projectIDs[i]].join(",")
    );
    count += userIds.length;
    pjMember.push(userIds);
    userCSVs += userCSV.join("\n") + "\n";
  }
  console.log("延べユーザー数:" + count);
  fs.writeFileSync(`${output}/pjMember.json`, JSON.stringify(pjMember));
  fs.writeFileSync(`${output}/pjMember.csv`, userCSVs);
};

asyncFunc().finally(() => console.log("done"));
