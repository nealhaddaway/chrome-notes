function setupModal(btnName, modalName) {
	let modal = document.getElementById(modalName);
	let btn = document.getElementById(btnName);
	let close = modal.querySelector(' .close');

	btn.onclick = () => {
		modal.style.display = 'block';
		close.focus();
	};
	close.onclick = () => {
		modal.style.display = 'none';
	};

	close.tabIndex = 0;

	close.onkeydown = (evt) => {
		if (evt.which == 13)
			// enter
			close.onclick();
	};
}
