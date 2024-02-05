"use strict";
const startTime = Date.now();
const axios = require("axios");
const fs = require("fs");
const output = "./output";
require("dotenv").config();

// ユーザー取得を除外するプロジェクト
const exclusionProjects = process.env.EXCLUSION_PROJECTS;

// 全ユーザーの情報を取得(プロミス)
// const allUsers = axios.get(
//   `${process.env.MY_SPACE}/api/v2/users?apiKey=${process.env.API_KEY}`
// );

// 全プロジェクトの情報を取得(プロミス)
const allProjects = axios.get(
  `${process.env.MY_SPACE}/api/v2/projects?apiKey=${process.env.API_KEY}&archived=false&all=true`
);

// プロジェクトのユーザーを取得する関数
const projectAdmins = (projectID) => {
  return axios.get(
    `${process.env.MY_SPACE}/api/v2/projects/${projectID}/administrators?apiKey=${process.env.API_KEY}`
  );
};

// 全プロジェクトのユーザー情報を取得
allProjects
  .then((result) => {
    const projectKeys = result.data
      .map((e) => e.projectKey) // プロジェクトの情報からプロジェクトID（key）を取得
      .filter((val) => !exclusionProjects.includes(val)); // 環境変数で指定したプロジェクトIDを除外
    console.log("プロジェクト数: ", projectKeys.length);
    // プロジェクト情報一覧
    const projectNames = result.data.map((e) => [e.projectKey, e.name]);

    // プロジェクト毎のユーザーを取得(プロミス)
    const totalAdmins = projectKeys.map((e) => projectAdmins(e));
    // 全プロジェクトのユーザー情報の取得が完了したら
    Promise.all(totalAdmins).then((result) => {
      const adminsByPJ = []; // PJごとのAdmin情報を格納するための配列
      result.map((e) => adminsByPJ.push(e.data));
      // console.log(adminsByPJ)
      const adminsWithPjInfo = []; // PJ情報を付加したユーザー一覧
      for (let i = 0; i < projectKeys.length; i++) {
        adminsByPJ[i].map((e) =>
        adminsWithPjInfo.push([
            e.id,
            e.name,
            e.mailAddress,
            new Date(e.lastLoginTime),
            projectKeys[i],
            projectNames.find((e) => e[0] === projectKeys[i])[1],
          ])
        );
      }

      console.log(adminsWithPjInfo);
      console.log(
        `プロジェクト管理者数: `,
        adminsWithPjInfo.length
      );
      // 日付フォーマットを整える
      // sv-SEロケールはYYYY-MM-DD形式の日付文字列を返す
      adminsWithPjInfo.map((e) => (e[3] = e[3].toLocaleDateString("sv-SE")));
      // ヘッダーを付加
      const headerString = [
        "ユーザーID",
        "プロジェクト管理者",
        "メールアドレス",
        "最終ログイン",
        "プロジェクトキー",
        "プロジェクト名",
      ];
      adminsWithPjInfo.unshift(headerString);
      // CSVファイルとして出力
      let adminsWithPjInfoCSV = "";
      adminsWithPjInfo.map(
        (e) => (adminsWithPjInfoCSV += e.join(",") + "\n")
      );
      fs.writeFileSync(
        `${output}/adminsWithPjInfo.csv`,
        adminsWithPjInfoCSV
      );
      console.log("done");
      const endTime = Date.now();
      console.log("実行時間（ミリ秒）: ", endTime - startTime);
    });
  })
  .catch((err) => console.log("エラー", err));
