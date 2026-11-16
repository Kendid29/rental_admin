import { JSX } from '@emotion/react/jsx-runtime';

import DashboardTitle from '@/components/ui/dashboard/DashboardTitle';

import MemberTable from './_components/MemberTable';

const Page = (): JSX.Element => {
  const breadcrumbs = [
    {
      label: 'Member',
    },
  ];

  return (
    <>
      <div className="flex flex-1 flex-col">
        <DashboardTitle
          title="Member List"
          subTitle="Manage your members here."
          breadcrumbs={breadcrumbs}
        >
          {/* <Button
            LinkComponent={Link}
            href={'/dashboard/member/new'}
            variant="contained"
            color="primary"
            startIcon={<PlusCircle size={'1rem'} />}
          >
            New Member
          </Button> */}
        </DashboardTitle>

        <MemberTable />
      </div>
    </>
  );
};

export default Page;
