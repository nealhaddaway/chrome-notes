// (c) Justin Golden 2019

window.onload = () => {
	const notes = document.getElementById('notes');
	const iconDiv = document.getElementById('iconDiv');
	const theme = document.getElementById('theme');

	notes.onchange = () => {
		if (localStorage) localStorage.setItem('noteData', notes.value);
	};

	const iconNames = [
		'cut',
		'copy',
		'paste',
		'select-all',
		'delete',
		'save',
		'undo',
		'redo',
		'speak',
		'night-mode',
		'spellcheck',
		'help',
		'info',
		'keyboard',
		'open-as-window',
		'rate',
	];
	const capitalize = (str) =>
		str.substring(0, 1).toUpperCase() + str.substring(1);
	for (iconName of iconNames) {
		const icon = document.createElement('img');
		icon.src = 'img/icon/' + iconName + '.svg';
		icon.className = 'icon';

		const btn = document.createElement('button');
		btn.className = 'icon-btn';
		btn.title = capitalize(iconName);
		btn.id = iconName;

		btn.appendChild(icon);
		iconDiv.appendChild(btn);

		if (iconName === 'spellcheck') {
			iconDiv.appendChild(document.createElement('hr'));
		}
	}

	document.getElementById('speak').title = 'Speak Selected Text';
	document.getElementById('delete').title = 'Delete Selection';
	document.getElementById('select-all').title = 'Select All';
	document.getElementById('open-as-window').title = 'Open in New Window';
	document.getElementById('night-mode').title = 'Night Mode';
	document.getElementById('rate').title = 'Rate / Share';
	document.getElementById('save').title = 'Download Notes as Text File';

	document.getElementById('version').innerHTML =
		'Version ' + chrome.runtime.getManifest().version;

	document.getElementById('cut').onclick = () => {
		notes.focus();
		document.execCommand('cut');
	};
	document.getElementById('copy').onclick = () => {
		notes.focus();
		document.execCommand('copy');
	};
	document.getElementById('paste').onclick = () => {
		notes.focus();
		document.execCommand('paste');
	};
	document.getElementById('select-all').onclick = () => {
		notes.focus();
		notes.select();
	};
	document.getElementById('delete').onclick = () => {
		notes.focus();
		document.execCommand('delete');
		// notes.value = "";
	};
	document.getElementById('save').onclick = () => {
		notes.focus();
		const file = {
			url:
				'data:application/txt,' +
				encodeURIComponent(notes.value.replace(/\r?\n/g, '\r\n')),
			filename: 'notes.txt',
		};
		chrome.downloads.download(file);
	};
	document.getElementById('undo').onclick = () => {
		notes.focus();
		document.execCommand('undo');
	};
	document.getElementById('redo').onclick = () => {
		notes.focus();
		document.execCommand('redo');
	};
	document.getElementById('speak').onclick = () => {
		if (!window.isSpeaking) {
			notes.focus();
			const synth = window.speechSynthesis;
			const txt = window.getSelection().toString() || notes.value;
			const msg = new SpeechSynthesisUtterance(txt);
			msg.rate = 1;
			msg.pitch = 1;
			synth.speak(msg);

			document.querySelector('#speak .icon').src =
				'img/icon/speak-cancel.svg';
			document.getElementById('speak').title = 'Cancel Text Speech';
			window.isSpeaking = true;

			msg.onend = () => {
				document.querySelector('#speak .icon').src =
					'img/icon/speak.svg';
				document.getElementById('speak').title = 'Speak Selected Text';
				window.isSpeaking = false;
			};
		} else {
			// msg.onend event fires
			window.speechSynthesis.cancel();
		}
	};
	document.getElementById('open-as-window').onclick = () => {
		notes.focus();
		chrome.windows.create({
			url: 'index.html',
			type: 'popup',
			width: window.outerWidth,
			height: window.outerHeight,
		});
	};
	document.getElementById('night-mode').onclick = () => {
		notes.focus();
		if (theme.href.includes('day.css')) {
			theme.href = 'css/night.css';
			localStorage.setItem('nightData', 'true');
		} else {
			theme.href = 'css/day.css';
			localStorage.setItem('nightData', 'false');
		}
	};
	document.getElementById('spellcheck').onclick = () => {
		notes.focus();
		if (notes.spellcheck) {
			notes.spellcheck = false;
			localStorage.setItem('spellcheck', 'false');
			document.getElementById('spellcheck').classList.remove('active');
		} else {
			notes.spellcheck = true;
			localStorage.setItem('spellcheck', 'true');
			document.getElementById('spellcheck').classList.add('active');
		}
		// force update
		let tmp = notes.value;
		notes.value = '';
		notes.value = tmp;
	};
	document.getElementById('rate').onclick = () => {
		window.open(
			'https://chrome.google.com/webstore/detail/lnfempckkegmaeleniojhjplemmebgfi'
		);
	};

	if (localStorage) {
		// load note
		notes.value = localStorage.getItem('noteData');
		// load night
		if (localStorage.getItem('nightData') === 'true') {
			theme.href = 'css/night.css';
		}
		// load spellcheck
		if (localStorage.getItem('spellcheck') === 'true') {
			notes.spellcheck = true;
			document.getElementById('spellcheck').classList.add('active');
		}
		// load size
		notes.style.width = localStorage.getItem('noteWidth') + 'px';
		notes.style.height = localStorage.getItem('noteHeight') + 'px';
	}

	document.onkeydown = (evt) => {
		if (evt.key === 'n' && notes !== document.activeElement) {
			document.getElementById('night-mode').onclick();
			notes.blur();
		}
		storeSize();
	};

	document.onmouseup = storeSize;

	// Modals
	document.getElementById('keyboard').title = 'Keyboard Shortcuts';
	setupModal('help', 'help-modal');
	setupModal('info', 'info-modal');
	setupModal('keyboard', 'keyboard-modal');
};

function storeSize() {
	if (localStorage) {
		localStorage.setItem('noteWidth', notes.clientWidth);
		localStorage.setItem('noteHeight', notes.clientHeight);
	}
}
