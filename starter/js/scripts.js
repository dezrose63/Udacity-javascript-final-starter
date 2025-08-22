// --- Contact Form Validation ---
document.addEventListener('DOMContentLoaded', function () {
	const form = document.getElementById('formSection');
	const emailInput = document.getElementById('contactEmail');
	const messageInput = document.getElementById('contactMessage');
	const emailError = document.getElementById('emailError');
	const messageError = document.getElementById('messageError');
	const charactersLeft = document.getElementById('charactersLeft');

	// Regex patterns
	const illegalCharRegex = /[^a-zA-Z0-9@._-]/;
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const maxMessageLength = 300;

	// Live character count
	if (messageInput && charactersLeft) {
			messageInput.addEventListener('input', function () {
				const len = messageInput.value.length;
				charactersLeft.textContent = `Characters: ${len}/${maxMessageLength}`;
				if (len > maxMessageLength) {
					charactersLeft.classList.add('error');
				} else {
					charactersLeft.classList.remove('error');
				}
			});
	}

	if (form) {
		form.addEventListener('submit', function (e) {
			e.preventDefault();
			let valid = true;
			// Reset errors
			if (emailError) emailError.textContent = '';
			if (messageError) messageError.textContent = '';

			// Email validation
			const email = emailInput ? emailInput.value.trim() : '';
			if (!email) {
				if (emailError) emailError.textContent = 'Email is required.';
				valid = false;
			} else if (!emailRegex.test(email)) {
				if (emailError) emailError.textContent = 'Please enter a valid email address.';
				valid = false;
			} else if (illegalCharRegex.test(email)) {
				if (emailError) emailError.textContent = 'Email contains illegal characters.';
				valid = false;
			}

			// Message validation
			const message = messageInput ? messageInput.value.trim() : '';
			if (!message) {
				if (messageError) messageError.textContent = 'Message is required.';
				valid = false;
			} else if (illegalCharRegex.test(message)) {
				if (messageError) messageError.textContent = 'Message contains illegal characters.';
				valid = false;
			} else if (message.length > maxMessageLength) {
				if (messageError) messageError.textContent = `Message must be no more than ${maxMessageLength} characters.`;
				valid = false;
			}

			if (valid) {
				alert('Form validation passed!');
				// Optionally, reset form fields here
				// form.reset();
				// charactersLeft.textContent = `Characters: 0/${maxMessageLength}`;
			}
		});
	}
});
// Global variables to store fetched data
let aboutMeData = null;
let projectsData = null;

// Fetch aboutMeData.json
fetch('data/aboutMeData.json')
        .then(response => {
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                return response.json();
        })
        .then(data => {
                aboutMeData = data;
                // Populate About Me section
                const aboutMeDiv = document.getElementById('aboutMe');
		if (aboutMeDiv && aboutMeData) {
			// Create paragraph for about me text
			const p = document.createElement('p');
			p.textContent = aboutMeData.aboutMe;
			// Create headshot container and image
			const headshotContainer = document.createElement('div');
			headshotContainer.className = 'headshotContainer';
			const img = document.createElement('img');
			// Fix headshot path if needed
			img.src = aboutMeData.headshot && aboutMeData.headshot.startsWith('images/') ? aboutMeData.headshot : (aboutMeData.headshot ? 'images/' + aboutMeData.headshot.replace(/^.*images[\\\/]/, '') : 'images/headshot.webp');
			img.alt = 'Headshot';
			headshotContainer.appendChild(img);
			// Clear and append children
			aboutMeDiv.innerHTML = '';
			aboutMeDiv.appendChild(p);
			aboutMeDiv.appendChild(headshotContainer);
		}
	})
	.catch(error => {
		console.error('Error fetching aboutMeData.json:', error);
	});

