import React, { useState, useMemo, useEffect } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import TableContainer from "Common/TableContainer";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Selection from "../../Employees/Groups/Select";
import Swal from "sweetalert2";
import SimpleBar from "simplebar-react";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../../features/account/authSlice";
import {
  useFetchEmployeeQuery,
  useRemoveEmployeeFromGroupMutation,
} from "features/employees/employeesSlice";
import {
  GroupInterface,
  useAddGroupMutation,
  useAddEmployeesToGroupMutation,
  useDeleteGroupMutation,
  useFetchGroupQuery,
} from "features/groups/groupsSlice";
import {
  useFetchProgrammsQuery,
  useFetchGroupEmployeeByIdGroupQuery,
} from "features/program/programSlice";

interface Employee {
  [x: string]: any;
  _id?: string;
  firstName: string;
  lastName: string;
  dateBirth: string;
  login: string;
  password: string;
  email: string;
  phone: string;
  classStudent: string;
  houseStreerNumber: string;
  deparment: string;
  country: string;
  card_id: string;
  nameParent: string;
  status_account: string;
  id_creation_date: string;
  id_file: string;
  IdFileExtension: string;
  IdFileBase64String: string;
  DropOff_date: string;
  DropOff_time: string;
  DropOff_station: string;
  pickUp_date: string;
  pickUp_time: string;
  pickUp_station: string;
  group: string;
  photo_id: string;
  PhotoIdBase64String: string;
  PhotoIdExtension: string;
  idSchool?: string;
  groupId?: string | null;
  groupJoiningDate: string | null;
}
const ProgramGroups = () => {
  document.title = "Group | School Administration";
  const navigate = useNavigate();
  const user: any = useSelector((state: RootState) => selectCurrentUser(state));
  console.log("user", user);
  const location = useLocation();

  console.log("location", location);

  const [modal_AddShippingModals, setmodal_AddShippingModals] =
    useState<boolean>(false);
  const [filteredEmployee, setFilteredEmployee] = useState<Employee[]>([]);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("");

  function tog_AddShippingModals() {
    setmodal_AddShippingModals(!modal_AddShippingModals);
  }
  const [modal_AddStudents, setmodal_AddStudents] = useState<boolean>(false);
  function tog_AddStudents() {
    setmodal_AddStudents(!modal_AddStudents);
  }
  const [showGroups, setShowGroups] = useState<boolean>(false);
  const [showGroupDetails, setShowGroupsDetails] = useState<any>({});
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { data: AllGroups = [] } = useFetchGroupQuery();
  console.log(AllGroups);

  const result = AllGroups.filter(
    (groups: any) =>
      groups?.program?._id! ===
      (location.state ? location.state._id : undefined)
  );

  const { data: employees = [] } = useFetchEmployeeQuery();
  const { data: AllPrograms = [] } = useFetchProgrammsQuery();

  let progId = localStorage.getItem("id_current_prog");

  const { data = [] } = useFetchGroupEmployeeByIdGroupQuery(String(progId));

  console.log("Hard coded", data);

  const [deleteGroup] = useDeleteGroupMutation();
  const [deleteEmployee] = useRemoveEmployeeFromGroupMutation();
  const [createGroup] = useAddGroupMutation();
  const [AddEmployeeToGroup] = useAddEmployeesToGroupMutation();

  // const groups = location?.state?.students_groups!;
  // console.log("Groups",groups,);

  const filtered = employees.filter((employees) => employees.groupId === null);
  console.log("filter1", filtered);

  // useEffect(() => {
  //   const filtered = employees.filter((employees) => employees.groupId === null);
  //   setFilteredEmployee(filtered);
  // }, [employees]);
  const handleSelectionChange = (selected: any) => {
    setSelectedStudents(selected);
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions = event.currentTarget.selectedOptions;

    const newColors = [];
    for (let i = 0; i < selectedOptions.length; i++) {
      newColors.push(selectedOptions[i].value);
    }

    setSelectedValues(newColors);
  };
  console.log("filter", selectedValues);
  const selectChangeProgram = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedProgram(value);
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmitGroup = (e: React.FormEvent<HTMLFormElement>) => {
    formData["program"] = selectedProgram;
    e.preventDefault();
    formData["employees"] = selectedStudents;
    createGroup(formData).then(() => setFormData(formData));
    notify();
    tog_AddShippingModals();
  };

  const onSubmitEmployeesToGroup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    updatedformData["_id"] = showGroupDetails._id;
    updatedformData["employees"] = selectedValues;
    AddEmployeeToGroup(updatedformData)
      .then(() => {
        notify();
      })
      .then(() => tog_AddStudents())
      .then(() => setShowGroups(!showGroups))
      .then(() => navigate("/programgroups"))
      .catch((error) => {
        console.error(error);
      });
    window.location.reload();
  };

  const [formData, setFormData] = useState({
    _id: "",
    groupName: "",
    note: "",
    startPoint: "",
    dateStart: "",
    timeStart: "",
    Destination: "",
    dateEnd: "",
    timeEnd: "",
    status: "",
    program: "",
    id_company: user?._id!,
    employees: [
      {
        _id: "",
        firstName: "",
        lastName: "",
        photos: "",
        groupId: "",
        groupJoiningDate: "",
      },
    ],
  });
  const [updatedformData, setupdatedFormData] = useState({
    _id: "",
    employees: [""],
  });

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Group has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

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
        text: "You can not step back!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Delete it!",
        cancelButtonText: "No, Cancel!",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteGroup(_id);
          swalWithBootstrapButtons.fire(
            "Deleted !",
            "Group has been deleted.",
            "success"
          );
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire("Cancel", "Group secured :)", "error");
        }
      });
  };
  const DeleteEmployee = async (employeeId: string, groupId: string) => {
    const confirmation = await Swal.fire({
      title: "Are you sure you want to remove the employee?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Remove Employee",
      cancelButtonText: "Cancel",
    });

    if (confirmation.isConfirmed) {
      try {
        await deleteEmployee({ employeeId, groupId });
        setShowGroups(!showGroups);
        Swal.fire("Success!", "Employee removed successfully.", "success");
        window.location.reload();
      } catch (error) {
        console.error("Error removing employee:", error);
        Swal.fire(
          "Error!",
          "An error occurred while removing the employee.",
          "error"
        );
      }
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: "Group Name",
        accessor: "groupName",
        disableFilters: true,
        filterable: true,
      },

      {
        Header: "Employees",
        accessor: "employees",
        disableFilters: true,
        filterable: true,
        Cell: ({ row }: { row: any }) => (
          <span>{row?.original?.employees?.length!}</span>
        ),
      },
      {
        Header: "Status",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: GroupInterface) => {
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
        Header: "Actions",
        disableFilters: true,
        filterable: true,
        accessor: (cellProps: GroupInterface) => {
          console.log(cellProps);
          return (
            <ul className="hstack gap-2 list-unstyled mb-0">
              <li>
                <Link
                  to="#"
                  //state={cellProps}
                  className="badge bg-info-subtle text-info view-item-btn"
                  data-bs-toggle="offcanvas"
                  onClick={() => {
                    setShowGroupsDetails(cellProps);
                    setShowGroups(!showGroups);
                  }}
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
                  to="#GroupDetails"
                  className="badge bg-success-subtle text-success edit-item-btn"
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
    [showGroups]
  );
  const hasStudents = filtered.length > 0;

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title={location?.state?.programName!} pageTitle="Group" />
          <Card id="shipmentsList">
            <Card.Header className="border-bottom-dashed">
              <Row className="g-3">
                <Col lg={6}>
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control search"
                      placeholder="Search for groups..."
                    />
                    <i className="ri-search-line search-icon"></i>
                  </div>
                </Col>
                {/* <Col className="col-xxl-auto col-sm-auto ms-auto">
                  <Button
                    variant="success"
                    onClick={() => tog_AddShippingModals()}
                    className="add-btn"
                  >
                    <i className="bi bi-plus-circle me-1 align-middle"></i> Add
                    New Group
                  </Button>
                </Col> */}
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              {/* <div className="table-responsive table-card"> */}
              <TableContainer
                columns={columns || []}
                data={data || []}
                // isGlobalFilter={false}
                iscustomPageSize={false}
                isBordered={false}
                customPageSize={10}
                className="custom-header-css table align-middle table-nowrap"
                tableClass="table-centered align-middle table-nowrap mb-0"
                theadClass="text-muted table-light"
                SearchPlaceholder="Search Products..."
              />
              {/* </div> */}
              <div className="noresult" style={{ display: "none" }}>
                <div className="text-center py-4">
                  <div className="avatar-md mx-auto mb-4">
                    <div className="avatar-title bg-primary-subtle text-primary rounded-circle fs-24">
                      <i className="bi bi-search"></i>
                    </div>
                  </div>
                  <h5 className="mt-2">Sorry! No Result Found</h5>
                  <p className="text-muted mb-0">
                    We've searched for groups and we did not find any groups for
                    you search.
                  </p>
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Modal add Group */}
          <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_AddShippingModals}
            onHide={() => {
              tog_AddShippingModals();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Create New Group
              </h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              <Form className="tablelist-form" onSubmit={onSubmitGroup}>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <Form.Label htmlFor="groupName"> Group Name</Form.Label>
                      <Form.Control
                        type="text"
                        id="groupName"
                        placeholder="Enter Group name"
                        required
                        value={formData.groupName}
                        onChange={onChange}
                      />
                    </div>
                  </Col>

                  <div className="col-lg-10">
                    <div className="mb-3">
                      <Form.Label htmlFor="note"> Description</Form.Label>
                      <Form.Control
                        type="text"
                        id="note"
                        placeholder="Enter description"
                        required
                        value={formData.note}
                        onChange={onChange}
                      />
                    </div>
                  </div>
                  <Col lg={6}>
                    <div className="mb-3">
                      <label htmlFor="group" className="form-label">
                        Program
                      </label>
                      <select
                        className="form-select text-muted"
                        name="choices-single-default"
                        id="group"
                        onChange={selectChangeProgram}
                      >
                        <option value="">Select Program</option>
                        {AllPrograms.map((program) => (
                          <option value={program?._id!} key={program?._id!}>
                            {program?.programName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div>
                      <Selection onSelectionChange={handleSelectionChange} />
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AddShippingModals();
                        }}
                        data-bs-dismiss="modal"
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Close
                      </Button>
                      <Button variant="primary" id="add-btn" type="submit">
                        Add Group
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
          {/* modal add new employees to the group */}
        </Container>
      </div>

      {/* show group details */}
      <Offcanvas
        show={showGroups}
        onHide={() => setShowGroups(!showGroups)}
        placement="end"
      >
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Group Details</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <div className="mt-3">
            <div className="table-responsive">
              <table className="table table-borderless">
                <tbody>
                  <tr>
                    <td>
                      <span className="text-muted">Group Name:</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showGroupDetails.groupName}
                      </span>
                    </td>
                  </tr>
                  {/* <tr>
                    <td>
                      <span className="text-muted">Description:</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showGroupDetails.note}
                      </span>
                    </td>
                  </tr> */}
                  {/* <tr>
                    <td>
                      <span className="text-muted">Program:</span>
                    </td>
                    <td>
                      <span className="fw-medium text-uppercase">
                        {showGroupDetails.program?.programName!}
                      </span>
                    </td>
                  </tr> */}
                  {/* <tr>
                    <td>
                      <span className="text-muted">Start Date:</span>
                    </td>
                    <td>
                      <span className="fw-medium">
                        {showGroupDetails.startDate}
                      </span>
                    </td>
                  </tr> */}
                  {/* <tr>
                    <td>
                      <span className="text-muted">Status:</span>
                    </td>
                    <td>
                      <span
                        className={
                          showGroupDetails.status === "Expired"
                            ? "badge bg-danger-subtle text-danger text-uppercase"
                            : "badge bg-success-subtle text-success text-uppercase"
                        }
                      >
                        {showGroupDetails.status}
                      </span>
                    </td>
                  </tr> */}
                  <tr>
                    <td>
                      <span className="text-muted ">Employees List:</span>
                    </td>
                    <td>
                      <Button
                        type="button"
                        className="btn  btn-sm btn-soft-primary "
                        onClick={() => tog_AddStudents()}
                      >
                        Add Employee
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
              <div className="card card-height-100">
                <SimpleBar>
                  {showGroupDetails.employees &&
                  showGroupDetails.employees.length === 0 ? (
                    <div className="p-3">
                      <p>No employees to display</p>
                    </div>
                  ) : (
                    showGroupDetails.employees?.map(
                      (employee: {
                        photos: string;
                        _id: string;
                        firstName: string;
                        lastName: string;
                      }) => (
                        <div
                          className="p-3 border-bottom border-bottom-dashed"
                          key={employee._id}
                        >
                          <div className="d-flex align-items-center gap-2">
                            <div className="flex-shrink-0">
                              <img
                                src={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${employee.photos}`}
                                alt=""
                                className="rounded dash-avatar"
                              />
                            </div>
                            <div className="flex-grow-1">
                              <h6 className="mb-1">
                                {employee.firstName} {employee.lastName}
                              </h6>
                            </div>
                            <div className="flex-shrink-0">
                              <Button
                                onClick={() =>
                                  DeleteEmployee(
                                    employee._id,
                                    showGroupDetails._id
                                  )
                                }
                                className="btn btn-icon btn-sm btn-soft-danger"
                              >
                                {/* remove employee from group */}
                                <i className="ph ph-trash"></i>
                              </Button>
                            </div>
                          </div>
                        </div>
                      )
                    )
                  )}
                </SimpleBar>
              </div>
            </div>
          </div>
        </Offcanvas.Body>

        <Modal
          className="fade zoomIn"
          size="lg"
          show={modal_AddStudents}
          onHide={() => {
            tog_AddStudents();
          }}
          centered
        >
          <Modal.Header className="px-4 pt-4" closeButton>
            <h5 className="modal-title fs-18" id="exampleModalLabel">
              Add new Students To The Group
            </h5>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div
              id="alert-error-msg"
              className="d-none alert alert-danger py-2"
            ></div>
            <Form
              className="tablelist-form"
              onSubmit={onSubmitEmployeesToGroup}
            >
              <input type="hidden" id="id-field" />
              <input
                type="hidden"
                name="_id"
                id="_id"
                value={showGroupDetails._id}
              />
              <Row>
                <Col lg={12} md={6}>
                  <div className="mb-3">
                    {hasStudents ? (
                      <select
                        multiple
                        size={8}
                        onChange={handleSelectChange}
                        className="select"
                        style={{ width: "300px" }}
                      >
                        {filtered.map((employees) => (
                          <option
                            key={employees._id}
                            value={`${employees._id}`}
                          >
                            {employees.firstName} {employees.lastName}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <p>NoEmployees to add.</p>
                    )}
                  </div>
                </Col>

                <Col lg={12}>
                  <div className="hstack gap-2 justify-content-end">
                    <Button
                      className="btn-ghost-danger"
                      onClick={() => {
                        tog_AddStudents();
                      }}
                      data-bs-dismiss="modal"
                    >
                      <i className="ri-close-line align-bottom me-1"></i> Close
                    </Button>
                    <Button variant="primary" id="add-btn" type="submit">
                      Add
                    </Button>
                  </div>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </Offcanvas>
    </React.Fragment>
  );
};

export default ProgramGroups;
