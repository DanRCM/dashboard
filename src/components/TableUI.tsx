import Box from '@mui/material/Box';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';

// Definimos las props
interface TableUIProps {
    times: string[];
    temperatures: number[];
}

// Columnas configuradas para datos reales
const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
        field: 'date',
        headerName: 'Fecha',
        width: 150,
    },
    {
        field: 'time',
        headerName: 'Hora',
        width: 150,
    },
    {
        field: 'temperature',
        headerName: 'Temperatura (2m)',
        width: 180,
        valueGetter: (_, row) => `${row.temperature} °C`, // Formato con unidad
    },
];

export default function TableUI({ times, temperatures }: TableUIProps) {

    // Transformamos los arrays paralelos en un array de objetos para el DataGrid
    const rows = times.map((timeString, index) => {
        // timeString viene como "2025-12-07T00:00"
        const [date, time] = timeString.split('T');
        
        return {
            id: index,
            date: date,
            time: time,
            temperature: temperatures[index]
        };
    });

    return (
        <Box sx={{ width: '100%' }}>
             <h3 style={{textAlign: 'center'}}>Temperatura por Hora</h3>
            <DataGrid
                rows={rows}
                columns={columns}
                initialState={{
                    pagination: {
                        paginationModel: {
                            pageSize: 5,
                        },
                    },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
                autoHeight // Ajusta la altura automáticamente
            />
        </Box>
    );
}