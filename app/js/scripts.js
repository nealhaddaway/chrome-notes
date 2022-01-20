// (c) Justin Golden 2019

window.onload = ()=> {

	let notes   = document.getElementById("notes");
	let iconDiv = document.getElementById("iconDiv");
	let theme   = document.getElementById("theme");

	notes.onchange = ()=> {
		if(localStorage)
			localStorage.setItem("noteData", notes.value);
	}
	
	let iconNames = ["cut", "copy", "paste", "select-all", "delete", "save", "undo", "redo", "speak", "night-mode", "spellcheck", "help", "info", "keyboard", "open-as-window", "rate"];
	for(let i = 0; i < iconNames.length; i++) {
		let icon = document.createElement("img");
		icon.src = "img/icon/" + iconNames[i] + ".svg";
		icon.id = iconNames[i];
		icon.className = "icon";
		icon.title = iconNames[i].substring(0, 1).toUpperCase() + iconNames[i].substring(1); //caps
		icon.draggable = false;
		icon.tabIndex = 0;
		icon.onkeydown = (evt)=> {
			if(evt.which==13) // enter
				icon.onclick();
		}
		iconDiv.appendChild(icon);

		if(iconNames[i] == "spellcheck") {
			iconDiv.appendChild(document.createElement("hr") );
		}
	}
	
	document.getElementById("speak").title = "Speak Selected Text";
	document.getElementById("delete").title = "Delete Selection";
	document.getElementById("select-all").title = "Select All";
	document.getElementById("open-as-window").title = "Open in New Window";
	document.getElementById("night-mode").title = "Night Mode";
	document.getElementById("rate").title = "Rate / Share";
	document.getElementById("save").title = "Download Notes as Text File";

	document.getElementById("version").innerHTML = "Version " + chrome.runtime.getManifest().version;
	
	document.getElementById("cut").onclick = ()=> {
		notes.focus();
		document.execCommand("cut");
	}
	document.getElementById("copy").onclick = ()=> {
		notes.focus();
		document.execCommand("copy");
	}
	document.getElementById("paste").onclick = ()=> {		
		notes.focus();
		document.execCommand("paste");
	}
	document.getElementById("select-all").onclick = ()=> {
		notes.focus();
		notes.select();
	}
	document.getElementById("delete").onclick = ()=> {
		notes.focus();
		document.execCommand("delete");
		// notes.value = "";
	}
	document.getElementById("save").onclick = ()=> {
		notes.focus();
		let file = {
			url: "data:application/txt," + 
				encodeURIComponent(notes.value.replace(/\r?\n/g, '\r\n') ),
			filename: "notes.txt"
		}
		chrome.downloads.download(file);
	}
	document.getElementById("undo").onclick = ()=> {
		notes.focus();
		document.execCommand("undo");
	}
	document.getElementById("redo").onclick = ()=> {
		notes.focus();
		document.execCommand("redo");
	}
	document.getElementById("speak").onclick = ()=> {
		if(!window.isSpeaking) {
			notes.focus();
			let synth = window.speechSynthesis;
			let txt = window.getSelection().toString() || notes.value;
			let msg = new SpeechSynthesisUtterance(txt);
			msg.rate = 1;
			msg.pitch = 1;
			synth.speak(msg);

			document.getElementById("speak").src = "img/icon/speak-cancel.svg";
			document.getElementById("speak").title = "Cancel Text Speech";
			window.isSpeaking = true;

			msg.onend = (evt)=> {
				document.getElementById("speak").src = "img/icon/speak.svg";
				document.getElementById("speak").title = "Speak Selected Text";
				window.isSpeaking = false;
				console.log('message ended');
			}
		} else {
			window.speechSynthesis.cancel();
			// msg.onend event fires
		}		
	}
	document.getElementById("open-as-window").onclick = ()=> {
		notes.focus();
		chrome.windows.create(
			{
				url: 'index.html',
				type: 'popup',
				width: window.outerWidth,
				height: window.outerHeight
			}, 
			(window)=> {}
		);
	}
	document.getElementById("night-mode").onclick = ()=> {
		notes.focus();
		if(theme.href.substring(theme.href.length-7, theme.href.length) === "day.css") {
			theme.href = "css/night.css";
			localStorage.setItem("nightData", "true");
		} else {
			theme.href = "css/day.css";
			localStorage.setItem("nightData", "false");
		}
	}
	document.getElementById("spellcheck").onclick = ()=> {
		notes.focus();
		if(notes.spellcheck) {
			notes.spellcheck = false;
			localStorage.setItem("spellcheck", "false");
			document.getElementById("spellcheck").classList.remove("active");
		} else {
			notes.spellcheck = true;
			localStorage.setItem("spellcheck", "true");
			document.getElementById("spellcheck").classList.add("active");
		}
		// force update
		let tmp = notes.value;
		notes.value = "";
		notes.value = tmp;
	}
	document.getElementById("rate").onclick = ()=> {
		window.open("https://chrome.google.com/webstore/detail/lnfempckkegmaeleniojhjplemmebgfi");
	}
	
	if(localStorage) {
		// load note
		notes.value = localStorage.getItem("noteData");
		// load night
		if(localStorage.getItem("nightData") == "true") {
			theme.href = "css/night.css";
		}
		// load spellcheck
		if(localStorage.getItem("spellcheck") == "true") {
			notes.spellcheck = true;
			document.getElementById("spellcheck").classList.add("active");
		}
		// load size
		notes.style.width = localStorage.getItem("noteWidth") + "px";
		notes.style.height = localStorage.getItem("noteHeight") + "px";
	}
	
	document.onkeydown = (e)=> {
		if(e.keyCode == 78 && notes != document.activeElement) { //"N" toggles night
			if(theme.href.substring(theme.href.length-7, theme.href.length) === "css/day.css") {
				theme.href = "css/night.css";
				localStorage.setItem("nightData", "true");
			} else {
				theme.href = "css/day.css";
				localStorage.setItem("nightData", "false");
			}
		}
		storeSize();
	}

	document.onmouseup = storeSize;

	// Modals
	document.getElementById("keyboard").title = "Keyboard Shortcuts";
	setupModal("help", "help-modal");
	setupModal("info", "info-modal");
	setupModal("keyboard", "keyboard-modal");
}

function storeSize() {
	if(localStorage) {
		localStorage.setItem("noteWidth", notes.clientWidth);
		localStorage.setItem("noteHeight", notes.clientHeight);
	}
}
