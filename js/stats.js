const Stats  = {
  
  displayChart: function (list) {
    
    // Stats data
    list = this.percentile(list)
    console.log(list)
    let data = {
      datasets: [{
        data: Object.values(list),
        backgroundColor:[
          "rgb(255, 99, 132)",
          "rgb(54, 162, 235)",
          "rgb(255, 205, 86)",
          "#F24900","#FFBC20","#007bff","#55BA30","#FFA75B",
          "#BC2FA0","#EE7600","#EE4000","#4EABFC","#DCC7AA",
          "#E91E63","#F44336","#f18973","#2196F3","#3F51B5",
          "#4CAF50","#FF9800","#FFC107","#9C27B0","#F44336"
          ]
      }],

      labels: Object.keys(list),

    };
    // For a pie chart
    let chartContainer = document.querySelector("#resultChart")
    let ctx = chartContainer.getContext('2d')

    if(typeof resultChart === "undefined"){
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
    else{
      resultChart.data.labels = Object.keys(list)
      resultChart.data.datasets[0].data = Object.values(list)
      
      resultChart.update();
    }
    
    
  },

  /**
   * Get proportion of contributors
   * arranged by wikis
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

