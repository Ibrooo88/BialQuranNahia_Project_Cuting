// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Add animation on scroll
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section');
    const highlights = document.querySelectorAll('.highlight');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }
        });
    }, { threshold: 0.1 });
    
    // Animate sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateX(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });
    
    // Animate highlights with a slight delay
    setTimeout(() => {
        highlights.forEach((highlight, index) => {
            highlight.style.opacity = '0';
            highlight.style.transform = 'scale(0.98)';
            highlight.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            setTimeout(() => {
                highlight.style.opacity = '1';
                highlight.style.transform = 'scale(1)';
            }, 100 * index);
        });
    }, 300);
    
    // Add print functionality
    const printButton = document.createElement('button');
    printButton.textContent = 'طباعة الشروط';
    printButton.style.display = 'block';
    printButton.style.margin = '30px auto';
    printButton.style.padding = '10px 20px';
    printButton.style.background = 'var(--primary-color)';
    printButton.style.color = 'white';
    printButton.style.border = 'none';
    printButton.style.borderRadius = '4px';
    printButton.style.cursor = 'pointer';
    printButton.onclick = () => window.print();
    
    const container = document.querySelector('.container');
    if (container) {
        container.appendChild(printButton);
    }
});

