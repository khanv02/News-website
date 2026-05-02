$(() => {
	initSportsPreview();
	initSportsFeedNavigation();
});

const initSportsPreview = () => {
	const $sportsLine = $("#s3-sports-category");
	const $previewCards = $(".s3-card-gallery");

	if (!$sportsLine.length || !$previewCards.length) return;

	const $sportButtons = $sportsLine.find(".s3-btn");
	if (!$sportButtons.length) return;

	let $activeButton = $sportButtons.filter(".is-active").length
		? $sportButtons.filter(".is-active").first()
		: $sportButtons.first();

	const updatePreview = ($button, animate = true) => {
		if (!$button || (animate && $button.is($activeButton))) return;
		$activeButton = $button;

		$sportButtons.removeClass("is-active");
		$button.addClass("is-active");

		const applySources = () => {
			$previewCards.each((index, card) => {
				const $card = $(card);
				const $img = $card.find("img");
				const src = $button.data(`preview${index + 1}`);

				if (!$img.length || !src) {
					$card.removeClass("is-visible").prop("hidden", true);
					return;
				}
				//Hiện card
				$card.prop("hidden", false);
				$img.attr("src", src);
				//attribute

				//Thực hiện lệnh đặt tên alt (có thể không cần / có thể xoá)
				const sportText = $button.find("span:first-child").text().trim() || "Ảnh thể thao";
				$img.attr("alt", `${sportText} ${index + 1}`);
			});
			//Báo cáo cho web chuẩn bị sẵn sàng để render, báo trước hành động này sắp diễn ra mục đích để tối ưu web, ko bị lag
			requestAnimationFrame(() => {
				$previewCards.not("[hidden]").addClass("is-visible");
			});
		};

		if (animate) {
			$previewCards.removeClass("is-visible");
			//quy định giá trị thời gian chuyển hiệu ứng từ button này -> button khác
			setTimeout(applySources, 110);
		} else {
			applySources();
		}
	};

	$sportButtons.on("mouseenter focus", function () {
		updatePreview($(this));
	});

	updatePreview($activeButton, false);
};



const initSportsFeedNavigation = () => {
	const $viewport = $(".sports-feed-viewport");
	const $prevButton = $(".sports-feed-nav--prev");
	const $nextButton = $(".sports-feed-nav--next");
	
	if (!$viewport.length || !$prevButton.length || !$nextButton.length) return;

	const updateNavState = () => {
		const scrollLeft = $viewport.scrollLeft();
		const maxScroll = $viewport[0].scrollWidth - $viewport.innerWidth();
		$prevButton.prop("disabled", scrollLeft <= 4); //true / false
		// property: chỉnh giá trị của biến disabled khi nào

		$nextButton.prop("disabled", scrollLeft >= maxScroll - 4);
	};

	const scrollFeed = (dir) => {
		$viewport[0].scrollBy({
			left: dir * Math.max($viewport.innerWidth() * 0.75, 260),
			behavior: "smooth"
		});
	};

	$prevButton.on("click", () => scrollFeed(-1));
	$nextButton.on("click", () => scrollFeed(1));

	$viewport.on("scroll", updateNavState);
	$(window).on("resize", updateNavState);
	updateNavState();
};

