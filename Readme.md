# 環境設定ファイル
.envファイルを作成して、環境変数を定義する
# 環境変数
```
MY_SPACE = 'スペースのURL（末尾のスラッシュは無し）'
API_KEY = 'Api Key'
EXCLUSION_PROJECTS = 'ProjectIDの配列'
```
# 一括処理
## getUsersToBeDeleted.js
### 機能
プロジェクトに参加していないユーザーを出力する　=> usersToBeDeleted.csv
# 分割処理
## 01getUsers.js
### 機能
ユーザー一覧を出力する　=> userIDs.json
## 02getProjectIDs.js
### 機能
プロジェクト一覧を出力する => projectIDs.json
## 03getPjMember.js
### 前提条件
02getProjectIDs.jsが実行済み
### 機能
プロジェクトに参加しているユーザー一覧を出力する => pjMember.json, pjMember.csv
## 04usersForDelete.js
### 前提条件
01getUsers.js, 03getPjMember.jsが実行済み
### 機能
プロジェクトに参加していないユーザーを出力する　=> usersForDelete.csv
