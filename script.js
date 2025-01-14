// Get stored results from localStorage
let results = JSON.parse(localStorage.getItem('results')) || [];

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

    const percentage = ((totalObtainedMarks / totalMaxMarks) * 100).toFixed(2);

    const result = {
        rollNo: document.getElementById('rollNo').value,
        name: document.getElementById('name').value,
        subjects: subjects,
        totalObtainedMarks,
        totalMaxMarks,
        percentage
    };

    // Add to results array and save to localStorage
    results.push(result);
    localStorage.setItem('results', JSON.stringify(results));
    
    alert('Result saved successfully!');
    this.reset();
    
    // Reset subjects to one empty entry
    document.getElementById('subjectsContainer').innerHTML = `
        <div class="subject-entry">
            <input type="text" class="subjectName" placeholder="Subject Name" required>
            <input type="number" class="obtainedMarks" placeholder="Obtained Marks" required>
            <input type="number" class="totalMarks" placeholder="Total Marks" required>
            <button type="button" class="removeSubject">Remove</button>
        </div>
    `;
});

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
        // Ensure at least one subject remains
        const subjectEntries = document.querySelectorAll('.subject-entry');
        if (subjectEntries.length > 1) {
            e.target.parentElement.remove();
        } else {
            alert('At least one subject is required!');
        }
    }
});

// Check result function
function checkResult() {
    const searchRoll = document.getElementById('searchRoll').value;
    const resultDisplay = document.getElementById('resultDisplay');
    
    const result = results.find(r => r.rollNo === searchRoll);
    
    if (result) {
        resultDisplay.style.display = 'block';
        let subjectsHTML = `
            <h3>Result for ${result.name} (Roll No: ${result.rollNo})</h3>
            <table class="result-table">
                <tr>
                    <th>Subject</th>
                    <th>Obtained Marks</th>
                    <th>Total Marks</th>
                    <th>Percentage</th>
                </tr>
        `;

        result.subjects.forEach(subject => {
            const subjectPercentage = ((subject.obtainedMarks / subject.totalMarks) * 100).toFixed(2);
            subjectsHTML += `
                <tr>
                    <td>${subject.subjectName}</td>
                    <td>${subject.obtainedMarks}</td>
                    <td>${subject.totalMarks}</td>
                    <td>${subjectPercentage}%</td>
                </tr>
            `;
        });

        subjectsHTML += `
            <tr class="total-row">
                <td><strong>Total</strong></td>
                <td><strong>${result.totalObtainedMarks}</strong></td>
                <td><strong>${result.totalMaxMarks}</strong></td>
                <td><strong>${result.percentage}%</strong></td>
            </tr>
        </table>`;

        resultDisplay.innerHTML = subjectsHTML;
    } else {
        resultDisplay.style.display = 'block';
        resultDisplay.innerHTML = '<p>No result found for this roll number.</p>';
    }
}