'use strict'
const axios = require('axios')
const fs = require('fs')
const output = './output/'
require('dotenv').config()

const getUsersUrl = '/api/v2/users'

const asyncFunc = async () => {
  const result = await axios.get(`${process.env.MY_SPACE}${getUsersUrl}?apiKey=${process.env.API_KEY}`)
    .catch(() => console.log('エラー'))
  // console.log(result)
  const userIDs = result.data.map(e => [e.id, e.name, e.mailAddress])
  console.log('ユーザー数: ' + userIDs.length)
  fs.writeFileSync(`${output}/userIDs.json`, JSON.stringify(userIDs))
}

asyncFunc().finally(() => console.log('done'))
