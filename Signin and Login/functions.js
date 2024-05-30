document.addEventListener("DOMContentLoaded", function() {
    // Get all input fields and labels
    const inputFields = document.querySelectorAll('input');
    const labels = document.querySelectorAll('label');

    // Add event listener to each input field
    inputFields.forEach(input => {
        // Find corresponding label for each input
        const label = Array.from(labels).find(lbl => lbl.htmlFor === input.id);
        
        if (label) {
            // Add focus event listener to input field
            input.addEventListener('focus', () => {
                // Hide the corresponding label when input field is focused
                label.style.display = 'none';
            });

            // Add blur event listener to input field
            input.addEventListener('blur', () => {
                // Show the corresponding label when input field loses focus
                if (input.value === '') {
                    label.style.display = 'block';
                }
            });
        }
    });

    // Add class to rows
    const rows = document.querySelectorAll('.row');
    rows.forEach((row, index) => {
        if (index % 2 === 0) {
            row.classList.add('padded-left');
        } else {
            row.classList.add('padded-right');
        }
    });

    // Handle navigation to alignment
    function navigateToAlignment() {
        window.location.href = "alignment.html";
    }

    // Create alignment scales
    const container = document.getElementById('alignment-scales-container');

    function createAlignmentScale() {
        if (!container) return;
    
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
    }

    function makeDraggable(draggable, scale) {
        const points = scale.querySelectorAll('.scale-point');

        function snapToClosestPoint() {
            const rect = scale.getBoundingClientRect();
            const draggableRect = draggable.getBoundingClientRect();
            const draggableCenter = draggableRect.left + draggableRect.width / 2;

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

            const leftPos = closestPoint.offsetLeft + (closestPoint.offsetWidth - draggable.offsetWidth) / 2;
            draggable.style.left = Math.max(0, Math.min(leftPos, scale.clientWidth - draggable.offsetWidth)) + 'px';
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

    // Attach toggleButton function to each button
    function toggleButton(button) {
        button.classList.toggle('active');
    }

    const buttons = document.querySelectorAll('.des-button, .dev-button, .oth-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            toggleButton(button);
        });
    });

    // Initial call to create alignment scales
    createAlignmentScale();
});