// Fetch projectsData.json
fetch('data/projectsData.json')
        .then(response => {
                if (!response.ok) throw new Error(`HTTP error ${response.status}`);
                return response.json();
        })
        .then(data => {
                projectsData = data;

		// --- Populate Project Cards ---
		const projectList = document.getElementById('projectList');
		if (projectList && Array.isArray(projectsData)) {
			projectList.innerHTML = '';
			const fragment = document.createDocumentFragment();
			projectsData.forEach(project => {
				const card = document.createElement('div');
				card.className = 'projectCard';
				card.id = project.project_id;
				// Set background image with fallback
				let cardImg = project.card_image || 'images/card_placeholder_bg.webp';
				if (cardImg && !cardImg.startsWith('images/')) {
					cardImg = 'images/' + cardImg.replace(/^.*images[\\\/]/, '');
				}
				card.style.backgroundImage = `url('${cardImg}')`;
				card.style.backgroundSize = 'cover';
				card.style.backgroundPosition = 'center';
				// Card content wrapped in a container for background styling
				const cardTextContainer = document.createElement('div');
				cardTextContainer.className = 'cardTextContainer';
				const h4 = document.createElement('h4');
				h4.textContent = project.project_name || 'Untitled Project';
				const p = document.createElement('p');
				p.textContent = project.short_description || '';
				cardTextContainer.appendChild(h4);
				cardTextContainer.appendChild(p);
				card.appendChild(cardTextContainer);
				// Click event to update spotlight
				card.addEventListener('click', () => updateSpotlight(project));
				fragment.appendChild(card);
			});
			projectList.appendChild(fragment);
		}

		// --- Populate Spotlight with first project by default ---
		function updateSpotlight(project) {
			const spotlight = document.getElementById('projectSpotlight');
			if (!spotlight) return;
			// Set background image with fallback
			let spotlightImg = project.spotlight_image || 'images/spotlight_placeholder_bg.webp';
			if (spotlightImg && !spotlightImg.startsWith('images/')) {
				spotlightImg = 'images/' + spotlightImg.replace(/^.*images[\\\/]/, '');
			}
			spotlight.style.backgroundImage = `url('${spotlightImg}')`;
			spotlight.style.backgroundSize = 'cover';
			spotlight.style.backgroundPosition = 'center';

			// Use the existing div#spotlightTitles
			const titlesDiv = document.getElementById('spotlightTitles');
			if (!titlesDiv) return;

			// Clear and set up structure
			titlesDiv.innerHTML = '';
			// h3 for project name
			const h3 = document.createElement('h3');
			h3.textContent = project.project_name || 'Untitled Project';
			titlesDiv.appendChild(h3);
			// p for long description
			const desc = document.createElement('p');
			desc.textContent = project.long_description || 'No description available.';
			titlesDiv.appendChild(desc);
			// a for external link
			const link = document.createElement('a');
			if (project.url) {
				link.href = project.url;
				link.textContent = 'Click here to see more...';
				link.target = '_blank';
				link.rel = 'noopener noreferrer';
			} else {
				link.href = '#';
				link.textContent = 'No link available';
				link.style.pointerEvents = 'none';
				link.style.opacity = '0.5';
			}
			titlesDiv.appendChild(link);
		}

		// Set default spotlight to first project
		if (projectsData.length > 0) {
			updateSpotlight(projectsData[0]);
		}

		// --- Arrow Scroll Functionality ---
		const arrowLeft = document.querySelector('.arrow-left');
		const arrowRight = document.querySelector('.arrow-right');
		if (projectList && arrowLeft && arrowRight) {
			// Responsive scroll using matchMedia
			function scrollProjectList(direction) {
				const isMobile = window.matchMedia('(max-width: 767px)').matches;
				const scrollAmount = 20; // px per interval for smooth continuous scroll
				if (isMobile) {
					projectList.scrollBy({ left: direction * scrollAmount, behavior: 'auto' });
				} else {
					projectList.scrollBy({ top: direction * scrollAmount, behavior: 'auto' });
				}
			}

			let scrollInterval = null;
			function startContinuousScroll(direction) {
				if (scrollInterval) return;
				scrollInterval = setInterval(() => scrollProjectList(direction), 16); // ~60fps
			}
			function stopContinuousScroll() {
				clearInterval(scrollInterval);
				scrollInterval = null;
			}

			// Mouse events for continuous scroll
			arrowLeft.addEventListener('mousedown', () => startContinuousScroll(-1));
			arrowLeft.addEventListener('mouseup', stopContinuousScroll);
			arrowLeft.addEventListener('mouseleave', stopContinuousScroll);
			arrowRight.addEventListener('mousedown', () => startContinuousScroll(1));
			arrowRight.addEventListener('mouseup', stopContinuousScroll);
			arrowRight.addEventListener('mouseleave', stopContinuousScroll);
			// Also support click for accessibility
			arrowLeft.addEventListener('click', () => scrollProjectList(-1));
			arrowRight.addEventListener('click', () => scrollProjectList(1));
		}
// Add custom scrollbar style for project cards
const style = document.createElement('style');
style.textContent = `
#projectList {
	scrollbar-width: thin;
	scrollbar-color: #888 #e0e0e0;
}
#projectList::-webkit-scrollbar {
	height: 8px;
	width: 8px;
	background: #e0e0e0;
	border-radius: 4px;
}
#projectList::-webkit-scrollbar-thumb {
	background: #888;
	border-radius: 4px;
}
#projectList::-webkit-scrollbar-thumb:hover {
	background: #555;
}
`;
document.head.appendChild(style);
	})
	.catch(error => {
		console.error('Error fetching projectsData.json:', error);
	});
