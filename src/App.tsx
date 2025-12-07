import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import HeaderUI from './components/HeaderUI';
import AlertUI from './components/AlertUI';
import SelectorUI from './components/SelectorUI';
import IndicatorUI from './components/IndicatorUI';
import TableUI from './components/TableUI';
import ChartUI from './components/ChartUI';
import useFetchData from './functions/useFetchData';
import './App.css';

function App() {
  // 1. Hook de datos: obtenemos data, loading y error
  const { data, loading, error } = useFetchData();

  // 2. Estado para el reloj local
  const [localTime, setLocalTime] = useState(new Date());

  // 3. Efecto para actualizar el reloj cada segundo
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date());
    }, 1000);

    return () => clearInterval(timer); // Limpieza al desmontar
  }, []);

  return (
    <Grid container spacing={5} justifyContent="center" alignItems="center">

      {/* --- SECCIÓN SUPERIOR FIJA --- */}
      
      {/* Encabezado */}
      <Grid size={{ xs: 12, md: 12 }}>
        <HeaderUI />
      </Grid>

      {/* Alertas */}
      <Grid size={{ xs: 12, md: 12 }} container justifyContent="right" alignItems="center">
        <AlertUI description="No se preveen lluvias" />
      </Grid>

      {/* Selector */}
      <Grid size={{ xs: 12, md: 3 }} >
        <SelectorUI />
      </Grid>

      {/* --- LÓGICA DE ESTADOS (Carga vs Error vs Datos) --- */}

      {/* CASO 1: CARGANDO */}
      {loading && (
        <Grid size={{ xs: 12, md: 9 }} container justifyContent="center">
          <Typography variant="h6">Cargando datos meteorológicos...</Typography>
        </Grid>
      )}

      {/* CASO 2: ERROR */}
      {error && (
        <Grid size={{ xs: 12, md: 9 }} container justifyContent="center">
          <Typography variant="h6" color="error">Error: {error}</Typography>
        </Grid>
      )}

      {/* CASO 3: ÉXITO (Tenemos datos y ya no carga) */}
      {data && !loading && (
        <>
          {/* Indicadores Principales */}
          <Grid container size={{ xs: 12, md: 9 }} spacing={2}>
            
            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Temperatura (2m)' 
                description={`${data.current.temperature_2m} ${data.current_units.temperature_2m}`} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Temperatura aparente' 
                description={`${data.current.apparent_temperature} ${data.current_units.apparent_temperature}`} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Velocidad del viento' 
                description={`${data.current.wind_speed_10m} ${data.current_units.wind_speed_10m}`} 
              />
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <IndicatorUI 
                title='Humedad relativa' 
                description={`${data.current.relative_humidity_2m} ${data.current_units.relative_humidity_2m}`} 
              />
            </Grid>
          </Grid>

          {/* Gráfico (Limitado a 24 horas con .slice) */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
            <ChartUI 
              labels={data.hourly.time.slice(0, 24)} 
              dataValues={data.hourly.temperature_2m.slice(0, 24)} 
            />
          </Grid>

          {/* Tabla (Limitada a 24 horas con .slice) */}
          <Grid size={{ xs: 12, md: 6 }} sx={{ display: { xs: "none", md: "block" } }}>
            <TableUI 
              times={data.hourly.time.slice(0, 24)} 
              temperatures={data.hourly.temperature_2m.slice(0, 24)} 
            />
          </Grid>

          {/* Pie de Página con Información Adicional */}
          <Grid size={{ xs: 12, md: 12 }} container justifyContent="center" sx={{ mt: 4, mb: 4, opacity: 0.7 }}>
             <Typography variant="caption" display="block" align="center">
                Hora de Visita Local: {localTime.toLocaleTimeString()} <br/>
                Última Actualización de Datos: {data.current.time.replace('T', ', ')} <br/>
                Fuente: Open-Meteo. (Latitud: {data.latitude}, Longitud: {data.longitude})
             </Typography>
          </Grid>
        </>
      )}
      
    </Grid >
  );
}

export default App;