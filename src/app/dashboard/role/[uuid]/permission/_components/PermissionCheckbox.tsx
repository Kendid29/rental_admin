import { memo, useMemo } from 'react';

import Checkbox from '@/components/ui/form/Checkbox';
import { AllPermissionsType } from '@/lib/types/permission.type';
import { usePermission } from '@/services/permission/usePermission';
import useTogglePermission from '@/services/permission/useTogglePermission';

interface Props {
  data: AllPermissionsType[];
  role_uuid: string;
  module_name: string;
}

const PermissionCheckbox = ({ data, role_uuid, module_name }: Props) => {
  const checkPermission = usePermission();
  const checkPermissionByRole = usePermission(role_uuid);

  const { mutate } = useTogglePermission(role_uuid);

  const permissions = useMemo(() => {
    return data.filter((item) => item.module_name === module_name);
  }, [data, module_name]);

  return (
    <div className="flex h-full flex-wrap items-center gap-x-6">
      {permissions.map(({ uuid, permission_name }, i) => (
        <Checkbox
          key={i}
          size="small"
          label={permission_name}
          disabled={!checkPermission('role_permission', 'Update' as any)}
          checked={
            !!checkPermissionByRole(
              module_name?.toLowerCase().replaceAll(' ', '_'),
              permission_name as any,
            )
          }
          onChange={(__, value) => mutate({ value, module_name, uuid, permission_name })}
        />
      ))}
    </div>
  );
};

export default memo(PermissionCheckbox);
