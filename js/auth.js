document.addEventListener("DOMContentLoaded", function () {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const username = localStorage.getItem("username");

    if (isLoggedIn === "true" && username) {
        displayUserOptions(username);
    }

    // Xử lý đăng nhậpf
    $('#loginForm').submit(function (event) {
        event.preventDefault();
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (!storedUser) {
            alert("Không tìm thấy người dùng. Hãy đăng ký tài khoản.");
            return;
        }

        const enteredUsername = $('#uname').val();
        const enteredPassword = $('#password').val();

        if (storedUser.username === enteredUsername && storedUser.password === enteredPassword) {
            alert('Đăng nhập thành công!');
            localStorage.setItem("isLoggedIn", "true");
            localStorage.setItem("username", enteredUsername);
            displayUserOptions(enteredUsername);
            window.location.href = 'index.html';
        } else {
            alert('Thông tin đăng nhập không đúng.');
        }
    });

    // Hàm hiển thị tên người dùng và tùy chọn Đăng xuất
    function displayUserOptions(username) {
        $('#register-link').hide();
        $('#login-link').hide();
        $('#user-options').html(`
            <li class="list-inline-item mx-2"><span><i class="fa fa-user"></i> ${username}</span></li>
            <li class="list-inline-item mx-2" style="padding-right:15px;"><a href="#" id="logout">Đăng xuất</a></li>
        `);
    }

    // Xử lý đăng xuất
    $(document).on("click", "#logout", function () {
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("username");
        window.location.href = 'dang-nhap.html';
    });
});
