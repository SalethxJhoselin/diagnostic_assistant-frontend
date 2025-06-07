import { TimePicker } from "@mui/x-date-pickers/TimePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import dayjs from "dayjs"
import { useEffect, useState } from "react"

export default function TimePickerCustom({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (val: string) => void
}) {
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setMode(isDark ? "dark" : "light")
    
      const observer = new MutationObserver(() => {
      const isDarkNow = document.documentElement.classList.contains("dark")
      setMode(isDarkNow ? "dark" : "light")
    })
    
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    })
    
    return () => observer.disconnect()
  }, [])

  const theme = createTheme({
    palette: {
      mode,
      background: {
        paper: mode === 'dark' ? '#24262D' : '#ffffff',
        default: mode === 'dark' ? '#24262D' : '#ffffff',
      },
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: mode === 'dark' ? '#4b5563' : '#d1d5db',
              },
              '&:hover fieldset': {
                borderColor: mode === 'dark' ? '#6b7280' : '#9ca3af',
              },
            },
          },
        },
      },
      MuiPopover: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'dark' ? '#24262D' : '#ffffff',
          },
        },
      },
    },
  })

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <TimePicker
          label={label}
          ampm={false}
          value={value ? dayjs(`2000-01-01T${value}`) : null}
          onChange={(newVal) => {
            if (newVal) onChange(newVal.format("HH:mm"))
          }}
          views={["hours", "minutes"]}
          desktopModeMediaQuery="@media (max-width: 99999px)"
          slotProps={{
            textField: {
              variant: "outlined",
              size: "small",
              fullWidth: true,
              InputProps: {
                sx: {
                  height: "2.5rem",
                  borderRadius: "0.375rem",
                  color: mode === 'dark' ? '#f9fafb' : '#111827',
                  backgroundColor: mode === 'dark' ? '#24262D' : '#ffffff',
                },
              },
              sx: {
                '& .MuiInputLabel-root': {
                  color: mode === 'dark' ? '#9ca3af' : '#6b7280',
                },
                '& .MuiSvgIcon-root': {
                  color: mode === 'dark' ? '#f9fafb' : '#4b5563',
                },
              },
            },
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  backgroundColor: mode === 'dark' ? '#24262D' : '#ffffff',
                  color: mode === 'dark' ? '#f9fafb' : '#111827',
                },
                '& .MuiClock-squareMask': {
                  backgroundColor: mode === 'dark' ? '#374151' : '#f3f4f6',
                },
                '& .MuiClockNumber-root': {
                  color: mode === 'dark' ? '#f9fafb' : '#111827',
                },
                '& .MuiClockPointer-root': {
                  backgroundColor: mode === 'dark' ? '#f9fafb' : '#111827',
                  '&::after': {
                    backgroundColor: mode === 'dark' ? '#f9fafb' : '#111827',
                  },
                },
                '& .MuiClock-pin': {
                  backgroundColor: mode === 'dark' ? '#f9fafb' : '#111827',
                },
              },
            },
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  )
}