import React, { useState } from "react";
import { Button, Card, Col, Row, Table, Modal } from "react-bootstrap";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";

const Profile = (props: any) => {
  const {
    firstName,
    lastName,
    address,
    dropdown_time,
    mobile,
    groupId,
    station,
    photos,
    trip_ref,
    email,
    pickup_time,
    legalcard,
    positionTitle,
  } = props;

  const [modal_AddShippingModals, setmodal_AddShippingModals] =
    useState<boolean>(false);
  function tog_AddShippingModals() {
    setmodal_AddShippingModals(!modal_AddShippingModals);
  }

  if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }

  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <React.Fragment>
      <Card.Body>
        <Row>
          <div className="hstack gap-0">
            <Col lg={3}>
              <div
                className="profile-user-img position-relative"
                style={{ width: "500px" }}
              >
                <img
                  src={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${photos}`}
                  alt=""
                  className="rounded cover"
                />
              </div>
            </Col>
            <Col lg={9}>
              <div className="d-flex border-bottom border-bottom-dashed mb-0 mt-10 mt-lg-4">
                <div className="flex-grow-5">
                  <h4>
                    {firstName} {lastName}
                  </h4>
                  <h5 className="text-muted">{positionTitle} </h5>
                </div>
              </div>

              <Row className="mt-3 g-4">
                <Col lg={8}>
                  <div className="table-responsive g-4">
                    <Table className=" mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Station:</td>
                          <td className="fw-medium">{station}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Address:</td>
                          <td className="fw-medium">{address}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Group:</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="table-responsive g-4">
                    <Table className=" mb-0">
                      <tbody>
                        <tr>
                          <td className="fw-bold">Email:</td>
                          <td className="fw-medium">{email}</td>
                        </tr>
                        <tr>
                          <td className="fw-bold">Mobile:</td>
                          <td className="fw-medium">{mobile}</td>
                        </tr>

                        <tr>
                          <td className="fw-bold">Joining Date:</td>
                          <td className="fw-medium">16 Aug, 2019</td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>
              </Row>
            </Col>
          </div>
        </Row>
        <Row className="mt-3 g-3">
          <Col lg={4}>
            <div className="table-responsive g-0">
              <Table className=" mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold">Joining Date:</td>
                    <td className="fw-medium">june 15,2023</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Col lg={4}>
            <div className="table-responsive g-3">
              <Table className=" mb-0">
                <tbody>
                  <tr>
                    <td className="fw-bold">Total Trips:</td>
                    <td className="fw-medium">75 trip</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
          <Col lg={4}>
            <div className="table-responsive g-1">
              <Table className=" mb-4">
                <tbody>
                  <tr>
                    <td className="fw-bold">Payment Balance:</td>
                    <td className="fw-medium">975/2150 £</td>
                  </tr>
                </tbody>
              </Table>
            </div>
          </Col>
        </Row>
        <Row>
          <div className="hstack gap-5">
            <Button
              variant="soft-danger"
              className="btn-label"
              onClick={() => {
                tog_AddShippingModals();
              }}
            >
              <i className="bi bi-file-image label-icon align-middle fs-16 me-2"></i>{" "}
              Legal Card Image
            </Button>
            <Button variant="soft-success" className="btn-label">
              <i className="bi bi-file-image label-icon align-middle fs-16 me-2"></i>{" "}
              Legal Card Image
            </Button>
          </div>
        </Row>
      </Card.Body>
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
              file={`${process.env.REACT_APP_FILE_URL}/employeeFiles/${legalcard}`}
              onLoadSuccess={onDocumentLoadSuccess}
            >
              <Page pageNumber={1} />
            </Document>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
};

export default Profile;
