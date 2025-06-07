import { useEffect, useState } from "react"
import { ThemeProvider, createTheme } from "@mui/material/styles"

export default function MuiThemeWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [mode, setMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setMode(isDark ? "dark" : "light")
  }, [])

  const theme = createTheme({
    palette: {
      mode,
    },
  })

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
