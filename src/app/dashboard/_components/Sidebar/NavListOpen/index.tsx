import _ from 'lodash';

import { NavItem } from '../nav_items';
import NavItemOpen from './NavItem';

const NavListOpen = ({ nav_items, isLoading }: { nav_items: NavItem[]; isLoading: boolean }) => {
  return (
    <div className="flex h-full flex-col gap-5 overflow-auto pr-3">
      {isLoading ? (
        <div>
          <div className="mb-2 h-6 w-1/2 animate-pulse rounded bg-gray-200" />
          <div className="flex flex-col gap-2">
            {_.times(12, (index) => `nav_open_${index}`).map((item) => (
              <div key={item} className="h-12 w-full animate-pulse rounded-lg bg-gray-200" />
            ))}
          </div>
        </div>
      ) : (
        nav_items.map((navItem) => <NavItemOpen key={navItem.title} navItem={navItem} />)
      )}
    </div>
  );
};

export default NavListOpen;
