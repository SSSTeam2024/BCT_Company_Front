import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import TableContainer from "Common/TableContainer";
import { userList } from "Common/data";
import Swal from "sweetalert2";
import {
  useFetchEmployeeQuery,
  useDeleteEmployeeMutation,
  Employee,
  useFetchEmployeeByCompanyQuery,
} from "features/employees/employeesSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../../features/account/authSlice";

const Account = () => {
  document.title = "Accounts | Company Administration";

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data } = useFetchEmployeeByCompanyQuery({ idCompany: user?._id! });
  console.log("data", data);
  // Type assertion to inform TypeScript about the shape of `data`
  const employees: Employee[] = (data as any)?.getEmployeesByIdCompany || [];

  const [deleteEmployee] = useDeleteEmployeeMutation();

  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const AlertDelete = async (_id: any) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        text: "You cannot step back!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, Cancel!",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteEmployee(_id);
          swalWithBootstrapButtons.fire(
            "Deleted!",
            "Account has been deleted.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire(
            "Cancelled",
            "Account secured :)",
            "error"
          );
        }
      });
  };

  const navigate = useNavigate();
  const [modal_AddEmployeeModal, setmodal_AddEmployeeModal] =
    useState<boolean>(false);
  function tog_AddEmployeeModal() {
    navigate("/employees/account/new-account");
  }

  const columns = useMemo(
    () => [
      {
        Header: "Employee Name",
        disableFilters: true,
        filterable: true,
        accessor: (employee: Employee) => {
          return (
            <div className="d-flex align-items-center gap-2">
              <div className="flex-shrink-0">
                <img
                  src={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${employee.photos}`}
                  alt=""
                  className="avatar-xs rounded-circle user-profile-img"
                  id="photos"
                />
              </div>
              <div className="flex-grow-1 ms-2 user_name">
                {employee.firstName} {employee.lastName}
              </div>
            </div>
          );
        },
      },
      {
        Header: "Group",
        accessor: (employee: any) => {
          return (
            <div className="flex-grow-1 ms-2 user_name">
              {employee.groupId?.groupName!}{" "}
            </div>
          );
        },
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Mobile",
        accessor: "mobile",
        disableFilters: true,
        filterable: true,
      },
      {
        Header: "Status",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: Employee) => {
          switch (cellProps.status) {
            case "Active":
              return (
                <span className="badge bg-success-subtle text-success">
                  {" "}
                  {cellProps.status}
                </span>
              );
            case "Inactive":
              return (
                <span className="badge bg-danger-subtle text-danger">
                  {" "}
                  {cellProps.status}
                </span>
              );
          }
        },
      },

      {
        Header: "Station",
        accessor: "station",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Address",
        accessor: "address",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Action",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: Employee) => {
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="/single-account"
                  state={cellProps}
                  className="badge bg-info-subtle text-info view-item-btn"
                >
                  <i
                    className="ph ph-eye"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="/edit-account"
                  className="badge bg-success-subtle text-success edit-item-btn"
                  state={cellProps}
                >
                  <i
                    className="ph ph-pencil-line"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="badge bg-danger-subtle text-danger remove-item-btn"
                  onClick={() => AlertDelete(cellProps._id)}
                >
                  <i
                    className="ph ph-trash"
                    style={{
                      transition: "transform 0.3s ease-in-out",
                      cursor: "pointer",
                      fontSize: "1.5em",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "scale(1.4)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "scale(1)")
                    }
                  ></i>
                </Link>
              </li>
            </ul>
          );
        },
      },
    ],
    []
  );

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Accounts" pageTitle="Employees" />
          <Card id="shipmentsList">
            <Card.Header className="border-bottom-dashed">
              <Row className="align-items-center g-3">
                <Col xxl={3} lg={6}>
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Search for something..."
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                <Col className="col-xxl-auto col-sm-auto ms-auto">
                  <Button
                    variant="success"
                    onClick={() => tog_AddEmployeeModal()}
                    className="add-btn"
                  >
                    <i className="bi bi-plus-circle me-1 align-middle"></i> Add
                    Employee Account
                  </Button>
                </Col>
              </Row>
            </Card.Header>

            <Card.Body>
              <div className="table-responsive table-card">
                <TableContainer
                  columns={columns || []}
                  data={data || []}
                  // isGlobalFilter={false}
                  iscustomPageSize={false}
                  isBordered={false}
                  customPageSize={10}
                  className="custom-header-css table align-middle table-nowrap"
                  tableClass="table-centered align-middle table-nowrap mb-0"
                  theadClassName="text-muted table-light"
                  SearchPlaceholder="Search Products..."
                />
              </div>
              <div className="noresult" style={{ display: "none" }}>
                <div className="text-center py-4">
                  <div className="avatar-md mx-auto mb-4">
                    <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                      <i className="bi bi-search"></i>
                    </div>
                  </div>
                  <h5 className="mt-2">Sorry! No Result Found</h5>
                  <p className="text-muted mb-0">
                    We've searched more than 150+ shipment orders We did not
                    find any shipment orders for you search.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_AddEmployeeModal}
            onHide={() => {
              tog_AddEmployeeModal();
            }}
            centered
          ></Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Account;
