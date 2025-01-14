 // Add subject row
document.getElementById('addSubject').addEventListener('click', function() {
    const subjectHTML = `
        <div class="subject-entry">
            <input type="text" class="subjectName" placeholder="Subject Name" required>
            <input type="number" class="obtainedMarks" placeholder="Obtained Marks" required>
            <input type="number" class="totalMarks" placeholder="Total Marks" required>
            <button type="button" class="removeSubject">Remove</button>
        </div>
    `;
    document.getElementById('subjectsContainer').insertAdjacentHTML('beforeend', subjectHTML);
});

// Remove subject row
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('removeSubject')) {
        if (document.querySelectorAll('.subject-entry').length > 1) {
            e.target.parentElement.remove();
        } else {
            alert('At least one subject is required!');
        }
    }
});

// Form submission
document.getElementById('resultForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const subjectEntries = document.querySelectorAll('.subject-entry');
    const subjects = [];
    let totalObtainedMarks = 0;
    let totalMaxMarks = 0;

    subjectEntries.forEach(entry => {
        const subjectName = entry.querySelector('.subjectName').value;
        const obtainedMarks = parseInt(entry.querySelector('.obtainedMarks').value);
        const totalMarks = parseInt(entry.querySelector('.totalMarks').value);
        
        subjects.push({
            subjectName,
            obtainedMarks,
            totalMarks
        });

        totalObtainedMarks += obtainedMarks;
        totalMaxMarks += totalMarks;
    });

    const result = {
        rollNo: document.getElementById('rollNo').value,
        name: document.getElementById('name').value,
        subjects: subjects,
        totalObtainedMarks,
        totalMaxMarks,
        percentage: ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2)
    };

    // Save to results.json using downloadable file
    let results = [];
    try {
        const existingResults = localStorage.getItem('results');
        if (existingResults) {
            results = JSON.parse(existingResults);
        }
    } catch (e) {
        console.error('Error loading existing results');
    }

    results.push(result);
    localStorage.setItem('results', JSON.stringify(results));

    // Create downloadable JSON file
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.download = 'results.json';
    link.href = url;
    link.click();

    alert('Result saved successfully!');
    this.reset();
    displayAllResults();
});

// Display all results
function displayAllResults() {
    const resultsDiv = document.getElementById('allResults');
    let results = [];
    try {
        const existingResults = localStorage.getItem('results');
        if (existingResults) {
            results = JSON.parse(existingResults);
        }
    } catch (e) {
        console.error('Error loading results');
    }

    if (results.length === 0) {
        resultsDiv.innerHTML = '<p>No results found</p>';
        return;
    }

    let html = '<table class="result-table"><tr><th>Roll No</th><th>Name</th><th>Total Marks</th><th>Percentage</th></tr>';
    results.forEach(result => {
        html += `
            <tr>
                <td>${result.rollNo}</td>
                <td>${result.name}</td>
                <td>${result.totalObtainedMarks}/${result.totalMaxMarks}</td>
                <td>${result.percentage}%</td>
            </tr>
        `;
    });
    html += '</table>';
    resultsDiv.innerHTML = html;
}

// Initial load of results
displayAllResults();