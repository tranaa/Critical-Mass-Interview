// Fetch JSON data
async function fetchData() {
    try {
        const response = await fetch('navigation.json');
        if (!response.ok) {
            throw new Error('Failed to fetch JSON file');
        }
        const data = await response.json();
        processCityData(data);
    } catch (error) {
        console.error('Problem fetching JSON file:', error);
    }
}

// Process city data to create navigation buttons
function processCityData(data) {
    const { cities } = data;
    const navBarList = document.getElementById('nav-bar-list');
    cities.forEach(city => {
        const listItem = document.createElement('li');
        listItem.className = "nav-bar-list-item";
        const listItemButton = document.createElement('button');
        listItemButton.id = city.section;
        listItemButton.textContent = city.label;
        listItemButton.setAttribute('aria-label', `Select ${city.label} time`);
        listItem.appendChild(listItemButton);
        navBarList.appendChild(listItem);
        listItemButton.addEventListener('click', () => {
            setActiveButton(listItemButton);
            moveSlider();
            toggleMenu();
            changeTimeZone(city.timeZone);
            document.getElementById('location').textContent = city.label;
        });
    });
}

// Set active navigation button
function setActiveButton(button) {
    const navButtons = document.querySelectorAll('.nav-bar-list-item button');
    navButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
}

// Move slider
function moveSlider() {
    const navSlider = document.getElementById("nav-slider");
    const activeButton = document.querySelector('.nav-bar-list-item button.active');
    if (activeButton) {
        navSlider.style.left = `${activeButton.offsetLeft}px`;
        navSlider.style.width = `${activeButton.offsetWidth}px`;
    }
}

// Close menu
function closeMenu() {
    const navIcon = document.getElementById('nav-icon');
    const navBar = document.getElementById('nav-bar');
    const screen = document.getElementById('blur-screen')
    screen.classList.remove('screen-active')
    navIcon.classList.add('fa-bars');
    navIcon.classList.remove('fa-times');
    navBar.classList.remove('nav-active');
}

// Get Json and add event listeners on load
window.onload = function() {
    fetchData();
    window.addEventListener('resize', moveSlider);
    window.addEventListener('resize', closeMenu);
};

// Toggle menu for smaller screens
function toggleMenu() {
    const navIcon = document.getElementById('nav-icon');
    const navBar = document.getElementById('nav-bar');
    const screen = document.getElementById('blur-screen')
    navIcon.classList.toggle('fa-bars');
    navIcon.classList.toggle('fa-times');
    navBar.classList.toggle('nav-active');
    screen.classList.toggle('screen-active')
}

// Clock logic
function displayTime() {
    const activeButton = document.querySelector('.nav-bar-list-item button.active');
    if (activeButton) {
        const now = new Date();
        const options = { timeZone: selectedTimeZone };
        const formattedTime = now.toLocaleTimeString('en-US', options);
        document.getElementById('clock').textContent = formattedTime;
        const currentDate = new Date().toLocaleDateString('en-US', { 
            timeZone: selectedTimeZone,
            weekday: 'long', 
            month: 'long', 
            day: 'numeric',
            year: 'numeric'
        });
        document.getElementById('date').textContent = currentDate;
    }
}

// Default user time zone
let selectedTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone; 

// Change time zone
function changeTimeZone(timeZone) {
    selectedTimeZone = timeZone;
    displayTime();
}

// Initial display of time and update every second
displayTime();
setInterval(displayTime, 1000);

// Event listener for menu burger
const menuBurger = document.getElementById('menu-burger');
menuBurger.addEventListener('click', toggleMenu);
