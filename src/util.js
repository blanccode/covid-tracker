import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    multiplier: 600,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 1000,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 1800,
  },
};

export const sortData = (data) => {
    const sortedData = [...data]
    return sortedData.sort((a,b) => a.cases>b.cases ? -1: 1)
};

export const showMapData = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      color={casesTypeColors[casesType].hex}
      fillColor={casesTypeColors[casesType].hex}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
      >
        <Popup>
          <div className="info-container">
            <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }}></div>
            <div className="info-name">{country.country}</div>
            <div className="info info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
            <div className="info info-recovery">Recovered: {numeral(country.recovered).format("0,0")}</div>
            <div className="info info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
          </div>
        </Popup>
    </Circle>
  ));
