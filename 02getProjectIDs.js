"use strict";
const axios = require("axios");
const fs = require("fs");
const output = "./output";
require("dotenv").config();

const exclusionProjects = process.env.EXCLUSION_PROJECTS;

const asyncFunc = async () => {
  const result = await axios
    .get(
      `${process.env.MY_SPACE}/api/v2/projects?apiKey=${process.env.API_KEY}&archived=false&all=true`
    )
    .catch(() => console.log("プロジェクト一覧エラー"));
  const projectIDs = result.data
    .map((e) => e.projectKey)
    .filter((e) => !exclusionProjects.includes(e));

  fs.writeFileSync(`${output}/projectIDs.json`, JSON.stringify(projectIDs));
  console.log("プロジェクト数: " + projectIDs.length);
};

asyncFunc().finally(() => console.log("done"));
