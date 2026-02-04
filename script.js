document.addEventListener('DOMContentLoaded', () => {
    console.log('ClearX Webstore: DOM fully loaded and parsed.');

    // --- Theme Toggle Logic ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    const body = document.body;

    const toggleTheme = () => {
        const currentMode = body.classList.contains('light-mode') ? 'light' : 'dark';
        console.log(`Theme Toggle: Switching from ${currentMode} mode.`);

        if (body.classList.contains('light-mode')) {
            body.classList.replace('light-mode', 'dark-mode');
            themeIcon.setAttribute('data-lucide', 'sun');
        } else {
            body.classList.replace('dark-mode', 'light-mode');
            themeIcon.setAttribute('data-lucide', 'moon');
        }
        lucide.createIcons();
        console.log(`Theme Toggle: Switched to ${body.classList.contains('light-mode') ? 'light' : 'dark'} mode.`);
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // --- Image Comparison Slider ---
    const slider = document.getElementById('compare-slider');
    const imgBefore = document.querySelector('.img-wrapper-before');
    const divider = document.querySelector('.slider-divider');

    if (slider) {
        console.log('Comparison Slider: Initialized.');
        slider.addEventListener('input', (e) => {
            const val = e.target.value;
            imgBefore.style.width = `${val}%`;
            divider.style.left = `${val}%`;
        });
    }

    // --- Parallax Effect for Hero ---
    const hero = document.querySelector('.hero');
    const stackItems = document.querySelectorAll('.stack-item');

    if (hero) {
        console.log('Hero Parallax: Initialized.');
        hero.addEventListener('mousemove', (e) => {
            const { clientX, clientY } = e;
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const moveX = (clientX - centerX) / 50;
            const moveY = (clientY - centerY) / 50;

            stackItems.forEach((item, index) => {
                const factor = index + 1;
                item.style.transform = `translate(calc(-50% + ${moveX * factor}px), calc(-50% + ${moveY * factor}px)) rotate(${(index - 1) * 5}deg)`;
            });
        });

        hero.addEventListener('mouseleave', () => {
            stackItems.forEach((item, index) => {
                item.style.transform = `translate(-50%, -50%) rotate(${(index - 1) * 5}deg)`;
            });
        });
    }

    // --- Intersection Observer for Animations ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animElements = document.querySelectorAll('.metric-card, .section-header, .test-container');
    console.log(`Scroll Animations: Observing ${animElements.length} elements.`);
    animElements.forEach(el => {
        el.style.opacity = '0';
        observer.observe(el);
    });

    // --- Model Testing Logic ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const testingGrid = document.getElementById('testing-grid');
    const testActions = document.getElementById('test-actions');
    const inputPreview = document.getElementById('input-preview');
    const outputPreview = document.getElementById('output-preview');
    const modelLoader = document.getElementById('model-loader');
    const resetBtn = document.getElementById('reset-test');
    const downloadBtn = document.getElementById('download-result');

    let processedImageUrl = null;

    const dataURLtoBlob = (dataurl) => {
        let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    };

    const handleFile = async (file) => {
        if (!file || !file.type.startsWith('image/')) {
            console.error('Model Testing: Invalid file type. Please upload an image.');
            return;
        }

        console.log(`Model Testing: Handling file "${file.name}" (${file.size} bytes).`);

        // Show local preview of input
        const reader = new FileReader();
        reader.onload = (e) => {
            const imgSrc = e.target.result;
            dropZone.style.display = 'none';
            testingGrid.style.display = 'grid';
            inputPreview.style.backgroundImage = `url(${imgSrc})`;
            inputPreview.style.filter = 'none'; // Remove simulated blur
            modelLoader.style.display = 'block';
            outputPreview.style.backgroundImage = 'none';
            testActions.style.display = 'none';
        };
        reader.readAsDataURL(file);

        // Actual API Call
        const formData = new FormData();
        formData.append('file', file);

        try {
            console.log('Model Testing: Sending request to backend...');
            const response = await fetch('http://localhost:8000/enhance', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.statusText}`);
            }

            const blob = await response.blob();
            const resultUrl = URL.createObjectURL(blob);

            console.log('Model Testing: Received result from backend.');
            modelLoader.style.display = 'none';
            outputPreview.style.backgroundImage = `url(${resultUrl})`;
            outputPreview.style.filter = 'none'; // Ensure no filtered appearance
            testActions.style.display = 'flex';

            processedImageUrl = resultUrl;

            if (downloadBtn) {
                downloadBtn.onclick = (event) => {
                    event.preventDefault();
                    const link = document.createElement('a');
                    link.href = resultUrl;
                    link.download = 'ClearX_ESRGAN_Enhanced.png';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                };
            }
        } catch (error) {
            console.error('Model Testing: Enhancement failed:', error);
            modelLoader.style.display = 'none';
            alert('Model Enhancement failed. Please ensure the backend server is running.');
            // Reset UI or show error state
            resetBtn.click();
        }
    };

    if (dropZone) {
        dropZone.addEventListener('click', () => fileInput.click());
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            const file = e.dataTransfer.files[0];
            handleFile(file);
        });
    }

    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            handleFile(file);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            console.log('Model Testing: Resetting test area.');
            dropZone.style.display = 'block';
            testingGrid.style.display = 'none';
            testActions.style.display = 'none';
            fileInput.value = '';
            processedImageUrl = null;
        });
    }

    // --- Smooth Scrolling for Navigation ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            e.preventDefault();
            console.log(`Navigation: Scrolling to ${href}.`);
            const target = document.querySelector(href);
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- Micro-interactions for buttons ---
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('mousedown', () => {
            btn.style.transform = 'scale(0.95)';
        });
        btn.addEventListener('mouseup', () => {
            btn.style.transform = 'scale(1)';
        });
    });

});
