import { extendTheme, type ThemeConfig } from "@chakra-ui/react";
import type { StyleFunctionProps } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools"

export const blue = {
  50: '#F0F7FF',
  100: '#C2E0FF',
  200: '#99CCF3',
  300: '#66B2FF',
  400: '#3399FF',
  main: '#007FFF',
  500: '#007FFF',
  600: '#0072E5', // vs blueDark 900: WCAG 4.6 AAA (large), APCA 36 Not for reading text
  700: '#0059B2',
  800: '#004C99',
  900: '#003A75',
};

export const blueDark = {
  50: '#E2EDF8',
  100: '#CEE0F3',
  200: '#91B9E3',
  300: '#5090D3',
  main: '#5090D3',
  400: '#265D97',
  500: '#1E4976',
  600: '#173A5E',
  700: '#132F4C', // contrast 13.64:1
  800: '#001E3C',
  900: '#0A1929',
};

const grey = {
  50: '#F3F6F9',
  100: '#E7EBF0',
  200: '#E0E3E7',
  300: '#CDD2D7', // vs blueDark 900: WCAG 11.6 AAA, APCA 78 Best for text
  400: '#B2BAC2', // vs blueDark 900: WCAG 9 AAA, APCA 63.3 Ok for text
  500: '#A0AAB4', // vs blueDark 900: WCAG 7.5 AAA, APCA 54.3 Only for large text
  600: '#6F7E8C', // vs white bg: WCAG 4.1 AA, APCA 68.7 Ok for text
  700: '#3E5060', // vs white bg: WCAG 8.3 AAA, APCA 88.7 Best for text
  800: '#2D3843', // vs white bg: WCAG 11.9 AAA, APCA 97.3 Best for text
  900: '#1A2027',
};
// context on the Advanced Perceptual Contrast Algorithm (APCA) used above here: https://github.com/w3c/wcag/issues/695

const colors = {
  blue: blue,
  grey: grey
}

const systemFont = [
  '-apple-system',
  'BlinkMacSystemFont',
  '"Segoe UI"',
  'Roboto',
  '"Helvetica Neue"',
  'Arial',
  'sans-serif',
  '"Apple Color Emoji"',
  '"Segoe UI Emoji"',
  '"Segoe UI Symbol"',
];

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
}

const styles = {
  global: (props: StyleFunctionProps) => {
    body: {
      bg: mode(grey[50], blueDark[800])(props)
    }
  }
}

const components = {
  Heading: {
    variants: {
      'section-title': {
        textDecoration: 'underline',
        fontSize: 20,
        textUnderlineOffSet: 6,
        
      }
    }
  }
}

const theme = extendTheme({ config, styles, components, systemFont, colors });

export default theme