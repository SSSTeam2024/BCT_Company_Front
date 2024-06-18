import React from "react";
import SimpleBar from "simplebar-react";
import { newcustomers } from "Common/data";
import { Link } from "react-router-dom";
import {
  useFetchEmployeeQuery,
  useFetchEmployeeByCompanyQuery,
  Employee,
} from "features/employees/employeesSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../features/account/authSlice";

const NewEmployees = () => {
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data } = useFetchEmployeeByCompanyQuery({ idCompany: user?._id! });
  const employees: Employee[] = (data as any)?.getEmployeesByIdCompany || [];

  return (
    <React.Fragment>
      <div className="col-xxl-3 col-lg-6">
        <div className="card card-height-100">
          <div className="card-header align-items-center d-flex">
            <h4 className="card-title mb-0 flex-grow-1">New Employees</h4>
            <Link to="/employees/account" className="flex-shrink-0">
              View All <i className="ri-arrow-right-line align-bottom ms-1"></i>
            </Link>
          </div>

          <SimpleBar style={{ maxHeight: "445px" }}>
            {(employees || []).map((item, key) => (
              <div
                className="p-3 border-bottom border-bottom-dashed"
                key={item._id}
              >
                <div className="d-flex align-items-center gap-2">
                  <div className="flex-shrink-0">
                    <img
                      src={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${item.photos}`}
                      alt=""
                      className="rounded dash-avatar"
                    />
                  </div>
                  <div className="flex-grow-1">
                    <h6 className="mb-1">
                      {item.firstName}
                      {item.lastName}
                    </h6>
                    <p className="fs-13 text-muted mb-0">
                      {item.positionTitle}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    <Link
                      to="mailto:careytommy@toner.com"
                      className="btn btn-icon btn-sm btn-soft-danger"
                    >
                      <i className="ph-envelope"></i>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </SimpleBar>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NewEmployees;
