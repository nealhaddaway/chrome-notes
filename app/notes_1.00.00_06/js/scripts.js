/*TODO:
print

remember caret position? (pick up where you left off)
spellcheck checkbox/toggle button for spellcheck property of #notes

Formatting:
bold, italic, underline formatting?
could use contenteditable for this stuff, but makes other stuff a pain.
https://medium.com/content-uneditable/contenteditable-the-good-the-bad-and-the-ugly-261a38555e9c
also resize attribute doesn't work, need specific font, saving stuff

Misc:
make todo seperate file
transitions for modal, colors, menu
multiple notes? add menu. search names of notes, etc
envelope icon for email?
settings modal? move night over there? manually enter notepad size? colors?
Uglify/Minify/Obscure before publish in store?

Multiple Notes:
need side menu where you can view all notes
plus icon for create new note
title above textarea for note title
search note names from side menu
sort by date last modified
dont show them date or allow other ways to sort
delete note option form menu
with confirmation dialog
delete all notes option
default open most recent note?
max notes? 1000?
time stored in mills: new Date().getTime()

COLORS:
f36 pink
f90 orange
fc9 shaving
333 lead
*/

window.onload = ()=> {

	let notes   = document.getElementById("notes");
	let iconDiv = document.getElementById("iconDiv");
	let theme   = document.getElementById("theme");

	notes.onchange = ()=> {
		if(localStorage)
			localStorage.setItem("noteData", notes.value);
	}
	
	let iconNames = ["cut", "copy", "paste", "select-all", "delete", "save", "undo", "redo", "speak", "open-as-window", "night-mode", "help", "info", "keyboard", "rate"];
	for(let i = 0; i < iconNames.length; i++) {
		let icon = document.createElement("img");
		icon.src = "img/icon/" + iconNames[i] + ".svg";
		icon.id = iconNames[i];
		icon.className = "icon";
		icon.title = iconNames[i].substring(0, 1).toUpperCase() + iconNames[i].substring(1); //caps
		// icon.title = icon.title.replace(/-/g, " ");
		icon.draggable = false;
		icon.tabIndex = 0;
		icon.onkeydown = (evt)=> {
			if(evt.which==13) // enter
				icon.onclick();
		}
		iconDiv.appendChild(icon);

		if(iconNames[i] == "night-mode") {
			iconDiv.appendChild(document.createElement("hr") );
		}
	}
	
	document.getElementById("speak").title = "Speak Selected Text";
	document.getElementById("delete").title = "Delete Selection";
	document.getElementById("select-all").title = "Select All";
	document.getElementById("open-as-window").title = "Open in New Window";
	document.getElementById("night-mode").title = "Night Mode";
	document.getElementById("rate").title = "Rate or Share";

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
		notes.focus();
		let synth = window.speechSynthesis;
		let msg = new SpeechSynthesisUtterance(window.getSelection().toString() );
		msg.rate = 1;
		msg.pitch = 1;
		synth.speak(msg);
	}
	document.getElementById("open-as-window").onclick = ()=> {
		notes.focus();
		chrome.windows.create(
			{'url': 'index.html', 'type': 'popup', 'width': 300, 'height': 300}, 
			(window)=>{}
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

	document.getElementById("rate").onclick = ()=> {
		window.open("https://chrome.google.com/webstore/detail/lnfempckkegmaeleniojhjplemmebgfi");
	}
	
	if(localStorage) {
		notes.value = localStorage.getItem("noteData");
		if(localStorage.getItem("nightData") == "true" && 
			document.getElementById("night-mode") != null) {
			theme.href = "css/night.css";
			localStorage.setItem("nightData", "true");
		}

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
