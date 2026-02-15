// Back-to-top button and other DOM-dependent code wrapped in document.ready
$(document).ready(function () {
    var btn = $('#back-to-top-button');

    $(window).scroll(function () {
        if ($(window).scrollTop() > 300) {
            btn.addClass('show');
        } else {
            btn.removeClass('show');
        }
    });

    btn.on('click', function (e) {
        e.preventDefault();
        const speechBalloon = document.querySelector('.speech-balloon');
        const clickSound = new Audio('assets/sounds/collision_sound.wav');
        $('html, body').animate({ scrollTop: 0 }, '300');
        speechBalloon.innerText = 'back to top!';
        clickSound.play();
    });

    // Play pronunciation audio when the emoji is clicked
    var volumeEmoji = document.getElementById('volumeEmoji');
    if (volumeEmoji) {
        volumeEmoji.addEventListener('click', function () {
            const pronunicationAudio = new Audio('assets/sounds/khang.mp3');
            pronunicationAudio.play();
        });
    }
});


// Toggle navigation menu bar
function toggleNav() {
    document.querySelector('nav').classList.toggle('animated-menu');
    document.querySelector('.nav-toggle-btn').classList.toggle('active');
}


// Change the text interchangably "See More" and "See Less"
function toggleText(linkElement) {
    var collapseId = linkElement.getAttribute('href').substring(1);
    var collapseElement = document.getElementById(collapseId);

    $(collapseElement).on('hidden.bs.collapse', function () {
        linkElement.textContent = '... See More';
    });
    $(collapseElement).on('shown.bs.collapse', function () {
        linkElement.textContent = '... See Less';
    });
}


// Toggle abstract visibility with "Abstract" and "Hide Abstract" text
function toggleAbstract(linkElement) {
    var collapseId = linkElement.getAttribute('href').substring(1);
    var collapseElement = document.getElementById(collapseId);

    $(collapseElement).on('hidden.bs.collapse', function () {
        linkElement.textContent = 'Abstract';
    });
    $(collapseElement).on('shown.bs.collapse', function () {
        linkElement.textContent = 'Hide Abstract';
    });
}



// Initialize the toggleText function for each link
$(document).ready(function () {
    document.querySelectorAll('[data-toggle="collapse"]').forEach(function (linkElement) {
        toggleText(linkElement);
    });
});


// Scroll to top of a div based on its tag
function scrollToTopDiv(divTag) {
    $(divTag)[0].scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}


// Initialize the toggleText function for each link


// Owl carousel for updates
function initializeOwlCarousel() {
    try {
        // Check if OwlCarousel plugin is loaded
        if (typeof $.fn.owlCarousel === 'undefined') {
            console.error('OwlCarousel plugin not loaded yet, retrying in 500ms...');
            setTimeout(initializeOwlCarousel, 500);
            return;
        }

        var $carousels = $('.owl-carousel');
        if ($carousels.length === 0) {
            console.warn('No .owl-carousel elements found in DOM');
            return;
        }

        console.log('Initializing OwlCarousel for', $carousels.length, 'carousel(s)');

        $carousels.owlCarousel({
            loop: false,
            rewind: false,
            margin: 5,
            nav: true,
            dots: false,
            lazyLoad: false,
            slideBy: 'page',
            responsive: {
                0: { items: 1.75 },
                600: { items: 3 },
                900: { items: 5 },
                1200: { items: 6 }
            }
        });

        console.log('OwlCarousel initialized successfully');
    } catch (error) {
        console.error('Error initializing OwlCarousel:', error);
        // Try again after a delay
        setTimeout(initializeOwlCarousel, 1000);
    }
}

// Touch and mouse event listeners
let isDragging = false;
let isMobile = 'ontouchstart' in window;
let startEvent = isMobile ? 'touchstart' : 'mousedown';
let moveEvent = isMobile ? 'touchmove' : 'mousemove';
let endEvent = isMobile ? 'touchend' : 'mouseup';


