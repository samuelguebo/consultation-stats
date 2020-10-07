var Stats = {
    displayChart: function (list) {
        list = this.percentile(list);
        var data = {
            datasets: [
                {
                    data: Object.values(list),
                    backgroundColor: [
                        "#FF6385",
                        "#36A2EB",
                        "#FFCD56",
                        "#F24900",
                        "#FFBC20",
                        "#007BFF",
                        "#55BA30",
                        "#FFA75B",
                        "#BC2FA0",
                        "#EE7600",
                        "#EE4000",
                        "#4EABFC",
                        "#DCC7AA",
                        "#E91E63",
                        "#F44336",
                        "#F18973",
                        "#2196F3",
                        "#3F51B5",
                        "#4CAF50",
                        "#FF9800",
                        "#FFC107",
                        "#9C27B0",
                        "#F44336",
                        "#FDFFF0",
                        "#FFF8F0",
                        "#FFF1F0",
                        "#FFF0F8",
                        "#E0FFEE",
                        "#E0FFE6",
                        "#FDFFF0",
                        "#F7E0FF",
                        "#F6FFE0",
                    ],
                },
            ],
            labels: Object.keys(list),
        };
        var chartContainer = document.querySelector("#resultChart");
        chartContainer.style.display = "block";
        var ctx = chartContainer.getContext("2d");
        ctx.textAligh = "left";
        if (typeof resultChart === "undefined") {
            resultChart = new Chart(ctx, {
                type: "doughnut",
                data: data,
                options: {
                    cutoutPercentage: 70,
                    tooltips: {
                        callbacks: {
                            label: function (tooltipItem, data) {
                                return (data["labels"][tooltipItem["index"]] +
                                    ": " +
                                    data["datasets"][0]["data"][tooltipItem["index"]] +
                                    "%");
                            },
                        },
                    },
                    legend: {
                        display: true,
                        position: "left",
                    },
                },
            });
        }
        else {
            resultChart.data.labels = Object.keys(list).slice(0, 32);
            resultChart.data.datasets[0].data = Object.values(list).slice(0, 32);
            resultChart.update();
        }
    },
    percentile: function (data) {
        return data.reduce(function (wiki, i) {
            if (typeof wiki[i] !== "undefined") {
                wiki[i] = Number((wiki[i] + (1 / data.length) * 100).toFixed(1));
            }
            else {
                wiki[i] = Number(((1 / data.length) * 100).toFixed(1));
            }
            return wiki;
        }, {});
    },
};
