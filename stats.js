document.addEventListener('DOMContentLoaded', () => {

    // Stats data
    let data = {
        datasets: [{
            data: [10, 20, 20],
            backgroundColor:["rgb(255, 99, 132)","rgb(54, 162, 235)","rgb(255, 205, 86)"]
        }],

        // These labels appear in the legend and in the tooltips when hovering different arcs
        labels: [
            'Red',
            'Yellow',
            'Blue'
        ],
          
    };
    // For a pie chart
    let chartContainer = document.querySelector("#resultChart")
    let ctx = chartContainer.getContext('2d')
    chartContainer.setAttribute("width", 600)
    chartContainer.setAttribute("height", 400)
    let resultChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          cutoutPercentage: 70,
          tooltips: {
            callbacks: {
              label: function(tooltipItem, data) {
                return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
              }
            }
          }
        }
    });
})