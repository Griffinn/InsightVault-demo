export function navbarOptionsHighlight() {
    const navItems = document.querySelectorAll("#middle .flex-item1, #bottom .flex-item2");

    const currentPath = window.location.pathname.split("/").pop();  
    // example: "reports.html"

    navItems.forEach(item => {
        const link = item.querySelector("a");

        if (link) {
            const linkPath = link.getAttribute("href");
            
            if (linkPath === `./${currentPath}` || linkPath === currentPath) {
                item.classList.add("nav-active");
            }
        }

        // also add click highlight for SPA-like feel
        item.addEventListener("click", () => {
            navItems.forEach(i => i.classList.remove("nav-active"));
            item.classList.add("nav-active");
        });
    });
}


// dashboard.js (Final Corrected Version)

/**
 * Finds the necessary elements within a card and updates their content.
 * @param {string} cardId - The ID of the outer card element (e.g., 'total-balance').
 * @param {string} value - The main numerical value to display.
 * @param {{percentage: string, trend: string}} comparison - Object containing percentage and trend.
 */
function updateMetric(cardId, value, comparison) {
    const cardElement = document.getElementById(cardId);
    if (!cardElement) return;

    // Safely extract data
    // Use 0% and 'up' as default if comparison object is missing/incomplete
    const percentage = comparison?.percentage || '0%'; 
    const trend = comparison?.trend || 'up';

    // 1. Update the total value element (<p class="sum-total">)
    const valueElement = cardElement.querySelector('.sum-total');
    
    // 2. Update the comparison span element (<span class="green">)
    const outerBox = cardElement.closest('.finance-info-outerbox');
    const comparisonSpan = outerBox ? outerBox.querySelector('.monthly-compare-data .green') : null;

    // Determine the icon and color
    const iconClass = trend === 'up' ? 'fa-caret-up' : 'fa-caret-down';
    const colorClass = trend === 'up' ? 'green' : 'red';

    // Format and update the main value (ensure value is treated as a number)
    const formattedValue = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    }).format(Number(value));

    if (valueElement) {
        valueElement.textContent = formattedValue;
    }
    
    // Update the comparison span content and class
    if (comparisonSpan) {
        comparisonSpan.classList.remove('green', 'red'); 
        comparisonSpan.classList.add(colorClass); 
        comparisonSpan.innerHTML = `<i class="fa-solid ${iconClass}"></i> ${percentage}`;
    }
}


/**
 * Fetches dashboard summary data from the server and updates the UI.
 */
