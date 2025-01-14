function checkResult() {
    const searchRoll = document.getElementById('searchRoll').value;
    const resultDisplay = document.getElementById('resultDisplay');
    
    fetch('https://raw.githubusercontent.com/100rabh999/RESULT/master/results.json')
  .then(response => {

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(results => {
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
        })
        .catch(error => {
            console.error('Error:', error);
            resultDisplay.style.display = 'block';
            resultDisplay.innerHTML = '<p>Error loading results. Please try again later.</p>';
        });
}