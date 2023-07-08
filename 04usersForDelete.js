const fs = require('fs')
const output = './output'
const pjMember = require(`${output}/pjMember.json`)
const users = require(`${output}/userIDs.json`)
const activeUserIDs = []

pjMember.map(e => e.map(ele => activeUserIDs.push(ele[0])))
const set = new Set(activeUserIDs)
const uniqueActiveUserIDs = [...set]
const userIDs = users.map(e => e[0])
const userIDsForDelete = userIDs.filter(val => !uniqueActiveUserIDs.includes(val))
const result = users.filter(val => userIDsForDelete.includes(val[0]))

let resultCSV = ''

result.map(ele => (resultCSV += ele.join(',') + '\n'))
console.log(resultCSV)
console.log('全ユーザー数:' + userIDs.length)
console.log('アクティブユーザー数:' + uniqueActiveUserIDs.length)
console.log('削除ユーザー数:' + result.length)
fs.writeFileSync(`${output}/nonActiveUsers.csv`, resultCSV)
