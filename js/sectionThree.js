document.addEventListener("DOMContentLoaded", function () {
	var sportsLine = document.getElementById("news-s3-sports-line");
	var previewCards = document.querySelectorAll(".news-s3-preview-card");

	if (!sportsLine || !previewCards.length) return;

	var sportButtons = sportsLine.querySelectorAll(".news-s3-sport-btn");

	if (!sportButtons.length) return;

	var activeButton =
		sportsLine.querySelector(".news-s3-sport-btn.is-active") || sportButtons[0];

	function updatePreview(button, animate) {
		if (!button) return;

		sportButtons.forEach(function (btn) {
			btn.classList.toggle("is-active", btn === button);
		});

		function applySources() {
			previewCards.forEach(function (card, index) {
				var img = card.querySelector("img");
				var key = "preview" + String(index + 1);
				var src = button.dataset[key];

				if (!img || !src) {
					card.classList.remove("is-visible");
					card.hidden = true;
					return;
				}

				card.hidden = false;
				img.src = src;

				var sportTextEl = button.querySelector(".news-s3-sport-text");
				var sportText = sportTextEl ? sportTextEl.textContent : "Ảnh thể thao";
				img.alt = sportText + " " + String(index + 1);
			});

			requestAnimationFrame(function () {
				previewCards.forEach(function (card) {
					if (!card.hidden) {
						card.classList.add("is-visible");
					}
				});
			});
		}

		if (animate) {
			previewCards.forEach(function (card) {
				card.classList.remove("is-visible");
			});

			window.setTimeout(applySources, 110);
		} else {
			applySources();
		}

		activeButton = button;
	}

	sportButtons.forEach(function (button) {
		button.addEventListener("mouseenter", function () {
			updatePreview(button, true);
		});

		button.addEventListener("focus", function () {
			updatePreview(button, true);
		});

		button.addEventListener("click", function () {
			updatePreview(button, true);
		});
	});

	updatePreview(activeButton, false);
});

