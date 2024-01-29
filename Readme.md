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
EXCLUSION_PROJECTS = ['ユーザー取得を除外するプロジェクトのIDの配列']
NOT_LOGGED_IN_DAYS = 最近ログインしていない期間（日数を数字で）
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

## getUsersNotLoggedInWithPjInfo.js

### 機能

しばらくログインしていないユーザーを出力する（プロジェクト名付き、延べユーザー）=> usersToBeDeletedWithPjInfo.csv

# 分割処理（一括処理の途中経過が必要なときにご利用ください）

## 01getUsers.js

### 機能

ユーザー一覧を出力する　=> userIDs.json

## 02getProjectIDs.js

### 機能

プロジェクト一覧を出力する => projectIDs.json

## 03getPjMember.js

### 前提条件

02getProjectIDs.js が実行済み

### 機能

プロジェクトに参加しているユーザー一覧を出力する => pjMember.json, pjMember.csv

## 04usersForDelete.js

### 前提条件

01getUsers.js, 03getPjMember.js が実行済み

### 機能

プロジェクトに参加していないユーザーを出力する　=> usersForDelete.csv
