import {
  createTheme,
  Palette,
  PaletteColor,
  responsiveFontSizes,
  stepConnectorClasses,
} from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';

import MuiSlideTransition from '@/components/mui/SlideTransition';

import { hexToRgb } from '../utils';

const fontSize = {
  fontSize: 'var(--text-sm)',
  lineHeight: 'var(--text-sm--line-height)',
};

declare module '@mui/material/styles' {
  interface CustomPalette extends Palette {
    white: Palette['primary'];
    gray: Palette['primary'];
    black: Palette['primary'];
  }

  interface PaletteOptions {
    white: PaletteOptions['primary'];
    gray: PaletteOptions['primary'];
    black: PaletteOptions['primary'];
  }
}

declare module '@mui/material/Typography' {
  interface TypographyPropsVariantOverrides {
    link: true;
  }
}

declare module '@mui/material/Button' {
  export interface ButtonPropsVariantOverrides {
    ghost: true;
    link: true;
  }

  export interface ButtonPropsColorOverrides {
    white: true;
    gray: true;
    black: true;
  }
}

declare module '@mui/material/IconButton' {
  export interface IconButtonPropsColorOverrides {
    white: true;
    gray: true;
    black: true;
  }

  export interface IconButtonOwnProps {
    variant?: 'outlined' | 'contained' | 'dashed';
  }
}

declare module '@mui/material/LinearProgress' {
  export interface LinearProgressPropsColorOverrides {
    black: true;
  }
}

const baseTheme = createTheme();
const { breakpoints } = baseTheme;