// Capture mouse down (desktop) or touch start (mobile) events
popupIconContainer.addEventListener(startEvent, (e) => {
    e.preventDefault();
    isDragging = true;
    let clientX = isMobile ? e.touches[0].clientX : e.clientX;
    let clientY = isMobile ? e.touches[0].clientY : e.clientY;

    startX = clientX;
    startY = clientY;
    originalX = popupIconContainer.getBoundingClientRect().left;
    originalY = popupIconContainer.getBoundingClientRect().top;
    dismissalArea.style.display = 'flex';

    // Hide the speech balloon as users start dragging and drag the icon
    document.querySelector('.speech-balloon').classList.add('hidden');
});


// Capture mouse move (desktop) or touch move (mobile) events
document.addEventListener(moveEvent, (e) => {
    if (!isDragging) {
        return;
    }

    let clientX = isMobile ? e.touches[0].clientX : e.clientX;
    let clientY = isMobile ? e.touches[0].clientY : e.clientY;

    let x = originalX + (clientX - startX);
    let y = originalY + (clientY - startY);
    popupIconContainer.style.left = `${x}px`;
    popupIconContainer.style.bottom = `calc(100% - ${y}px - ${popupIconContainer.offsetHeight}px)`;
});


// Capture mouse up (desktop) or touch end (mobile) events
document.addEventListener(endEvent, (e) => {
    const clickSound = new Audio('assets/sounds/disappear_sound.wav');

    if (!isDragging) {
        return;
    }

    let clientX = isMobile ? e.changedTouches[0].clientX : e.clientX;
    let clientY = isMobile ? e.changedTouches[0].clientY : e.clientY;
    let centerX = window.innerWidth / 2;
    let centerY = window.innerHeight;

    // Check if icon is near the middle bottom dismissal area
    if (Math.abs(clientX - centerX) < 50 && Math.abs(clientY - centerY) < 100) {
        popupIconContainer.classList.add('hidden');
        clickSound.play();
    }

    dismissalArea.style.display = 'none';
    isDragging = false;
});


// Hide speech balloon when scrolling down
window.addEventListener('scroll', function () {
    let scrollPosition = window.scrollY || document.documentElement.scrollTop;
    if (scrollPosition > 300) {
        document.querySelector('.speech-balloon').classList.add('hidden');
    } else {
        document.querySelector('.speech-balloon').classList.remove('hidden');
    }
});


// Update progress bar as user scrolls down
window.onscroll = function () { progressBar() };

function progressBar() {
    var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    var scrolled = (winScroll / height) * 100;
    document.getElementById("progressBar").style.width = scrolled + "%";
}


// Scripts to activate/deactivate contact info card 
$(document).ready(function () {
    var overlaybg = document.getElementById('overlay-bg');
    var contactTrigger = document.getElementById('contact-card-trigger');
    var frontEndCard = document.getElementById('front_end_card');

    if (contactTrigger) {
        contactTrigger.onclick = function () {
            overlaybg.style.display = 'flex';
        };
    }

    if (overlaybg) {
        overlaybg.addEventListener('click', function (event) {
            if (event.target === overlaybg) {
                overlaybg.style.display = 'none';
            }
        });
    }

    if (frontEndCard) {
        frontEndCard.addEventListener('click', function () {
            this.classList.toggle('flip');
            const flipAudio = new Audio('assets/sounds/flip_sound.wav');
            flipAudio.play();
        });
    }
});


