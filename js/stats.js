const Stats = {
  /**
   * Create chart in UI
   * @param {Array of objects} list 
   */
  displayChart: function (list) {

    // Stats data
    list = this.percentile(list)
    //console.log(list)
    let data = {
      datasets: [{
        data: Object.values(list),
        backgroundColor: [
          "#FF6385", "#36A2EB", "#FFCD56", "#F24900", "#FFBC20", "#007BFF",
          "#55BA30", "#FFA75B", "#BC2FA0", "#EE7600", "#EE4000", "#4EABFC",
          "#DCC7AA", "#E91E63", "#F44336", "#F18973", "#2196F3", "#3F51B5",
          "#4CAF50", "#FF9800", "#FFC107", "#9C27B0", "#F44336", "#FDFFF0",
          "#FFF8F0", "#FFF1F0", "#FFF0F8", "#F0F6FF"
        ]
      }],

      labels: Object.keys(list),

    };
    // For a pie chart
    let chartContainer = document.querySelector("#resultChart")
    chartContainer.style.display = 'block'
    let ctx = chartContainer.getContext('2d')
    ctx.textAligh = 'left'

    if (typeof resultChart === "undefined") {
      resultChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: {
          cutoutPercentage: 70,
          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                return data['labels'][tooltipItem['index']] + ': ' + data['datasets'][0]['data'][tooltipItem['index']] + '%';
              }
            }
          },
          legend: {
            display: true,
            position: 'left',
          }
        }
      });

    }
    // update
    else {

      resultChart.data.labels = Object.keys(list).slice(0, 32)
      resultChart.data.datasets[0].data = Object.values(list).slice(0, 32)

      resultChart.update();
    }


  },

  /**
   * Get proportion of contributors
   * arranged by wikis
   * 
   * @param {Object} data 
   */

  percentile: function (data) {
    return data.reduce((wiki, i) => {
      if (typeof wiki[i] !== 'undefined') {
        wiki[i] = Number((wiki[i] + (1 / data.length) * 100).toFixed(1))
      } else {
        wiki[i] = Number(((1 / data.length) * 100).toFixed(1))
      }
      return wiki
    }, {})
  }
}