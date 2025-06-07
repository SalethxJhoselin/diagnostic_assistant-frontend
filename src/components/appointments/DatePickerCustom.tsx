import { useEffect, useMemo, useState } from "react"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import dayjs from "dayjs"

export default function DatePickerCustom({
  value,
  onChange,
}: {
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
      attributeFilter: ["class"]
    })

    return () => observer.disconnect()
  }, [])

  const theme = useMemo(() => createTheme({
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
    },
  }), [mode])

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Selecciona una fecha"
          value={value ? dayjs(value) : null}
          onChange={(newVal) => {
            if (newVal) onChange(newVal.format("YYYY-MM-DD"))
          }}
          format="DD/MM/YYYY"
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
          }}
        />
      </LocalizationProvider>
    </ThemeProvider>
  )
}
