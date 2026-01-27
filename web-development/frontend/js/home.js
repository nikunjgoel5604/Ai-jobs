document.addEventListener('DOMContentLoaded', () => {

    // 1. Jobs at Risk (List)
    fetchData('automation/risk').then(data => {
        if (!data) return;
        const listContainer = document.getElementById('automation-risk');
        listContainer.innerHTML = data.slice(0, 10).map(j => `<p>${j.job_title} - ${j.risk_percent.toFixed(2)}%</p>`).join('');    });

    // 2. Job Growth Projection Chart
    fetchData('automation/growth').then(data => { 
        if (!data) return;
        
        data.sort((a, b) => (b.openings_2030 - b.openings_2024) - (a.openings_2030 - a.openings_2024));
        const jobData = data.slice(0, 10);

        const ctxGrowth = document.getElementById('growthChart').getContext('2d');
        new Chart(ctxGrowth, {
            type: 'bar',
            data: {
                labels: jobData.map(j => j.job_title),
                datasets: [{
                    label: '2024 Openings',
                    data: jobData.map(j => j.openings_2024),
                    backgroundColor: chartColors.primaryAccent
                }, {
                    label: '2030 Projections',
                    data: jobData.map(j => j.openings_2030),
                    backgroundColor: chartColors.secondaryHighlight
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: chartColors.textColor } },
                    title: { display: true, text: 'Top 10 Jobs by Growth', color: chartColors.primaryAccent, font: { size: 18 } }
                },
                scales: {
                    x: { grid: { color: chartColors.gridLines }, ticks: { color: chartColors.textColor } },
                    y: { grid: { color: chartColors.gridLines }, ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // 3. AI Adoption Sentiment (Doughnut Chart)
    fetchData('adoption/sentiment').then(data => {
        if (!data) return;
        const ctx = document.getElementById('sentimentChart').getContext('2d');
        const labels = Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1));
        const counts = Object.values(data);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Sentiment Distribution',
                    data: counts,
                    backgroundColor: [chartColors.primaryAccent, chartColors.secondaryHighlight, chartColors.tertiarySoft],
                    borderColor: chartColors.backgroundColor,
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: chartColors.textColor } },
                    title: { display: true, text: 'AI Adoption Sentiment', color: chartColors.primaryAccent, font: { size: 18 } }
                }
            }
        });
        sentimentChart.update();
    });

    // 4. Trending Skills Chart (Horizontal Bar Chart)
    fetchData('skills/trending').then(data => {
        if (!data) return;
        const ctx = document.getElementById('skillsChart').getContext('2d');
        const labels = data.map(item => item.skill);
        const counts = data.map(item => item.count);

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Skill Demand',
                    data: counts,
                    backgroundColor: chartColors.primaryAccent
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Top 10 Trending Skills', color: chartColors.primaryAccent, font: { size: 18 } }
                },
                scales: {
                    x: { beginAtZero: true, grid: { color: chartColors.gridLines }, ticks: { color: chartColors.textColor } },
                    y: { grid: { color: chartColors.gridLines }, ticks: { color: chartColors.textColor } }
                }
            }
        });
    });
    
    // Explore Your Career button functionality
    const exploreBtnFunction = document.querySelector('.cta-button');
    const targetSectionFunction = document.querySelector('.hero-section + .info-blocks');

    if (exploreBtnFunction && targetSectionFunction) {
        exploreBtnFunction.addEventListener('click', (e) => {
            e.preventDefault();
            targetSectionFunction.scrollIntoView({ behavior: 'smooth' });
        });
    }
});