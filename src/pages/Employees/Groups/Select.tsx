import React, { useEffect, useState } from 'react';
import DualListBox from 'react-dual-listbox'

import { Row, Col } from "react-bootstrap";

import "react-dual-listbox/lib/react-dual-listbox.css";
import { useFetchEmployeeQuery, useAddEmployeeMutation, useDeleteEmployeeMutation, useUpdateEmployeeMutation, Employee } from 'features/employees/employeesSlice';


interface SelectionProps {
  onSelectionChange: (selected: string[]) => void; // Define the onSelectionChange prop
}

const Selection: React.FC<SelectionProps> = ({onSelectionChange}) => {
 
 const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [options, setOptions] = useState<{ value: string; label: string; }[]>([]);
  // const [selected, setSelected] =  useState<string[]>([]);
  const { data = [] } = useFetchEmployeeQuery();
  const filteredEmployees = data.filter(employee => employee.groupId === null);



  useEffect(() => {
    if (filteredEmployees) {
   
      const names:any = filteredEmployees.map(item => ({ value: item._id, label:item.firstName + item.lastName}));
      setOptions(names);
    }
  }, [data]);
 
  
   
  const handleSelectionChange = (selected:any) => {
    setSelectedItems(selected);
    onSelectionChange(selected); // Pass selectedItems to the parent component
    
  };


  return (
    <React.Fragment>
      <Col lg={12}>
          <div>
            <h5 className="fs-14 mb-1">Employees</h5>
            <p className="text-muted">Slide the selected Employees to the right </p>
            <DualListBox
              options={options}
              selected={selectedItems}
              onChange={handleSelectionChange}
              icons={{
                moveLeft: <span className="mdi mdi-chevron-left" key="key" />,
                moveAllLeft: [
                  <span className="mdi mdi-chevron-double-left" key="key" />,
                ],
                moveRight: <span className="mdi mdi-chevron-right" key="key" />,
                moveAllRight: [
                  <span className="mdi mdi-chevron-double-right" key="key" />,
                ],
                moveDown: <span className="mdi mdi-chevron-down" key="key" />,
                moveUp: <span className="mdi mdi-chevron-up" key="key" />,
                moveTop: (
                  <span className="mdi mdi-chevron-double-up" key="key" />
                ),
                moveBottom: (
                  <span className="mdi mdi-chevron-double-down" key="key" />
                ),
              }}
            />
          </div>
        </Col>
    </React.Fragment>
  );
};

export default Selection;