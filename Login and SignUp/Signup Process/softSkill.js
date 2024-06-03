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

