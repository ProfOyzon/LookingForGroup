// Get all input fields and labels
const inputFields = document.querySelectorAll('input');
const labels = document.querySelectorAll('label');

// Add event listener to each input field
inputFields.forEach(input => {
    // Find corresponding label for each input
    const label = Array.from(labels).find(lbl => lbl.htmlFor === input.id);
    
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
});