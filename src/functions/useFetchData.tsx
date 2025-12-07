import { useEffect, useState } from 'react';
import { type OpenMeteoResponse } from '../types/DashboardTypes';

// Ahora la función recibe parámetros
export default function useFetchData(latitude: number, longitude: number) {

    const [data, setData] = useState<OpenMeteoResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reiniciamos loading al cambiar de ciudad para que se vea el efecto de carga
        setLoading(true); 

        async function fetchData() {
            try {
                // Inyectamos las variables en la URL
                const URL = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m&timezone=auto`;
                
                const response = await fetch(URL);
                const json = await response.json();
                
                // Pequeña validación por si Open-Meteo devuelve error
                if(json.error) throw new Error(json.reason);

                setData(json);
                setError(null);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
        
        // Agregamos latitude y longitude al array de dependencias.
        // Esto le dice a React: "Si cambian las coordenadas, vuelve a ejecutar esto".
    }, [latitude, longitude]);

    return { data, loading, error };
}