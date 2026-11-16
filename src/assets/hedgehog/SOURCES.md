# ハリネズミ素材の出どころ

すべて『はりねずみの杉山』MV 用に生成済みの素材を流用（2026-11-16 コピー、元ファイルは無変更）。
元フォルダ：`榑田いつき - 4th Single『はりねずみの杉山』/assets/sprites/`（MV プロジェクト内の切り抜き済み透過 PNG）

| サイト内のファイル | 元ファイル | 用途 |
| --- | --- | --- |
| hero.png | front/front-0.png | ヘッダーのハリネズミ（通常） |
| hero-happy.png | front/front-2.png | ヘッダーのハリネズミ（タップ時「><」） |
| peek.png | sheet0/sheet0-1.png | MUSIC 欄で画面右端から顔を出す |
| sleep.png | sleep/sleep-0.png | NEWS 欄で寝ている |
| sleep-grumpy.png | sleep/sleep-3.png | NEWS 欄（タップで半目） |
| ball.png | curl/curl-3.png | フッターの隠れハリネズミ（丸まり） |
| wave.png | dance/dance-0.png | フッターの隠れハリネズミ（見つかったとき） |
| belly.png | sleep/sleep-1.png | NEXT RELEASE の絵 |
| note.png | icons/icons-2.png | 音符モチーフ |
| sparkle.png | icons/icons-3.png | きらきらモチーフ |
| heart.png | icons/icons-0.png | 吹き出しのハート |

表示用には Astro のビルド時に WebP へ縮小変換される（元 PNG はこのフォルダに保持）。

## WO-SITE-03 で追加（2026-11-17 コピー、元ファイルは無変更）

| サイト内のファイル | 元ファイル | 用途 |
| --- | --- | --- |
| lost.png | sniff/sniff-0.png | 404 の迷子のハリネズミ（くんくん） |
| lost-found.png | sniff/sniff-2.png | 404 の迷子のハリネズミ（タップでにっこり） |

`public/` の配信用画像（ビルドで変換されず、そのままのパスで配信）：

| ファイル | 元素材 | 加工 |
| --- | --- | --- |
| ogp.jpg（1200×630） | `sources/diecut_sugiyama.psd`（杉山の原画、単一レイヤー） | レイヤーの透過をそのまま読み出し、高さ 540px に縮小して紙色 #F2EBE6 の中央に配置。絵の改変なし |
| favicon.ico（16/32/48）・favicon-32x32.png | `assets/sprites/front/front-0.png`（hero.png と同じ） | 縮小のみ（透過） |
| apple-touch-icon.png（180×180） | 同上 | 縮小して紙色背景に配置（iOS は透過を黒にするため） |
