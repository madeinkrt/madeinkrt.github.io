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

export async function getLinks() {
	const all = (await getCollection('links')).sort(byOrder);
	return {
		main: all.filter((l) => l.data.group === 'main'),
		other: all.filter((l) => l.data.group === 'other'),
	};
}
