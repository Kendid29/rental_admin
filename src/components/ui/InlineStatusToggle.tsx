import { CircularProgress, Switch } from '@mui/material';

interface InlineStatusToggleProps {
  checked: boolean;
  loading?: boolean;
  disabled?: boolean;
  label: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (checked: boolean) => void;
}

const InlineStatusToggle = ({
  checked,
  loading = false,
  disabled = false,
  label,
  onChange,
}: InlineStatusToggleProps) =>
  loading ? (
    <CircularProgress size={20} aria-label={`Updating ${label}`} />
  ) : (
    <Switch
      size="small"
      checked={checked}
      disabled={disabled}
      onChange={(_, value) => onChange(value)}
      inputProps={{ 'aria-label': label }}
    />
  );

export default InlineStatusToggle;
