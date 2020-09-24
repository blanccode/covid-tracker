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

function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  // const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 }); 
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([])

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
          <InfoBox title="Covid Cases Today" cases={countryInfo.todayCases} total={countryInfo.cases} />
          <InfoBox title="Recovered" cases={countryInfo.todayRecovered} total={countryInfo.recovered} />
          <InfoBox title="Deaths" cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>
      </div>
      <Map
          countries={mapCountries}
          // casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
      />
      <Card className="app__right">
        <CardContent className="cart-table">
          <h3>Live Cases by Country</h3>
          <Table countries= {tableData}/>
          <h3>Worldwide new Cases</h3>
          <LineGraph />
        </CardContent>
      </Card>
    </div>
  );
};

export default App;
