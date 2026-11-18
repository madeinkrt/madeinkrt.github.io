作品データの書き方（このファイルはサイトには表示されません）

トップページ・Works ページ・作品ページは、どれもこのフォルダのデータから作られます（二重管理しない）。

- 1作品 = 1つの .md ファイル。ファイル名は半角英数字（例: lantana.md）。
  ファイル名（拡張子なし）が作品の ID になり、作品ページは /works/lantana/ になります。
  Works ページでは /works/#lantana のようにその作品へ直接飛べます。
  カードのジャケットと曲名を押すと作品ページに移ります。
- status:
    released = 既発表（トップの MUSIC 欄、Works の「既発表」に出る）
    upcoming = 制作中（トップの NEXT RELEASE 欄、Works の「制作中」に出る）
- label: 「1st Single」など。小さく英字で表示。
- target: 目標表記（例: 「ボカコレ2027冬 参加目標」）。確定・予定とは書かない。
    target がある制作中作品 … トップでは先頭が NEXT RELEASE の大きな枠、残りは「その先に」の行に出る。
    target が空欄の制作中作品 … 日程は出さず、「ほかに制作中」として小さく出る。
- order: 並び順。発表順の通し番号（1st = 1, 2nd = 2, …）。小さいほど先。
- jacket: ジャケット画像。src/assets/jackets/ に画像を置き、この .md からの相対パスで書く。
    例) jacket: ../../assets/jackets/lantana.jpg
  画像は長辺 800px 程度の JPEG に縮めてから置く（原寸はリポジトリに入れない）。
  表示用の WebP はビルド時に自動で作られます。
  空欄のままなら「JACKET 準備中」の枠が出ます。
- links: 鑑賞リンク。トップのカードと Works の両方で使われます。
  url が空欄のものは「準備中」と表示され、押せません。制作中の作品は links: [] のままにする。
- 本文（--- の下）は任意。短い紹介文を書くとカードに表示されます。

作品ページ用の項目（すべて任意。空欄・未記入ならその節ごと出ません）
- releaseDate: 公開日。2025-12-19 の形で書く。作品ページに「公開日：2025年12月19日」と出る。
- credits: クレジット。1行ずつ並べる。「唄：」で始まる行は曲名の横の feat. 表記にも使われる。
    例) credits:
          - 唄：宮舞モカ
          - 作詞・作曲・編曲・絵・動画：榑田いつき
- intro: 作品ページの紹介文。SNS で共有したときの説明文にもなる（未記入なら「榑田いつき - 1st Single『ランタナ』」の形）。
- piaproUrl: piapro（歌詞・インスト）の URL。「piapro で見る」ボタンが出る。
- spotifyUrl: Spotify のアルバム（シングル）ページの URL。作品ページの「聴く・観る」に「Spotify で聴く」ボタン、
    カードの鑑賞ボタンの横に小さな「Spotify」の文字リンクが出る。
- appleMusicUrl: Apple Music のアルバム（シングル）ページの URL。同じく「Apple Music で聴く」ボタンと
    「Apple Music」の文字リンクが出る。
    並びはどちらも ニコニコ動画／YouTube／Spotify／Apple Music の順。未記入のものは出ない。
    （以前の streamingUrl は廃止しました。書いてもサイトには出ません）
- youtubeMusicUrl: YouTube Music の URL。作品ページの「聴く・観る」に「YouTube Music で聴く」ボタンが出る。
- amazonMusicUrl: Amazon Music のアルバム（シングル）ページの URL。「Amazon Music で聴く」ボタンが出る。
- lineMusicUrl: LINE MUSIC のアルバム（シングル）ページの URL。「LINE MUSIC で聴く」ボタンが出る。
- kkboxUrl: KKBOX のアルバム（シングル）ページの URL。「KKBOX で聴く」ボタンが出る。
- moraUrl: mora のパッケージページの URL。「mora で聴く」ボタンが出る。
- recochokuUrl: レコチョクのアルバム（シングル）ページの URL。「レコチョク で聴く」ボタンが出る。
- kiiteUrl: Kiite の楽曲ページの URL。https://kiite.jp/song/<ID>/listed-by の形で書く（/song/<ID> だけだと 404 になる）。
    「Kiite で聴く」ボタンが出る。
    この7つは作品ページだけに出て、カードには出ない（カードは Spotify／Apple Music だけ）。
    並びは Spotify／Apple Music の後に YouTube Music／Amazon Music／LINE MUSIC／KKBOX／mora／レコチョク／Kiite の順。
    未記入のものは出ない。
- fanboxUrl: FANBOX の記事 URL。既発表の作品は未記入でも FANBOX トップへの案内が出る。
    制作中の作品は、ここを書いたときだけ案内が出る。
