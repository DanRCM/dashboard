import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import CohereAssistant from './components/CohereAssistant'; 
import useFetchData from './functions/useFetchData';
import './App.css';

const citiesConfig = [
  { name: "Guayaquil", lat: -2.1962, lng: -79.8862 },
  { name: "Quito", lat: -0.1807, lng: -78.4678 },
  { name: "Manta", lat: -0.9621, lng: -80.7127 },
  { name: "Cuenca", lat: -2.9001, lng: -79.0059 },
];

function App() {
  const [selectedCityIndex, setSelectedCityIndex] = useState(0); 
  const { lat, lng } = citiesConfig[selectedCityIndex];
  const { data, loading, error } = useFetchData(lat, lng);
  const [localTime, setLocalTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setLocalTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCityChange = (index: number) => {
      setSelectedCityIndex(index);
  };

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      <Grid size={{ xs: 12, md: 12 }}>
        <HeaderUI />
      </Grid>

      <Grid size={{ xs: 12, md: 12 }} container justifyContent="right" alignItems="center">
        <AlertUI description="No se preveen lluvias"/>
      </Grid>

      <Grid size={{ xs: 12, md: 3 }} >
        <SelectorUI 
            onCityChange={handleCityChange} 
            currentId={selectedCityIndex} 
        />
      </Grid>

      {/* Lógica de UI (Loading / Error / Data) */}
      
      {loading && (
        <Grid size={{ xs: 12, md: 9 }} container justifyContent="center" alignItems="center" style={{minHeight: '200px'}}>
           <Typography>Cargando datos de {citiesConfig[selectedCityIndex].name}...</Typography>
        </Grid>
      )}

      {error && (
        <Grid size={{ xs: 12, md: 9 }} container justifyContent="center">
          <Typography color="error">Error: {error}</Typography>
        </Grid>
      )}

      {data && !loading && (
        <>
            <Grid container size={{ xs: 12, md: 9 }} spacing={2}>
              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI title='Temperatura (2m)' description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI title='Temperatura aparente' description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI title='Velocidad del viento' description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} />
              </Grid>
              <Grid size={{ xs: 12, md: 3 }}>
                <IndicatorUI title='Humedad relativa' description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} />
              </Grid>
            </Grid>

            {/* Fila de Gráficos y Tabla */}
            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <ChartUI labels={data.hourly.time.slice(0, 24)} dataValues={data.hourly.temperature_2m.slice(0, 24)} />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
              <TableUI times={data.hourly.time.slice(0, 24)} temperatures={data.hourly.temperature_2m.slice(0, 24)} />
            </Grid>

            {/* --- NUEVA SECCIÓN: ASISTENTE IA --- */}
            <Grid size={{ xs: 12, md: 12 }}>
                <CohereAssistant 
                    weatherData={data} 
                    city={citiesConfig[selectedCityIndex].name} 
                />
            </Grid>

            {/* Footer */}
            <Grid size={{ xs: 12, md: 12 }} container justifyContent="center" sx={{ mt: 4, mb: 4, opacity: 0.7 }}>
                <Typography variant="caption" display="block" align="center">
                    Hora Local: {localTime.toLocaleTimeString()} <br/>
                    Ciudad: {citiesConfig[selectedCityIndex].name} (Lat: {data.latitude}, Long: {data.longitude})
                </Typography>
            </Grid>
        </>
      )}
    </Grid >
  );
}

export default App;