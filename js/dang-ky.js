// Hàm định dạng ngày hiện tại
function getCurrentDate() {
    var today = new Date();
    var weekday = today.toLocaleDateString("vi-VN", { weekday: "long" });
    var day = today.getDate();
    var month = today.toLocaleDateString("vi-VN", { month: "long" });
    var year = today.getFullYear();

    return weekday + ", " + day + " " + month + " " + year;
}

// Cập nhật ngày khi tải trangf
window.onload = function () {
    var currentDate = getCurrentDate();
    document.getElementById("dateNow").textContent = currentDate;
}




// Hàm kiểm tra Username
function validateUsername() {
    const unameInput = $('#uname');
    const errorUname = $('#txt_uname');
    if (unameInput.val().trim() === '') {
        errorUname.text('tên người dùng không được bỏ trống');
        errorUname.css('display', 'inline');
        return false;
    } else {
        errorUname.css('display', 'none');
        return true;
    }
}

// Hàm kiểm tra Password
function validatePassword() {
    const passwordInput = $('#password');
    const errorPassword = $('#txt_password');
    const passwordValue = passwordInput.val();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;

    if (!passwordRegex.test(passwordValue)) {
        errorPassword.text('Mật khẩu phải có từ 6 đến 20 ký tự, bao gồm ít nhất 1 chữ hoa, 1 chữ thường, và 1 số.');
        errorPassword.css('display', 'inline');
        return false;
    } else {
        errorPassword.css('display', 'none');
        return true;
    }
}


// Hàm kiểm tra Password Authentication
function validatePasswordAuth() {
    const passwordInput = $('#password');
    const passAuthInput = $('#passauth');
    const errorPassauth = $('#txt_passauth');
    if (passAuthInput.val() !== passwordInput.val()) {
        errorPassauth.text('Password nhập lại phải khớp với Password.');
        errorPassauth.css('display', 'inline');
        return false;
    } else {
        errorPassauth.css('display', 'none');
        return true;
    }
}


// Hàm kiểm tra Email
function validateEmail() {
    const emailInput = $('#email');
    const errorEmail = $('#txt_email');
    const emailValue = emailInput.val();
    const regx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.com$/;

    if (!regx.test(emailValue)) {
        errorEmail.text('Email phải chứa ký tự "@" và kết thúc bằng ".com".');
        errorEmail.css('display', 'inline');
        return false;
    } else {
        errorEmail.css('display', 'none');
        return true;
    }
}

// Hàm kiểm tra Phone
function validatePhone() {
    const phoneInput = $('#phone');
    const errorPhone = $('#txt_phone');
    const phoneValue = phoneInput.val();
    const phoneRegex = /^0\d{9,10}$/;

    if (!phoneRegex.test(phoneValue)) {
        errorPhone.text('Số điện thoại phải bắt đầu bằng "0" và có 10 hoặc 11 chữ số.');
        errorPhone.css('display', 'inline');
        return false;
    } else {
        errorPhone.css('display', 'none');
        return true;
    }
}


//hàm kiểm tra ngày tháng năm sinh
function validateDOB() {
    const dobInput = $('#dob');
    const errorDOB = $('#txt_dob');
    const dobValue = dobInput.val();
    const currentDate = new Date();
    const dobDate = new Date(dobValue);

    // Kiểm tra nếu người dùng chưa chọn ngày sinh hoặc ngày sinh lớn hơn hiện tại
    if (!dobValue || dobDate > currentDate) {
        errorDOB.text('Ngày tháng năm sinh không được lớn hơn ngày hiện tại.');
        errorDOB.css('display', 'inline');
        return false;
    } else {
        errorDOB.css('display', 'none');
        return true;
    }
}


// Gắn sự kiện focusout cho các ô nhập
$('#uname').focusout(validateUsername);
$('#password').focusout(validatePassword);
$('#passauth').focusout(validatePasswordAuth);
$('#email').focusout(validateEmail);
$('#phone').focusout(validatePhone);
$('#dob').focusout(validateDOB);

// Sự kiện đăng ký
$('.btn').click(function () {
    const validUsername = validateUsername();
    const validPassword = validatePassword();
    const validPassauth = validatePasswordAuth();
    const validEmail = validateEmail();
    const validPhone = validatePhone();
    const validDOB = validateDOB();

    if (validUsername && validPassword && validPassauth && validEmail && validPhone && validDOB) {
        const user = {
            username: $('#uname').val(),
            password: $('#password').val(),
            email: $('#email').val(),
            phone: $('#phone').val()
        };
        localStorage.setItem('user', JSON.stringify(user));
        alert('Đăng ký thành công! Bạn có thể đăng nhập với thông tin đã cung cấp.');

    }
});

