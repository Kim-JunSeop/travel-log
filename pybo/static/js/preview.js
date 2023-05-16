const blogImages = document.querySelectorAll('.img');
blogImages.forEach((img) => {
    const summary_box = img.nextElementSibling;
    img.addEventListener('mouseenter', () => {
        summary_box.style.display = 'block';
    });
    img.addEventListener('mouseleave', () => {
        summary_box.style.display = 'none';
    });
});