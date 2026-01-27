document.addEventListener('DOMContentLoaded', () => {
    let allJobTitles = [];

    // Fetch all job titles once when the page loads
    fetchData('jobs/titles').then(data => { if (data) allJobTitles = data; });

    // --- REUSABLE AUTOCOMPLETE FUNCTION ---
    const setupAutocomplete = (inputEl, resultsEl, data) => {
        inputEl.addEventListener('input', () => {
            const value = inputEl.value.toLowerCase();
            resultsEl.innerHTML = '';
            if (!value) return;

            const suggestions = data.filter(item => item.toLowerCase().includes(value)).slice(0, 5);
            
            suggestions.forEach(item => {
                const div = document.createElement('div');
                div.innerHTML = item.replace(new RegExp(value, 'gi'), `<strong>$&</strong>`);
                div.addEventListener('click', () => {
                    inputEl.value = item;
                    resultsEl.innerHTML = '';
                });
                resultsEl.appendChild(div);
            });
        });
    };

    // --- APPLY AUTOCOMPLETE TO ALL RELEVANT INPUTS ---
    // Personalized Analysis Autocomplete
    const jobTitleInput = document.getElementById('job-title-input');
    const autocompleteResults = document.getElementById('autocomplete-results');
    setupAutocomplete(jobTitleInput, autocompleteResults, allJobTitles);

    // Hide autocomplete results if user clicks elsewhere
    document.addEventListener('click', (e) => {
        if (!e.target.matches('.autocomplete-container input')) {
            document.querySelectorAll('.autocomplete-items').forEach(el => el.innerHTML = '');
        }
    });

    // --- EXISTING PAGE FUNCTIONALITY ---

    // "Future-Proof" Career Identifier
    fetchData('insights/future-proof-careers').then(data => {
        const container = document.getElementById('future-proof-careers');
        if (data && data.length > 0) {
            container.innerHTML = data.map(job => {
                const risk = Number(job.Automation_Risk);
                return `<p>${job.Job_Title} (Automation Risk: ${risk.toFixed(2)}%)</p>`
            }).join('');
        } else {
            container.innerHTML = '<p>Could not retrieve future-proof careers data.</p>';
        }
    });
// Top 5 Skills List with Filter (UPDATED)
    const loadTopSkills = (industry = '') => {
        fetchData(`recommendations/skills?industry=${industry}`).then(data => {
            const container = document.getElementById('top-skills');
            if (data && data.top_skills.length > 0) {
                // UPDATED: Removed the "Find Jobs" link
                container.innerHTML = data.top_skills.map(item => `
                    <div class="skill-item">
                        <span>${item.skill} (Found in ${item.count} listings)</span>
                    </div>
                `).join('');
            } else {
                container.innerHTML = "<p>No skills found for this industry.</p>";
            }
        });
    };
    loadTopSkills();
    document.getElementById('industry-filter').addEventListener('change', e => {
        loadTopSkills(e.target.value);
    });

// Personalized Skill Gap Analysis
    document.getElementById('analyze-skills-btn').addEventListener('click', async () => {
        const userSkills = document.getElementById('user-skills').value.split(',').map(s => s.trim());
        const jobTitle = jobTitleInput.value.trim();

        if (userSkills.length > 0 && jobTitle) {
            const resultsContainer = document.getElementById('analysis-results');
            resultsContainer.innerHTML = '<p>Analyzing...</p>';
            
            // The case-insensitivity fix is in backend/career.js
            const skillGapData = await fetchData('career/skill-gap', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userSkills, jobTitle })
            });
            
            // The case-insensitivity fix is in backend/career.js
            const careerPathData = await fetchData(`career/career-path?jobTitle=${encodeURIComponent(jobTitle)}`);

            let html = '<h3>Analysis Results</h3>';
            if (skillGapData && skillGapData.required) {
                html += `<h4>Skill Gap for ${jobTitle}</h4>`;
                if (skillGapData.gaps.length > 0) {
                    html += `<p><strong>Missing Skills:</strong> ${skillGapData.gaps.join(', ')}</p>`;
                    html += `<p><strong>Suggested Skills to Learn:</strong> ${skillGapData.suggestions.join(', ')}</p>`;
                } else {
                    html += `<p>You have all the required skills for this role!</p>`;
                }
            } else {
                html += `<p>Could not analyze skill gap for "${jobTitle}". Please check the job title.</p>`;
            }

            if (careerPathData && careerPathData.length > 0) {
                html += '<h4>Potential Career Paths</h4>';
                html += careerPathData.map(job => `<p>${job.job_title}</p>`).join('');
            }
            resultsContainer.innerHTML = html;
        }
    });
});