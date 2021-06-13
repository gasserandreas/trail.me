import { createMuiTheme } from '@material-ui/core/styles';

const colors = {
  primary: {
    light: '#2EB594',
    main: '#00A578',
    dark: '#00694B',
  },
  red: {
    default: '#FF0000',
  },
  white: {
    default: '#FCFCFC',
  },
  gray: {
    light: '#B6B7B9',
    medium: '#6D6F74',
    dark: '#37383D',
  },
};

const customTheme = createMuiTheme({
  props: {
    MuiButtonBase: {
      disableRipple: true,
    },
    // MuiToggleButton: {
    //   disableRipple: true,
    // },
    MuiTabs: {
      textColor: 'primary',
      indicatorColor: 'primary',
    },
    MuiCheckbox: {
      color: 'primary',
    },
    MuiRadio: {
      color: 'primary',
    },
  },
  palette: {
    primary: {
      light: colors.primary.light,
      main: colors.primary.main,
      dark: colors.primary.dark,
    },
    secondary: { main: colors.red.default },
    background: {
      default: colors.white.default,
    },
  },
  overrides: {
    MuiButton: {
      root: {
        textTransform: 'none',
        '&:focus': {
          outline: `2px solid ${colors.primary.light}`,
        },
        '&$disabled': {
          border: `1px solid ${colors.gray.medium}`,
        },
      },
      text: {
        '&:disabled': {
          border: 'none',
        },
      },
      contained: {
        backgroundColor: colors.gray.light,
        border: `1px solid ${colors.gray.medium}`,
        '&, &:focus, &:active': {
          boxShadow: 'none',
        },
      },
      containedPrimary: {
        borderColor: colors.primary.main,
      },
      containedSecondary: {
        borderColor: colors.red.default,
      },
    },
    MuiFab: {
      root: {
        textTransform: 'none',
        '&:focus': {
          outline: 0,
        },
      },
    },
    MuiButtonBase: {
      root: {
        textTransform: 'none',
        '&:focus': {
          outline: 0,
        },
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        '&$selected': {
          fontWeight: 'bold',
        },
      },
    },
    MuiTypography: {
      h1: {
        fontSize: '1.75rem',
        fontWeight: 700,
      },
      h2: {
        fontSize: '1.5rem',
        fontWeight: 700,
      },
      h3: {
        fontSize: '1.1875rem',
        fontWeight: 700,
      },
      h4: {
        fontSize: '1rem',
        fontWeight: 700,
      },
      h5: {
        fontSize: '1rem',
        fontWeight: 700,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 700,
      },
    },
    MuiChip: {
      root: {
        borderRadius: 4,
      },
      avatar: {
        '&&': {
          borderRadius: 4,
          width: '32px',
          height: '32px',
        },
      },
      sizeSmall: {
        fontSize: '0.75rem',
        height: '24px',
        '& $label': {
          padding: '0.25rem 0.375rem',
        },
      },
      avatarSmall: {
        '&&': {
          width: '24px',
          height: '24px',
        },
      },
    },
    MuiFormControlLabel: {
      root: {
        marginBottom: '0rem',
      },
    },
    MuiFormLabel: {
      root: {
        color: 'black',
        fontWeight: 700,
      },
    },
    MuiInputLabel: {
      root: {
        fontWeight: 400,
      },
    },
    MuiCheckbox: {
      root: {
        padding: '0.125rem 0.5625rem',
        '&&:hover,&&$checked:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiRadio: {
      root: {
        padding: '0.125rem 0.5625rem',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
    MuiOutlinedInput: {
      adornedEnd: {
        '&$marginDense': {
          paddingRight: 0,
        },
      },
    },
    MuiListItem: {
      root: {
        '&$selected': {
          backgroundColor: 'rgba(0,0,0,0.12)',
        },
      },
    },
  },
  // Spacing: (factor) => SPACING[factor],
  typography: {
    // Use the system font instead of the default Roboto font.
    fontFamily: [
      'Arial',
      '-apple-system',
      '"Helvetica Neue"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontWeightBold: 700,
  },
});

export default customTheme;
