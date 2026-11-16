import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem from '@mui/material/MenuItem';

import { LogOut, UserRound } from 'lucide-react';

import Menu from '@/components/mui/Menu';
import { useTranslation } from '@/lib/hooks/useTranslation';
import useGetUserSession from '@/services/auth/useGetUserSession';
import useLogout from '@/services/auth/useLogout';

const ProfileMenu = ({ children }: { children?: React.ReactNode }) => {
  const { t } = useTranslation();
  const { data: user } = useGetUserSession();

  const { mutate, isPending } = useLogout();

  return (
    <Menu
      Button={Button}
      buttonProps={{
        children: (
          <>
            {user?.profile.name}
            <Avatar className="border-primary-500 text-primary-500 size-8 border bg-white text-sm uppercase">
              <UserRound size={'1rem'} />
            </Avatar>
          </>
        ),
        className: 'gap-2 -mr-4 md:mr-0',
      }}
      slotProps={{
        paper: {
          className: 'min-w-40',
        },
      }}
      transformOrigin={{ horizontal: 'left', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
    >
      {children}
      {/* <Link href="/dashboard/edit-profile">
        <MenuItem>
          <ListItemIcon>
            <UserRoundPen size={"1rem"} />
          </ListItemIcon>
          Edit Profile
        </MenuItem>
      </Link> */}
      <MenuItem disabled={isPending} onClick={() => mutate()} className="text-red-500">
        <ListItemIcon>
          <LogOut size={'1rem'} className="text-red-500" />
        </ListItemIcon>
        {t.header.logout}
      </MenuItem>
    </Menu>
  );
};

export default ProfileMenu;
