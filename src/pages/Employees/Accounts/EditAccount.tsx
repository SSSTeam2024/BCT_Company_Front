import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import TableContainer from "Common/TableContainer";
import { userList } from "Common/data";
import Swal from "sweetalert2";
import {
  useFetchEmployeeQuery,
  useDeleteEmployeeMutation,
  Employee,
  useFetchEmployeeByCompanyQuery,
  useUpdateEmployeeMutation,
} from "features/employees/employeesSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../../features/account/authSlice";
import SimpleBar from "simplebar-react";
import country from "Common/country";

import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";

const EditAccount = () => {
  document.title = "Edit Account | Company Administration";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }

  const [numPages, setNumPages] = useState<number | null>(null);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const employeeLocation = useLocation();

  const [showStatus, setShowStatus] = useState<boolean>(false);

  const [showGender, setShowGender] = useState<boolean>(false);

  const [showNationality, setShowNationality] = useState<boolean>(false);

  const [first_name, setFirstName] = useState<string>(
    employeeLocation?.state?.firstName ?? ""
  );

  const [last_name, setLastName] = useState<string>(
    employeeLocation?.state?.lastName ?? ""
  );

  const [position, setPosition] = useState<string>(
    employeeLocation?.state?.positionTitle ?? ""
  );

  const [adr, setAdr] = useState<string>(
    employeeLocation?.state?.address ?? ""
  );

  const [mail, setMail] = useState<string>(
    employeeLocation?.state?.email ?? ""
  );

  const [phone, setPhone] = useState<string>(
    employeeLocation?.state?.mobile ?? ""
  );

  const [selectedCivilStatus, setSelectedCivilStatus] = useState<string>("");

  const [selectedGender, setSelectedGender] = useState<string>("");

  const [seletedCountry1, setseletedCountry1] = useState<any>({});

  const [employeeLogin, setEmployeeLogin] = useState<string>(
    employeeLocation?.state?.login ?? ""
  );

  const handleFirstName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
  };

  const handleLastName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
  };

  const handlePosition = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPosition(e.target.value);
  };

  const handleAdr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdr(e.target.value);
  };

  const handleEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMail(e.target.value);
  };

  const handleMobile = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhone(e.target.value);
  };

  const handleSelectCivilStatus = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCivilStatus(value);
  };

  const handleSelectGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedGender(value);
  };

  const handleLogin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployeeLogin(e.target.value);
  };

  const [modal_LegalCard, setmodal_LegalCard] = useState<boolean>(false);
  function tog_LegalCard() {
    setmodal_LegalCard(!modal_LegalCard);
  }

  const navigate = useNavigate();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Employee Account Updated successfully",
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const notifyError = (err: any) => {
    Swal.fire({
      position: "center",
      icon: "error",
      title: `Sothing Wrong, ${err}`,
      showConfirmButton: false,
      timer: 2500,
    });
  };

  const [updateEmployeeProfileMutation] = useUpdateEmployeeMutation();

  const initialEmployeeAccount = {
    _id: "",
    firstName: "",
    lastName: "",
    idCompany: "",
    gender: "",
    civilStatus: "",
    address: "",
    station: "",
    mobile: "",
    email: "",
    photos: "",
    dateOfBirth: "",
    legalcard: "",
    username: "",
    groupId: {
      _id: null,
      groupName: " ",
    },
    groupJoiningDate: "",
    login: "",
    password: "",
    photosBase64String: "",
    photosExtension: "",
    legalcardBase64String: "",
    legalcardExtension: "",
    positionTitle: "",
    nationality: "",
    status: "",
  };
  const [updateEmployeeProfile, setUpdateEmployeeProfile] = useState<Employee>(
    initialEmployeeAccount
  );
  const {
    _id,
    firstName,
    lastName,
    idCompany,
    gender,
    civilStatus,
    address,
    station,
    mobile,
    email,
    photos,
    dateOfBirth,
    legalcard,
    username,
    groupId,
    groupJoiningDate,
    login,
    password,
    photosBase64String,
    photosExtension,
    legalcardBase64String,
    legalcardExtension,
    positionTitle,
    nationality,
    status,
  } = updateEmployeeProfile as Employee;

  const onSubmitUpdateEmployeeProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      updateEmployeeProfile["_id"] = employeeLocation?.state?._id!;
      if (first_name === "") {
        updateEmployeeProfile["firstName"] =
          employeeLocation?.state?.firstName!;
      } else {
        updateEmployeeProfile["firstName"] = first_name;
      }
      if (last_name === "") {
        updateEmployeeProfile["lastName"] = employeeLocation?.state?.lastName!;
      } else {
        updateEmployeeProfile["lastName"] = last_name;
      }
      if (mail === "") {
        updateEmployeeProfile["email"] = employeeLocation?.state?.email!;
      } else {
        updateEmployeeProfile["email"] = mail;
      }
      if (phone === "") {
        updateEmployeeProfile["mobile"] = employeeLocation?.state?.mobile!;
      } else {
        updateEmployeeProfile["mobile"] = phone;
      }
      if (adr === "") {
        updateEmployeeProfile["address"] = employeeLocation?.state?.address!;
      } else {
        updateEmployeeProfile["address"] = adr;
      }

      if (selectedGender === "") {
        updateEmployeeProfile["gender"] = employeeLocation?.state?.gender!;
      } else {
        updateEmployeeProfile["gender"] = selectedGender;
      }

      if (position === "") {
        updateEmployeeProfile["positionTitle"] =
          employeeLocation?.state?.positionTitle!;
      } else {
        updateEmployeeProfile["positionTitle"] = position;
      }

      if (selectedCivilStatus === "") {
        updateEmployeeProfile["civilStatus"] =
          employeeLocation?.state?.civilStatus!;
      } else {
        updateEmployeeProfile["civilStatus"] = selectedCivilStatus;
      }

      if (employeeLogin === "") {
        updateEmployeeProfile["login"] = employeeLocation?.state?.login!;
      } else {
        updateEmployeeProfile["login"] = employeeLogin;
      }

      if (seletedCountry1 === null) {
        updateEmployeeProfile["nationality"] =
          employeeLocation?.state?.nationality!;
      } else {
        updateEmployeeProfile["nationality"] = seletedCountry1?.countryName!;
      }
      updateEmployeeProfile["idCompany"] = user?._id!;
      updateEmployeeProfile["groupId"] = employeeLocation?.state?.groupId!;
      updateEmployeeProfile["password"] = employeeLocation?.state?.password!;
      updateEmployeeProfileMutation(updateEmployeeProfile);
      notifySuccess();
      navigate("/employees/account");
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Card>
            <Form onSubmit={onSubmitUpdateEmployeeProfile}>
              <Card.Body>
                <Row>
                  <div className="hstack gap-0">
                    <Col lg={3}>
                      <div className="position-relative rounded">
                        <img
                          src={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${employeeLocation.state.photos}`}
                          alt=""
                          className="rounded cover"
                        />
                      </div>
                    </Col>
                    <Col lg={9}>
                      <div className="d-flex border-bottom border-bottom-dashed mb-0 mt-10 mt-lg-4">
                        <div className="justify-content-start">
                          <Form.Control
                            type="text"
                            id="firstname"
                            value={first_name}
                            onChange={handleFirstName}
                            className="mb-1"
                          />
                          <Form.Control
                            type="text"
                            id="last_name"
                            value={last_name}
                            onChange={handleLastName}
                            className="mb-1"
                          />
                          <Form.Control
                            type="text"
                            id="position"
                            value={position}
                            onChange={handlePosition}
                          />
                        </div>
                        <div className="hstack gap-2 justify-content-end m-2">
                          <Button
                            variant="soft-danger"
                            className="btn-label"
                            onClick={tog_LegalCard}
                          >
                            <i className="bi bi-file-image label-icon align-middle fs-16 me-2"></i>
                            Legal Card
                          </Button>
                        </div>
                      </div>
                      <Row className="g-4">
                        <Col lg={9}>
                          <div className="table-responsive g-4">
                            <Table className=" mb-0">
                              <tbody>
                                <tr>
                                  <td className="fw-bold">Address:</td>
                                  <td className="fw-medium">
                                    <Form.Control
                                      type="text"
                                      id="address"
                                      value={adr}
                                      onChange={handleAdr}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">Email:</td>
                                  <td className="fw-medium">
                                    <Form.Control
                                      type="text"
                                      id="email"
                                      value={mail}
                                      onChange={handleEmail}
                                    />
                                  </td>
                                </tr>
                                <tr>
                                  <td className="fw-bold">Mobile:</td>
                                  <td className="fw-medium">
                                    <Form.Control
                                      type="text"
                                      id="phone"
                                      value={phone}
                                      onChange={handleMobile}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                          <div className="table-responsive g-4">
                            <Table className="mb-0">
                              <tbody>
                                <tr>
                                  <td className="fw-bold">
                                    Civil Status :{" "}
                                    <span className="fw-medium">
                                      {employeeLocation?.state?.civilStatus}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "160px" }}
                                    >
                                      <label
                                        htmlFor="id_file"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Driver Status"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowStatus(!showStatus)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </td>
                                  {showStatus && (
                                    <td className="fw-medium">
                                      <select
                                        className="form-select text-muted"
                                        name="civilStatus"
                                        id="civilStatus"
                                        onChange={handleSelectCivilStatus}
                                      >
                                        <option value="">Select</option>
                                        <option value="Married">Married</option>
                                        <option value="Single">Single</option>
                                        <option value="Divorced">
                                          Divorced
                                        </option>
                                        <option value="Widowed">Widowed</option>
                                      </select>
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td className="fw-bold">
                                    Gender :{" "}
                                    <span className="fw-medium">
                                      {employeeLocation?.state?.gender}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "160px" }}
                                    >
                                      <label
                                        htmlFor="id_file"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Driver Status"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowGender(!showGender)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </td>
                                  {showGender && (
                                    <td className="fw-medium">
                                      <select
                                        className="form-select text-muted"
                                        name="gender"
                                        id="gender"
                                        onChange={handleSelectGender}
                                      >
                                        <option value="">Select</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                      </select>
                                    </td>
                                  )}
                                </tr>
                                <tr>
                                  <td className="fw-bold">
                                    Nationality :{" "}
                                    <span className="fw-medium">
                                      {employeeLocation?.state?.nationality}
                                    </span>
                                    <div
                                      className="d-flex justify-content-start mt-n3"
                                      style={{ marginLeft: "180px" }}
                                    >
                                      <label
                                        htmlFor="id_file"
                                        className="mb-0"
                                        data-bs-toggle="tooltip"
                                        data-bs-placement="right"
                                        title="Select Driver Status"
                                      >
                                        <span
                                          className="d-inline-block"
                                          onClick={() =>
                                            setShowNationality(!showNationality)
                                          }
                                        >
                                          <span className="text-success cursor-pointer">
                                            <i className="bi bi-pen fs-14"></i>
                                          </span>
                                        </span>
                                      </label>
                                    </div>
                                  </td>
                                  {showNationality && (
                                    <td className="fw-medium">
                                      <Dropdown>
                                        <Dropdown.Toggle
                                          as="input"
                                          style={{
                                            backgroundImage: `url(${
                                              seletedCountry1.flagImg &&
                                              seletedCountry1.flagImg
                                            })`,
                                          }}
                                          className="form-control rounded-end flag-input form-select"
                                          placeholder="Select country"
                                          readOnly
                                          defaultValue={
                                            seletedCountry1.countryName
                                          }
                                        ></Dropdown.Toggle>
                                        <Dropdown.Menu
                                          as="ul"
                                          className="list-unstyled w-100 dropdown-menu-list mb-0"
                                        >
                                          <SimpleBar
                                            style={{ maxHeight: "220px" }}
                                            className="px-3"
                                          >
                                            {(country || []).map(
                                              (item: any, key: number) => (
                                                <Dropdown.Item
                                                  as="li"
                                                  onClick={() =>
                                                    setseletedCountry1(item)
                                                  }
                                                  key={key}
                                                  className="dropdown-item d-flex"
                                                >
                                                  <div className="flex-shrink-0 me-2">
                                                    <Image
                                                      src={item.flagImg}
                                                      alt="country flag"
                                                      className="options-flagimg"
                                                      height="20"
                                                    />
                                                  </div>
                                                  <div className="flex-grow-1">
                                                    <div className="d-flex">
                                                      <div className="country-name me-1">
                                                        {item.countryName}
                                                      </div>
                                                      <span className="countrylist-codeno text-muted">
                                                        {item.countryCode}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </Dropdown.Item>
                                              )
                                            )}
                                          </SimpleBar>
                                        </Dropdown.Menu>
                                      </Dropdown>
                                    </td>
                                  )}
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                          <div className="table-responsive g-4">
                            <Table className=" mb-0">
                              <tbody>
                                <tr>
                                  <td className="fw-bold">Login:</td>
                                  <td className="fw-medium">
                                    <Form.Control
                                      type="text"
                                      id="login"
                                      value={employeeLogin}
                                      onChange={handleLogin}
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </div>
                </Row>
                <Row>
                  <div className="hstack gap-5"></div>
                </Row>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-center">
                <Button variant="success" type="submit" className="add-btn">
                  <i className="me-1 align-middle"></i> Update
                </Button>
              </Card.Footer>
            </Form>
          </Card>

          <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_LegalCard}
            onHide={() => {
              tog_LegalCard();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                Legal Card
              </h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              <div>
                <Document
                  file={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${employeeLocation.state.legalcard}`}
                  onLoadSuccess={onDocumentLoadSuccess}
                >
                  <Page pageNumber={1} />
                </Document>
              </div>
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditAccount;
