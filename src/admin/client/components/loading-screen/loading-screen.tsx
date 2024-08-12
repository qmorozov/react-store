import MaterialUIBox, { BoxProps as MUIBoxProps } from '@mui/material/Box';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import LinearProgress from '@mui/material/LinearProgress';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export default function LoadingScreen({ sx, ...other }: MUIBoxProps) {
  return (
    <MaterialUIBox
      sx={{
        px: 5,
        width: 1,
        flexGrow: 1,
        minHeight: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...sx,
      }}
      {...other}
    >
      <LinearProgress color="inherit" sx={{ width: 1, maxWidth: 360 }} />
    </MaterialUIBox>
  );
}
