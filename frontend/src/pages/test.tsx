// 1. Import `createTheme`
import { createTheme } from "@nextui-org/react"
import { Switch, changeTheme, useTheme } from '@nextui-org/react'


const App = () => {
  const lightTheme = createTheme({
    type: 'light',
    theme: {
      colors: {},
    }
  })
  
  const darkTheme = createTheme({
    type: 'dark',
    theme: {
      colors: {},
    }
  })
  const { type, isDark } = useTheme();

  const handleChange = () => {
    const nextTheme = isDark ? lightTheme : darkTheme;
    window.localStorage.setItem('data-theme', nextTheme); // you can use any storage
    changeTheme(nextTheme);
  }

  return (
    <div>
      The current theme is: {type}
      <Switch
        checked={isDark}
        onChange={handleChange}
      />
    </div>
  )
}

export default App;
