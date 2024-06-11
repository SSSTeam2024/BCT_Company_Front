import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Dropzone from "react-dropzone";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { useAddGroupMutation } from "features/groups/groupsSlice";


const AddNewGroup = () => {
  document.title = "create Group | Bouden Coach Travel";

  const [selectedFiles, setselectedFiles] = useState([]);

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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          {/* <Breadcrumb title="Create Vehicle" pageTitle="Vehicles" /> */}
          <form
            id="createproduct-form"
            autoComplete="off"
            className="needs-validation"
            noValidate
          >
            <Row>
              <Col lg={12}>
                <Card>
                  <Card.Header>
                    <div className="d-flex">
                      <div className="flex-shrink-0 me-3">
                        <div className="avatar-sm">
                          <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                            <i className="bi bi-person-workspace"></i>
                          </div>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h5 className="card-title mb-1">Group Information</h5>
                      </div>
                    </div>
                  </Card.Header>
                 
                 
                            <Card.Body>
                            
                    <div className="mb-3">
                      <Form className="tablelist-form">
                        <input type="hidden" id="id-field" />
                        <Row>
                          <Row>
                            {/* First Name  == Done */}
                            <Col lg={4}>
                              <div className="mb-3">
                                <Form.Label htmlFor="customerName-field">
                                  Group Name
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="customerName-field"
                                  placeholder="Enter first name"
                                  required
                                />
                              </div>
                            </Col>
                            <Col lg={3}>
                              <div className="mb-3">
                                <Form.Label htmlFor="customerName-field">
                                  Contribution
                                </Form.Label>
                                <Form.Control
                                  type="text"
                                  id="customerName-field"
                                  placeholder="Enter first name"
                                  required
                                />
                              </div>
                            </Col>
                            </Row>
                            <Row>
                            <Col lg={3}>
                              <div className="mb-3">
                                <label
                                  htmlFor="statusSelect"
                                  className="form-label"
                                >
                                Departus Station
                                </label>
                                <select
                                  className="form-select text-muted"
                                  name="choices-single-default"
                                  id="statusSelect"
                                  required
                                >
                                  <option value="">Station 1</option>
                                  <option value="Male">Station 2</option>
                                  <option value="Female">Station 3</option>
                                  <option value="Other">Station 4</option>
                                </select>
                              </div>
                            </Col>
                             <Col lg={3}>
                              <div className="mb-3">
                                <label
                                  htmlFor="statusSelect"
                                  className="form-label"
                                >
                                Final Station
                                </label>
                                <select
                                  className="form-select text-muted"
                                  name="choices-single-default"
                                  id="statusSelect"
                                  required
                                >
                                  <option value="">Station 1</option>
                                  <option value="Male">Station 2</option>
                                  <option value="Female">Station 3</option>
                                  <option value="Other">Station 4</option>
                                </select>
                              </div>
                            </Col>
                            <Col lg={3}>
                              <div className="mb-3">
                                <label
                                  htmlFor="statusSelect"
                                  className="form-label"
                                >
                                Mid Stations
                                </label>
                                <select
                                  className="form-select text-muted"
                                  name="choices-single-default"
                                  id="statusSelect"
                                  required
                                >
                                  <option value="">Station 1</option>
                                  <option value="Male">Station 2</option>
                                  <option value="Female">Station 3</option>
                                  <option value="Other">Station 4</option>
                                </select>
                              </div>
                            </Col>
                          
                          
                          

                          </Row>
                         
                          {/* <Col lg={12}>
                            <Card.Header>
                              <div className="d-flex">
                                <div className="flex-shrink-0 me-3">
                                  <div className="avatar-sm">
                                    <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                      <i className="bi bi-box-seam"></i>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="card-title">Identification and Authentication</h5>
                                </div>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Row>
                                <Col lg={3}>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="statusSelect"
                                      className="form-label"
                                    >
                                      Employee ID
                                    </label>
                                    <Form.Control
                                      type="text"
                                      id="supplierName-field"
                                      placeholder="Enter number"
                                      required
                                    />
                                  </div>
                                </Col>
                                <Col lg={3}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="orderDate-field">
                                    Social Security Number
                                    </Form.Label>
                                    <Flatpickr
                                      className="form-control flatpickr-input"
                                      placeholder="Select Date"
                                     
                                    />
                                  </div>
                                </Col>
                                <Col lg={3}>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="statusSelect"
                                      className="form-label"
                                    >
                                      Photo
                                    </label>
                                    <Form.Control
                                      type="file"
                                      id="supplierName-field"
                                      placeholder="Enter number"
                                      className="text-muted"
                                      required
                                    />
                                  </div>
                                </Col>
                              </Row>
                            </Card.Body>
                          </Col> */}
                         
                          {/* <Col lg={12}>
                            <Card.Header>
                              <div className="d-flex">
                                <div className="flex-shrink-0 me-3">
                                  <div className="avatar-sm">
                                    <div className="avatar-title rounded-circle bg-light text-primary fs-20">
                                      <i className="bi bi-box-seam"></i>
                                    </div>
                                  </div>
                                </div>
                                <div className="flex-grow-1">
                                  <h5 className="card-title">Transportation-Specific Information</h5>
                                </div>
                              </div>
                            </Card.Header>
                            <Card.Body>
                              <Row>
                              <Col lg={3}>
                              <div className="mb-3">
                                <label
                                  htmlFor="statusSelect"
                                  className="form-label"
                                >
                                  Station
                                </label>
                                <select
                                  className="form-select text-muted"
                                  name="choices-single-default"
                                  id="statusSelect"
                                  required
                                >
                                  <option value="">Station 1</option>
                                  <option value="Male">Station 2</option>
                                  <option value="Female">Station 3</option>
                                  <option value="Other">Station 4</option>
                                </select>
                              </div>
                            </Col>
                                <Col lg={2}>
                                  <div className="mb-3">
                                    <label
                                      htmlFor="statusSelect"
                                      className="form-label"
                                    >
                                      Group
                                    </label>
                                    <select
                                  className="form-select text-muted"
                                  name="choices-single-default"
                                  id="statusSelect"
                                  required
                                >
                                  <option value="">Group</option>
                                  <option value="Active">Group 1</option>
                                  <option value="Inactive">Group 2</option>
                                  <option value="Annual vacation">
                                   Annual vacation
                                  </option>
                                      <option value="Exceptional vacation">Exceptional vacation</option>
                                       <option value="Driving">Driving</option>
                                </select>
                                  </div>
                                </Col>
                                <Col lg={2}>
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
                                  required
                                >
                                  <option value="">Category</option>
                                  <option value="Only Car">Only Car</option>
                                  <option value="Only Bus">Only Bus</option>
                                  <option value="Both">
                                   Both
                                  </option>
                                </select>
                                  </div>
                                </Col>
                                <Col lg={3}>
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
                                  required
                                >
                                  <option value="">Contract</option>
                                  <option value="CDI">CDI</option>
                                  <option value="CDD">CDD</option>
                                  <option value="Part Time">
                                   Part Time
                                  </option>
                                </select>
                                  </div>
                                </Col>
                               
                              </Row>
                            </Card.Body>
                          </Col> */}
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
                          {/* <Col lg={12}>
                            <div className="hstack gap-2 justify-content-end">
                              <Button variant="primary" id="add-btn">
                                Add New Group
                              </Button>
                            </div>
                          </Col> */}
                        </Row>
                      </Form>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </form>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default AddNewGroup;