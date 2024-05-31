document.addEventListener('DOMContentLoaded', () => {
    // Ensure elements exist before proceeding
    const rows = document.querySelectorAll('.row');
    if (rows.length === 0) {
        console.log('No rows found.');
    } else {
        rows.forEach((row, index) => {
            if (index % 2 === 0) {
                row.classList.add('padded-left');
            } else {
                row.classList.add('padded-right');
            }
        });
    }
    
    function toggleButton(button) {
        button.classList.toggle('active');
        saveStateToLocalStorage();
        let container = document.querySelectorAll('#alignment-scales-container');
        if (!container) {
            console.log('No alignment scales container found.');
            return;
        }

        // Remove existing scales
        container.innerHTML = '';

        // Find all active buttons
        let activeButtons = document.querySelectorAll('.active');

        // Create alignment scales for each active button
        activeButtons.forEach(activeButton => {
            createAlignmentScale(container);
        });
    }

    function saveStateToLocalStorage() {
        const activeButtons = document.querySelectorAll('.active');
        const activeButtonIds = Array.from(activeButtons).map(button => button.id);
        localStorage.setItem('activeButtons', JSON.stringify(activeButtonIds));
    }

    const buttons = document.querySelectorAll('.des-button, .dev-button, .oth-button');
    if (buttons.length === 0) {
        console.log('No buttons found.');
    } else {
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                toggleButton(button);
            });
        });
    }

    function navigateToAlignment() {
        window.location.href = "alignment.html";
    }

    function createAlignmentScale(container) {
        if (!container) {
            console.log('No alignment scales container found.');
            return;
        }

        const scale = document.createElement('div');
        scale.classList.add('alignment-scale');

        const draggable = document.createElement('div');
        draggable.classList.add('draggable');
        scale.appendChild(draggable);

        const point1 = document.createElement('div');
        point1.classList.add('scale-point');
        point1.style.left = '0';
        scale.appendChild(point1);

        const point2 = document.createElement('div');
        point2.classList.add('scale-point');
        point2.style.left = '50%';
        point2.style.transform = 'translateX(-50%)';
        scale.appendChild(point2);

        const point3 = document.createElement('div');
        point3.classList.add('scale-point');
        point3.style.left = '100%';
        point3.style.transform = 'translateX(-100%)';
        scale.appendChild(point3);

        container.appendChild(scale);

        makeDraggable(draggable, scale);

        // Move the scale down the page
        const margin = 20; // Adjust this value as needed
        const scaleIndex = container.querySelectorAll('.alignment-scale').length - 1;
        scale.style.marginTop = `${scaleIndex * margin}px`;
    }

    const nextButton = document.querySelector('.button-sticky[onclick="navigateToAlignment()"]');
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            createAlignmentScales();
            navigateToAlignment();
        });
    }

    function makeDraggable(draggable, scale) {
        const points = scale.querySelectorAll('.scale-point');

        function snapToClosestPoint() {
            const rect = scale.getBoundingClientRect();
            const draggableRect = draggable.getBoundingClientRect();
            const draggableCenter = draggableRect.left + draggableRect.width / 2;
            const scaleWidth = rect.width;

            let closestPoint = points[0];
            let minDistance = Math.abs(draggableCenter - (rect.left + closestPoint.offsetLeft + closestPoint.offsetWidth / 2));

            points.forEach(point => {
                const pointCenter = rect.left + point.offsetLeft + point.offsetWidth / 2;
                const distance = Math.abs(draggableCenter - pointCenter);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestPoint = point;
                }
            });

            // Adjusting the left position based on the scale's width
            const leftPos = closestPoint.offsetLeft + (closestPoint.offsetWidth - draggable.offsetWidth) / 2;
            const maxLeft = scaleWidth - draggable.offsetWidth; // Maximum left position
            draggable.style.left = Math.max(0, Math.min(leftPos, maxLeft)) + 'px';
        }

        draggable.addEventListener('mousedown', function(e) {
            e.preventDefault();
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });

        function onMouseMove(e) {
            let rect = scale.getBoundingClientRect();
            let offsetX = e.clientX - rect.left - draggable.offsetWidth / 2;
            offsetX = Math.max(0, Math.min(offsetX, rect.width - draggable.offsetWidth));
            draggable.style.left = offsetX + 'px';
        }

        function onMouseUp() {
            document.removeEventListener('mousemove', onMouseMove);
            snapToClosestPoint();
        }
    }

    

    // Create alignment scales based on saved state
    const container = document.getElementById('alignment-scales-container');
    if (container) {
        createAlignmentScale(container);
    }
});