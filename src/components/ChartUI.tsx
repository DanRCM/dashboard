import { LineChart } from '@mui/x-charts/LineChart';
import Typography from '@mui/material/Typography';

// Definimos las props que espera el componente
interface ChartUIProps {
    labels: string[];      // Array de horas (string)
    dataValues: number[];  // Array de temperaturas (number)
}

export default function ChartUI({ labels, dataValues }: ChartUIProps) {
    
    // Convertimos las fechas completas a solo horas para que se vea limpio en el eje X
    // Ejemplo entrada: "2025-12-07T00:00" -> Salida: "00:00"
    const formattedLabels = labels.map(label => label.split('T')[1]);

    return (
        <>
            <Typography variant="h5" component="div" gutterBottom>
                Temperatura (2m) Horaria
            </Typography>
            <LineChart
                height={300}
                series={[
                    { 
                        data: dataValues, 
                        label: 'Temperatura 2m (°C)', 
                        color: '#2196f3' // Un azul bonito para el clima
                    },
                ]}
                xAxis={[{ 
                    scaleType: 'point', 
                    data: formattedLabels,
                    label: 'Hora'
                }]}
            />
        </>
    );
}