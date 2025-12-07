import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { type SelectChangeEvent } from '@mui/material/Select';

interface SelectorUIProps {
    onCityChange: (index: number) => void;
    currentId: number; // <--- Nueva prop para controlar el valor
}

const cities = [
    { name: "Guayaquil", id: 0 },
    { name: "Quito", id: 1 },
    { name: "Manta", id: 2 },
    { name: "Cuenca", id: 3 },
];

export default function SelectorUI({ onCityChange, currentId }: SelectorUIProps) {

    const handleChange = (event: SelectChangeEvent<number>) => {
        onCityChange(Number(event.target.value));
    };

    return (
        <FormControl fullWidth>
            <InputLabel id="city-select-label">Ciudad</InputLabel>
            <Select
                labelId="city-select-label"
                id="city-select"
                value={currentId} // <--- Usamos currentId para el valor
                label="Ciudad"
                onChange={handleChange}
            >
                {cities.map((city) => (
                    <MenuItem key={city.id} value={city.id}>
                        {city.name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    );
}