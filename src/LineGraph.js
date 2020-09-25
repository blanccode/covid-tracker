
import React, { useEffect, useState} from 'react';
import { Line } from "react-chartjs-2";
import numeral from "numeral";

const options = {
    legend: {
        display: false,
    },
    elements: {
        point: {
            radius: 0,
        },
    },
    maintainAspectRatio: false,
    tooltips: {
        mode: "index",
        intersect: false,
        callbacks: {
            label: function (tooltipItem, data) {
                return numeral(tooltipItem.value).format("+0,0");
            },
        },
    },
    scales: {
        xAxes: [{
            type: "time",
            time: {
                format: "MM/DD/YY",
                tooltipFormat: "ll",
            },
        }, ],
        yAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
                // Include a dollar sign in the ticks
                callback: function (value, index, values) {
                    return numeral(value).format("0a");
                },
            },
        }, ],
    },
};


const parseChartData = (data, casesType) => {
    let parsedData = [];
    let lastDataPoint;
    for (let date in data.cases) {

        if (lastDataPoint) {

            let newDataPoint = {
                x: date,
                y: data[casesType][date] - lastDataPoint,
            }
            parsedData.push(newDataPoint)


        }       

        lastDataPoint = data[casesType][date];

    }
    return parsedData
}


function LineGraph({casesType}) {
    const [data, setData] = useState({})

        useEffect(() => {
            async function fetchData() {
            const response = await fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=120")
            const data = await response.json()

            let chartData = parseChartData(data,casesType)
                setData(chartData)
            }
            fetchData()
        }, [casesType])


    return (
      <div>
        {data?.length > 0 && (
          <Line 
            data={ 
                    { 
                datasets: [
                    {
                    backgroundColor: casesType === "recovered" ? "rgb(125, 215, 29, .65)" : "rgba(204, 16, 52, 0.5)",
                    borderColor: casesType === "recovered" ? "#7dd71d" : "#CC1034",
                    data: data,
                    },
                ],
                }
            } 
            options={options}
          />
        )}
      </div>
    );
}

export default LineGraph;
