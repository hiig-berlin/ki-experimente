// scroll anchor links into veiw smoothly
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
	anchor.addEventListener('click', function (e) {
		const targetElement = document.querySelector(anchor.getAttribute('href'))
		if (targetElement.scrollIntoView) {
			e.preventDefault();
			targetElement.scrollIntoView({
				behavior: 'smooth'
			});
		}
	});
});

