
export default {
  theme: {
    extend: {
      colors: {
        brand: {
          'primary': '#1f2937',
          'secondary': '#2b7fff',
          'tertiary': '#05df72',
          'quaternary': '#ff4d4d',
        },
        'text-primary': '#99a1af',
      },
      keyframes: {
        'slide-fade-down': {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'rotate-in': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(45deg)' },
        },
        'rotate-out': {
          '0%': { transform: 'rotate(45deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'pulse-out': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(2)' },
        },
      },
      animation: {
        'slide-fade-down': 'slide-fade-down 300ms ease-out forwards',
        'rotate-in': 'rotate-in 200ms ease-in forwards',
        'rotate-out': 'rotate-out 200ms ease-in forwards',
        'pulse-out': 'pulse-out ease-out 1s',
      },
      backgroundImage: {
        'sharp-gradient-rl': 'linear-gradient(to right, #1f2937 75%, rgba(0,0,0,0) 100%)',
        'sharp-gradient-lr': 'linear-gradient(to left, #1f2937 75%, rgba(0,0,0,0) 100%)',
      },
   
    },
  },
};
