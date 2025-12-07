// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
    const faqItems = document.querySelectorAll('.faq-item');
    const searchInput = document.getElementById('faqSearch');
    const noResults = document.getElementById('noResults');
    const backToTopBtn = document.getElementById('backToTop');
    
    // Toggle FAQ items
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close all other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item && otherItem.classList.contains('active')) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-answer').style.maxHeight = null;
                }
            });
            
            // Toggle current item
            item.classList.toggle('active');
            const answer = item.querySelector('.faq-answer');
            
            if (item.classList.contains('active')) {
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                answer.style.maxHeight = null;
            }
        });
    });
    
    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            let hasResults = false;
            
            faqItems.forEach(item => {
                const question = item.querySelector('.faq-question').textContent.toLowerCase();
                const answer = item.querySelector('.faq-answer').textContent.toLowerCase();
                
                if (question.includes(searchTerm) || answer.includes(searchTerm)) {
                    item.style.display = '';
                    hasResults = true;
                    
                    // Highlight matching text
                    if (searchTerm.length > 2) {
                        const regex = new RegExp(searchTerm, 'gi');
                        const questionText = item.querySelector('.faq-question').innerHTML;
                        const answerText = item.querySelector('.faq-answer').innerHTML;
                        
                        item.querySelector('.faq-question').innerHTML = questionText.replace(regex, 
                            match => `<span style="background-color: #fff9c4; padding: 0 2px; border-radius: 3px;">${match}</span>`);
                            
                        item.querySelector('.faq-answer').innerHTML = answerText.replace(regex, 
                            match => `<span style="background-color: #fff9c4; padding: 0 2px; border-radius: 3px;">${match}</span>`);
                    }
                } else {
                    item.style.display = 'none';
                }
            });
            
            // Show/hide categories based on visible items
            document.querySelectorAll('.faq-category').forEach(category => {
                const visibleItems = category.querySelectorAll('.faq-item[style=""]').length;
                const totalItems = category.querySelectorAll('.faq-item').length;
                
                if (visibleItems === 0 && searchTerm.length > 0) {
                    category.style.display = 'none';
                } else {
                    category.style.display = '';
                }
            });
            
            // Show no results message if no matches
            if (noResults) {
                noResults.style.display = hasResults || searchTerm.length === 0 ? 'none' : 'block';
            }
        });
    }
    
    // Back to top button
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'block';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Open first FAQ item by default on page load
    if (faqItems.length > 0) {
        faqItems[0].classList.add('active');
        faqItems[0].querySelector('.faq-answer').style.maxHeight = 
            faqItems[0].querySelector('.faq-answer').scrollHeight + 'px';
    }
});

