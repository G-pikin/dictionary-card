// DOM Elements
const body = document.body;
const menuButton = document.getElementById('menuButton');
const menuDropdown = document.getElementById('menuDropdown');
const fontToggle = document.getElementById('fontToggle');
const fontDropdown = document.getElementById('fontDropdown');
const fontOptions = document.querySelectorAll('.font-option');
const favoriteButton = document.getElementById('favoriteButton');
const shareButton = document.getElementById('shareButton');
const shareDropdown = document.getElementById('shareDropdown');
const copyLink = document.getElementById('copyLink');
const shareEmail = document.getElementById('shareEmail');
const shareTwitter = document.getElementById('shareTwitter');
const toast = document.getElementById('toast');
const playButton = document.getElementById('playButton');
const searchInput = document.getElementById('searchInput');
const themeToggle = document.getElementById('themeToggle');
const darkModeToggle = document.getElementById('darkModeToggle');
const fontSelect = document.getElementById('fontSelect');
const menuItems = document.querySelectorAll('.menu-item');
const backButtons = document.querySelectorAll('.back-button');
const historyItems = document.querySelectorAll('.history-item');
const defaultPage = document.getElementById('dictionaryPage');
const pages = document.querySelectorAll('.card, .page');

// Audio element for pronunciation
const audio = new Audio('https://ssl.gstatic.com/dictionary/static/sounds/20200429/keyboard--_gb_1.mp3');

// Check for saved theme preference
if (localStorage.getItem('darkMode') === 'true') {
    body.classList.add('dark-mode');
    darkModeToggle.checked = true;
}

// Theme Toggle Functionality
themeToggle.addEventListener('click', toggleTheme);
darkModeToggle.addEventListener('change', toggleTheme);

function toggleTheme() {
    body.classList.toggle('dark-mode');
    const isDarkMode = body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    darkModeToggle.checked = isDarkMode;
}

// Hamburger Menu Functionality
menuButton.addEventListener('click', () => {
    menuDropdown.classList.toggle('active');
    // Close other dropdowns
    fontDropdown.classList.remove('active');
    shareDropdown.classList.remove('active');
});

// Menu Navigation
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        defaultPage.classList.add('page')
        const targetPage = item.getAttribute('data-page');
        navigateToPage(targetPage);
        menuDropdown.classList.remove('active');
    });
});

// Back Button Navigation
backButtons.forEach(button => {
    button.addEventListener('click', () => {
        const targetPage = button.getAttribute('data-page');
        console.log(targetPage);
        defaultPage.classList.remove('page')
        navigateToPage(targetPage);
    });
});

// History Item Navigation
historyItems.forEach(item => {
    item.addEventListener('click', () => {
        const word = item.getAttribute('data-word');
        searchInput.value = word;
        navigateToPage('dictionaryPage');
        showToast(`Loaded definition for "${word}"`);
    });
});

// Page Navigation Function
function navigateToPage(pageId) {
    pages.forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Font Selector Functionality
fontToggle.addEventListener('click', () => {
    fontDropdown.classList.toggle('active');
    // Close other dropdowns
    menuDropdown.classList.remove('active');
    shareDropdown.classList.remove('active');
});

fontOptions.forEach(option => {
    option.addEventListener('click', () => {
        const fontType = option.getAttribute('data-font');
        setFont(fontType);
        
        // Update active class
        fontOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        
        fontDropdown.classList.remove('active');
    });
});

// Settings Font Select
fontSelect.addEventListener('change', () => {
    setFont(fontSelect.value);
});

function setFont(fontType) {
    // Update font family
    if (fontType === 'serif') {
        body.classList.add('serif');
        fontToggle.textContent = 'Serif ▼';
        fontSelect.value = 'serif';
    } else if (fontType === 'sans-serif') {
        body.classList.remove('serif');
        body.style.fontFamily = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
        fontToggle.textContent = 'Sans Serif ▼';
        fontSelect.value = 'sans-serif';
    } else if (fontType === 'monospace') {
        body.classList.remove('serif');
        body.style.fontFamily = "'Courier New', Courier, monospace";
        fontToggle.textContent = 'Monospace ▼';
        fontSelect.value = 'monospace';
    }
    
    // Save preference
    localStorage.setItem('fontPreference', fontType);
}

// Load saved font preference
const savedFont = localStorage.getItem('fontPreference');
if (savedFont) {
    setFont(savedFont);
}

// Favorite Button Functionality
favoriteButton.addEventListener('click', () => {
    favoriteButton.classList.toggle('active');
    
    if (favoriteButton.classList.contains('active')) {
        showToast('Added to favorites');
        // In a real app, you would save this to localStorage or a database
        localStorage.setItem('favorite_keyboard', 'true');
    } else {
        showToast('Removed from favorites');
        localStorage.removeItem('favorite_keyboard');
    }
});

// Check if word was previously favorited
if (localStorage.getItem('favorite_keyboard') === 'true') {
    favoriteButton.classList.add('active');
}

// Share Button Functionality
shareButton.addEventListener('click', () => {
    shareDropdown.classList.toggle('active');
    // Close other dropdowns
    menuDropdown.classList.remove('active');
    fontDropdown.classList.remove('active');
});

// Copy Link Option
copyLink.addEventListener('click', () => {
    navigator.clipboard.writeText('https://en.wiktionary.org/wiki/keyboard')
        .then(() => {
            showToast('Link copied to clipboard');
            shareDropdown.classList.remove('active');
        })
        .catch(err => {
            showToast('Failed to copy link');
            console.error('Could not copy text: ', err);
        });
});

// Email Share Option
shareEmail.addEventListener('click', () => {
    const subject = 'Dictionary Definition: keyboard';
    const body = 'Check out this definition of "keyboard": https://en.wiktionary.org/wiki/keyboard';
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    shareDropdown.classList.remove('active');
});

// Twitter Share Option
shareTwitter.addEventListener('click', () => {
    const text = 'Check out this definition of "keyboard": https://en.wiktionary.org/wiki/keyboard';
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
    shareDropdown.classList.remove('active');
});

// Play Button Functionality
playButton.addEventListener('click', () => {
    audio.play();
});

// Search Functionality
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            showToast(`Searching for "${searchTerm}"...`);
            // In a real app, you would redirect to search results
            // window.location.href = `/search?q=${encodeURIComponent(searchTerm)}`;
        }
    }
});

// Toast Message Function
function showToast(message) {
    toast.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!menuButton.contains(e.target) && !menuDropdown.contains(e.target)) {
        menuDropdown.classList.remove('active');
    }
    
    if (!fontToggle.contains(e.target) && !fontDropdown.contains(e.target)) {
        fontDropdown.classList.remove('active');
    }
    
    if (!shareButton.contains(e.target) && !shareDropdown.contains(e.target)) {
        shareDropdown.classList.remove('active');
    }
});

// Initialize the app with the dictionary page active
navigateToPage('dictionaryPage');
