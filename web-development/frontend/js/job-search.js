document.addEventListener('DOMContentLoaded', () => {
    const listingsContainer = document.getElementById('job-listings');
    const searchInput = document.getElementById('search-input');
    const searchForm = document.getElementById('search-form');

    const searchJobs = (skill) => {
        if (!skill || skill.trim() === '') {
            listingsContainer.innerHTML = '<p>Please enter a job title or skill to start your search.</p>';
            return;
        }

        listingsContainer.innerHTML = '<p>Searching...</p>';

        fetchData(`jobs/search?skill=${encodeURIComponent(skill)}`)
            .then(data => {
                if (data && data.error) {
                    console.error('Backend Error:', data.error);
                    listingsContainer.innerHTML = `<p style="color: #e94560;">An error occurred on the server. Please try again later.</p>`;
                    return;
                }

                if (data && data.length > 0) {
                    listingsContainer.innerHTML = data.map(job => {
                        
                        // --- THIS BLOCK IS THE FIX ---
                        // It now correctly checks if skills exist before trying to display them.
                        let skillsHtml = '<span class="skill-tag">No skills listed</span>'; // Default message
                        if (job.required_skills && job.required_skills.trim() !== '') {
                            skillsHtml = job.required_skills.split(',')
                                .map(s => `<span class="skill-tag">${s.trim()}</span>`)
                                .join('');
                        }

                        return `
                            <div class="job-listing">
                                <h4>${job.job_title}</h4>
                                <p><strong>Company:</strong> ${job.company_name || 'N/A'}</p>
                                <p><strong>Location:</strong> ${job.company_location || 'N/A'}</p>
                                <p><strong>Salary:</strong> $${parseInt(job.salary_usd).toLocaleString()} USD</p>
                                <p><strong>Type:</strong> ${job.employment_type === 'FL' ? 'Freelance' : 'Full-time'}</p>
                                <div class="skills-container">
                                    ${skillsHtml}
                                </div>
                            </div>`;
                    }).join('');
                } else {
                    listingsContainer.innerHTML = `<p>No jobs found matching "${skill}".</p>`;
                }
            })
            .catch(error => {
                console.error('Fetch Error:', error);
                listingsContainer.innerHTML = '<p style="color: #e94560;">Could not connect to the server. Please ensure the backend is running and accessible.</p>';
            });
    };

    if (searchForm) {
        searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            const url = new URL(window.location);
            url.searchParams.set('skill', query);
            window.history.pushState({}, '', url);

            searchJobs(query);
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const skillFromUrl = urlParams.get('skill');

    if (skillFromUrl) {
        searchInput.value = skillFromUrl; 
        searchJobs(skillFromUrl);       
    } else {
        listingsContainer.innerHTML = '<p>Please enter a job title or skill to start your search.</p>';
    }
});