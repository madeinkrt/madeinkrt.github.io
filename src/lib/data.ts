// ページ共通のデータ取得。トップと Works が同じ作品データ（src/content/works）を
// 同じルールで振り分けるよう、振り分けはここ 1か所にまとめる（二重管理しない）。
import { getCollection, type CollectionEntry } from 'astro:content';

export type Work = CollectionEntry<'works'>;
export type SiteLink = CollectionEntry<'links'>;

const byOrder = (a: { data: { order: number } }, b: { data: { order: number } }) => a.data.order - b.data.order;

export async function getWorks() {
	const all = (await getCollection('works')).sort(byOrder);
	const released = all.filter((w) => w.data.status === 'released');
	const upcoming = all.filter((w) => w.data.status === 'upcoming');
	return {
		/** 全作品（発表順）。作品ページの前後ナビに使う */
		all,
		/** 既発表（発表順） */
		released,
		/** 制作中すべて（発表順） */
		upcoming,
		/** 制作中のうち目標表記があるもの（トップの NEXT RELEASE／その先に） */
		targeted: upcoming.filter((w) => !!w.data.target),
		/** 制作中のうち目標表記がないもの（日程は出さない） */
		untargeted: upcoming.filter((w) => !w.data.target),
	};
}

/** 作品ページの URL（/works/<作品 ID>/）。作品 ID は src/content/works のファイル名 */
export const workPath = (work: Work) => `/works/${work.id}/`;

type StreamingLink = { service: string; url: string };
const hasUrl = (l: { service: string; url?: string }): l is StreamingLink => !!l.url;

/**
 * カード用の配信リンク（WO-SITE-09）。設定のあるものだけを Spotify → Apple Music の順で返す。
 * カード（小さな文字リンク）はこの2つだけに絞る（カードを重くしない）。
 */
export function streamingLinks(work: Work) {
	const { spotifyUrl, appleMusicUrl } = work.data;
	return [
		{ service: 'Spotify', url: spotifyUrl },
		{ service: 'Apple Music', url: appleMusicUrl },
	].filter(hasUrl);
}

/**
 * 作品ページ用の配信リンク（WO-SITE-11）。カードと同じ Spotify → Apple Music の後に、
 * YouTube Music → Amazon Music → LINE MUSIC → KKBOX → mora → レコチョク → Kiite の順で、設定のあるものだけを返す。
 * 配信の全量は作品ページをハブとして案内する。
 */
export function allStreamingLinks(work: Work) {
	const { youtubeMusicUrl, amazonMusicUrl, lineMusicUrl, kkboxUrl, moraUrl, recochokuUrl, kiiteUrl } = work.data;
	return [
		...streamingLinks(work),
		...[
			{ service: 'YouTube Music', url: youtubeMusicUrl },
			{ service: 'Amazon Music', url: amazonMusicUrl },
			{ service: 'LINE MUSIC', url: lineMusicUrl },
			{ service: 'KKBOX', url: kkboxUrl },
			{ service: 'mora', url: moraUrl },
			{ service: 'レコチョク', url: recochokuUrl },
			{ service: 'Kiite', url: kiiteUrl },
		].filter(hasUrl),
	];
}

export type News = CollectionEntry<'news'>;
export type NewsCategory = News['data']['category'];

/** NEWS のカテゴリ（WO-SITE-12）。並び順は /news/ の絞り込みボタンの順 */
export const newsCategories: { key: NewsCategory; label: string }[] = [
	{ key: 'news', label: 'お知らせ' },
	{ key: 'activity', label: '活動' },
	{ key: 'site', label: 'サイト更新' },
];
export const newsCategoryLabel = (key: NewsCategory) => newsCategories.find((c) => c.key === key)?.label ?? key;

/** お知らせ全件（日付の新しい順。同じ日付はファイル名の逆順）。トップ（先頭3件）と /news/（全件）で共通 */
export async function getNews() {
	return (await getCollection('news')).sort(
		(a, b) => b.data.date.getTime() - a.data.date.getTime() || b.id.localeCompare(a.id),
	);
}

/** お知らせの日付表示（2026.11.18）。日付は UTC の 0 時として読まれるので UTC で取り出す */
export const fmtNewsDate = (d: Date) =>
	`${d.getUTCFullYear()}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${String(d.getUTCDate()).padStart(2, '0')}`;

export async function getLinks() {
	const all = (await getCollection('links')).sort(byOrder);
	return {
		main: all.filter((l) => l.data.group === 'main'),
		other: all.filter((l) => l.data.group === 'other'),
	};
}
