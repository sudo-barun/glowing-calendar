import Component from './node_modules/@xylem-js/xylem-js/js/dom/Component.js';
import createStore from './node_modules/@xylem-js/xylem-js/js/core/createStore.js';
import map from './node_modules/@xylem-js/xylem-js/js/core/map.js';
import mountComponent from './node_modules/@xylem-js/xylem-js/js/dom/mountComponent.js';
import parseHTML from './node_modules/@xylem-js/xylem-js/js/dom/parseHTML.js';

class Calendar extends Component
{
	build()
	{
		const now = new Date();
		const lastDayOfThisMonth = new Date(now.getFullYear(), now.getMonth()+1, 0);
		const lastDay = lastDayOfThisMonth.getDate();
		const INITIAL_CENTER_X = `200%`;
		const INITIAL_CENTER_Y = `200%`;

		this.afterAttachToDom.subscribe(() => {
			document.body.addEventListener('mousemove', (ev) => {
				centerX$._(`${ev.clientX}px`);
				centerY$._(`${ev.clientY}px`);
			});
			document.body.addEventListener('mouseleave', () => {
				centerX$._(INITIAL_CENTER_X);
				centerY$._(INITIAL_CENTER_Y);
			});
		});

		const centerX$ = createStore(INITIAL_CENTER_X);
		const centerY$ = createStore(INITIAL_CENTER_Y);

		return parseHTML([
			'<div>', {
				class: 'grid',
				style: {
					'--center-x': centerX$,
					'--center-y': centerY$,
				},
			},
			[
				...Array(lastDay).fill().map((_, i) => [
					'<div>', { class: 'cell' },
					[i+1],
					'</div>',
				]).flat(),
			],
			'</div>',
		]);
	}
}

class App extends Component
{
	build()
	{
		const colorScheme$ = createStore('dark');
		const infoStr = atob('TWFkZSBieTogQmFydW4gS2hhcmVs');
		document.documentElement.setAttribute("data-theme", colorScheme$._());
		document.documentElement.style.setProperty("color-scheme", colorScheme$._());
		colorScheme$.subscribe(v => {
			document.documentElement.setAttribute("data-theme", v);
			document.documentElement.style.setProperty("color-scheme", v);
		});


		const info = [
			'<div>', {
				style: [
					`position:fixed;bottom:0;right:0;padding:8px;user-select:none;`,
					{
						color: map(colorScheme$, v => v === 'dark' ? 'hsl(0, 100%, 100%, 0.1)' : 'hsl(0, 100%, 0%, 0.05'),
					},
				],
			},
			[infoStr],
			'</div>',
		]

		return parseHTML([
			...info,
			'<div>', { style: 'margin-block: 16px' },
			[
				'<label>',
				[
					'<input/>', {
						'type': 'radio',
						'name': 'colorScheme',
						'value': 'dark',
						'checked': colorScheme$._() === 'dark',
						'@click': (ev) => { colorScheme$._(ev.target.value) },
					},
					'Dark mode',
				],
				'</label>',
				' ',
				'<label>',
				[
					'<input/>', {
						'type': 'radio',
						'name': 'colorScheme',
						'value': 'light',
						'checked': colorScheme$._() === 'light',
						'@click': (ev) => { colorScheme$._(ev.target.value) },
					},
					'Light mode',
				],
				'</label>',
			],
			'</div>',
			new Calendar(),
		]);
	}
}

mountComponent(new App(), document.getElementById('app'));