const MuiTheme = createTheme({
  colorSchemes: {
    dark: true,
  },

  palette: {
    primary: {
      main: '#0053cd',
      light: '#4f8dfb',
      dark: '#003487',
      contrastText: '#fff',
    },
    secondary: {
      main: '#186bfa',
      light: '#4898fd',
      dark: '#093eb0',
      contrastText: '#fff',
    },
    background: {
      default: '#f7f9fb',
      paper: '#ffffff',
    },
    divider: '#c5c6cf',
    gray: {
      main: '#6a7282',
      light: '#99a1af',
      dark: '#4a5565',
      contrastText: '#fff',
    },
    black: {
      main: '#1e2939',
      light: '#364153',
      dark: '#101828',
      contrastText: '#fff',
    },
    warning: {
      main: '#f59e0b',
      light: '#fbbf24',
      dark: '#d97706',
      contrastText: '#fff',
    },
    success: {
      main: '#1e7f1e',
      light: '#54b24c',
      dark: '#156d1d',
      contrastText: '#fff',
    },
    error: {
      main: '#ba1a1a',
      light: '#ff5449',
      dark: '#93000a',
      contrastText: '#fff',
    },
    white: {
      main: '#fff',
      contrastText: '#0053cd',
    },
  },

  typography: {
    fontFamily: 'var(--font-sans)',
    allVariants: {
      color: 'inherit',
    },
    // h1: {
    //   fontWeight: 600,
    // },
    // h2: {
    //   fontWeight: 600,
    // },
    // h3: {
    //   fontWeight: 600,
    // },
    // h4: {
    //   fontWeight: 600,
    // },
    // h5: {
    //   fontWeight: 600,
    // },
    body2: {
      color: '#4a5565',
    },
    caption: {
      color: '#6a7282',
    },
  },

  shape: {
    borderRadius: 6,
  },

  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          backgroundColor: '#d1d5dc',
        },
      },
    },

    MuiFormHelperText: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          marginLeft: '0px',
          marginTop: '0px',
        },
      },
    },

    MuiButton: {
      variants: [
        {
          props: { variant: 'ghost' },
          style: {
            padding: '6px 8px',
          },
        },
        {
          props: { variant: 'link' },
          style: {
            padding: '0px 2px',
            backgroundColor: 'transparent',
            disableRipple: true,
          },
        },
      ],
      styleOverrides: {
        root({ theme, ownerState }) {
          const color =
            (theme.palette[ownerState.color as keyof Palette] as PaletteColor) ||
            theme.palette.primary;

          return {
            padding: '8px 16px',
            textTransform: 'none',
            borderRadius: '8px',
            '&.MuiButton-containedWhite': {
              color: '#0053cd',
              backgroundColor: '#fff',
              '&:hover': {
                backgroundColor: '#f3f4f6',
              },
            },
            '&.MuiButton-ghost': {
              backgroundColor: `rgba(${hexToRgb(color.main)}, 0.075)`,
              '&:hover': {
                backgroundColor: `rgba(${hexToRgb(color.main)}, 0.15)`,
              },
            },
            '&.MuiButton-text': {
              '&:hover': {
                backgroundColor: `rgba(${hexToRgb(color.main)}, 0.075)`,
              },
            },
            color: color.main,
            ...fontSize,
          };
        },
        contained({ theme, ownerState }) {
          const color =
            (theme.palette[ownerState.color as keyof Palette] as PaletteColor) ||
            theme.palette.primary;
          return {
            color: color.contrastText || '#fff',
            boxShadow: 'none',
          };
        },
      },
      defaultProps: {
        size: 'small',
      },
    },

    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.015), 0 2px 8px rgba(0, 0, 0, 0.01)',
        },
        outlined: {
          border: '1px solid var(--color-stone-200)',
        },
      },
    },

    MuiRating: {
      styleOverrides: {
        iconFilled: {
          color: '#f59e0b',
        },
      },
    },

    MuiDivider: {
      styleOverrides: {
        root: {
          margin: '0.75rem 0rem',
          borderColor: 'var(--color-stone-200)',
        },
      },
    },

    MuiTypography: {
      defaultProps: {
        variant: 'body1',
      },
      variants: [
        {
          props: { variant: 'link' },
          style: {
            color: '#101828',
            textDecoration: 'underline',
          },
        },
      ],
      styleOverrides: {
        h1: {
          fontWeight: 600,
          fontSize: '3rem',
          [breakpoints.down('lg')]: {
            fontSize: '2.5rem',
          },
        },
        h2: {
          fontWeight: 600,
          fontSize: '2.5rem',
          [breakpoints.down('lg')]: {
            fontSize: '2rem',
          },
        },
        h3: {
          fontWeight: 600,
          fontSize: '2rem',
          [breakpoints.down('lg')]: {
            fontSize: '1.5rem',
          },
        },
        h4: {
          fontWeight: 600,
          fontSize: '1.75rem',
          [breakpoints.down('lg')]: {
            fontSize: '1.25rem',
          },
        },
        h5: {
          fontWeight: 600,
          fontSize: '1.5rem',
          [breakpoints.down('lg')]: {
            fontSize: '1.25rem',
          },
        },
        h6: {
          fontWeight: 600,
          fontSize: '1.25rem',
          [breakpoints.down('lg')]: {
            fontSize: '1rem',
          },
        },
        body1: {
          fontSize: '0.9rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.875rem',
          },
        },
        body2: {
          fontSize: '0.875rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.75rem',
          },
        },
        subtitle1: {
          fontSize: '1rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.875rem',
          },
        },
        subtitle2: {
          fontSize: '0.875rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.75rem',
          },
        },
        caption: {
          fontSize: '0.85rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.75rem',
          },
        },
        overline: {
          fontSize: '0.75rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.65rem',
          },
        },
        button: {
          fontSize: '0.875rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.75rem',
          },
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        invisible: {
          opacity: '0 !important',
          backgroundColor: 'rgba(0,0,0,0) !important',
        },
        root: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.2)',
        },
      },
    },

    MuiStack: {
      defaultProps: {
        alignItems: 'center',
        direction: 'row',
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          padding: '1rem',
          borderRadius: '12px',
        },
      },
    },

    MuiDialog: {
      defaultProps: {
        TransitionComponent: MuiSlideTransition,
      },
      styleOverrides: {
        paper: {
          borderRadius: '1rem',
          boxShadow: '0px 10px 20px rgba(0, 0, 0, 0.1)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          // padding: '12px 8px 12px 24px',
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          fontFamily: 'var(--font-sans)',
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '16px 24px 16px 24px',
        },
      },
    },

    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          ':before': {
            height: '0rem',
          },
          margin: '0px !important',
        },
      },
    },

    MuiPagination: {
      defaultProps: {
        shape: 'rounded',
        color: 'primary',
      },
      styleOverrides: {
        root({ ownerState, theme }) {
          return {
            '& .MuiPaginationItem-outlined': {
              borderRadius: '8px',
            },
            '& .MuiPaginationItem-outlined.Mui-selected': {
              // backgroundColor: (theme.palette[ownerState.color as keyof Palette] as PaletteColor)
              //   .main,
              color: 'white !important',
            },
            '& .MuiPaginationItem-outlined.Mui-selected:hover': {
              // backgroundColor: (theme.palette[ownerState.color as keyof Palette] as PaletteColor)
              //   .dark,
            },
          };
        },
      },
    },

    MuiSwitch: {
      styleOverrides: {
        root: {
          width: '46px',
          height: '27px',
          padding: 0,
          margin: '4px',

          '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
            opacity: 1,
          },
          '& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track': {
            opacity: 0.3,
          },
        },
        switchBase: {
          padding: '4px',
        },
        thumb: {
          width: 18,
          height: 18,
          boxShadow: 'none',
          backgroundColor: 'white',
        },
        track: {
          borderRadius: 9999,
          backgroundColor: '#bdbdbd',
          opacity: '1',
          transition:
            'background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,border 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          height: 'inherit',
        },
        root: {
          borderRadius: '8px',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary-400)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--color-primary-500)',
          },
        },
        notchedOutline: {
          borderColor: 'var(--color-stone-300)',
          '& legend': {
            marginTop: '2px',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputLabel-root': {
            color: '#99a1af',
          },
          '& .MuiInputLabel-root.Mui-focused': {
            color: 'var(--color-primary-600)',
          },
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
          },
          '& .Mui-disabled': {
            opacity: 0.5,
          },
        },
      },
    },

    MuiFormControl: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            backgroundColor: '#fff',
          },
          '& .MuiInputAdornment-root .MuiTypography-root': {
            color: '#374151',
          },
          '& .MuiInputLabel-sizeSmall': {
            lineHeight: '1.75rem',
          },
          '& .MuiInputBase-sizeSmall': {
            lineHeight: '1.75rem',
          },
          '& .MuiPickersInputBase-root': {
            borderRadius: '8px',
          },
          '& .MuiPickersInputBase-inputSizeSmall': {
            lineHeight: '1.75rem',
            height: '45px',
          },
          '& .MuiInputBase-root.MuiInputBase-readOnly': {
            backgroundColor: `rgb(${hexToRgb('#f3f4f6')})`,
            color: '#6a7282',
            '& .MuiInputAdornment-root .MuiTypography-root': {
              color: '#6a7282',
            },
          },
          '&.MuiInputBase-readOnly .MuiInputBase-root': {
            backgroundColor: `rgb(${hexToRgb('#f3f4f6')})`,
            color: '#6a7282',
            '& .MuiInputAdornment-root .MuiTypography-root': {
              color: '#6a7282',
            },
          },

          '&.error .MuiInputBase-root': {
            backgroundColor: `var(--color-danger-100)`,
            color: 'var(--color-danger-700)',
          },
        },
      },
    },

    MuiInputAdornment: {
      styleOverrides: {
        root: {
          color: 'var(--color-primary-500)',
          '& .MuiSvgIcon-root': {
            color: 'var(--color-primary-500)',
          },
        },
      },
    },

    MuiAutocomplete: {
      defaultProps: {
        size: 'small',
        slotProps: {
          paper: {
            variant: 'outlined',
          },
        },
      },
    },

    MuiIconButton: {
      variants: [
        {
          props: { variant: 'outlined' },
          style: {
            border: '1px solid currentColor',
            borderRadius: '50%',
          },
        },
        {
          props: { variant: 'dashed' },
          style: {
            border: '1px dashed currentColor',
            borderRadius: '50%',
          },
        },
        {
          props: { variant: 'contained', color: 'primary' },
          style: ({ theme }) => ({
            border: '1px solid currentColor',
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              backgroundColor: theme.palette.primary.dark,
            },
          }),
        },
      ],
    },

    MuiChip: {
      styleOverrides: {
        root({ theme, ownerState }) {
          const color =
            (theme.palette[ownerState.color as keyof Palette] as PaletteColor) ||
            theme.palette.primary;

          return {
            borderRadius: '0.6rem',
            fontWeight: '600',
            '&.MuiChip-filled': {
              backgroundColor: `rgba(${hexToRgb(color.main)}, 0.1)`,
              color: color.main,
            },
            textTransform: 'capitalize',
          };
        },
        labelSmall: {
          fontSize: '0.75rem',
        },
      },
      defaultProps: {
        variant: 'outlined',
      },
    },

    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: ' 0px',
          gap: '0.5rem',
        },
      },
    },

    MuiDataGrid: {
      styleOverrides: {
        root: {
          '& .MuiDataGrid-row:hover': {
            backgroundColor: `rgba(${hexToRgb('#0053cd')}, 0.04) !important`,
          },
        },
        columnHeader: {
          backgroundColor: `rgba(${hexToRgb('#0053cd')}, 0.08)`,
          color: '#0053cd',
          border: 'none',
        },
        columnSeparator: {
          color: 'var(--color-primary-300)',
        },
        main: {
          padding: '0px 0.75rem',
        },
        virtualScroller: {
          border: '1px solid var(--color-stone-300)',
          borderRadius: '0.4rem',
        },
        'container--top': {
          borderBottom: '1px solid var(--color-stone-300)',
        },
        footerContainer: {
          minHeight: '40px',
          border: 'none',
        },
        toolbar: {
          justifyContent: 'space-between',
        },
        cell: {
          fontSize: '0.9rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.875rem',
          },
        },
        columnHeaderTitle: {
          fontSize: '0.9rem',
          [breakpoints.down('lg')]: {
            fontSize: '0.875rem',
          },
        },
        scrollbar: {
          display: 'none',
        },
      },
    },

    MuiTablePagination: {
      styleOverrides: {
        toolbar: {
          height: '40px',
          minHeight: '0px !important',
        },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: '0.6rem',
          '.MuiLinearProgress-bar': {
            borderRadius: '0.6rem',
          },
        },
      },
    },

    MuiList: {
      styleOverrides: {
        padding: {
          padding: '6px',
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: '28px !important',
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          paddingRight: '3rem',
          ...fontSize,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: 'black',
          padding: '0.5rem 1rem',
          fontSize: '0.875rem',
        },
        arrow: {
          color: 'black',
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          justifyContent: 'space-between',
        },
      },
    },

    // MuiAutocomplete: {
    //   styleOverrides: {
    //     popper: {
    //       whiteSpace: 'nowrap',
    //     },
    //   },
    // },
  },
});

export default responsiveFontSizes(MuiTheme);
