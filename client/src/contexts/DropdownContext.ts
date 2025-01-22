import { createContext } from 'react';
import { DropdownContextProps } from '../interfaces/DropdownProps';

/**
 * Contains info on whether the dropdown is open or not
 */
export const DropdownContext = createContext<DropdownContextProps>({
  open: false,
  setOpen: () => { },
});