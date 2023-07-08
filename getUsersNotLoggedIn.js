'use strict'
const axios = require('axios')
const fs = require('fs')
const output = './output'
require('dotenv').config()

const getUsersUrl = '/api/v2/users'
const now = Date.now()
const standardDate = now - 180 * 24 * 60 * 60 * 1000 // 180日前

const asyncFunc = async () => {
  const result = await axios.get(`${process.env.MY_SPACE}${getUsersUrl}?apiKey=${process.env.API_KEY}`)
    .catch(() => console.log('エラー'))
  const userNotLoggedIn = result.data.map(e => [e.id, e.name, e.mailAddress, new Date(e.lastLoginTime)]).filter(val => (val[3].getTime() <= standardDate))
  console.log('全ユーザー数: ', result.data.length)
  console.log('しばらくログインしていないユーザー数: ', userNotLoggedIn.length)
  let usersNotLoggedInCSV = ''
  userNotLoggedIn.map(e => (usersNotLoggedInCSV += e.join(',') + '\n'))
  fs.writeFileSync(`${output}/usersNotLoggedIn.csv`, usersNotLoggedInCSV)
}

asyncFunc().finally(() => console.log('done'))
