import React, { useState } from "react";
import { Container, Form, Row, Card, Col } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import Swal from "sweetalert2";
import { useAddNewRequestFeatureMutation } from "features/RequestFeature/requestFeatureSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { selectCurrentUser } from "../../../features/account/authSlice";

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

const RequestFeature = () => {
  document.title = "Request New Feature | Company Administration";

  const navigate = useNavigate();
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const notifySuccess = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Request a Feature is created successfully",
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

  //select Subject
  const [selectedSubject, setSelectedSubject] = useState<string>("");

  const selectChangeSubject = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedSubject(value);
  };

  const [createResquestFeature] = useAddNewRequestFeatureMutation();

  const initialRequestFeature = {
    company_id: "",
    subject: "",
    title: "",
    details: "",
    date: "",
    status: "",
    answer: "",
    featureImage: "",
    featureImage_base64_string: "",
    featureImage_extension: "",
  };

  const [requestFeature, setRequestFeature] = useState(initialRequestFeature);

  const {
    company_id,
    subject,
    title,
    details,
    date,
    status,
    answer,
    featureImage,
    featureImage_base64_string,
    featureImage_extension,
  } = requestFeature;

  const onChangeRequestFeature = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRequestFeature((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  // Feature Image
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("featureImage_base64_string") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      console.log("extension", extension);
      const featureImage = base64Data + "." + extension;
      setRequestFeature({
        ...requestFeature,
        featureImage: featureImage,
        featureImage_base64_string: base64Data,
        featureImage_extension: extension,
      });
    }
  };

  const currentDate = new Date();
  const onSubmitRequestFeature = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      requestFeature["company_id"] = user?._id!;
      requestFeature["date"] = currentDate.toDateString();
      requestFeature["status"] = "Pending";
      requestFeature["subject"] = selectedSubject;
      createResquestFeature(requestFeature)
        .then(() => notifySuccess())
        .then(() => navigate("/request-feature"));
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <Row>
              <Col lg={6}>
                <Card.Header className="border-0">
                  <h3>New Request</h3>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={onSubmitRequestFeature}>
                    <Row className="d-flex justify-content-center">
                      <Row>
                        {/* Subject  == Done */}
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Label htmlFor="subject">Subject</Form.Label>
                            <select
                              className="form-select text-muted"
                              name="subject"
                              id="subject"
                              onChange={selectChangeSubject}
                            >
                              <option value="">Select</option>
                              <option value="Billing">Billing</option>
                              <option value="Digital Marketing">
                                Digital Marketing
                              </option>
                              <option value="Entreprise">Entreprise</option>
                              <option value="Sales">Sales</option>
                              <option value="Emails and Hosting">
                                Emails and Hosting
                              </option>
                              <option value="Website and mobile app">
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
                              value={requestFeature.title}
                              onChange={onChangeRequestFeature}
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
                              rows={3}
                              value={requestFeature.details}
                              onChange={onChangeRequestFeature}
                            ></textarea>
                          </div>
                        </Col>
                      </Row>
                      {/* <Row>
                      <Col lg={12}>
                        <div className="mb-3">
                          <Form.Label htmlFor="supplierName-field">
                            Screenshot
                          </Form.Label>
                          <Form.Control
                            type="terxt"
                            id="supplierName-field"
                            placeholder="Click here and press Ctrl+V to paste a screenshot"
                            required
                          />
                        </div>
                      </Col>
                    </Row> */}
                      <Row>
                        <Col lg={12}>
                          <div className="mb-3">
                            <Form.Label htmlFor="featureImage_base64_string">
                              Upload Images
                            </Form.Label>
                            <div>
                              <input
                                className="form-control mb-2"
                                type="file"
                                onChange={handleFileUpload}
                                id="featureImage_base64_string"
                                name="featureImage_base64_string"
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
                    </Row>
                  </Form>
                </Card.Body>
              </Col>
              <Col lg={6}>
                <Card.Body>
                  <h3>Emergency Support</h3>
                  <p>
                    For all normal requests please submit the details in the box
                    on the left.
                    <p>In an emergency please phone using the numbers below:</p>
                  </p>
                  <p className="fw-bold">+44(0)203 409 0646</p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default RequestFeature;
