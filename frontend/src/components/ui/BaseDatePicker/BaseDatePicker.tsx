import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ruRU } from '@mui/x-date-pickers/locales';
import 'dayjs/locale/ru';

import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker';

export const BaseDatePicker = (props: DatePickerProps) => {
    return (
        <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="ru"
            localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
        >
            <DatePicker
                {...props}
                sx={{
                    '& .MuiPickersOutlinedInput-root': {
                        color: 'white',
                    },

                    '& .MuiIconButton-root': {
                        color: 'white',
                    },

                    '& .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff40',
                    },

                    '&&:hover:not(.Mui-focused) .MuiPickersOutlinedInput-notchedOutline': {
                        borderColor: '#ffffff4d',
                    },
                }}
                slotProps={{
                    textField: {
                        size: 'small',
                        fullWidth: true,
                    },
                    layout: {
                        sx: {
                            color: 'white',
                            border: '1px solid #4d4c52',
                            borderRadius: '2px',
                            backgroundColor: '#424147',

                            '& .MuiIconButton-root': {
                                color: 'white',
                            },

                            '& .MuiSvgIcon-root': {
                                color: 'white',
                            },

                            '& .MuiTypography-root': {
                                color: 'white',
                            },

                            '& .MuiPickersDay-root': {
                                color: 'white',
                            },

                            '& .MuiPickersDay-root:hover': {
                                backgroundColor: '#5a5a60',
                            },

                            '& .MuiPickersDay-root:not(.Mui-selected)': {
                                borderColor: 'white',
                            },
                        },
                    },
                }}
            />
        </LocalizationProvider>
    );
};
