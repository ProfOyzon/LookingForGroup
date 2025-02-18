import { createContext } from 'react';

type DropdownContextProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
};

/**
 * Contains info on whether the dropdown is open or not
 */
export const DropdownContext = createContext<DropdownContextProps>({
  open: false,
  setOpen: () => {},
});
