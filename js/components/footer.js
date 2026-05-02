/* =============================================================
   footer.js — Shared Footer Component
   <div id="site-footer"></div>
   ============================================================= */
$(() => {
  const $slot = $("#site-footer");
  if (!$slot.length) return;

  // Dynamic path resolution
  const pathParts = window.location.pathname.split('/');
  const htmlIndex = pathParts.lastIndexOf('html');
  
  let depthFromHtml = 0;
  if (htmlIndex !== -1) {
    depthFromHtml = pathParts.length - htmlIndex - 2; 
  } else {
    // Fallback if 'html' folder isn't in URL, use data-base or default
    const fallbackBase = ($slot.data("base") || "./").replace(/\/?$/, "/");
    depthFromHtml = fallbackBase.split('../').length - 1;
    if (fallbackBase === "./") depthFromHtml = 0;
  }

  let htmlBase = depthFromHtml <= 0 ? "./" : "../".repeat(depthFromHtml);
  let rootBase = htmlBase + "../";

  const rHtml = (h) => htmlBase + h.replace(/^\.?\//, "");
  const rRoot = (h) => rootBase + h.replace(/^\.?\//, "");

  $slot.html(`
    <footer class="site-footer">
      <div class="container-fluid px-4 px-xl-5 pb-0 pt-5">
        
        <!-- Top Section -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
          
          <!-- Logo & Socials -->
          <div class="d-flex flex-column align-items-start gap-4">
            <span class="footer-logo">Báo Chí Design</span>
            <div class="d-flex gap-3">
              <!-- youtube -->
              <a href="https://www.youtube.com/@nghia_game_dev" class="social-circle">
                <img src="${rRoot('images/footer/ytb.png')}" alt="YouTube" width="22" height="22">
              </a>
              <!-- github -->
              <a href="https://github.com/nghiaiuh/News-website" class="social-circle">
                <img src="${rRoot('images/footer/github.png')}" alt="GitHub" width="22" height="22">
              </a>
              <!-- linkedin -->
              <a href="https://www.linkedin.com/in/ngh%C4%A9a-phan-np061010/" class="social-circle">
                <img src="${rRoot('images/footer/lki.png')}" alt="LinkedIn" width="22" height="22">
              </a>
            </div>
          </div>

          <!-- Login CTA -->
          <div class="d-flex flex-column align-items-md-end gap-3 w-100 newsletter-wrapper ms-md-auto">
            <span class="fs-6">Đăng nhập để trở thành người đóng góp</span>
            <a href="${rHtml('dang-nhap.html')}" class="newsletter-input w-100 d-flex justify-content-between align-items-center text-decoration-none">
              <span class="text-white-50">Đăng nhập / Đăng ký...</span>
              <img src="${rRoot('images/footer/paper-plane.png')}" alt="paper-plane" class="send-icon" width="20" height="20">
            </a>
          </div>

        </div>

        <div class="footer-divider mb-5"></div>

        <!-- Middle Section: Grid Links -->
        <div class="row g-4 mb-5">
          <!-- Col 1 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Giải trí Showbiz</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="${rHtml('giai-tri-doi-song/Dune_PartTwo.html')}" class="footer-link">Dune: Part Two - Kiệt tác thị giác</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/nghesi_tre.html')}" class="footer-link">Văn hóa ứng xử của nghệ sĩ</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/top_phim.html')}" class="footer-link">Cuộc đua 5 phim Việt mùa nghỉ lễ</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/concern_chayVE.html')}" class="footer-link">Nam ca sĩ cháy vé trong 12 phút</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/le-hoi-he.html')}" class="footer-link">Lễ hội âm nhạc mùa hè 2026</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/worldcup.html')}" class="footer-link">Bản quyền FIFA World Cup 2026</a></li>
            </ul>
          </div>
          <!-- Col 2 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Kinh tế Thị trường</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="${rHtml('kinh-te-chinh-tri/viet-nam-binh-on-thi-truong-nang-luong-truoc-bien-dong-gia-dau.html')}" class="footer-link">Bình ổn thị trường năng lượng</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/bo-cong-thuong-khuyen-nghi-doanh-nghiep-giam-rui-ro-trung-dong.html')}" class="footer-link">Giảm rủi ro từ xung đột Trung Đông</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/tong-thong-han-quoc-lee-jae-myung-tham-viet-nam.html')}" class="footer-link">Hàn Quốc thăm Việt Nam</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/to-lam-nang-tam-ket-noi-viet-trung.html')}" class="footer-link">Nâng tầm Việt Nam - Trung Quốc</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/quoc-hoi-rut-ngan-nhiem-ky-khoa-xv.html')}" class="footer-link">Rút ngắn nhiệm kỳ QH khóa XV</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/to-lam-du-le-ky-niem-120-nam-ha-huy-tap.html')}" class="footer-link">Kỷ niệm 120 năm sinh Hà Huy Tập</a></li>
            </ul>
          </div>
          <!-- Col 3 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Chính trị Thế giới</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="${rHtml('kinh-te-chinh-tri/israel-iran-an-mieng-tra-mieng-thuong-vong-tang.html')}" class="footer-link">Israel - Iran ăn miếng trả miếng</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/my-tuyen-bo-thang-loi-iran-oman-thu-phi-hormuz.html')}" class="footer-link">Mỹ tuyên bố thắng lợi với Iran</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/uav-iran-danh-trung-co-so-cia-arab-saudi.html')}" class="footer-link">UAV Iran đánh trúng cơ sở CIA</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/tuong-lai-bat-dinh-cua-tau-hang-iran-bi-my-bat.html')}" class="footer-link">Tàu hàng Iran bị Mỹ bắt giữ</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/my-cong-bo-300-nguoi-noi-tieng-trong-ho-so-epstein.html')}" class="footer-link">Công bố hồ sơ Epstein chấn động</a></li>
              <li><a href="${rHtml('kinh-te-chinh-tri/chu-tich-quoc-hoi-toa-dam-viet-nam-tho-nhi-ky.html')}" class="footer-link">Hợp tác Việt Nam - Thổ Nhĩ Kỳ</a></li>
            </ul>
          </div>
          <!-- Col 4 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Thể thao & Điện tử</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="${rHtml('the-thao/the-thao-football-detail.html')}" class="footer-link">Kịch tính vòng loại World Cup</a></li>
              <li><a href="${rHtml('the-thao/the-thao-nba-detail.html')}" class="footer-link">Nhịp đập NBA Playoffs 2026</a></li>
              <li><a href="${rHtml('the-thao/the-thao-tennis-detail.html')}" class="footer-link">Bất ngờ tại Grand Slam 2024</a></li>
              <li><a href="${rHtml('the-thao/the-thao-messi-vo-dich.html')}" class="footer-link">Messi và giấc mơ World Cup</a></li>
              <li><a href="${rHtml('the-thao/the-thao-f1-detail.html')}" class="footer-link">Tốc độ F1: Rượt đuổi nghẹt thở</a></li>
              <li><a href="${rHtml('the-thao/the-thao-max.html')}" class="footer-link">Max Verstappen - Thiên tài đua xe</a></li>
            </ul>
          </div>
          <!-- Col 5 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Sức khoẻ Đời sống</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="${rHtml('the-thao/suc-khoe-cardio-detail.html')}" class="footer-link">Khởi động an toàn khi tập cardio</a></li>
              <li><a href="${rHtml('the-thao/suc-khoe-tamly-detail.html')}" class="footer-link">Sức khỏe tinh thần thời đại số</a></li>
              <li><a href="${rHtml('the-thao/suc-khoe-yoga-detail.html')}" class="footer-link">Yoga - Chìa khóa của tĩnh lặng</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/an_uong.html')}" class="footer-link">Chế độ ăn xanh và sức khỏe</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/loi-song.html')}" class="footer-link">Sức mạnh của việc dậy sớm</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/song-toi-gian.html')}" class="footer-link">Nghệ thuật sống tối giản</a></li>
            </ul>
          </div>
          <!-- Col 6 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Vũ trụ & Thiên nhiên</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="${rHtml('vu-tru-thien-nhien/artemisII.html')}" class="footer-link">Artemis II: Trở lại Mặt Trăng</a></li>
              <li><a href="${rHtml('vu-tru-thien-nhien/vu-tru-thien-nhien.html')}" class="footer-link">Khám phá bí ẩn Vũ trụ</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/phuquoc.html')}" class="footer-link">Phú Quốc: Hòn Đảo Quý Giá</a></li>
              <li><a href="${rHtml('giai-tri-doi-song/loiich-thethao.html')}" class="footer-link">Lợi ích hoạt động ngoài trời</a></li>
              <li><a href="${rHtml('the-thao/the-thao-suc-khoe.html')}" class="footer-link">Thể thao & Sức khỏe đời sống</a></li>
              <li><a href="${rHtml('giaitri-doisong.html')}" class="footer-link">Giải trí & Đời sống hiện đại</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-divider mb-3"></div>

        <!-- Bottom Section -->
        <div class="text-center pb-4 pt-2">
          <p class="copyright-text mb-0 px-3">
            © 2026 Báo Chí Design, LLC. All Rights Reserved. Use of this site constitutes acceptance of our Terms of Service, Privacy Policy and Do Not Sell or Share My Personal Information. Báo Chí Design may receive compensation for some links to products and services on this website. Offers may be subject to change without notice.
          </p>
        </div>

      </div>
    </footer>
  `);
});
