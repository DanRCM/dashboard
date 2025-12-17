import { useState } from 'react';
import { CohereClient } from "cohere-ai";
import { 
    Box, 
    TextField, 
    Button, 
    Card, 
    CardContent, 
    Typography, 
    CircularProgress,
    Alert
} from '@mui/material';

// Interfaz para las props que recibimos de App.tsx
interface CohereAssistantProps {
    weatherData: any; // Recibimos toda la data del clima
    city: string;
}

// Inicializamos el cliente
const cohere = new CohereClient({
    token: "jhcEVIXRCrQvjQGMoxOOAkgPY00DZ7lsaSYMITVM", 
});

export default function CohereAssistant({ weatherData, city }: CohereAssistantProps) {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleAsk = async () => {
        if (!question.trim()) return;

        setLoading(true);
        setError(null);
        setAnswer("");

        try {
            // 1. Construimos el contexto para que la IA sepa de qué hablamos
            const context = `
                Actúa como un asistente meteorológico experto.
                Datos actuales del clima en ${city}:
                - Temperatura: ${weatherData.current.temperature_2m} ${weatherData.current_units.temperature_2m}
                - Viento: ${weatherData.current.wind_speed_10m} ${weatherData.current_units.wind_speed_10m}
                - Humedad: ${weatherData.current.relative_humidity_2m} ${weatherData.current_units.relative_humidity_2m}
                - Sensación Térmica: ${weatherData.current.apparent_temperature} ${weatherData.current_units.apparent_temperature}
                
                Responde a la siguiente pregunta del usuario basándote en estos datos de forma concisa:
                "${question}"
            `;

            // 2. Enviamos la petición a Cohere
            const response = await cohere.chat({
                message: context,
                model: 'command-a-03-2025', // Un modelo de Cohere
            });

            // 3. Mostramos la respuesta
            setAnswer(response.text);

        } catch (err: any) {
            console.error(err);
            // Manejo básico de errores y Rate Limits
            if (err.statusCode === 429) {
                setError("Has excedido el límite de consultas gratuitas de Cohere. Intenta en un minuto.");
            } else {
                setError("Hubo un error al conectar con el asistente. Intenta de nuevo.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Asistente IA - {city}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Pregúntame recomendaciones sobre el clima actual.
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <TextField 
                        fullWidth 
                        size="small" 
                        label="Ej: ¿Necesito paraguas hoy?" 
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        disabled={loading}
                    />
                    <Button 
                        variant="contained" 
                        onClick={handleAsk}
                        disabled={loading || !question}
                    >
                        {loading ? <CircularProgress size={24} /> : "Preguntar"}
                    </Button>
                </Box>

                {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}

                {answer && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                        <Typography variant="body1">
                            {answer}
                        </Typography>
                    </Box>
                )}
            </CardContent>
        </Card>
    );
}