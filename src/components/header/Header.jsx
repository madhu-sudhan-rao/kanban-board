import PropTypes from 'prop-types';
import Profile from "../profile/Profile";
import "./Header.css";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from '../ui/button';

function Header({ onAddColumnClick }) {
  return (
    <>
      <div className="header flex justify-between items-center">
        <div className="avatar">
          <Profile />
        </div>
        <div className="title">FlowBoard</div>
        <div className="add-button-container">
          <TooltipProvider className="dark">
            <Tooltip className="dark">
              <TooltipTrigger className="dark" asChild>
                <Button
                  className="dark add-column-button"
                  size="icon"
                  variant="outline"
                  onClick={onAddColumnClick}
                >
                  <Plus className="text-white" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="dark">Add column</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
}

// Add PropTypes validation
Header.propTypes = {
  onAddColumnClick: PropTypes.func.isRequired
};

export default Header;