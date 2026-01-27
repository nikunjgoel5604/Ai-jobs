document.addEventListener('DOMContentLoaded', () => {

    // Job Growth by Industry Chart
    fetchData('dashboard/job-growth-by-industry').then(data => {
        if (!data) return;
        const ctx = document.getElementById('industryGrowthChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.Industry),
                datasets: [{
                    label: 'Projected Job Growth',
                    data: data.map(d => d.Growth),
                    backgroundColor: chartColors.primaryAccent,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Job Growth by Industry', color: chartColors.textColor }
                },
                scales: {
                    x: { ticks: { color: chartColors.textColor } },
                    y: { ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // Automation Risk vs. Salary Chart
    fetchData('dashboard/automation-risk-vs-salary').then(data => {
        if (!data) return;
        const ctx = document.getElementById('riskVsSalaryChart').getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Jobs',
                    data: data.map(d => ({ x: d.risk, y: d.salary })),
                    backgroundColor: chartColors.secondaryHighlight,
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'Automation Risk vs. Salary', color: chartColors.textColor }
                },
                scales: {
                    x: { title: { display: true, text: 'Automation Risk (%)', color: chartColors.textColor }, ticks: { color: chartColors.textColor } },
                    y: { title: { display: true, text: 'Median Salary (USD)', color: chartColors.textColor }, ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // AI Adoption by Location Chart
    fetchData('dashboard/ai-adoption-by-location').then(data => {
        if (!data) return;
        const ctx = document.getElementById('adoptionByLocationChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.Location),
                datasets: [{
                    label: 'Average AI Adoption Level',
                    data: data.map(d => d.AvgAdoption),
                    backgroundColor: chartColors.tertiarySoft,
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: {
                    legend: { display: false },
                    title: { display: true, text: 'AI Adoption by Location', color: chartColors.textColor }
                },
                scales: {
                    x: { ticks: { color: chartColors.textColor } },
                    y: { ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // Automation Risk Trends (Line Chart)
    fetchData('dashboard/automation-risk-trends').then(data => {
        if (!data) return;
        const ctx = document.getElementById('automationTrendChart').getContext('2d');
        
        const colors = [
            chartColors.primaryAccent, 
            chartColors.secondaryHighlight, 
            chartColors.tertiarySoft, 
            '#6ab5ddff', // A new color
            '#efb564ff'  // Another new color
        ];

        const datasets = data.map((industryData, index) => ({
            label: industryData.Industry,
            data: [
                industryData.avg_2020, 
                industryData.avg_2021, 
                industryData.avg_2022, 
                industryData.avg_2023, 
                industryData.avg_2024
            ],
            borderColor: colors[index % colors.length],
            backgroundColor: colors[index % colors.length],
            fill: false,
            tension: 0.1
        }));

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['2020', '2021', '2022', '2023', '2024'],
                datasets: datasets
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { display: true, labels: { color: chartColors.textColor } },
                    title: { display: false } // Title is already in the HTML
                },
                scales: {
                    x: { ticks: { color: chartColors.textColor } },
                    y: { 
                        title: { display: true, text: 'Avg. Automation Risk (%)', color: chartColors.textColor },
                        ticks: { color: chartColors.textColor } 
                    }
                }
            }
        });
    });

    // ... (Your existing code for the other 4 charts remains here) ...
    // --- YOUR NEW CHART: Actual vs. Predicted Risk ---
    const actualVsPredictedCtx = document.getElementById('actualVsPredictedChart').getContext('2d');
    const actualVsPredictedChart = new Chart(actualVsPredictedCtx, {
        type: 'scatter',
        data: { datasets: [] }, // Start with empty data
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                x: { title: { display: true, text: 'Actual Risk (%)', color: chartColors.textColor }, ticks: { color: chartColors.textColor } },
                y: { title: { display: true, text: 'Predicted Risk (%)', color: chartColors.textColor }, ticks: { color: chartColors.textColor } }
            }
        }
    });
    fetchData('dashboard/actual-vs-predicted-risk').then(data => {
        if (!data) return;
        actualVsPredictedChart.data.datasets = [{
            label: 'Actual vs. Predicted',
            data: data.map(d => ({ x: d.actual_risk, y: d.predicted_risk })),
            backgroundColor: chartColors.primaryAccent,
        }];
        actualVsPredictedChart.update();
    });

    // --- NEW CHARTS (IDEAS A & B) ---

    // IDEA A.1: Productivity Change vs. Training Hours
    fetchData('dashboard/productivity-vs-training').then(data => {
        if (!data) return;
        const ctx = document.getElementById('productivityChart').getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Productivity vs. Training',
                    data: data.map(d => ({ x: d['Training Hours Provided'], y: d['Productivity Change (%)'] })),
                    backgroundColor: chartColors.primaryAccent,
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { title: { display: true, text: 'Training Hours', color: chartColors.textColor }, ticks: { color: chartColors.textColor } },
                    y: { title: { display: true, text: 'Productivity Change (%)', color: chartColors.textColor }, ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // IDEA A.2: New Roles Created by Industry
    fetchData('dashboard/new-roles-by-industry').then(data => {
        if (!data) return;
        const ctx = document.getElementById('newRolesChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.Industry),
                datasets: [{
                    label: 'Avg. New Roles Created',
                    data: data.map(d => d.AvgNewRoles),
                    backgroundColor: chartColors.tertiarySoft,
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: chartColors.textColor } },
                    y: { ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // IDEA A.3: Most Adopted GenAI Tools
    fetchData('dashboard/genai-tool-adoption').then(data => {
        if (!data) return;
        const ctx = document.getElementById('genAIToolsChart').getContext('2d');
        new Chart(ctx, {
            type: 'pie',
            data: {
                labels: data.map(d => d['GenAI Tool']),
                datasets: [{
                    data: data.map(d => d.count),
                    backgroundColor: [chartColors.primaryAccent, chartColors.secondaryHighlight, chartColors.tertiarySoft, '#39a2db', '#e8a03a'],
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: chartColors.textColor } } }
            }
        });
    });

    // IDEA B.1: Job Postings by Location
    fetchData('dashboard/postings-by-location').then(data => {
        if (!data) return;
        const ctx = document.getElementById('postingsLocationChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.map(d => d.company_location),
                datasets: [{
                    label: 'Job Postings',
                    data: data.map(d => d.count),
                    backgroundColor: chartColors.secondaryHighlight,
                }]
            },
            options: {
                responsive: true,
                indexAxis: 'y',
                plugins: { legend: { display: false } },
                scales: {
                    x: { ticks: { color: chartColors.textColor } },
                    y: { ticks: { color: chartColors.textColor } }
                }
            }
        });
    });

    // IDEA B.2: Experience Level Demand
    fetchData('dashboard/experience-level-demand').then(data => {
        if (!data) return;
        const ctx = document.getElementById('experienceLevelChart').getContext('2d');
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.map(d => d.level),
                datasets: [{
                    data: data.map(d => d.count),
                    backgroundColor: [chartColors.primaryAccent, chartColors.tertiarySoft, chartColors.secondaryHighlight, '#e8a03a'],
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { labels: { color: chartColors.textColor } } }
            }
        });
    });
});
