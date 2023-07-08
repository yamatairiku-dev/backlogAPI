'use strict'
const axios = require('axios')
const fs = require('fs')
const output = './output/'
require('dotenv').config()

// ユーザー取得を除外するプロジェクト
const exclusionProjects = process.env.EXCLUSION_PROJECTS

// 全ユーザーを取得
const allUsers = axios.get(`${process.env.MY_SPACE}/api/v2/users?apiKey=${process.env.API_KEY}`)

// 全プロジェクトを取得
const allProjects = axios.get(`${process.env.MY_SPACE}/api/v2/projects?apiKey=${process.env.API_KEY}&archived=false&all=true`)

// プロジェクトのユーザーを取得
const usersPerProject = (projectID) => {
  return axios.get(`${process.env.MY_SPACE}/api/v2/projects/${projectID}/users?apiKey=${process.env.API_KEY}`)
}

const getActiveUsers = () => {
  return new Promise((resolve, reject) => {
    allProjects.then(result => {
      const projectKeys = result.data.map(e => e.projectKey).filter(val => !exclusionProjects.includes(val))
      console.log('プロジェクト数: ', projectKeys.length)

      // プロジェクト毎のユーザーを取得
      const totalUsers = projectKeys.map(e => usersPerProject(e))
      Promise.all(totalUsers).then(result => {
        // プロジェクト毎のユーザーIDを抽出
        const totalUserIDs = []
        result.map(e => e.data.map(e => totalUserIDs.push(e.id)))
        console.log('延べユーザー数', totalUserIDs.length)

        // ユーザーIDの重複排除
        const set = new Set(totalUserIDs)
        const activeUsers = [...set]
        console.log('アクティブユーザー数: ', activeUsers.length)
        resolve(activeUsers)
      }).catch(err => reject(err))
    }).catch(err => reject(err))
  })
}

const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    allUsers.then(result => {
      // ユーザーID，ユーザー名，メールアドレスを抽出
      const userIDs = result.data.map(e => [e.id, e.name, e.mailAddress])
      console.log('全ユーザー数: ', userIDs.length)
      resolve(userIDs)
    }).catch(err => reject(err))
  })
}

Promise.all([getAllUsers(), getActiveUsers()]).then(result => {
  const allUsers = result[0]
  const activeUsers = result[1]

  // 全ユーザーのIDからアクティブユーザーのIDを削除
  const usersIdsToBeDeleted = allUsers.map(e => e[0]).filter(val => !activeUsers.includes(val))

  // 削除対象ユーザーのIDからユーザー情報を付加
  const usersToBeDeleted = allUsers.filter(val => usersIdsToBeDeleted.includes(val[0]))
  console.log('削除ユーザー数: ', usersToBeDeleted.length)
  console.log(usersToBeDeleted)

  // CSVファイルとして出力
  let usersToBeDeletedCSV = ''
  usersToBeDeleted.map(e => (usersToBeDeletedCSV += e.join(',') + '\n'))
  fs.writeFileSync(`${output}/usersToBeDeleted.csv`, usersToBeDeletedCSV)
}).catch(err => console.log('エラー', err))
