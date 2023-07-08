# 事前準備
## 環境設定ファイル
環境変数を設定するための '.env' ファイルを作成
```
touch .env
```
## 環境変数
環境変数を設定
```
MY_SPACE = 'スペースのURL（末尾のスラッシュは無し）'
API_KEY = '管理者権限のAPIキー'
EXCLUSION_PROJECTS = 'ユーザー取得を除外するプロジェクトのIDの配列'
```
## 出力フォルダー
ファイルの出力先フォルダーを作成
```
mkdir output
```
# 一括処理
## getUsersToBeDeleted.js
### 機能
プロジェクトに参加していないユーザーを出力する　=> usersToBeDeleted.csv
## getUsersNotLoggedIn.js
### 機能
しばらくログインしていないユーザーを出力する　=> getUsersNotLoggedIn.csv
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