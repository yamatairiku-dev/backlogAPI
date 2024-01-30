"use strict";
const startTime = Date.now();
const axios = require("axios");
const fs = require("fs");
const output = "./output";
require("dotenv").config();

// ユーザー取得を除外するプロジェクト
const exclusionProjects = process.env.EXCLUSION_PROJECTS;

// 全ユーザーの情報を取得(プロミス)
const allUsers = axios.get(
  `${process.env.MY_SPACE}/api/v2/users?apiKey=${process.env.API_KEY}`
);

// 全プロジェクトの情報を取得(プロミス)
const allProjects = axios.get(
  `${process.env.MY_SPACE}/api/v2/projects?apiKey=${process.env.API_KEY}&archived=false&all=true`
);

// プロジェクトのユーザーを取得する関数
const usersPerProject = (projectID) => {
  return axios.get(
    `${process.env.MY_SPACE}/api/v2/projects/${projectID}/users?apiKey=${process.env.API_KEY}`
  );
};

// プロジェクトに参加しているユーザー（アクティブユーザー）を取得する関数
const getActiveUsers = () => {
  return new Promise((resolve, reject) => {
    allProjects
      .then((result) => {
        const projectKeys = result.data
          .map((e) => e.projectKey) // プロジェクトの情報からプロジェクトID（key）を取得
          .filter((val) => !exclusionProjects.includes(val)); // 環境変数で指定したプロジェクトIDを除外
        console.log("プロジェクト数: ", projectKeys.length);

        // プロジェクト毎のユーザーを取得(プロミス)
        const totalUsers = projectKeys.map((e) => usersPerProject(e));
        Promise.all(totalUsers).then((result) => {
          const totalUserIDs = []; // UserIDを格納するための配列
          // プロジェクト毎のユーザー情報からユーザーIDのみ抽出して格納
          result.map((e) => e.data.map((e) => totalUserIDs.push(e.id)));
          console.log("延べユーザー数", totalUserIDs.length);

          // ユーザーIDの重複排除
          const set = new Set(totalUserIDs);
          const activeUsers = [...set];
          console.log("アクティブユーザー数: ", activeUsers.length);
          resolve(activeUsers);
        });
      })
      .catch((err) => reject(err));
  });
};

// 全ユーザーを取得する関数
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    allUsers
      .then((result) => {
        // ユーザーID，ユーザー名，メールアドレス，最終ログイン日時を抽出
        const allUserIDs = result.data.map((e) => [
          e.id,
          e.name,
          e.mailAddress,
          new Date(e.lastLoginTime),
        ]);
        console.log("全ユーザー数: ", allUserIDs.length);
        resolve(allUserIDs);
      })
      .catch((err) => reject(err));
  });
};

Promise.all([getAllUsers(), getActiveUsers()])
  .then((result) => {
    const allUsers = result[0];
    const activeUsers = result[1];

    // 全ユーザーのIDをアクティブユーザー以外でフィルタ
    const usersIdsToBeDeleted = allUsers
      .map((e) => e[0]) //ユーザーIDのみを抽出
      .filter((val) => !activeUsers.includes(val));

    // 全ユーザー情報を削除対象ユーザーIDでフィルタすることで、削除対象ユーザーのID、名前、メアド、最終ログイン日時を抽出
    const usersToBeDeleted = allUsers.filter((val) =>
      usersIdsToBeDeleted.includes(val[0])
    );
    console.log("削除ユーザー数: ", usersToBeDeleted.length);
    // 日付フォーマットを整える
    // sv-SEロケールはYYYY-MM-DD形式の日付文字列を返す
    usersToBeDeleted.map((e) => (e[3] = e[3].toLocaleDateString("sv-SE")));
    // ヘッダーを付加;
    const headerString = [
      "ユーザーID",
      "ユーザー名",
      "メールアドレス",
      "最終ログイン",
    ];
    usersToBeDeleted.unshift(headerString);
    console.log(usersToBeDeleted);
    // CSVファイルとして出力
    let usersToBeDeletedCSV = "";
    usersToBeDeleted.map((e) => (usersToBeDeletedCSV += e.join(",") + "\n"));
    fs.writeFileSync(`${output}/usersToBeDeleted.csv`, usersToBeDeletedCSV);
    console.log("done");
    const endTime = Date.now();
    console.log("実行時間（ミリ秒）: ", endTime - startTime);
  })
  .catch((err) => console.log("エラー", err));
