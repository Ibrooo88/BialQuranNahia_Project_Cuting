// معالجة نموذج التسجيل
document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.querySelector('form[method="POST"]');
    
    if (signupForm) {
        signupForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على القيم
            const name = signupForm.querySelector('input[name="name"]').value;
            const email = signupForm.querySelector('input[name="email"]').value;
            const password1 = signupForm.querySelector('input[name="password1"]').value;
            const password2 = signupForm.querySelector('input[name="password2"]').value;
            
            // التحقق من البيانات
            if (!name || !email || !password1 || !password2) {
                alert('يرجى ملء جميع الحقول');
                return;
            }
            
            // التحقق من تطابق كلمات المرور
            if (password1 !== password2) {
                alert('كلمات المرور غير متطابقة');
                return;
            }
            
            // التحقق من طول كلمة المرور
            if (password1.length < 8) {
                alert('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
                return;
            }
            
            // محاكاة إرسال البيانات
            alert('تم إنشاء حسابك بنجاح! سيتم توجيهك إلى الصفحة الرئيسية.');
            
            // التوجيه إلى الصفحة الرئيسية
            setTimeout(function() {
                window.location.href = 'inbox.html';
            }, 1500);
        });
    }
    
    // معالجة تسجيل الدخول بحساب Google
    const googleBtn = document.querySelector('a[href="#"]');
    if (googleBtn && googleBtn.textContent.includes('جوجل')) {
        googleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('سيتم توجيهك إلى صفحة تسجيل الدخول بحساب Google');
            // يمكن إضافة منطق Google OAuth هنا
        });
    }
});

