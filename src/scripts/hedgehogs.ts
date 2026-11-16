// トップページのハリネズミの仕掛け（試作 WO-SITE-01）
// - 依存ライブラリなし。すべて「タップ／スクロールされたときだけ」動く。
// - prefers-reduced-motion: reduce のときは動きを止め、表情の切り替えだけ行う。

const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
const reduced = () => reduceMotionQuery.matches;

// iOS Safari で :active（カードの浮き上がり）を効かせるための空リスナー
document.addEventListener('touchstart', () => {}, { passive: true });

/** 一定時間だけクラスを付け、時間が来たら外す（連打されたらタイマーを延長） */
const timers = new WeakMap<Element, Map<string, number>>();
function flash(el: Element, cls: string, ms: number) {
	let map = timers.get(el);
	if (!map) timers.set(el, (map = new Map()));
	window.clearTimeout(map.get(cls));
	el.classList.add(cls);
	map.set(
		cls,
		window.setTimeout(() => el.classList.remove(cls), ms),
	);
}

/** アニメーション用クラスを付け直す（連打でも毎回再生されるように） */
function replay(el: Element, cls: string) {
	el.classList.remove(cls);
	void (el as HTMLElement).offsetWidth; // reflow
	el.classList.add(cls);
}

// ── ①② ヘッダーのハリネズミ ─────────────────────────────
const hero = document.querySelector<HTMLButtonElement>('[data-hh="hero"]');
if (hero) {
	const jump = hero.querySelector('.hh__jump')!;
	const lean = hero.querySelector<HTMLElement>('.hh__lean')!;
	const noteSrc = hero.dataset.noteSrc;

	jump.addEventListener('animationend', () => jump.classList.remove('is-jumping'));

	hero.addEventListener('click', () => {
		flash(hero, 'is-alt', 1200);
		if (reduced()) return;
		replay(jump, 'is-jumping');
		if (noteSrc && hero.querySelectorAll('.pop-note').length < 6) {
			for (let i = 0; i < 2; i++) {
				const n = document.createElement('img');
				n.src = noteSrc;
				n.alt = '';
				n.className = 'pop-note';
				n.style.setProperty('--dx', `${(i === 0 ? -1 : 1) * (18 + Math.random() * 22)}px`);
				n.style.setProperty('--rot', `${(Math.random() - 0.5) * 50}deg`);
				n.style.animationDelay = `${i * 90}ms`;
				n.addEventListener('animationend', () => n.remove());
				hero.appendChild(n);
			}
		}
	});

	// ② 指・カーソルの方向へ少し傾く。ヘッダーが見えている間だけ反応する。
	let heroVisible = true;
	new IntersectionObserver(([e]) => (heroVisible = e.isIntersecting)).observe(hero);

	let raf = 0;
	let resetTimer = 0;
	const leanTo = (x: number) => {
		if (reduced() || !heroVisible) return;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			const r = hero.getBoundingClientRect();
			const dx = x - (r.left + r.width / 2);
			const t = Math.max(-1, Math.min(1, dx / (window.innerWidth * 0.5)));
			lean.style.setProperty('--lean', `${(t * 9).toFixed(2)}deg`);
			lean.style.setProperty('--shift', `${(t * 5).toFixed(1)}px`);
		});
	};
	const leanReset = () => {
		lean.style.setProperty('--lean', '0deg');
		lean.style.setProperty('--shift', '0px');
	};

	const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
	window.addEventListener(
		'pointermove',
		(e) => {
			if (e.pointerType === 'mouse' && finePointer.matches) leanTo(e.clientX);
		},
		{ passive: true },
	);
	document.documentElement.addEventListener('mouseleave', leanReset);
	// タッチ端末：タップした方向へ傾いて、少ししたら元に戻る
	window.addEventListener(
		'pointerdown',
		(e) => {
			if (e.pointerType === 'mouse') return;
			leanTo(e.clientX);
			window.clearTimeout(resetTimer);
			resetTimer = window.setTimeout(leanReset, 1400);
		},
		{ passive: true },
	);
}

// ── ③ 画面の端から顔を出すハリネズミ ───────────────────────
const peek = document.querySelector<HTMLButtonElement>('[data-hh="peek"]');
const peekArea = document.querySelector('[data-peek-area]');
if (peek && peekArea) {
	new IntersectionObserver(
		([e], obs) => {
			if (e.isIntersecting) {
				peek.classList.add('is-out');
				obs.disconnect();
			}
		},
		{ threshold: 0.35 },
	).observe(peekArea);

	peek.addEventListener('click', () => {
		// びくっ → 引っ込む → しばらくしてまた顔を出す
		flash(peek, 'is-hiding', 2600);
	});
}

// ── ④ 眠っているハリネズミ ──────────────────────────────
const sleepy = document.querySelector<HTMLButtonElement>('[data-hh="sleepy"]');
if (sleepy) {
	const jump = sleepy.querySelector('.hh__jump')!;
	jump.addEventListener('animationend', () => jump.classList.remove('is-wiggle'));
	sleepy.addEventListener('click', () => {
		flash(sleepy, 'is-alt', 2000);
		if (!reduced()) replay(jump, 'is-wiggle');
	});
}

// ── ⑤ フッターの隠れハリネズミ ───────────────────────────
const hidden = document.querySelector<HTMLButtonElement>('[data-hh="hidden"]');
if (hidden) {
	const jump = hidden.querySelector('.hh__jump')!;
	jump.addEventListener('animationend', () => jump.classList.remove('is-pop'));
	hidden.addEventListener('click', () => {
		flash(hidden, 'is-alt', 3200);
		if (!reduced()) replay(jump, 'is-pop');
	});
}

// ── ⑦ 404 の迷子のハリネズミ ───────────────────────────
const lost = document.querySelector<HTMLButtonElement>('[data-hh="lost"]');
if (lost) {
	const jump = lost.querySelector('.hh__jump')!;
	jump.addEventListener('animationend', () => jump.classList.remove('is-pop'));
	lost.addEventListener('click', () => {
		flash(lost, 'is-alt', 2600);
		if (!reduced()) replay(jump, 'is-pop');
	});
}

// ── ⑥ 浮かぶ音符：見えている間だけ動かす ─────────────────────
document.querySelectorAll('[data-motifs]').forEach((el) => {
	new IntersectionObserver(([e]) => el.classList.toggle('is-playing', e.isIntersecting)).observe(el);
});
