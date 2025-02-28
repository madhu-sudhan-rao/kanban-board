import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '../ui/dropdown-menu';
import PropTypes from "prop-types";

Dropdown.propTypes = {
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    list: PropTypes.array,
    label: PropTypes.string
}

Dropdown.defaultProps ={
    isOpen: false,
    onClose: () => {},
    list: []
}


function Dropdown({
    isOpen,
    onClose,
    list,
    label
}) {
      if (!isOpen) return null; // Ensure it only renders when open

  return (
    <div>
        <DropdownMenu open={isOpen} onOpenChange={onClose}>

           <DropdownMenuContent>
                <DropdownMenuGroup>
                    {label?.trim() && <><DropdownMenuLabel>{label}</DropdownMenuLabel><DropdownMenuSeparator /></>}
                    {
                        list.map((option, index) => (
                            <DropdownMenuItem key={index} disabled={option?.disabled}>
                                {(option?.title & !option?.subMenu) && option?.title}
                                {option.shortcut && <DropdownMenuShortcut>{option.shortcut}</DropdownMenuShortcut> }

                                {option?.subMenu &&
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>{option?.title}</DropdownMenuSubTrigger>
                                            <DropdownMenuPortal>
                                                <DropdownMenuSubContent>
                                                    {
                                                        option?.subMenu?.map((subMenuOption, subMenuIndex) => (
                                                            <DropdownMenuItem key={subMenuIndex} disabled={subMenuOption?.disabled} >
                                                                {subMenuOption?.title}
                                                            </DropdownMenuItem>

                                                        ))
                                                    }
                                                </DropdownMenuSubContent>
                                            </DropdownMenuPortal>


                                    </DropdownMenuSub>
                                }
                                
                            </DropdownMenuItem>
                        ))
                    }
                </DropdownMenuGroup>
    
           </DropdownMenuContent>
        </DropdownMenu>
    </div>
  )
}

export default Dropdown