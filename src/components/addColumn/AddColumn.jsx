import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import PropTypes from "prop-types";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";

AddColumn.propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
  onSaveColumn: PropTypes.func,
  columnDetails: PropTypes.object
};

AddColumn.defaultProps = {
  isOpen: false,
  onClose: () => {},
  onSaveColumn: () => {},
  columnDetails: {}
};

function AddColumn({ isOpen, onClose, onSaveColumn, columnDetails }) {
  const [columnName, setColumnName] = useState("");

  useEffect(() => {
    if(columnDetails) {
      setColumnName(columnDetails)
    }
  }, [])

  const handleSubmitColumn = () => {
    onSaveColumn({
      title: columnName,
      value: columnName.split(' ').join('').trim().toLowerCase(),
      data: [],
      count: 0
    });
    setColumnName('')
  };

  const handleKeydown = (e) => {
    if (e.code === "Enter" && e.isTrusted) {
      handleSubmitColumn();
    }
  };

  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="dark">
          <DialogHeader className={"dark"}>
            <DialogTitle className="dark">
              <span className="text-white">Add Column</span>
            </DialogTitle>
          </DialogHeader>
          <div className="form">
            <div className="grid w-full items-center gap-1.5 mt-2">
              <label className="dark text-white text-sm" htmlFor="priority">
                Column name
              </label>
              <Input
                className="dark text-white"
                type="text"
                value={columnName}
                onChange={(e) => setColumnName(e.target.value)}
                required
                placeholder="Enter column name"
                onKeyDown={(e) => handleKeydown(e)}
              />
              {/* {!columnName && <div className="text-xs text-red-600">Please enter the column name</div>} */}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="dark" onClick={onClose}>
              <span className="text-white">Cancel</span>
            </Button>
            <Button
              variant="default"
              className="dark"
              onClick={() => handleSubmitColumn()}
              disabled={columnName?.length < 1}
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddColumn;
