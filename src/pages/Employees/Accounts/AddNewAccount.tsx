import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Dropdown,
  Form,
  Image,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import SimpleBar from "simplebar-react";
import country from "Common/country";
import Swal from "sweetalert2";
import { useAddEmployeeMutation } from "features/employees/employeesSlice";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import { useFetchGroupQuery } from "features/groups/groupsSlice";
import { useSelector } from "react-redux";
import { RootState } from '../../../app/store'; // Import your RootState interface
import { selectCurrentUser } from '../../../features/account/authSlice'; 

const AddNewAccount = () => {
  document.title = "create Account | Bouden Coach Travel";
  const navigate = useNavigate();
  const [selectedFiles, setselectedFiles] = useState([]);
  // Mutation to create account
  const [createAccount] = useAddEmployeeMutation();
  const { data: AllGroups = [] } = useFetchGroupQuery();
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  // Account's Values and Functions
  // groupId: "65def391137b93f458f52c1f",
  const [formData, setFormData] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    idCompany: user?._id!,
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
    groupId:{
      _id:null,
      groupName:" ",
    },
    groupJoiningDate:"",
    login: "",
    password: "",
    photosBase64String: "",
    photosExtension: "",
    legalcardBase64String: "",
    legalcardExtension: "",
    positionTitle: "",
    nationality: "",
    status: "",
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const [seletedCountry, setseletedCountry] = useState<any>({});
  const [seletedCountry1, setseletedCountry1] = useState<any>({});

  // change gender
  const [selectedOption, setSelectedOption] = useState<string>("");
  // This function is triggered when the select changes
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedOption(value);
  };

  //change civil status
  const [selectedStatus, setSelectedStatus] = useState<string>("");

  const selectChangeStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedStatus(value);
  };

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  //change station
  const [selectedStation, setSelectedStation] = useState<string>("");

  const selectChangeStation = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedStation(value);
  };

  //change group
  const [selectedGroup, setSelectedGroup] = useState<string>("");

  // const selectChangeGroup = (event: React.ChangeEvent<HTMLSelectElement>) => {
  //   const value = event.target.value;
  //   setSelectedGroup(value);
  // };

  const handleDateChange = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDate(selectedDates[0]);
  };

  const onSubmitAccount = (e: React.FormEvent<HTMLFormElement>) => {
    formData["gender"] = selectedOption;
    formData["civilStatus"] = selectedStatus;
    formData["station"] = selectedStation;
    // if (selectedGroup === "") {
    //   formData["groupId"] = "65def391137b93f458f52c1f";
    // } else {
    //   formData["groupId"] = selectedGroup;
    // }

    formData["nationality"] = seletedCountry1.countryName;
    // formData["dateOfBirth"] = selectedDate!.toDateString();
    e.preventDefault();
    createAccount(formData).then(() => setFormData(formData));
    notify();
    navigate("/employees/account");
  };
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Account has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  function handleAcceptedFiles(files: any) {
    files.map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
        formattedSize: formatBytes(file.size),
      })
    );
    setselectedFiles(files);
  }

  /* Formats the size */
  function formatBytes(bytes: any, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  }

  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        // const base64Data = base64String.split(",")[1]; // Extract only the Base64 data
        const [, base64Data] = base64String.split(","); // Extract only the Base64 data
        const extension = file.name.split(".").pop() ?? ""; // Get the file extension
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("photosBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newFile = base64Data + "." + extension;
      console.log(extension);
      setFormData({
        ...formData,
        photos: newFile,
        photosBase64String: base64Data,
        photosExtension: extension,
      });
    }
  };
  const handlePDFUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("legalcardBase64String") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
      console.log(extension);
      setFormData({
        ...formData,
        legalcard: newPDF,
        legalcardBase64String: base64Data,
        legalcardExtension: extension,
      });
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col lg={12}>
              <Card>
                {/* <Card.Header>
                  <div className="d-flex">
                    <div className="flex-shrink-0 me-3">
                      <div className="avatar-sm">
                        <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                          <i className="bi bi-person-workspace"></i>
                        </div>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <h5 className="card-title mb-1">Employee's Account</h5>
                    </div>
                  </div>
                </Card.Header> */}
                <Card.Body>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-lines-fill"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title">Personal Information</h5>
                      </div>
                    </div>
                  </Card.Header>
                  <Card.Body></Card.Body>
                  <div className="mb-3">
                    <Form className="tablelist-form" onSubmit={onSubmitAccount}>
                      <input type="hidden" id="id-field" />
                      <Row>
                        <div className="text-center mb-3">
                          <div
                            className="position-relative d-inline-block"
                            style={{ marginBottom: "30px" }}
                          >
                            <div className="position-absolute top-100 start-100 translate-middle">
                              <label
                                htmlFor="photosBase64String"
                                className="mb-0"
                                data-bs-toggle="tooltip"
                                data-bs-placement="right"
                                title="Select Employee Picture"
                              >
                                <span className="avatar-xs d-inline-block">
                                  <span className="avatar-title bg-light border rounded-circle text-muted cursor-pointer">
                                    <i className="ri-image-fill"></i>
                                  </span>
                                </span>
                              </label>
                              <input
                                className="d-none"
                                type="file"
                                name="photosBase64String"
                                id="photosBase64String"
                                accept="image/*"
                                onChange={(e) => handleFileUpload(e)}
                              />
                            </div>
                            <div className="avatar-xl">
                              <div className="avatar-title bg-light rounded-4">
                                <img
                                  src={`data:image/*;base64, ${formData.photosBase64String}`}
                                  // alt={formData.firstName}
                                  id="photosBase64String"
                                  className="avatar-xl h-auto rounded-4 object-fit-cover"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <Row>
                          {/* First Name  == Done */}
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="fullName">
                                First Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="firstName"
                                placeholder="Enter first name"
                                // required
                                value={formData.firstName}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          {/* Last Name == Done */}
                          <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label htmlFor="lastName">
                                Last Name
                              </Form.Label>
                              <Form.Control
                                type="text"
                                id="lastName"
                                placeholder="Enter last name"
                                value={formData.lastName}
                                onChange={onChange}
                              />
                            </div>
                          </Col>
                          {/* Birth_Date  == Done */}
                          {/* <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="dateOfBirth">
                                Date of Birth
                              </Form.Label>
                              <Flatpickr
                                value={selectedDate!}
                                onChange={handleDateChange}
                                className="form-control flatpickr-input"
                                placeholder="Select Date"
                                options={{
                                  dateFormat: "d M, Y",
                                }}
                                id="dateOfBirth"
                              />

                            </div>
                          </Col> */}
                          <Col lg={2}>
                            <div className="mb-3">
                              <label htmlFor="gender" className="form-label">
                                Gender
                              </label>
                              <select
                                className="form-select text-muted"
                                name="gender"
                                id="gender"
                                // required
                                // value={formData.gender}
                                onChange={selectChange}
                              >
                                <option value="">Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                              </select>
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label>Nationality</Form.Label>
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
                                  defaultValue={seletedCountry1.countryName}
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
                            </div>
                          </Col>
                          <Col lg={2}>
                            <div className="mb-3">
                              <Form.Label htmlFor="civilStatus">
                                Civil Status
                              </Form.Label>
                              <select
                                className="form-select text-muted"
                                name="ccivilStatus"
                                id="civilStatus"
                                // required
                                onChange={selectChangeStatus}
                              >
                                <option value="">Status</option>
                                <option value="Married">Married</option>
                                <option value="Single">Single</option>
                                <option value="Divorced">Divorced</option>
                                <option value="Widowed">Widowed</option>
                              </select>
                            </div>
                          </Col>
                        </Row>
                        <Row>
                          {/* Original_Nationality  == Not Yet */}
                          {/* <Col lg={3}>
                            <div className="mb-3">
                              <Form.Label>
                                Original Nationality
                              </Form.Label>
                              <Dropdown>
                                <Dropdown.Toggle
                                  as="input"
                                  style={{
                                    backgroundImage: `url(${seletedCountry.flagImg &&
                                      seletedCountry.flagImg
                                      })`,
                                  }}
                                  className="form-control rounded-end flag-input form-select"
                                  placeholder="Select country"
                                  readOnly
                                  defaultValue={seletedCountry.countryName}
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
                                            setseletedCountry(item)
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
                            </div>
                          </Col> */}

                          <Row>
                            <Col lg={3}>
                              <div className="mb-3">
                                <Form.Label htmlFor="mobile">
                                  Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="mobile"
                                  onChange={onChange}
                                  placeholder="Enter phone"
                                  // required
                                />
                              </div>
                            </Col>
                            {/* <Col lg={3}>
                              <div className="mb-3">
                                <Form.Label htmlFor="supplierName-field">
                                  Emergency Phone Number
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="supplierName-field"
                                  placeholder="Enter phone"
                                // required
                                />
                              </div>

                            </Col> */}
                            <Col lg={4}>
                              <div className="mb-3">
                                <Form.Label htmlFor="email">Email</Form.Label>
                                <Form.Control
                                  type="email"
                                  id="email"
                                  onChange={onChange}
                                  placeholder="Enter email"
                                  // required
                                />
                              </div>
                            </Col>
                            <Col lg={3}>
                              <div className="mb-3">
                                <Form.Label htmlFor="address">
                                  Address
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="address"
                                  placeholder="Enter address"
                                  onChange={onChange}
                                  // required
                                />
                              </div>
                            </Col>
                            <Row>
                              {/* <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="supplierName-field">
                                    Locality
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="supplierName-field"
                                    placeholder="Enter address"
                                  // required
                                  />
                                </div>
                              </Col> */}
                              {/* <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="supplierName-field">
                                    Post Code
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="supplierName-field"
                                    placeholder="Enter address"
                                  // required
                                  />
                                </div>
                              </Col> */}
                            </Row>
                          </Row>
                        </Row>

                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-person-fill-add"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  Identification and Authentication
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="positionTitle">
                                    Position Title
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="positionTitle"
                                    placeholder="Enter position Title"
                                    value={formData.positionTitle}
                                    onChange={onChange}
                                  />
                                </div>
                              </Col>
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label htmlFor="login" className="form-label">
                                    Employee ID
                                  </label>
                                  <Form.Control
                                    type="text"
                                    id="login"
                                    placeholder="login"
                                    onChange={onChange}
                                    // required
                                  />
                                </div>
                              </Col>
                              {/* <Col lg={3}>
                                <div className="mb-3">
                                  <Form.Label htmlFor="orderDate-field">
                                    Social Security Number
                                  </Form.Label>
                                  <Flatpickr
                                    className="form-control flatpickr-input"
                                    placeholder="Select Date"

                                  />
                                </div>
                              </Col> */}
                              <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="legalcardBase64String"
                                    className="form-label"
                                  >
                                    Legal Card
                                  </label>
                                  <Form.Control
                                    name="legalcardBase64String"
                                    onChange={handlePDFUpload}
                                    type="file"
                                    id="legalcardBase64String"
                                    accept=".pdf"
                                    placeholder="Choose File"
                                    className="text-muted"

                                    // required
                                  />
                                </div>
                              </Col>
                            </Row>
                          </Card.Body>
                        </Col>

                        <Col lg={12}>
                          <Card.Header>
                            <div className="d-flex">
                              <div className="flex-shrink-0 me-3">
                                <div className="avatar-sm">
                                  <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                    <i className="bi bi-truck-front"></i>
                                  </div>
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <h5 className="card-title">
                                  Transportation-Specific Information
                                </h5>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <Row>
                              {/* <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="station"
                                    className="form-label"
                                  >
                                    Station
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="choices-single-default"
                                    id="station"
                                    onChange={selectChangeStation}
                                  // required
                                  >
                                    <option value="Station 1">Station 1</option>
                                    <option value="Station 2">Station 2</option>
                                    <option value="Station 3">Station 3</option>
                                    <option value="Station 4">Station 4</option>
                                  </select>
                                </div>
                              </Col> */}
                              {/* <Col lg={2}>
                                <div className="mb-3">
                                  <label htmlFor="group" className="form-label">
                                    Group
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="choices-single-default"
                                    id="group"
                                    onChange={selectChangeGroup}
                                  >
                                    <option value="Group">Group</option>
                                    {AllGroups.map((groups) => (
                                      <option
                                        value={groups?._id!}
                                        key={groups?._id!}
                                      >
                                        {groups?.groupName}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              </Col> */}
                              {/* <Col lg={2}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="statusSelect"
                                    className="form-label"
                                  >
                                    Category
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="choices-single-default"
                                    id="statusSelect"
                                  // required
                                  >
                                    <option value="">Category</option>
                                    <option value="Only Car">Only Car</option>
                                    <option value="Only Bus">Only Bus</option>
                                    <option value="Both">
                                      Both
                                    </option>
                                  </select>
                                </div>
                              </Col> */}
                              {/* <Col lg={3}>
                                <div className="mb-3">
                                  <label
                                    htmlFor="statusSelect"
                                    className="form-label"
                                  >
                                    Contract Type
                                  </label>
                                  <select
                                    className="form-select text-muted"
                                    name="choices-single-default"
                                    id="statusSelect"
                                  // required
                                  >
                                    <option value="">Contract</option>
                                    <option value="CDI">CDI</option>
                                    <option value="CDD">CDD</option>
                                    <option value="Part Time">
                                      Part Time
                                    </option>
                                  </select>
                                </div>
                              </Col> */}
                            </Row>
                          </Card.Body>
                        </Col>
                        {/* <Col lg={6}>
                            <div className="mb-3">
                              <label
                                htmlFor="statusSelect"
                                className="form-label"
                              >
                                Shift
                              </label>
                              <select
                                className="form-select"
                                name="choices-single-default"
                                id="statusSelect"
                                required
                              >
                                <option value="">Shifts</option>
                                <option value="Pickups">Night </option>
                                <option value="Pending">Weekend </option>
                                <option value="Shipping">Holiday </option>
                                <option value="Delivered">Costum </option>
                              </select>
                            </div>
                          </Col> */}
                        <Col lg={12}>
                          <div className="hstack gap-2 justify-content-end">
                            <Button
                              variant="primary"
                              id="add-btn"
                              type="submit"
                            >
                              Add New employee's Account
                            </Button>
                          </div>
                        </Col>
                      </Row>
                    </Form>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddNewAccount;