// Get all filter buttons and change their active status as user clicks
$(document).ready(function () {
    var filterButtonsProject = document.querySelectorAll('#filters-project .filter-button');
    var filterButtonsGithub = document.querySelectorAll('#filters-resources .filter-button');
    var speechBalloon = document.querySelector('.speech-balloon');

    filterButtonsProject.forEach(function (filterButtonProject) {
        filterButtonProject.addEventListener('click', function () {
            filterButtonsProject.forEach(function (flrbtn) {
                flrbtn.classList.remove('active');
            });
            this.classList.add('active');
            if (this.textContent === "perception + manipulation") {
                speechBalloon.innerText = 'see RoPM projects!';
            } else {
                speechBalloon.innerText = 'see ' + this.textContent + ' projects!';
            }
            speechBalloon.classList.remove('hidden');
        });
    });

    filterButtonsGithub.forEach(function (filterButtonGithub) {
        filterButtonGithub.addEventListener('click', function () {
            filterButtonsGithub.forEach(function (flrbtn) {
                flrbtn.classList.remove('active');
            });
            this.classList.add('active');
            speechBalloon.innerText = 'see ' + this.textContent + ' repos!';
            speechBalloon.classList.remove('hidden');
        });
    });


    // Function to update Isotope layout with smooth transitions
    function updateLayout(collapseElement, isExpanding) {

        // Initialize Isotope with vertical layout
        var iso = new Isotope('#projects', {
            itemSelector: '.project',
            layoutMode: 'vertical'
        });

        if (isExpanding) {
            $(collapseElement).css('display', 'none');
            iso.arrange();
            setTimeout(function () {
                $(collapseElement).css('display', '');
                iso.arrange();
            }, 300);
        } else {
            iso.arrange();
            setTimeout(function () {
                $(collapseElement).css('display', 'none');
                iso.arrange();
            }, 300);
        }
    }


    // Bind updateLayout function to the collapsible elements' events
    $('.collapse').on('show.bs.collapse', function () {
        updateLayout(this, true);
    }).on('hide.bs.collapse', function () {
        updateLayout(this, false);
    });
});  // Close the $(document).ready block that started at line 235


// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault = 5;
var currentNumberPages = 1;
var currentPage = 1;
var currentFilter = '*';
var filterAtribute = 'data-filter';
var pageAtribute = 'data-page-project';
var pagerClass = 'isotope-pager-project';
var $projects = $('#projects').isotope({
    itemcategory: '.project',
    layoutMode: 'vertical'
});


// Filter based on input category
function filterCategoryProjects(category) {
    $projects.isotope({
        filter: category
    });
}


// Determine items to be categorized and displayed per page
function showPageProjects(n) {
    currentPage = n;
    var category = '.project';
    category += (currentFilter != '*') ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';
    category += '[' + pageAtribute + '="' + currentPage + '"]';
    filterCategoryProjects(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerProjects() {
    var $isotopePager = ($('.' + pagerClass).length == 0) ? $('<div class="' + pagerClass + '"></div>') : $('.' + pagerClass);
    $isotopePager.html('');

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function () {
        if (currentPage > 1) {
            showPageProjects(currentPage - 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === 1) {
        $previous.prop('disabled', true);
    }

    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function () {
        if (currentPage < currentNumberPages) {
            showPageProjects(currentPage + 1);
            updatePagerProjects();
            scrollToTopDiv('#research');
        }
    });
    if (currentPage === currentNumberPages) {
        $next.prop('disabled', true);
    }

    var $currentPageIndicator = $('<span class="current-page">&nbsp; page ' + currentPage + ' of ' + currentNumberPages + ' &nbsp; </span>');

    $previous.appendTo($isotopePager);
    $currentPageIndicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $projects.after($isotopePager);
}


// Set pagination
function setPaginationProjects() {
    var SettingsPagesOnItems = function () {
        var itemsLength = $projects.children('.project').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault);
        var item = 1;
        var page = 1;
        var category = '.project';
        category += (currentFilter != '*') ? '[' + filterAtribute + '="' + currentFilter + '"]' : '';

        $projects.children(category).each(function () {
            if (item > itemsPerPageDefault) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute, page);
            item++;
        });
        currentNumberPages = page;
    }();

    updatePagerProjects();
}


function initializeIsotopeProjects() {
    // Set number of pages, return to first page,
    setPaginationProjects();
    showPageProjects(1);


    // Filter projects based on category, including change active buttons, filter projects, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-project .filter-button').click(function () {
        $('#filters-project .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter = filter;
        setPaginationProjects();
        showPageProjects(1);
        updatePagerProjects();
    });
}


