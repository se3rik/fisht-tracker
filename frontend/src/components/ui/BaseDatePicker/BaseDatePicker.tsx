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
                    '& .MuiPickersOutlinedInput-root.Mui-disabled': {
                        backgroundColor: '#ffffff08',
                        borderRadius: '4px',
                        cursor: 'not-allowed',
                    },
                    '& .MuiPickersOutlinedInput-root.Mui-disabled .MuiPickersOutlinedInput-notchedOutline':
                        {
                            borderColor: 'transparent',
                        },
                    '& .MuiPickersOutlinedInput-root.Mui-disabled:hover .MuiPickersOutlinedInput-notchedOutline':
                        {
                            borderColor: 'transparent',
                        },
                    '& .MuiPickersOutlinedInput-root.Mui-disabled .MuiIconButton-root': {
                        color: '#ffffff20',
                    },
                }}
                slotProps={{
                    textField: {
                        size: 'small',
                        fullWidth: true,
                        InputProps: {
                            style: props.disabled
                                ? {
                                      WebkitTextFillColor: '#ffffffcf',
                                      color: '#ffffffcf',
                                      opacity: 1,
                                      fontSize: 14,
                                  }
                                : { fontSize: 14 },
                        },
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
