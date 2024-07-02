import React, { useState } from "react";
import {
  Container,
  Card,
  Accordion,
  Row,
  Col,
  Form,
  Tab,
  Nav,
  Button,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { GoogleApiWrapper, Map } from "google-maps-react";
import { Link, useLocation } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";

const options = [
  { value: "ForHandicap", label: "For Handicap" },
  { value: "Wifi", label: "Wifi" },
  { value: "WC", label: "WC" },
  { value: "AC", label: "AC" },
];

const LoadingContainer = () => <div>Loading...</div>;
const ProgramClone = (props: any) => {
  document.title = "Program | Company Administration";
  const [showAddStations, setShowAddStations] = useState<boolean>(false);

  function handle_ShowAddStations() {
    setShowAddStations(!showAddStations);
  }

  const [stops, setStops] = useState([{ id: 1 }]);

  const handleRemoveItemClick = (idToRemove: any) => {
    setStops((prevParents) =>
      prevParents.filter((stop) => stop.id !== idToRemove)
    );
  };

  const handleAddItemClick = () => {
    setStops((prevParents) => [...prevParents, { id: prevParents.length + 1 }]);
  };

  const [activeVerticalTab, setactiveVerticalTab] = useState<number>(1);
  const [selected, setSelected] = useState(["Wifi", "AC"]);
  const cloneLocation = useLocation();
  console.log(cloneLocation.state);
  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Program" pageTitle="Management" />
          <Card className="overflow-hidden">
            <Card.Header className="border-0">
              <div className="hstack gap-2 justify-content-end">
                <Button variant="success" id="add-btn" className="btn-sm">
                  Save & Send
                </Button>
                <Button variant="info" id="add-btn" className="btn-sm">
                  Quick Save
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="form-steps">
              <Card>
                <Card.Body className="form-steps">
                  <Form className="vertical-navs-step">
                    <Tab.Container activeKey={activeVerticalTab}>
                      <Row className="gy-5">
                        <Col lg={3}>
                          <Nav
                            as="div"
                            variant="pills"
                            className="nav flex-column custom-nav nav-pills"
                            role="tablist"
                            aria-orientation="vertical"
                          >
                            <Nav.Link
                              as="button"
                              className="nav-link done"
                              eventKey="1"
                              onClick={() => setactiveVerticalTab(1)}
                            >
                              <span className="step-title me-2">
                                <i className="ri-close-circle-fill step-icon me-2"></i>
                              </span>
                              Journey
                            </Nav.Link>
                            <Nav.Link
                              as="button"
                              className={
                                activeVerticalTab > 2
                                  ? "nav-link done"
                                  : "nav-link"
                              }
                              eventKey="2"
                              onClick={() => setactiveVerticalTab(2)}
                            >
                              <span className="step-title me-2">
                                <i className="ri-close-circle-fill step-icon me-2"></i>
                              </span>
                              Stops
                            </Nav.Link>
                            <Nav.Link
                              as="button"
                              className={
                                activeVerticalTab > 3
                                  ? "nav-link done"
                                  : "nav-link"
                              }
                              eventKey="3"
                              onClick={() => setactiveVerticalTab(3)}
                            >
                              <span className="step-title me-2">
                                <i className="ri-close-circle-fill step-icon me-2"></i>
                              </span>
                              Run Dates
                            </Nav.Link>
                            <Nav.Link
                              as="button"
                              className={
                                activeVerticalTab > 4
                                  ? "nav-link done"
                                  : "nav-link"
                              }
                              eventKey="4"
                              onClick={() => setactiveVerticalTab(4)}
                            >
                              <span className="step-title me-2">
                                <i className="ri-close-circle-fill step-icon me-2"></i>
                              </span>
                              Passengers
                            </Nav.Link>
                          </Nav>
                        </Col>
                        <Col lg={9}>
                          <div className="px-lg-4">
                            <Tab.Content>
                              <Tab.Pane eventKey="1">
                                <div>
                                  <Row>
                                    <Form.Label htmlFor="customerName-field">
                                      Name
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="customerName-field"
                                      required
                                      className="mb-2"
                                      name="Name"
                                      defaultValue={`Copy_${cloneLocation.state.Name}`}
                                    />
                                  </Row>
                                </div>
                                <div>
                                  <Row>
                                    <Col lg={6}>
                                      <div className="mb-3">
                                        <Form.Label htmlFor="customerName-field">
                                          Pickup
                                        </Form.Label>
                                        <Map
                                          google={props.google}
                                          zoom={13}
                                          style={{
                                            height: "200%",
                                            width: "95%",
                                          }}
                                          initialCenter={{
                                            lat: 52.5244734,
                                            lng: -1.9857876,
                                          }}
                                        ></Map>
                                      </div>
                                    </Col>
                                    <Col lg={6}>
                                      <div className="mb-3">
                                        <Form.Label htmlFor="customerName-field">
                                          Destination
                                        </Form.Label>
                                        <Map
                                          google={props.google}
                                          zoom={13}
                                          style={{
                                            height: "200%",
                                            width: "100%",
                                          }}
                                          initialCenter={{
                                            lat: 52.5244734,
                                            lng: -1.9857876,
                                          }}
                                        ></Map>
                                      </div>
                                    </Col>
                                  </Row>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="2">
                                <div>
                                  <h5>Stops</h5>
                                </div>
                                <div>
                                  {stops.map((stop, index) => (
                                    <Row>
                                      <Col lg={6} key={index}>
                                        <div className="mb-3">
                                          <Form.Label htmlFor="customerName-field">
                                            Stop {index + 1}
                                          </Form.Label>
                                          <Form.Control
                                            type="text"
                                            id="customerName-field"
                                            required
                                            className="mb-2"
                                            name="Stops"
                                          />
                                        </div>
                                      </Col>
                                      <Col lg={3}>
                                        <button
                                          type="button"
                                          className="btn btn-danger btn-icon"
                                          onClick={() =>
                                            handleRemoveItemClick(stop.id)
                                          }
                                          style={{ marginTop: "25px" }}
                                        >
                                          <i className="ri-delete-bin-5-line"></i>
                                        </button>
                                      </Col>
                                    </Row>
                                  ))}
                                  <Link
                                    to="#"
                                    id="add-item"
                                    className="btn btn-soft-secondary fw-medium"
                                    onClick={handleAddItemClick}
                                  >
                                    <i className="ri-add-fill me-1 align-bottom"></i>
                                  </Link>

                                  <hr className="my-4 text-muted" />
                                </div>
                                <div className="d-flex align-items-start gap-3 mt-4">
                                  <Button
                                    type="button"
                                    className="btn btn-light btn-label previestab"
                                    onClick={() => setactiveVerticalTab(1)}
                                  >
                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                                    Back to Journey
                                  </Button>
                                  <Button
                                    type="button"
                                    className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                    onClick={() => setactiveVerticalTab(3)}
                                  >
                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                    Go to Run Dates
                                  </Button>
                                </div>
                              </Tab.Pane>

                              <Tab.Pane eventKey="3">
                                <div>
                                  <h5>Run Dates</h5>
                                </div>
                                <Row>
                                  <Col lg={5}>
                                    <div className="mb-3">
                                      <Flatpickr
                                        className="form-control flatpickr-input"
                                        placeholder="Select Date"
                                        options={{
                                          dateFormat: "d M, Y",
                                        }}
                                        defaultValue={cloneLocation.state.From}
                                      />
                                    </div>
                                  </Col>
                                  <Col className="d-flex justify-content-center align-items-center">
                                    <h5>to</h5>
                                  </Col>
                                  <Col lg={5}>
                                    <div className="mb-3">
                                      <Flatpickr
                                        className="form-control flatpickr-input"
                                        placeholder="Select Date"
                                        options={{
                                          dateFormat: "d M, Y",
                                        }}
                                        defaultValue={cloneLocation.state.Date}
                                      />
                                    </div>
                                  </Col>
                                  <Col lg={5}>
                                    <Flatpickr
                                      className="form-control"
                                      options={{
                                        enableTime: true,
                                        noCalendar: true,
                                        dateFormat: "H:i",
                                        time_24hr: true,
                                      }}
                                      defaultValue={cloneLocation.state.Time}
                                    />
                                  </Col>
                                  <Col lg={2}></Col>
                                  <Col lg={5}>
                                    <div className="mb-3">
                                      <Form.Label htmlFor="supplierName-field">
                                        Days of week not running
                                      </Form.Label>
                                      <select
                                        className="form-select"
                                        multiple
                                        aria-label="multiple select example"
                                      >
                                        <option value="No Except">
                                          No Except
                                        </option>
                                        <option value="1">Monday</option>
                                        <option value="2">Tuesday</option>
                                        <option value="3">Wednesday</option>
                                        <option value="4">Thursday</option>
                                        <option value="5">Friday</option>
                                        <option value="6">Saturday</option>
                                        <option value="7">Sunday</option>
                                      </select>
                                    </div>
                                  </Col>
                                </Row>
                                <div className="d-flex align-items-start gap-3 mt-4">
                                  <Button
                                    type="button"
                                    className="btn btn-light btn-label previestab"
                                    onClick={() => setactiveVerticalTab(2)}
                                  >
                                    <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                                    Back to Stops
                                  </Button>
                                  <Button
                                    type="button"
                                    className="btn btn-success btn-label right ms-auto nexttab nexttab"
                                    onClick={() => setactiveVerticalTab(4)}
                                  >
                                    <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                    Passengers
                                  </Button>
                                </div>
                              </Tab.Pane>
                              <Tab.Pane eventKey="4">
                                <Row>
                                  <Col lg={4}>
                                    <div className="mb-3">
                                      <Form.Label htmlFor="customerName-field">
                                        Number of passengers
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        id="customerName-field"
                                        required
                                        className="mb-2"
                                        name="Pax"
                                        defaultValue={
                                          cloneLocation.state.PassengersNumber
                                        }
                                      />
                                    </div>
                                  </Col>
                                  <Col lg={8}>
                                    <div>
                                      <h5 className="fs-14 mb-1">Extra</h5>
                                      <p className="text-muted">
                                        Slide the selected option to the right{" "}
                                      </p>
                                      <DualListBox
                                        options={options}
                                        selected={selected}
                                        onChange={(e: any) => setSelected(e)}
                                        icons={{
                                          moveLeft: (
                                            <span
                                              className="mdi mdi-chevron-left"
                                              key="key"
                                            />
                                          ),
                                          moveAllLeft: [
                                            <span
                                              className="mdi mdi-chevron-double-left"
                                              key="key"
                                            />,
                                          ],
                                          moveRight: (
                                            <span
                                              className="mdi mdi-chevron-right"
                                              key="key"
                                            />
                                          ),
                                          moveAllRight: [
                                            <span
                                              className="mdi mdi-chevron-double-right"
                                              key="key"
                                            />,
                                          ],
                                          moveDown: (
                                            <span
                                              className="mdi mdi-chevron-down"
                                              key="key"
                                            />
                                          ),
                                          moveUp: (
                                            <span
                                              className="mdi mdi-chevron-up"
                                              key="key"
                                            />
                                          ),
                                          moveTop: (
                                            <span
                                              className="mdi mdi-chevron-double-up"
                                              key="key"
                                            />
                                          ),
                                          moveBottom: (
                                            <span
                                              className="mdi mdi-chevron-double-down"
                                              key="key"
                                            />
                                          ),
                                        }}
                                      />
                                    </div>
                                  </Col>
                                </Row>
                              </Tab.Pane>
                            </Tab.Content>
                          </div>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </Form>
                </Card.Body>
              </Card>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-center">
              <div className="hstack gap-2 justify-content-end">
                <Button variant="success" id="add-btn" className="btn-sm">
                  Save & Send
                </Button>
                <Button variant="info" id="add-btn" className="btn-sm">
                  Quick Save
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default GoogleApiWrapper({
  apiKey: "AIzaSyAbvyBxmMbFhrzP9Z8moyYr6dCr-pzjhBE",
  LoadingContainer: LoadingContainer,
  v: "3",
})(ProgramClone);