// Function to load GitHub repositories and HuggingFace resources
document.addEventListener('DOMContentLoaded', () => {

    const container = document.getElementById('github-cards');
    if (!container) return; // Exit if resources section is not present

    const repoElements = container.querySelectorAll('div[data-url], div[data-hf-id]');

    repoElements.forEach(repoElement => {
        const dataType = repoElement.getAttribute('data-type');

        if (dataType === 'github') {
            // Handle GitHub repositories
            const repoUrl = repoElement.getAttribute('data-url');

            axios.get(repoUrl)
                .then(response => {
                    const { name, description, html_url, stargazers_count, forks_count, language } = response.data;
                    const cardHtml = `
                            <div class="repo-header">
                                <i class="far fa-bookmark bookmark-icon"></i>
                                <a href="${html_url}" target="_blank" class="repo-name">${name}</a>
                            </div>
                            <div class="repo-description">${description || 'No description provided.'}</div>
                            <div class="repo-stats">
                                <i class="fas fa-code language-icon"></i>
                                <span class="language">${language}</span>
                                <div>
                                    <i class="fas fa-star star-icon"></i>
                                    <span class="stats-number">${stargazers_count}</span>
                                </div>
                                <div>
                                    <i class="fas fa-code-branch fork-icon"></i>
                                    <span class="stats-number">${forks_count}</span>
                                </div>
                            </div>
                    `;

                    repoElement.innerHTML = cardHtml;
                })
                .catch(error => {
                    console.error('Error fetching repository data for', repoUrl, error);
                    const fallbackName = repoUrl.split('/').pop();
                    const fallbackLink = repoUrl.replace('api.github.com/repos', 'github.com');
                    repoElement.innerHTML = `
                        <div class="repo-header">
                            <i class="far fa-bookmark bookmark-icon"></i>
                            <a href="${fallbackLink}" target="_blank" class="repo-name">${fallbackName}</a>
                        </div>
                        <div class="repo-description">Unable to load details (API Limit or Error).</div>
                        <div class="repo-stats">
                            <a href="${fallbackLink}" target="_blank">View on GitHub <i class="fas fa-external-link-alt"></i></a>
                        </div>
                    `;
                });
        } else if (dataType === 'huggingface') {
            // Handle HuggingFace datasets and models
            const hfId = repoElement.getAttribute('data-hf-id');
            const hfType = repoElement.getAttribute('data-hf-type'); // 'dataset' or 'model'

            const apiUrl = hfType === 'dataset'
                ? `https://huggingface.co/api/datasets/${hfId}`
                : `https://huggingface.co/api/models/${hfId}`;

            const webUrl = hfType === 'dataset'
                ? `https://huggingface.co/datasets/${hfId}`
                : `https://huggingface.co/${hfId}`;

            axios.get(apiUrl)
                .then(response => {
                    const data = response.data;
                    const name = hfId.split('/').pop();

                    // Get description and truncate to 2-3 lines (approximately 200 characters)
                    let description = data.description || data.cardData?.description || 'No description provided.';

                    // Remove markdown headers, links, and excessive whitespace
                    description = description
                        .replace(/^#+\s+/gm, '') // Remove markdown headers
                        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove markdown links but keep text
                        .replace(/\n+/g, ' ') // Replace newlines with spaces
                        .replace(/\s+/g, ' ') // Normalize whitespace
                        .trim();

                    // Truncate to approximately 200 characters (2-3 lines)
                    const maxLength = 200;
                    if (description.length > maxLength) {
                        description = description.substring(0, maxLength).trim() + '...';
                    }

                    const downloads = data.downloads || 0;
                    const likes = data.likes || 0;

                    const cardHtml = `
                            <div class="repo-header">
                                <img src="assets/img/huggingface-icon.webp" alt="HuggingFace" style="width: 16px; height: 16px; margin-right: 5px; vertical-align: middle;">
                                <a href="${webUrl}" target="_blank" class="repo-name">${name}</a>
                            </div>
                            <div class="repo-description">${description}</div>
                            <div class="repo-stats">
                                <i class="fas fa-database language-icon"></i>
                                <span class="language">${hfType}</span>
                                <div>
                                    <i class="fas fa-download star-icon"></i>
                                    <span class="stats-number">${downloads.toLocaleString()}</span>
                                </div>
                                <div>
                                    <i class="fas fa-heart fork-icon" style="color: #ff6b6b;"></i>
                                    <span class="stats-number">${likes}</span>
                                </div>
                            </div>
                    `;

                    repoElement.innerHTML = cardHtml;
                })
                .catch(error => {
                    console.error('Error fetching HuggingFace data for', hfId, error);
                    const fallbackName = hfId.split('/').pop();
                    repoElement.innerHTML = `
                        <div class="repo-header">
                            <img src="assets/img/huggingface-icon.webp" alt="HuggingFace" style="width: 16px; height: 16px; margin-right: 5px; vertical-align: middle;">
                            <a href="${webUrl}" target="_blank" class="repo-name">${fallbackName}</a>
                        </div>
                        <div class="repo-description">Unable to load details (API Limit or Error).</div>
                        <div class="repo-stats">
                            <a href="${webUrl}" target="_blank">View on HuggingFace <i class="fas fa-external-link-alt"></i></a>
                        </div>
                    `;
                });
        }
    });
});



// Modified from https://codepen.io/SohRonery/pen/wvvBLyP
var itemsPerPageDefault_1 = 6;
var currentNumberPages_1 = 1;
var currentPage_1 = 1;
var currentFilter_1 = '*';
var filterAtribute_1 = 'data-filter';
var pageAtribute_1 = 'data-page-github';
var pagerClass_1 = 'isotope-pager-github';
// var $cards = $('#github-cards').isotope({
//     itemcategory: '.github-card',
//     layoutMode: 'fitRows'
// });
var $cards = $('#github-cards'); // Just select the element without Isotope


// Filter based on input category
function filterCategoryGithub(category) {
    // Use jQuery show/hide instead of Isotope for flexbox compatibility
    if (category === '*') {
        $cards.find('.github-card').show();
    } else {
        $cards.find('.github-card').hide();
        $cards.find(category).show();
    }
}


// Determine items to be categorized and displayed per page
function showPageGithub(n) {
    currentPage_1 = n;
    var category = '.github-card';
    category += (currentFilter_1 != '*') ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';
    category += '[' + pageAtribute_1 + '="' + currentPage_1 + '"]';
    filterCategoryGithub(category);
}


// Update pager indicator when user clicks previous or next button, and disable buttons as needed
function updatePagerGithub() {
    var $isotopePager = ($('.' + pagerClass_1).length == 0) ? $('<div class="' + pagerClass_1 + '"></div>') : $('.' + pagerClass_1);
    $isotopePager.html('');

    var $previous = $('<button class="pager" id="previous-page">&#8592; previous</button>');
    $previous.click(function () {
        if (currentPage_1 > 1) {
            showPageGithub(currentPage_1 - 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === 1) {
        $previous.prop('disabled', true);
    }

    var $next = $('<button class="pager" id="next-page">next &#8594;</button>');
    $next.click(function () {
        if (currentPage_1 < currentNumberPages_1) {
            showPageGithub(currentPage_1 + 1);
            updatePagerGithub();
            scrollToTopDiv('#resources');
        }
    });
    if (currentPage_1 === currentNumberPages_1) {
        $next.prop('disabled', true);
    }

    var $currentPage_1Indicator = $('<span class="current-page">&nbsp; page ' + currentPage_1 + ' of ' + currentNumberPages_1 + ' &nbsp; </span>');

    $previous.appendTo($isotopePager);
    $currentPage_1Indicator.appendTo($isotopePager);
    $next.appendTo($isotopePager);
    $cards.after($isotopePager);
}


// Set pagination
function setPaginationGithub() {
    var SettingsPagesOnItems = function () {
        var itemsLength = $cards.children('.github-card').length;
        var pages = Math.ceil(itemsLength / itemsPerPageDefault_1);
        var item = 1;
        var page = 1;
        var category = '.github-card';
        category += (currentFilter_1 != '*') ? '[' + filterAtribute_1 + '="' + currentFilter_1 + '"]' : '';

        $cards.children(category).each(function () {
            if (item > itemsPerPageDefault_1) {
                page++;
                item = 1;
            }
            $(this).attr(pageAtribute_1, page);
            item++;
        });
        currentNumberPages_1 = page;
    }();

    updatePagerGithub();
}


function initializeIsotopeGithub() {
    // Set number of pages, return to first page,
    setPaginationGithub();
    showPageGithub(1);


    // Filter cards based on category, including change active buttons, filter cards, 
    // set the number of pages, return to the first page, and update the pager indicator 
    $('#filters-resources .filter-button').click(function () {
        $('#filters-resources .filter-button').removeClass('active');
        $(this).addClass('active');
        var filter = $(this).attr('data-filter');
        currentFilter_1 = filter;
        setPaginationGithub();
        showPageGithub(1);
        updatePagerGithub();
    });
}


// // Guarantee correct layouts when all web resources are fully loaded 
// This version is slow --> only re-layout when all the gifs are fully loaded
// $(window).on('load', function() {
//     initializeOwlCarousel();
//     initializeIsotopeProjects();
// });
// This version is faster --> re-layout when all the images are fully loaded not neccessarily all the gifs
$(document).ready(function () {
    // Initialize Owl Carousel immediately to prevent layout issues!
    initializeOwlCarousel();

    var Images = $('img[src$=".jpg"], img[src$=".jpeg"], img[src$=".png"]').get();
    var imageLoadPromises = Images.map(function (img) {
        return new Promise(function (resolve) {
            if (img.complete) {
                resolve();
            } else {
                img.onload = resolve;
                img.onerror = resolve; // Continue even if image fails to load
            }
        });
    });

    Promise.all(imageLoadPromises).then(function () {
        // Only Isotope needs to wait for images because it calculates layout positions based on element sizes
        initializeIsotopeProjects();
        initializeIsotopeGithub(); // Re-enabled to support filtering
    });
});


// Fallback: Re-initialize carousel on window.load if it didn't work on document.ready
$(window).on('load', function () {
    // Check if carousel was successfully initialized
    if ($('.owl-carousel').length > 0 && !$('.owl-carousel').hasClass('owl-loaded')) {
        console.warn('OwlCarousel not initialized on document.ready, trying again on window.load');
        initializeOwlCarousel();
    }
});


// Automatically update year in footer
$(document).ready(function () {
    var currentYearEl = document.getElementById("currentYear");
    if (currentYearEl) {
        currentYearEl.textContent = new Date().getFullYear();
    }
});


// Canvas for particle moves
$(document).ready(function () {
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const particles = [];


    // Resize canvas width and height
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();


    // Class for Particle
    class Particle {

        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.color = 'rgba(255, 255, 255, ' + 0.7 + ')';
            this.lifespan = 100;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.color = 'rgba(255, 255, 255, ' + this.lifespan-- / 100 + ')';

            if (this.lifespan <= 0) {
                this.reset();
            }
        }

        draw(ctx) {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }


    // Initialize 101 particles
    for (let i = 0; i < 101; i++) {
        particles.push(new Particle());
    }


    // Make the particles move
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(particle => {
            particle.update();
            particle.draw(ctx);
        });

        requestAnimationFrame(animate);
    }

    // Animate the particles only in dark mode
    // function checkAndAnimate() {
    //     if (document.body.classList.contains('dark-theme')) {
    //         animate();
    //     } else {
    //         ctx.clearRect(0, 0, canvas.width, canvas.height);
    //         requestAnimationFrame(checkAndAnimate);
    //     }
    // }

    // Start checking for theme
    // checkAndAnimate();
});  // Close the $(document).ready block for canvas that started at line 647
