// sitemap.xml（WO-SITE-08 で public/sitemap.xml の手書きからビルド時生成に変更）
// 固定ページは下の一覧に手で書く（lastmod も内容を変えたときに手で更新する）。
// 作品ページ（/works/<ID>/）は src/content/works から自動で足すので、作品を増やしても書き足さなくてよい。
// 404 は載せない。robots.txt（public/）の Sitemap: 行はこの URL を指している。
import type { APIRoute } from 'astro';
import { getWorks, workPath } from '../lib/data';

const fixedPages: { path: string; lastmod: string }[] = [
	{ path: '/', lastmod: '2026-11-18' },
	{ path: '/works/', lastmod: '2026-11-18' },
	{ path: '/about/', lastmod: '2026-11-17' },
	{ path: '/contact/', lastmod: '2026-11-17' },
];

export const GET: APIRoute = async ({ site }) => {
	const { all } = await getWorks();
	const urls = [...fixedPages, ...all.map((w) => ({ path: workPath(w), lastmod: undefined }))];
	const body = urls
		.map(({ path, lastmod }) => {
			const loc = new URL(path, site).href;
			return `\t<url>\n\t\t<loc>${loc}</loc>\n${lastmod ? `\t\t<lastmod>${lastmod}</lastmod>\n` : ''}\t</url>`;
		})
		.join('\n');
	const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
	return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
