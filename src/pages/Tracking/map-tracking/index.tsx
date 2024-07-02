import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Row,
  Tab,
  Nav,
  Form,
  Image,
  Dropdown,
  Table,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import {
  GoogleApiWrapper,
  Map,
  Marker,
  InfoWindow,
  Polyline,
} from "google-maps-react";
import logoDark from "assets/images/logo-dark.png";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { io } from "socket.io-client";
import coach from "../../../assets/images/coach.png";
import chauffeur from "../../../assets/images/chauffeur.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../../features/account/authSlice";
import Swal from "sweetalert2";
import axios from "axios";
// import './google-map.scss';

const LoadingContainer = () => <div>Loading...</div>;
const Maptracking = (props: any) => {
  document.title = "Tracking | Company Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  console.log("user id", user._id);

  const notify = (msg: string) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: msg,
      showConfirmButton: true,
      //timer: 2000,
    });
  };

  let path = [
    { lat: 52.53121397525478, lng: -2.0343799253369403 },
    { lat: 52.531403248085006, lng: -2.031837191253659 },
    { lat: 52.5311095485165, lng: -2.0271594188472855 },
  ];
  const [markers, setMarkers] = useState<any[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const URL = "${process.env.REACT_APP_BASE_URL}";
  const socket = io(URL);

  useEffect(() => {
    socket.on("live-tracking-companies-listening", (socketData: any) => {
      console.log("broadcasted trip", socketData);
      let tripExists = false;
      let counter = 0;

      let temparkers = [...markers];

      console.log([...markers]);

      for (let element of temparkers) {
        console.log("element", element);
        counter++;
        if (element.details.trip_details._id === socketData.trip_details._id) {
          console.log("tripExists");
          if (socketData.trip_details.progress === "completed") {
            notify(
              "Driver " +
                socketData.details.id_driver.firstname +
                " has completed this job"
            );
          } else {
            element.details.position = socketData.position;
            element.positions.push(socketData.position);
          }
          console.log("trip positions", socketData.position);
          setMarkers(temparkers);
          tripExists = true;
          break;
        }
      }

      if (counter === markers.length && tripExists === false) {
        console.log("tripNotExists");
        if (user._id === socketData.trip_details.company_id) {
          temparkers.push({
            details: socketData,
            positions: [socketData.position],
          });
          setMarkers(temparkers);
        }
      }

      console.log(temparkers);
      console.log(markers);
    });

    // Clean up function to remove event listener when component unmounts
    return () => {
      socket.disconnect(); // Disconnect the socket connection
    };
  }, [markers]);

  const drawPolyline = async (positions?: any) => {
    console.log("Positions to be snapped", positions);

    let array = positions
      .map((position: any) => `${position.lat},${position.lng}`)
      .join("|");

    console.log("To Be snapped array", array);

    try {
      const requestUrl = `https://roads.googleapis.com/v1/snapToRoads?path=${array}&key=${"AIzaSyBbORSZJBXcqDnY6BbMx_JSP0l_9HLQSkw"}&interpolate=true`;

      console.log("Request URL:", requestUrl);

      const response: any = await axios.get(requestUrl);

      if (response) {
        console.log("Response", response);
        const snappedPoints = response.snappedPoints.map((point: any) => ({
          lat: point.location.latitude,
          lng: point.location.longitude,
        }));
        setRouteCoordinates(snappedPoints);
      }
    } catch (error) {
      console.error("Error snapping to road:", error);
    }

    //////////////////////////////////////////////////////////////////////////////////////////////

    // //? Polyline Solution
    // //?setRouteCoordinates(positions);

    // //? Directions Service Route Solution
    // //TODO: Construct an array of arrays where each sub array contains 27 point positions
    // //TODO : 1 for origin, 1 for destination, 25 for waypoints array

    // let segmentsContainer: any[][] = [];

    // for (let i = 0; i < positions.length; i += 27) {
    //   const subArray: string[] = positions.slice(i, i + 27);
    //   segmentsContainer.push(subArray);
    // }

    // console.log("segmentsContainer", segmentsContainer);

    // let temp_routes = [];

    // for (let i = 1; i < segmentsContainer.length; i++) {
    //   let waypts = [];
    //   let segment = segmentsContainer[i];
    //   console.log("segment", segment);
    //   for (let j = 1; j < segment.length - 1; j++) {
    //     waypts.push({
    //       location: segment[j],
    //     });
    //   }
    //   console.log(waypts);
    //   let result = drawRoute(segment[0], segment[segment.length - 1], waypts);

    //   temp_routes.push(result);
    // }
    // setRouteCoordinates(temp_routes);
  };

  const drawRoute = (fromPosition: any, toPosition: any, waypts: any) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: fromPosition,
        destination: toPosition,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypts, //[
        //   {
        //     location: {
        //       lat: 52.531403248085006,
        //       lng: -2.031837191253659
        //     },
        //   },
        // ],
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          let route = result!.routes[0].overview_path.map((point) => {
            return { lat: point.lat(), lng: point.lng() };
          });
          return route;
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  };

  const [navList, setNavList] = useState(150);
  function openMap() {
    setNavList(50);
  }

  function closeMap() {
    setNavList(150);
  }

  const columns = [
    {
      name: <span className="font-weight-bold fs-13">Quote ID</span>,
      selector: (row: any) => row.srNo,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row: any) => row.FixHeadId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Collection</span>,
      selector: (row: any) => <Link to="#!">{row.title}</Link>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      selector: (row: any) => row.user,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Price</span>,
      selector: (row: any) => row.purchaseId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.assigned,
      sortable: true,
    },
  ];

  const columns2 = [
    {
      name: <span className="font-weight-bold fs-13">Quote ID</span>,
      selector: (row: any) => row.srNo,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Name</span>,
      selector: (row: any) => row.FixHeadId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Collection</span>,
      selector: (row: any) => row.title,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Destination</span>,
      selector: (row: any) => row.user,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Price</span>,
      selector: (row: any) => row.purchaseId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Date</span>,
      selector: (row: any) => row.assigned,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Action</span>,
      sortable: true,
      selector: (cell: any) => {
        return (
          <ul className="hstack gap-2 list-unstyled mb-0">
            <li>
              <Link
                to="#"
                className="badge badge-soft-success edit-item-btn"
                onClick={() => openMap()}
              >
                <i className="ri-map-2-line" title="Map View"></i>
              </Link>
            </li>
          </ul>
        );
      },
    },
  ];

  const columns1 = [
    {
      name: <span className="font-weight-bold fs-13">Account</span>,
      selector: (row: any) => row.srNo,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Pay Date</span>,
      selector: (row: any) => row.FixHeadId,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Pay Method</span>,
      selector: (row: any) => <Link to="#!">{row.title}</Link>,
      sortable: true,
    },
    {
      name: <span className="font-weight-bold fs-13">Amount</span>,
      selector: (row: any) => row.user,
      sortable: true,
    },
  ];

  const data = [
    {
      srNo: "86929",
      FixHeadId: "Nicole Wojtynia",
      purchaseId: "£195.00",
      title: "Paget Primary School, 110 Paget Rd",
      user: "Birmingham B24 0JP",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Joseph Parker",
      createDate: "03 Oct, 2021",
      status: "Re-open",
      priority: "High",
    },
    {
      srNo: "86930",
      FixHeadId: "Nicole Wojtynia",
      purchaseId: "£195.00",
      title: "Paget Primary School, 110 Paget Rd",
      user: "Birmingham B24 0JP",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Mary Rucker",
      createDate: "05 Oct, 2021",
      status: "On-Hold",
      priority: "Medium",
    },
    {
      srNo: "86931",
      FixHeadId: "Nicole Wojtynia",
      purchaseId: "£195.00",
      title: "Paget Primary School, 110 Paget Rd",
      user: "Birmingham B24 0JP",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Tonya Noble",
      createDate: "27 April, 2022",
      status: "Closed",
      priority: "Low",
    },
  ];
  const data2 = [
    {
      srNo: "86929",
      FixHeadId: "Nicole Wojtynia",
      purchaseId: "£195.00",
      title: "Paget Primary School, 110 Paget Rd",
      user: "Birmingham B24 0JP",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Joseph Parker",
      createDate: "03 Oct, 2021",
      status: "Re-open",
      priority: "High",
    },
    {
      srNo: "86930",
      FixHeadId: "Nicole Wojtynia",
      purchaseId: "£195.00",
      title: "Paget Primary School, 110 Paget Rd",
      user: "Birmingham B24 0JP",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Mary Rucker",
      createDate: "05 Oct, 2021",
      status: "On-Hold",
      priority: "Medium",
    },
    {
      srNo: "86931",
      FixHeadId: "Nicole Wojtynia",
      purchaseId: "£195.00",
      title: "Paget Primary School, 110 Paget Rd",
      user: "Birmingham B24 0JP",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Tonya Noble",
      createDate: "27 April, 2022",
      status: "Closed",
      priority: "Low",
    },
  ];
  const data1 = [
    {
      srNo: "Priya Naker",
      FixHeadId: "06-03-2023",
      title: "Bank Transfert",
      user: "£4,620.00",
      assigned: "2023-10-02 12:30:00",
      createdBy: "Joseph Parker",
      createDate: "03 Oct, 2021",
      status: "Re-open",
      priority: "High",
    },
  ];

  const [activeVerticalTab, setactiveVerticalTab] = useState<number>(1);
  const [isHovered, setHover] = useState(false);
  const [navWidth, setNavWidth] = useState(150);
  function openNav() {
    setNavWidth(100);
  }

  function closeNav() {
    setNavWidth(150);
  }

  const [changeColor, setChangeColor] = useState<boolean>(false);

  // function for handleClick
  const handleClick = () => {
    setChangeColor(!changeColor);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <div className="d-flex justify-content-end">
            <button
              onClick={handleClick}
              type="button"
              className={`btn btn-darken-success custom-toggle btn-sm mb-1 ${
                changeColor === false ? "btn-darken-success" : "btn-darken-info"
              }`}
              data-bs-toggle="button"
            >
              <span className="icon-on">
                <i
                  className={`${
                    changeColor === false
                      ? "ri-road-map-line align-bottom me-1"
                      : "ri-table-2 align-bottom me-1"
                  }`}
                ></i>
                {changeColor === false ? "Map" : "List"}
              </span>
            </button>
            <button onClick={drawPolyline}>Draw Route</button>
          </div>

          <Row>
            {changeColor === false ? (
              <Col lg={8}>
                <Row>
                  <Col lg={12}>
                    <div className="card-body">
                      <div
                        id="gmaps-types"
                        className="gmaps"
                        style={{ position: "relative" }}
                      >
                        <Map
                          google={props.google}
                          zoom={13}
                          style={{ height: "200%", width: `${navWidth}%` }}
                          initialCenter={{ lat: 52.5244734, lng: -1.9857876 }}
                        >
                          {console.log("markers", markers)}
                          {markers.map((marker, index) => (
                            <InfoWindow
                              key={index}
                              position={{
                                lat: marker.details.position.lat,
                                lng: marker.details.position.lng,
                              }} // Use the position of the first marker
                              visible={true}
                              pixelOffset={{ width: 0, height: -35 }}
                            >
                              <div style={{ textAlign: "center" }}>
                                <img
                                  src={chauffeur}
                                  alt=""
                                  style={{ width: "25px" }}
                                />
                                <span>
                                  {" "}
                                  {
                                    marker.details.trip_details.id_driver
                                      .firstname
                                  }
                                </span>
                                <br />

                                <span>
                                  {marker.details.trip_details.id_vehicle.model}
                                </span>
                              </div>
                            </InfoWindow>
                          ))}
                          {markers.map((marker, index) => (
                            <Marker
                              key={index}
                              position={{
                                lat: marker.details.position.lat,
                                lng: marker.details.position.lng,
                              }}
                              icon={{
                                url: coach,
                                scaledSize: new window.google.maps.Size(35, 35), // Adjust the size of the icon
                              }}
                              onClick={() => {
                                drawPolyline(marker.positions);
                              }}
                            />
                          ))}
                          <Polyline
                            path={routeCoordinates}
                            strokeColor="#FF1493"
                            strokeOpacity={0.7}
                            strokeWeight={7}
                          />
                        </Map>
                        {navWidth === 100 ? (
                          <button
                            type="button"
                            className="btn btn-danger btn-icon"
                            onClick={() => closeNav()}
                          >
                            <i className="ri-close-line"></i>
                          </button>
                        ) : (
                          ""
                        )}
                      </div>
                      {isHovered && (
                        <Dropdown
                          style={{
                            position: "absolute",
                            top: "5px",
                            right: "-365px",
                          }}
                        >
                          <Dropdown.Toggle
                            className="btn-icon btn btn-warning arrow-none btn-sm w-sm"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                          >
                            <i className="ri-equalizer-line"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu as="ul">
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-users-four align-middle"></i>{" "}
                                All Clients
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-check-circle align-middle"></i>{" "}
                                All Status
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-clock-afternoon align-middle"></i>{" "}
                                Delayed
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-arrow-clockwise align-middle"></i>{" "}
                                Changing
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-map-pin align-middle"></i>{" "}
                                On Site
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-thumbs-up align-middle"></i>{" "}
                                Normal
                              </Link>
                            </li>
                            <li>
                              <Link className="dropdown-item" to="#">
                                <i className="ph ph-checks align-middle"></i>{" "}
                                Compeleted
                              </Link>
                            </li>
                          </Dropdown.Menu>
                        </Dropdown>
                      )}
                    </div>
                  </Col>
                </Row>
              </Col>
            ) : (
              <div style={{ height: "200%", width: `${navList}%` }}>
                {" "}
                <DataTable columns={columns2} data={data2} pagination />
              </div>
            )}
            {navList === 50 ? (
              <Col lg={4}>
                <Row>
                  <Col lg={12}>
                    <div
                      className="card-body"
                      onMouseOver={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                    >
                      <div
                        id="gmaps-types"
                        className="gmaps"
                        style={{ position: "relative" }}
                      >
                        <Map
                          google={props.google}
                          zoom={13}
                          style={{ height: "118%", width: "160%" }}
                          initialCenter={{ lat: 52.5244734, lng: -1.9857876 }}
                        >
                          <Marker
                            position={{ lat: 52.5471571, lng: -1.9042587 }}
                          />
                        </Map>
                        <button
                          type="button"
                          className="btn btn-danger btn-icon"
                          onClick={() => closeMap()}
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            ) : (
              ""
            )}
            {navWidth === 100 ? (
              <Col xl={4}>
                <Card style={{ height: "110%" }}>
                  <Card.Header>
                    <h3>Trip: 89089</h3>
                  </Card.Header>
                  <Card.Body>
                    <Card>
                      <Card.Body>
                        <Tab.Container defaultActiveKey="home1">
                          <Nav
                            as="ul"
                            variant="pills"
                            className="nav-pills-custom nav-success mb-3 "
                          >
                            <Nav.Item as="li">
                              <Nav.Link eventKey="home1">General</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                              <Nav.Link eventKey="profile1">History</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                              <Nav.Link eventKey="messages1">Payment</Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li">
                              <Nav.Link eventKey="settings1">Contract</Nav.Link>
                            </Nav.Item>
                          </Nav>
                          <Tab.Content className="text-muted">
                            <Tab.Pane eventKey="home1">
                              <Table className="table-borderless table-sm mb-0">
                                <tbody>
                                  <tr className="fw-bold">
                                    <td>Driver:</td>
                                    <td className="fw-medium">Andrew</td>
                                  </tr>
                                  <tr className="fw-bold">
                                    <td>Vehicle</td>
                                    <td className="fw-medium">415-778-3654</td>
                                  </tr>
                                  <tr className="fw-bold">
                                    <td>Vehicle Type</td>
                                    <td className="fw-medium">
                                      10-16 Seat Standard Minibus
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">PickUp</td>
                                    <td className="fw-medium">
                                      Paget Primary School, 110 Paget Rd
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">Destination</td>
                                    <td className="fw-medium">
                                      Birmingham B24 0JP
                                    </td>
                                  </tr>
                                  <tr className="fw-bold">
                                    <td>Arrival Date</td>
                                    <td className="fw-medium">
                                      2023-12-13 17:30:00
                                    </td>
                                  </tr>
                                  <tr className="fw-bold">
                                    <td>Customer Name</td>
                                    <td className="fw-medium">
                                      Nicole Wojtynia
                                    </td>
                                  </tr>
                                  <tr className="fw-bold">
                                    <td>Status</td>
                                    <td className="fw-medium">On road</td>
                                  </tr>
                                </tbody>
                              </Table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="profile1">
                              <DataTable
                                columns={columns}
                                data={data}
                                // pagination
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="messages1">
                              <DataTable
                                columns={columns1}
                                data={data1}
                                // pagination
                              />
                            </Tab.Pane>
                            <Tab.Pane eventKey="settings1">
                              <div className="d-flex mt-2">
                                <div className="flex-shrink-0">
                                  <i className="ri-checkbox-circle-fill text-success"></i>
                                </div>
                                <div className="flex-grow-1 ms-2">Contract</div>
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Tab.Container>
                      </Card.Body>
                    </Card>
                  </Card.Body>
                </Card>
              </Col>
            ) : (
              ""
            )}
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default GoogleApiWrapper({
  apiKey: "AIzaSyBbORSZJBXcqDnY6BbMx_JSP0l_9HLQSkw",
  LoadingContainer: LoadingContainer,
  v: "3",
})(Maptracking);
