(function () {
    'use strict'

    document.getElementById('generate-otp').addEventListener('click', function() {
        var value = this.innerHTML.trim();
        if (value === 'proceed') {
            this.innerHTML = 'generate OTP';
            document.getElementById('login-otp').style.display = 'flex';
            document.getElementById('mobile-num').style.display = 'none';
        } else {
            this.innerHTML = 'proceed';
            document.getElementById('login-otp').style.display = 'flex';
            document.getElementById('mobile-num').style.display = 'none';
        }
    });
})();


