import React, { useState, useEffect} from 'react';
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import Map from "./Map";
import "./App.css";
import Table from "./Table"
import {sortData} from "./util"
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";
import {prettifyStats} from "./util"
import numeral from "numeral";




function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); 
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");


useEffect( () => {
  async function fetchData() {
  const response = await fetch("https://disease.sh/v3/covid-19/all");
  const data = await response.json();
  setCountryInfo(data);
  }
  fetchData()
}, []);

  useEffect(() =>  {
    const getCountriesData = async () => {
      const response = await fetch("https://disease.sh/v3/covid-19/countries");
      const data = await response.json();
      const countries = data.map((country) => ({
        name: country.country,
        value: country.countryInfo.iso2,
      }));
      const sortedData = sortData(data);
      setTableData(sortedData);
      setCountries(countries);
      setMapCountries(data)
    }
    getCountriesData()
  }, []);

  const onCountryChange = async (e) => {
    const countryValue = e.target.value;

    const url =
      countryValue === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryValue}`;
        const response = await fetch(url)
        const data = await response.json()
        setCountry(countryValue);
        setCountryInfo(data)

        setMapCenter(data.countryInfo?.lat ? [data.countryInfo.lat, data.countryInfo.long] : { lat: 34.80746, lng: -40.4796 })
        setMapZoom(4,7);

  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            casesRed
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            active={casesType === "cases"}
            cases={prettifyStats(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            green
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettifyStats(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            deathRed
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            active={casesType === "deaths"}
            cases={prettifyStats(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <div className="table-container">
              <h3>Live Cases by Country</h3>
              <Table countries={tableData} />
            </div>
            <div className="chart-container">
              <h3>Worldwide new {casesType}</h3>
              <LineGraph casesType={casesType} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
