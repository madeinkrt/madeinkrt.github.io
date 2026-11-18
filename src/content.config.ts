// サイトのデータ定義（Astro Content Collections）
//
// 作品・お知らせ・リンク集はページにハードコードせず、ここで定義したデータファイルから読みます。
//   - 作品     : src/content/works/*.md   （1作品 = 1ファイル、Markdown + frontmatter）
//   - お知らせ : src/content/news/*.md    （1件 = 1ファイル）
//   - リンク集 : src/data/links.json
// GitHub Mobile での直接編集にも、フォーム型 CMS（Markdown フォルダを扱うもの）にも
// そのまま載せ替えられるよう、フィールドは平坦で単純な形にしています。
import { defineCollection, z } from 'astro:content';
import { glob, file } from 'astro/loaders';

// 空欄（"" / null）を「未設定」として扱うための小さなヘルパー。
// CMS やスマホ編集で値を消したときにビルドが落ちないようにする。
const emptyToUndefined = (v: unknown) => (v === '' || v === null ? undefined : v);

// 日付（YYYY-MM-DD）。YAML では引用符なしの 2025-12-19 が日付型として読まれるので、文字列に戻してから確かめる。
const ymd = (v: unknown) => {
	const u = emptyToUndefined(v);
	return u instanceof Date ? u.toISOString().slice(0, 10) : u;
};

// 文字列の配列。空欄の行は捨て、1件も残らなければ「未設定」とする。
const stringList = (v: unknown) => {
	const u = emptyToUndefined(v);
	if (!Array.isArray(u)) return u;
	const rest = u.filter((s) => s !== '' && s !== null && s !== undefined);
	return rest.length > 0 ? rest : undefined;
};

// 任意の URL（空欄なら未設定）
const optionalUrl = z.preprocess(emptyToUndefined, z.string().url().optional());

const works = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/works' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			// released = 既発表（トップ MUSIC 欄・Works「既発表」） / upcoming = 制作中（トップ NEXT RELEASE 欄・Works「制作中」）
			status: z.enum(['released', 'upcoming']),
			// 例: "4th Single"（英語は飾りとして小さく表示）
			label: z.preprocess(emptyToUndefined, z.string().optional()),
			// 目標表記。例: "ボカコレ2027冬 参加目標"（確定・予定とは書かない）
			// 制作中で target が空の作品は、日程を出さずに「ほかに制作中」として扱う
			target: z.preprocess(emptyToUndefined, z.string().optional()),
			// 並び順（発表順の通し番号。小さいほど先）
			order: z.number().default(100),
			// ジャケット画像（この .md からの相対パス）。未設定なら「準備中」の枠を表示
			jacket: z.preprocess(emptyToUndefined, image().optional()),
			// 鑑賞リンク。url が空のものは「準備中」として押せない表示になる
			links: z
				.array(
					z.object({
						label: z.string(),
						url: z.preprocess((v) => v ?? '', z.string()),
					}),
				)
				.default([]),
			// ── 以下は作品ページ（/works/<ID>/）用。すべて任意で、未設定なら作品ページでその節ごと出さない ──
			// 公開日（YYYY-MM-DD）。作品ページに「公開日：2025年12月19日」の形で出る
			releaseDate: z.preprocess(ymd, z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD で書いてください').optional()),
			// クレジット（1行 = 1項目）。例: "唄：宮舞モカ"。「唄：」の行は曲名の feat. 表記にも使う
			credits: z.preprocess(stringList, z.array(z.string()).optional()),
			// 作品ページの紹介文（OGP の説明文にも使う）
			intro: z.preprocess(emptyToUndefined, z.string().optional()),
			// piapro（歌詞・インスト）の URL
			piaproUrl: optionalUrl,
			// 配信の URL（WO-SITE-09）。設定したときだけ、作品ページに「Spotify で聴く」「Apple Music で聴く」ボタン、
			// カードの鑑賞ボタンの横に小さな文字リンクが出る（既発表・制作中を問わず、設定の有無だけで決まる）
			spotifyUrl: optionalUrl,
			appleMusicUrl: optionalUrl,
			// そのほかの配信の URL（WO-SITE-11）。設定したときだけ、作品ページの「聴く・観る」に「〇〇 で聴く」ボタンが出る。
			// カードには出さない（カードは Spotify／Apple Music だけ。配信の全量は作品ページで案内する）
			youtubeMusicUrl: optionalUrl,
			amazonMusicUrl: optionalUrl,
			lineMusicUrl: optionalUrl,
			kkboxUrl: optionalUrl,
			moraUrl: optionalUrl,
			recochokuUrl: optionalUrl,
			kiiteUrl: optionalUrl,
			// FANBOX の URL。既発表の作品は未設定でも FANBOX トップへの案内を出す。制作中の作品は設定したときだけ出す
			fanboxUrl: optionalUrl,
		}),
});

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
		// カテゴリ（WO-SITE-13 で内容別の5分類に）。
		// release = リリース / info = お知らせ / writing = 文章 / fanbox = FANBOX / site = サイト更新
		// 表示ラベルは src/lib/data.ts の newsCategories。未設定・空欄なら info（お知らせ）
		category: z.preprocess(
			emptyToUndefined,
			z.enum(['release', 'info', 'writing', 'fanbox', 'site']).default('info'),
		),
	}),
});

const links = defineCollection({
	loader: file('src/data/links.json'),
	schema: z.object({
		label: z.string(),
		// 空なら「準備中」として押せない表示になる
		url: z.preprocess((v) => v ?? '', z.string()),
		// main = 主要（大きなボタンで常に表示） / other = 「その他のリンク」にまとめる
		group: z.enum(['main', 'other']).default('other'),
		// 補足（例: "mstdn.jp"）。リンク名の横に小さく出る
		note: z.preprocess(emptyToUndefined, z.string().optional()),
		order: z.number().default(100),
	}),
});

export const collections = { works, news, links };
