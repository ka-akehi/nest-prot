# SQLインジェクション脆弱性テスト手順

このドキュメントでは、`cats` API を例に SQL インジェクション（SQLi）の脆弱性を検証する方法をまとめます。テストは必ずローカルまたは専用の検証環境で行い、本番環境では実施しないでください。

## 前提準備
- `npm run prisma-reset` などでデータベースを初期化する。
- `npm run start:dev` でアプリケーションを起動する。
- 以下のようにテストデータを投入しておくと挙動が比較しやすい。

```bash
curl -X POST http://localhost:3000/cats \
  -H 'Content-Type: application/json' \
  -d '{"name":"Tama","age":2,"breed":"Mikeneco"}'
```

## 手動テスト

### 1. 脆弱な検索 (`GET /cats/search/unsafe`)
- SQL インジェクションが成立する例:
  - すべてのレコードが返る: `GET /cats/search/unsafe?keyword=' OR '1'='1` （期待値: フィルタ無視で全件返却され、脆弱性が成立する）
  - LIKE ワイルドカード挙動: `GET /cats/search/unsafe?keyword=%` （期待値: すべてのレコードがヒットし、ユーザ入力が直接 SQL に挿入されていることを確認）
  - 一文字ワイルドカード: `GET /cats/search/unsafe?keyword=_` （期待値: 名前・品種が 1 文字以上のレコードがヒットし、任意の文字にマッチする）
- データ改ざんを伴うペイロード（テスト環境限定）:
  - `GET /cats/search/unsafe?keyword=' UNION SELECT 999, 'Injected', 0, 'Payload' --` （期待値: 本来存在しないID 999のレコードがレスポンスに混ざり、任意データを注入できる）

### 2. 安全な検索 (`GET /cats/search/safe`)
- `GET /cats/search/safe?keyword=' OR '1'='1` （期待値: 空配列または通常件数のみが返り、フィルタがバイパスされない）
- `GET /cats/search/safe?keyword=%` （期待値: LIKE パターンとして扱われるため全件が返る。ワイルドカードが無効化されていない点を確認する）
- `GET /cats/search/safe?keyword=_` （期待値: `_` もワイルドカードとして扱われ、全件が返る）
- `GET /cats/search/safe?keyword=Tama` （期待値: 名前が `Tama` のレコードのみ取得でき、正常系の動作は維持される）

### 3. ワイルドカード無効化検索 (`GET /cats/search/safe-literal`)
- `GET /cats/search/safe-literal?keyword=%` （期待値: `%` を文字として扱うため該当レコードがなければ空配列）
- `GET /cats/search/safe-literal?keyword=_` （期待値: `_` も文字として扱われ、完全一致しなければヒットしない）
- `GET /cats/search/safe-literal?keyword=Tama` （期待値: `Tama` を含むレコードのみ取得でき、通常検索との差分がないことを確認できる）

### 4. 高度検索 (`GET /cats/filter/advanced`)
- `GET /cats/filter/advanced?keyword=cat&minAge=1&sortBy=age&order=desc` （期待値: 名前・品種に `cat` を含むレコードが年齢降順で返却される）
- `GET /cats/filter/advanced?minAge=abc` （期待値: `minAge` が数値でないため Prisma が例外を返すか、フィルタが適用されずデフォルト挙動になる）
- `GET /cats/filter/advanced?sortBy=unknown` （期待値: 未定義項目は無視され、デフォルトの `id` 昇順になる）

## 自動化ツール
- **Burp Suite / OWASP ZAP**: `GET /cats/search/unsafe` に対してアクティブスキャンを行い、レスポンス差分やエラーメッセージを確認。`search/safe` や `filter/advanced` を対照として登録しておく。期待値: unsafe に対しては SQLi 高リスクが検出され、safe/advanced は誤検知がない。
- **sqlmap**: `sqlmap -u "http://localhost:3000/cats/search/unsafe?keyword=*" --risk=2 --level=5` を実行。期待値: unsafe でインジェクション脆弱性を報告し、`--level=5` でも safe/advanced は exploitable と判断されない。
- スキャナは誤検知が発生し得るため、報告された結果は手動で再現確認する。期待値: レポートで示されたエラーメッセージが実際のアプリログと一致し、再現テストで同じ挙動を確認できる。

## 復旧と後処理
- 破壊的テスト後は `npm run prisma-reset` などで状態を戻す。
- ログやアプリの例外メッセージを確認し、情報漏えいリスクがないかチェックする。
- 学んだポイントを README やテスト計画書に反映し、次の改善（自動テストパターン追加、WAF 設定など）を検討する。