async function fetchDashboardSummary() {
    const apiEndpoint = '/api/dashboard/summary'; 

    try {
        const response = await fetch(apiEndpoint);
        
        if (!response.ok) {
             throw new Error(`Server error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // --- Map API data to updateMetric calls ---
        updateMetric('total-balance', data.totalBalance, data.totalBalanceComparison);
        updateMetric('monthy-income', data.monthlyIncome, data.monthlyIncomeComparison); 
        updateMetric('monthly-expense', data.monthlyExpense, data.monthlyExpenseComparison);
        updateMetric('monthly-savings', data.monthlySavings, data.monthlySavingsComparison);

    } catch (error) {
        console.error("Failed to fetch dashboard summary:", error);
        
        // --- Fallback to show clear error state ---
        const metricIds = ['total-balance', 'monthy-income', 'monthly-expense', 'monthly-savings'];
        
        metricIds.forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                 const valueElement = element.querySelector('.sum-total');
                 if (valueElement) valueElement.textContent = '$ N/A';
                 
                 const outerBox = element.closest('.finance-info-outerbox');
                 const comparisonSpan = outerBox ? outerBox.querySelector('.monthly-compare-data .green') : null;
                 if (comparisonSpan) {
                     comparisonSpan.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> Failed to Load';
                     comparisonSpan.classList.remove('green');
                     comparisonSpan.classList.add('red');
                 }
            }
        });
    }
}




//-------------------------------------------------------------------------REPORTS PART-------------------------------------------------------------------///

//1. This Month Button //


// // ----------------------------------------------------
// // DATE RANGE FUNCTION
// // ----------------------------------------------------
function getDateRange(option) {
    const today = new Date();
    let startDate, endDate;

    switch (option) {
        case "This Week": {
            const day = today.getDay(); // Sun=0, Mon=1...
            const diff = today.getDate() - day + (day === 0 ? -6 : 1);
            startDate = new Date(today.setDate(diff));
            endDate = new Date();
            break;
        }

        case "This Month": {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
            break;
        }

        case "This Quarter": {
            const quarter = Math.floor(today.getMonth() / 3);
            startDate = new Date(today.getFullYear(), quarter * 3, 1);

            const endMonth = (quarter * 3) + 2;
            endDate = new Date(today.getFullYear(), endMonth + 1, 0);
            break;
        }

        case "This Year": {
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
            break;
        }

        default:
            startDate = endDate = today;
    }


    return {
        startDate: formatDate(startDate),
        endDate: formatDate(endDate)
    };
}


// ----------------------------------------------------
//  FORMAT yyyy-mm-dd
// ----------------------------------------------------
function formatDate(date) {
    return date.toISOString().split("T")[0];
}


// ----------------------------------------------------
// FETCH DATA FROM BACKEND
// ----------------------------------------------------
async function fetchReportData(startDate, endDate) {
    try {
        const res = await fetch(
            `/api/reports/total-amounts?byCategory=active&startDate=${startDate}&endDate=${endDate}`
        );

        const data = await res.json();
        console.log("Cashflow API Data:", data);

        // ⭐ Call graph function right here
        renderCategoryPieChart(data);

        // ⭐ Always return array to prevent crashes
        return Array.isArray(data) ? data : [];

    } catch (err) {
        console.error("Error fetching report data:", err);
        return [];
    }
}



// ----------------------------------------------------
//Chart creating function
// ----------------------------------------------------
let changeOverTimeChartInstance = null;

let categoryChartInstance = null;



function renderCategoryPieChart(data) {
    const labels = data.map(item => item.category);
    const totals = data.map(item => item.total);

    const colors = [
        "#FF6B6B", "#FF8E72", "#FFB56B", "#FFD93D",
        "#6BCB77", "#4D96FF", "#845EC2", "#FF63A5",
        "#00C9A7", "#FF9F1C", "#F15BB5", "#00BFFF",
        "#FF6F61", "#8AC926", "#1982C4", "#6A4C93",
        "#FFBE0B", "#FF006E", "#06D6A0", "#8338EC"
    ];

    const ctx = document.getElementById("cashflowChart").getContext("2d");

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    categoryChartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Total Spending",
                    data: totals,
                    backgroundColor: colors,
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false // hide chart.js legend
                }
            },
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // ---------- CUSTOM LEGEND ----------
    // const legendBox = document.getElementById("categoryLegend");
    // legendBox.innerHTML = "";

    // const totalSum = totals.reduce((a, b) => a + b, 0);

    // labels.forEach((label, index) => {
    //     const percent = ((totals[index] / totalSum) * 100).toFixed(1);

    //     const item = document.createElement("div");
    //     item.classList.add("legend-item");

    //     const colorBox = document.createElement("span");
    //     colorBox.classList.add("legend-color");
    //     colorBox.style.backgroundColor = colors[index];

    //     const text = document.createElement("span");
    //     text.textContent = `${label} — ₹${totals[index]} (${percent}%)`;

    //     item.appendChild(colorBox);
    //     item.appendChild(text);

    //     legendBox.appendChild(item);
    // });
}



///-----------------------------////
///Setup the button - This month ///
///-----------------------------///



function setupDurationSelector(){

    const dropdownItems = document.querySelectorAll("#time-selector-dropdown .dropdown-item");
    const dropdownBtn = document.querySelector("#time-selector-btn");

    dropdownItems.forEach(item => {
        item.addEventListener("click", async () => {
            const selected = item.textContent.trim();

            // Update button text
            dropdownBtn.innerHTML = `${selected} <i class="fa-solid fa-calendar"></i>`;

            //Get date range
            const { startDate, endDate } = getDateRange(selected);

            console.log("Selected:", selected);
            console.log("Range:", startDate, endDate);

            // Fetch report data from backend
            const reportData = await fetchReportData(startDate, endDate);

            console.log("Report Data:", reportData);
        });
    });
        
    
}






document.addEventListener("DOMContentLoaded", async () => {
  setupDurationSelector();  
  navbarOptionsHighlight(); 
  fetchDashboardSummary();
  

  
  // Fetch default “This Year” data immediately
  const { startDate, endDate } = getDateRange("This Year");
  await fetchReportData(startDate, endDate);

}); 




