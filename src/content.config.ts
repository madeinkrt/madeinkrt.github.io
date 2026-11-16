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
		}),
});

const news = defineCollection({
	loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
	schema: z.object({
		title: z.string(),
		date: z.coerce.date(),
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
