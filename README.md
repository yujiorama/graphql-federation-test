# graphql-federation-test

graphql-federation-test

## サブグラフのフィールドを移行する実験

### 前提条件

- current-serviceとnew-serviceをGraphQL Federation v2で統合している
- WunderGraph Cosmo routerは `@override` ディレクティブをサポートしている
- current-serviceとnew-serviceは同じデータベースを利用している

### 1. 複数の型からなるunion型の移行

#### 課題

- current-serviceのunion型 `Ad` を段階的にnew-serviceへ移行する

#### 解決策

- 考え方
    - union型の部分型Tをエンティティにする
    - new-serviceで部分型Tを解決できるようにする
    - current-serviceは部分型Tのキーと`__typename`だけを解決できるようにする

##### 1. AdLink型を移行する

- 1.1 AdLink型をエンティティにする
    - current-serviceのサブグラフスキーマのAdLink型に `@key` ディレクティブを追加する
    - スーパーグラフを合成する
    - GraphQLクエリをrouterに送信して、サブグラフcurrent-serviceがAdLink型を解決していることを確認する
- 1.2 new-serviceでAdLink型を解決できるようにする
    - new-serviceの SDL に `extend type AdLink` を追加する
        - current-service と同じ `@key(fields: "id")` を指定する
    - new-serviceのリファレンスリゾルバーにAdLink型を実装する
    - new-serviceの SDL をnew-serviceのサブグラフスキーマに反映する
    - スーパーグラフを合成する
    - GraphQLクエリをrouterに送信して、サブグラフcurrent-serviceがAdLink型を解決していることを確認する
- 1.3 current-serviceはAdLink型のキーと`__typename`だけを解決できるようにする
    - current-serviceのItem.adsフィールドリゾルバーがAdLink型をキーと`__typename`だけを返すようにする
    - GraphQLクエリをrouterに送信して、サブグラフnew-serviceがAdLink型を解決していることを確認する

##### 2. AdImage型を移行する

- 2.1 AdImage型をエンティティにする
    - current-serviceのサブグラフスキーマのAdImage型に `@key` ディレクティブを追加する
    - スーパーグラフを合成する
    - GraphQLクエリをrouterに送信して、サブグラフcurrent-serviceがAdImage型を解決していることを確認する
- 2.2 new-serviceでAdImage型を解決できるようにする
    - new-serviceの SDL に `extend type AdImage` を追加する
        - current-service と同じ `@key(fields: "id")` を指定する
    - new-serviceのリファレンスリゾルバーにAdImage型を実装する
    - new-serviceの SDL をnew-serviceのサブグラフスキーマに反映する
    - スーパーグラフを合成する
    - GraphQLクエリをrouterに送信して、サブグラフcurrent-serviceがAdImage型を解決していることを確認する
- 2.3 current-serviceはAdImage型のキーと`__typename`だけを解決できるようにする
    - current-serviceのItem.adsフィールドリゾルバーがAdImage型をキーと`__typename`だけを返すようにする
    - GraphQLクエリをrouterに送信して、サブグラフnew-serviceがAdImage型を解決していることを確認する

##### 3. union型 `Ad` を移行する

- new-service の SDL に `extend type Item` を追加する
    - ads フィールドに `@override(from: "current-service")` を指定する
- new-serviceの SDL にunion型 `Ad` を追加する
- new-serviceにunion型 `Ad` のタイプリゾルバーを実装する
- new-serviceの SDL をnew-serviceのサブグラフスキーマに反映する
- スーパーグラフを合成する
- GraphQLクエリをrouterに送信して、サブグラフnew-serviceがunion型`Ad`を解決していることを確認する

### 2. エンティティが実装している複数のinterface型の移行

#### 課題

- current-serviceのItem型とTag型が実装しているNameValue interfaceをnew-serviceへ移行する

#### 解決策

- 考え方
    - NameValue は「値型」（エンティティではない）
        - 当面は current-service と new-service の両方に型定義があっても壊れない
    - エンティティ Item を解決する責任を current-service に残したまま、name と value フィールドの解決を new-service に任せる
        - new-service で Item を extend して name と value フィールドに `@override(from: "current-service")` を指定する
        - ルーターは name/value を new-service にルーティングする
        - [@override](https://www.apollographql.com/docs/graphos/schema-design/federated-schemas/reference/directives#override)

##### 1. new-service に NameValue を追加

- new-service の SDL に current-service と同一の NameValue インターフェイスを追加する

##### 2. new-service に Item を追加

- new-service の SDL に `extend type Item` を追加する
    - current-service と同じ `@key(fields: "id")` を指定する
    - name フィールドには `@override(from: "current-service")` を指定する
    - value フィールドに `@override(from: "current-service")` を指定する

##### 3. new-service のリゾルバー実装

- Itemリゾルバーを実装する
- Item.name フィールドリゾルバーを実装する
- Item.value フィールドリゾルバーを実装する

##### 4. スーパーグラフの合成

- new-serviceの SDL をnew-serviceのサブグラフスキーマに反映する
- スーパーグラフを合成する
- GraphQLクエリをrouterに送信して、サブグラフnew-serviceがNameValueインターフェイスのフィールドを解決していることを確認する

##### 5. 後始末

- current-service の SDL に定義した Item に name/value が残っていてもよい
    - ロールバックが必要になった場合、一つ前のスーパーグラフに戻すだけで復旧可能
- current-service の SDL から interface NameValue の定義を削除してもよい
    - current-service の SDL では別のサブグラフのinterfaceを参照できるので `Item implements NameValue` はそのままでもよい
      補足
