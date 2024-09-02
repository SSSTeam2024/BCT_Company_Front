import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Button,
  Form,
  Table,
  Dropdown,
} from "react-bootstrap";
import { useSelector } from "react-redux";
import withRouter from "Common/withRouter";
import { RootState } from "../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../features/account/authSlice";
import {
  Account,
  useUpdateAccountMutation,
} from "features/account/accountSlice";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const EditProfile = () => {
  document.title = " Edit Profile | Company Administration ";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Profile Updated successfully",
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

  const navigate = useNavigate();

  const [showCategory, setShowCategory] = useState<boolean>(false);

  const [showStatus, setShowStatus] = useState<boolean>(false);

  const [companyName, setCompanyName] = useState<string>(user?.name ?? "");

  const [selectCategory, setSelectedCategory] = useState<string>("");

  const [companyAdr, setCompanyAdr] = useState<string>(user?.address ?? "");

  const [companyEmail, setCompanyEmail] = useState<string>(user?.email ?? "");

  const [companyPhone, setCompanyPhone] = useState<string>(user?.phone ?? "");

  const [bankAccountName, setBankAccountName] = useState<string>(
    user?.bank_name ?? ""
  );

  const [accountName, setAccountName] = useState<string>(
    user?.account_name ?? ""
  );

  const [accountNumber, setAccountNumber] = useState<string>(
    user?.account_number ?? ""
  );

  const [selectStatus, setSelectedStatus] = useState<string>("");

  const [loginCompany, setLoginCompany] = useState<string>(user?.login ?? "");

  const handleCompanyName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSelectCategory = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCategory(value);
  };

  const handleCompanyAdr = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyAdr(e.target.value);
  };

  const handleCompanyEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyEmail(e.target.value);
  };

  const handleCompanyPhone = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyPhone(e.target.value);
  };

  const handleBankAccountName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBankAccountName(e.target.value);
  };

  const handleAccountName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountName(e.target.value);
  };

  const handleAccountNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountNumber(e.target.value);
  };

  const handleSelectStatus = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedStatus(value);
  };

  const handleLoginCompany = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginCompany(e.target.value);
  };

  const [updateCompanyProfileMutation] = useUpdateAccountMutation();

  const initialCompanyAccount: Account = {
    _id: "",
    name: "",
    address: "",
    email: "",
    phone: "",
    activity: "",
    service_date: "",
    statusCompany: "",
    account_name: "",
    sort_code: "",
    account_number: "",
    bank_name: "",
    login: "",
    password: "",
    logoBase64String: "",
    logoExtension: "",
    logo_file: "",
    legel_card_base64_string: "",
    legal_card_extension: "",
    legal_file: "",
    api_token: "",
  };

  const [updateCompanyProfile, setUpdateCompanyProfile] = useState<any>(
    initialCompanyAccount
  );

  const {
    _id,
    name,
    address,
    email,
    phone,
    activity,
    service_date,
    statusCompany,
    account_name,
    sort_code,
    account_number,
    bank_name,
    login,
    password,
    logoBase64String,
    logoExtension,
    logo_file,
    legel_card_base64_string,
    legal_card_extension,
    legal_file,
  } = updateCompanyProfile as any;

  const onSubmitUpdateCompanyProfile = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try {
      updateCompanyProfile["_id"] = user?._id!;
      if (companyName === "") {
        updateCompanyProfile["name"] = user?.name!;
      } else {
        updateCompanyProfile["name"] = companyName;
      }
      if (companyAdr === "") {
        updateCompanyProfile["address"] = user?.address!;
      } else {
        updateCompanyProfile["address"] = companyAdr;
      }
      if (companyEmail === "") {
        updateCompanyProfile["email"] = user?.email!;
      } else {
        updateCompanyProfile["email"] = companyEmail;
      }
      if (companyPhone === "") {
        updateCompanyProfile["phone"] = user?.phone!;
      } else {
        updateCompanyProfile["phone"] = companyPhone;
      }
      if (loginCompany === "") {
        updateCompanyProfile["login"] = user?.login!;
      } else {
        updateCompanyProfile["login"] = loginCompany;
      }

      if (accountNumber === "") {
        updateCompanyProfile["account_number"] = user?.account_number!;
      } else {
        updateCompanyProfile["account_number"] = accountNumber;
      }

      if (bankAccountName === "") {
        updateCompanyProfile["bank_name"] = user?.bank_name!;
      } else {
        updateCompanyProfile["bank_name"] = bankAccountName;
      }

      if (selectCategory === "") {
        updateCompanyProfile["activity"] = user?.activity!;
      } else {
        updateCompanyProfile["activity"] = selectCategory;
      }

      if (selectStatus === "") {
        updateCompanyProfile["statusCompany"] = user?.statusCompany!;
      } else {
        updateCompanyProfile["statusCompany"] = selectStatus;
      }

      if (accountName === "") {
        updateCompanyProfile["account_name"] = user?.account_name!;
      } else {
        updateCompanyProfile["account_name"] = accountName;
      }

      if (!updateCompanyProfile.logoBase64String) {
        // If not, keep the existing profile picture
        updateCompanyProfile["logo_file"] = user?.logo_file!;
        // Make sure to retain the existing base64 data and extension
        updateCompanyProfile["logoBase64String"] = user?.logoBase64String!;
        updateCompanyProfile["logoExtension"] = user?.logoExtension!;
      }

      if (!updateCompanyProfile.legel_card_base64_string) {
        // If not, keep the existing profile picture
        updateCompanyProfile["legal_file"] = user?.legal_file!;
        // Make sure to retain the existing base64 data and extension
        updateCompanyProfile["legel_card_base64_string"] =
          user?.legel_card_base64_string!;
        updateCompanyProfile["legal_card_extension"] =
          user?.legal_card_extension!;
      }
      console.log("updateCompanyProfile", updateCompanyProfile);
      updateCompanyProfileMutation(updateCompanyProfile)
        .then(() => navigate("/user-profile"))
        .then(() => notifySuccess());
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Row>
            <Col xxl={12}>
              <Card>
                <Form onSubmit={onSubmitUpdateCompanyProfile}>
                  <Card.Body>
                    <Row>
                      <Col lg={3}>
                        <div className="profile-user-img position-relative">
                          <img
                            src={`${process.env.REACT_APP_BASE_URL}/companyFiles/logoFiles/${user.logo_file}`}
                            alt=""
                            className="rounded object-fit-cover"
                          />
                        </div>
                      </Col>
                      <Col lg={9}>
                        <div className="d-flex border-bottom border-bottom-dashed pb-3 mb-3 mt-4 mt-lg-0">
                          <div className="flex-grow-1">
                            <Form.Control
                              type="text"
                              id="firstname"
                              value={companyName}
                              onChange={handleCompanyName}
                              className="mb-1"
                            />
                            <Form.Label htmlFor="supplierName-field">
                              Activity :{" "}
                              <span className="text-dark fs-14">
                                {user?.activity!}
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
                                  title="Select Birth Date"
                                >
                                  <span
                                    className="d-inline-block"
                                    onClick={() =>
                                      setShowCategory(!showCategory)
                                    }
                                  >
                                    <span className="text-success cursor-pointer">
                                      <i className="bi bi-pen fs-14"></i>
                                    </span>
                                  </span>
                                </label>
                              </div>
                            </Form.Label>
                            {showCategory && (
                              <select
                                className="form-select text-muted"
                                name="choices-single-default"
                                id="statusSelect"
                                onChange={handleSelectCategory}
                              >
                                <option value="">Select</option>
                                <option value="Sales and marketing">
                                  Sales and marketing
                                </option>
                                <option value="Auditing">Auditing</option>
                                <option value="Operations and logistics">
                                  Operations and logistics
                                </option>
                                <option value="General administration">
                                  General administration
                                </option>
                                <option value="Warehousing">Warehousing</option>
                              </select>
                            )}
                          </div>
                        </div>
                        <Row>
                          <Col lg={6}>
                            <div className="table-responsive">
                              <Table className="table-borderless table-sm mb-0">
                                <tbody>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-map-pin"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Location</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="address"
                                        value={companyAdr}
                                        onChange={handleCompanyAdr}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-envelope"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Email</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="email"
                                        value={companyEmail}
                                        onChange={handleCompanyEmail}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-phone"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Mobile / Phone No.</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="phone"
                                        value={companyPhone}
                                        onChange={handleCompanyPhone}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-warning-circle"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>
                                        Status:{" "}
                                        {user?.statusCompany! === "Active" ? (
                                          <span className="badge badge-soft-success">
                                            {user?.statusCompany!}
                                          </span>
                                        ) : (
                                          <span className="badge badge-soft-danger">
                                            {user?.statusCompany!}
                                          </span>
                                        )}
                                        <div
                                          className="d-flex mt-n3"
                                          style={{ marginLeft: "100px" }}
                                        >
                                          <label
                                            htmlFor="id_file"
                                            className="mb-0"
                                            data-bs-toggle="tooltip"
                                            data-bs-placement="right"
                                            title="Select Status"
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
                                    </div>
                                    {showStatus && (
                                      <td>
                                        <select
                                          className="form-select text-muted"
                                          name="status"
                                          id="status"
                                          onChange={handleSelectStatus}
                                        >
                                          <option value="">Select</option>
                                          <option value="Active">Active</option>
                                          <option value="Inactive">
                                            Inactive
                                          </option>
                                        </select>
                                      </td>
                                    )}
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <div className="table-responsive">
                              <Table className="table-borderless table-sm mb-0">
                                <tbody>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-bank"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Bank Name</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="bank_name"
                                        value={bankAccountName}
                                        onChange={handleBankAccountName}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-user-list"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Account Name</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="account_name"
                                        value={accountName}
                                        onChange={handleAccountName}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-credit-card"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Account Number</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="account_number"
                                        value={accountNumber}
                                        onChange={handleAccountNumber}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <div className="d-flex align-item-start fw-medium">
                                      <i
                                        className="ph ph-identification-badge"
                                        style={{
                                          marginRight: "3px",
                                          marginTop: "4px",
                                        }}
                                      ></i>
                                      <td>Login</td>
                                    </div>
                                    <td className="fw-medium">
                                      <Form.Control
                                        type="text"
                                        id="login"
                                        value={loginCompany}
                                        onChange={handleLoginCompany}
                                        className="mb-1"
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </Table>
                            </div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="d-flex justify-content-center">
                    <Button variant="success" type="submit" className="add-btn">
                      <i className="me-1 align-middle"></i> Update
                    </Button>
                  </Card.Footer>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default EditProfile;
