// معالجة نموذج التواصل
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.querySelector('form[method="post"]');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // الحصول على القيم
            const subject = contactForm.querySelector('#subject').value.trim();
            const email = contactForm.querySelector('#email').value.trim();
            const message = contactForm.querySelector('#message').value.trim();
            
            // التحقق من البيانات
            if (!subject || !email || !message) {
                alert('يرجى ملء جميع الحقول المطلوبة');
                return;
            }
            
            // التحقق من صحة البريد الإلكتروني
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('يرجى إدخال بريد إلكتروني صحيح');
                return;
            }
            
            // التحقق من طول الرسالة
            if (message.length > 1000) {
                alert('الرسالة طويلة جداً. الحد الأقصى 1000 حرف');
                return;
            }
            
            // محاكاة إرسال الرسالة
            alert('شكراً لك! تم إرسال رسالتك بنجاح. سنتواصل معك قريباً.');
            
            // إعادة تعيين النموذج
            contactForm.reset();
            
            // يمكن إضافة منطق إرسال حقيقي هنا
            // fetch('/api/contact/', { ... })
        });
    }
    
    // إضافة تأثيرات تفاعلية على روابط التواصل
    const socialLinks = document.querySelectorAll('.contact-links a');
    socialLinks.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.transition = 'transform 0.3s';
        });
        link.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });
    });
});

