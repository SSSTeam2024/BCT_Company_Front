import React, { useState } from "react";
import { Container, Form, Row, Card, Col } from "react-bootstrap";

import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import { useAddNewErrorReportMutation } from "features/ReportError/reportErrorSlice";
import { RootState } from "app/store"; // Import your RootState interface
import { selectCurrentUser } from "features/account/authSlice";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function convertToBase64(
  file: File
): Promise<{ base64Data: string; extension: string }> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const base64String = fileReader.result as string;
      const [, base64Data] = base64String.split(",");
      const extension = file.name.split(".").pop() ?? "";
      resolve({ base64Data, extension });
    };
    fileReader.onerror = (error) => {
      reject(error);
    };
    fileReader.readAsDataURL(file);
  });
}

const ReportError = () => {
  document.title = "Report an Error | Company Administration";

  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const navigate = useNavigate();

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Report an Error is created successfully",
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

  //select Section
  const [selectedSection, setSelectedSection] = useState<string>("");

  const selectChangeSection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSection(value);
  };

  const [createErrorReport] = useAddNewErrorReportMutation();

  const initialErrorReport = {
    company_id: "",
    section: "",
    title: "",
    details: "",
    date: "",
    status: "",
    answer: "",
    errorImage: "",
    errorImage_base64_string: "",
    errorImage_extension: "",
  };

  const [errorReport, setErrorReport] = useState(initialErrorReport);

  const {
    company_id,
    section,
    title,
    details,
    date,
    status,
    answer,
    errorImage,
    errorImage_base64_string,
    errorImage_extension,
  } = errorReport;

  const onChangeErrorReport = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrorReport((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Feature Image
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("errorImage_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const featureImage = base64Data + "." + extension;
      setErrorReport({
        ...errorReport,
        errorImage: featureImage,
        errorImage_base64_string: base64Data,
        errorImage_extension: extension,
      });
    }
  };

  const currentDate = new Date();
  const onSubmitErrorReport = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      errorReport["company_id"] = user?._id!;
      errorReport["date"] = currentDate.toDateString();
      errorReport["status"] = "Pending";
      errorReport["section"] = selectedSection;
      createErrorReport(errorReport)
        .then(() => notifySuccess())
        .then(() => navigate("/reported-errors"));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Report an Error" pageTitle="Help" />
          <Card>
            <Row>
              <Col lg={6}>
                <Card.Header className="border-0">
                  <h3>Report</h3>
                </Card.Header>
                <Card.Body>
                  <Row className="d-flex justify-content-center">
                    <Form onSubmit={onSubmitErrorReport}>
                      <Row>
                        {/* Section  == Done */}
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Label htmlFor="supplierName-field">
                              Section
                            </Form.Label>
                            <select
                              className="form-select text-muted"
                              name="choices-single-default"
                              id="statusSelect"
                              onChange={selectChangeSection}
                            >
                              <option value="">Select</option>
                              <option value="Entreprise">Billing</option>
                              <option value="Schools">Digital Marketing</option>
                              <option value="Entreprise">Other</option>
                              <option value="Schools">Sales</option>
                              <option value="Schools">
                                Emails and Hosting
                              </option>
                              <option value="Schools">
                                Website and mobile app
                              </option>
                            </select>
                          </div>
                        </Col>
                      </Row>
                      {/* Title  == Done */}
                      <Row>
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Label htmlFor="title">Title</Form.Label>
                            <Form.Control
                              type="text"
                              id="title"
                              name="title"
                              value={errorReport.title}
                              onChange={onChangeErrorReport}
                            />
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Label htmlFor="details">Details</Form.Label>
                            <textarea
                              className="form-control"
                              id="details"
                              name="details"
                              // placeholder="for everyone : customer can see it"
                              rows={3}
                              value={errorReport.details}
                              onChange={onChangeErrorReport}
                            ></textarea>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Label htmlFor="errorImage_base64_string">
                              Upload Images
                            </Form.Label>
                            <div>
                              <input
                                className="form-control mb-2"
                                type="file"
                                onChange={handleFileUpload}
                                id="errorImage_base64_string"
                                name="errorImage_base64_string"
                                accept="image/*"
                              />
                            </div>
                          </div>
                        </Col>
                      </Row>
                      <Row>
                        <div
                          className="position-relative"
                          style={{ height: "40px" }}
                        >
                          <div className="position-absolute bottom-0 start-50 translate-middle-x">
                            <button
                              type="submit"
                              className="btn rounded-pill btn-info"
                            >
                              <span className="mdi mdi-send-outline"></span>{" "}
                              Send
                            </button>
                          </div>
                        </div>
                      </Row>
                    </Form>
                  </Row>
                </Card.Body>
              </Col>
              <Col lg={6}>
                <Card.Header className="border-0">
                  <h3>Emergency Support</h3>
                </Card.Header>
                <Card.Body>
                  <p>
                    For all normal requests please submit the details in the box
                    on the left. In an emergency please phone using the numbers
                    below:
                  </p>
                  <p>UK: +44(0)203 409 0646</p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default ReportError;
