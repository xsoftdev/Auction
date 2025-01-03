import type { Config } from 'tailwindcss'
import defaultTheme from 'tailwindcss/defaultTheme'

export default <Partial<Config>>{
    theme: {
        screens: {
            'xxs': '320px',
            'sm': '640px',
            'md': '768px',
            'lg': '1024px',
            'xl': '1280px',
            '2xl': '1536px',
        },
        extend: {
            colors: {
                scarlet: {
                    50: '#fff4ec',
                    100: '#ffe7d3',
                    200: '#ffcba5',
                    300: '#ffa66d',
                    400: '#ff7532',
                    500: '#ff4f0a',
                    600: '#ff3400',
                    700: '#cc2102',
                    800: '#a11b0b',
                    900: '#821a0c',
                    950: '#460904',
                },
                gray: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#828282',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#262626',
                },
                black: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#000000',
                },
                black_haze: {
                    50: '#f5f6f8',
                    100: '#eceef2',
                    200: '#d6dae1',
                    300: '#b1bac8',
                    400: '#8796a9',
                    500: '#68798f',
                    600: '#536176',
                    700: '#444f60',
                    800: '#3b4351',
                    900: '#343a46',
                    950: '#23272e',
                },

            }
        }
    }
}
