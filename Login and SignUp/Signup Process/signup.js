document.addEventListener("DOMContentLoaded", function() {
    // Existing code
    const inputFields = document.querySelectorAll('input');
    const labels = document.querySelectorAll('label');

    inputFields.forEach(input => {
        const label = Array.from(labels).find(lbl => lbl.htmlFor === input.id);
        
        if (label) {
            input.addEventListener('focus', () => {
                label.style.display = 'none';
            });

            input.addEventListener('blur', () => {
                if (input.value === '') {
                    label.style.display = 'block';
                }
            });
        }
    });

    window.checkPassword = function() { 
        const password1 = document.querySelector('#password1').value; 
        const password2 = document.querySelector('#password2').value; 
        const errorMessage = document.querySelector('#error-message');

        if (!password1) { 
            errorMessage.textContent = "Please enter Password"; 
            errorMessage.style.display = 'block';
            return false;
        }
                
        if (!password2) { 
            errorMessage.textContent = "Please enter confirm password"; 
            errorMessage.style.display = 'block';
            return false;
        }
                
        if (password1 != password2) { 
            errorMessage.textContent = "Passwords do not match: Please try again..."; 
            errorMessage.style.display = 'block';
            return false;
        } 

        errorMessage.style.display = 'none';
        return true;
    }

    // New password strength code
    const passwordInput = document.querySelector('#password1');
    const strengthLabel = document.querySelector('#strengthLabel');
    const powerContainer = document.querySelector('#powerContainer');
    const powerPoint = document.querySelector('#power-point');

    passwordInput.addEventListener('input', () => {
        let point = 0;
        const value = passwordInput.value;
        const widthPower = ["1%", "25%", "50%", "75%", "100%"];
        const colorPower = ["#D73F40", "#DC6551", "#F2B84F", "#BDE952", "#3ba62f"];

        if (value.length >= 6) {
            let arrayTest = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^0-9a-zA-Z]/];
            arrayTest.forEach((item) => {
                if (item.test(value)) {
                    point += 1;
                }
            });
        }

        powerPoint.style.width = widthPower[point];
        powerPoint.style.backgroundColor = colorPower[point];

        strengthLabel.style.display = 'block';
        powerContainer.style.display = 'block';
    });
});