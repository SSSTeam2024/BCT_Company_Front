import React, { useEffect, useState } from "react";
import { Row, Card, Col, Tab, Form, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";

import Select from "react-select";

import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  useJsApiLoader,
} from "@react-google-maps/api";
import "./SelectionStudentStop.css";

import start_clicked from "../../../assets/images/start_clicked.png";
import start_unclicked from "../../../assets/images/start_unclicked.png";
import dest_clicked from "../../../assets/images/dest_clicked.png";
import dest_unclicked from "../../../assets/images/dest_unclicked.png";
import { useUpdateEmployeeStopsMutation } from "features/employees/employeesSlice";
import { useNavigate } from "react-router-dom";

import Swal from "sweetalert2";

const StopsManagement = () => {
  document.title = "Stops Management | Company Administration";

  const [activeVerticalTab, setactiveVerticalTab] = useState<number>(0);
  const navigate = useNavigate();

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const [clickedMarkerIndex, setClickedMarkerIndex] = useState(-2);

  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [selectedStop, setSelectedStop] = useState<any>(null);
  const [assignedPassengers, setAssignedPassengers] = useState<any[]>([]);

  const [selectedPassengers, setSelectedPassengers] = useState([]);
  const [disabledSubmit, setDisabledSubmit] = useState(true);
  const [totalStudentsNumber, setTotalStudentsNumber] = useState(0);
  const location = useLocation();
  const [updateEmployeesStops] = useUpdateEmployeeStopsMutation();

  let program = location.state;

  console.log("Program object", program);

  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBbORSZJBXcqDnY6BbMx_JSP0l_9HLQSkw",
    libraries: ["places"],
  });
  const [assignedStudents, setAssignedStudents] = useState([]);

  useEffect(() => {
    // Check if program object exists
    if (program) {
      // Assuming assigned students data is present in program object
      setAssignedStudents(program.assignedStudents); // Update assigned students state
    }
  }, [program]);
  useEffect(() => {
    if (isLoaded && program) {
      const directionsService = new google.maps.DirectionsService();
      const waypoints = program.stops.map((stop: any) => ({
        location: { query: stop.address.placeName }, // Use the address from autocomplete
        stopover: true,
      }));

      directionsService.route(
        {
          origin: program.origin_point.coordinates,
          destination: program.destination_point.coordinates,
          travelMode: google.maps.TravelMode.DRIVING,
          waypoints,
        },
        (result, status) => {
          if (result !== null && status === google.maps.DirectionsStatus.OK) {
            // console.log(result);
            setDirections(result);
            if (result.routes && result.routes.length > 0) {
              //console.log("Route drawn successfully");

              let newAssignments = [];
              let total = 0;

              for (let group of program.employees_groups) {
                total += group?.employees?.length;
                for (let employee of group.employees) {
                  if (employee.stop_point !== null) {
                    newAssignments.push({
                      employee: employee._id,
                      stop: employee.stop_point,
                    });
                  }
                }
              }
              setTotalStudentsNumber(total);
              setAssignedPassengers(newAssignments);
              if (newAssignments.length < total) {
                setDisabledSubmit(true);
              } else {
                setDisabledSubmit(false);
              }
            } else {
              console.error("No routes found in the directions result");
            }
          } else {
            console.error("Directions request failed due to " + status);
          }
        }
      );
    }
  }, [isLoaded, program]);

  if (loadError) {
    return <div>Error loading Google Maps API: {loadError.message}</div>;
  }

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  const handleMapLoad = (map: any) => {
    setMap(map);
  };

  const handleStopMarkerClick = (stop: any, index: any) => {
    setClickedMarkerIndex(index);
    setSelectedStop(stop.address);
  };

  const handleStartPointMarkerClick = () => {
    setClickedMarkerIndex(-1);
    let origin = {
      coordinates: {
        lat: String(program.origin_point.coordinates.lat),
        lng: String(program.origin_point.coordinates.lng),
      },
      placeName: program.origin_point.placeName,
    };
    setSelectedStop(origin);
  };

  const handleDestinationPointMarkerClick = () => {
    console.log("Clicked Destination", program.destination_point);
    setClickedMarkerIndex(program.stops.length);
    let dest = {
      coordinates: {
        lat: String(program.destination_point.coordinates.lat),
        lng: String(program.destination_point.coordinates.lng),
      },
      placeName: program.destination_point.placeName,
    };
    setSelectedStop(dest);
  };

  const handleGroupSelection = (group: any) => {
    // console.log("Selected group", group);
    setSelectedGroup(group);
    setSelectedStop(null);
    setClickedMarkerIndex(-2);
  };

  const handleAssignPassengers = (passengers: any) => {
    // console.log("Selected passengers", passengers);
    if (!selectedStop) return;
    const newAssignments = passengers.map((passenger: any) => ({
      employee: passenger.value,
      stop: selectedStop,
    }));
    // console.log("Selected newAssignments", newAssignments);
    setAssignedPassengers((prevAssignments: any) => [
      ...prevAssignments.filter(
        (a: any) => !passengers.some((p: any) => p.value === a.employee)
      ),
      ...newAssignments,
    ]);
    let oldFilteredAssignments = assignedPassengers.filter(
      (a: any) => !passengers.some((p: any) => p.value === a.employee)
    );
    console.log("assignedPassengers assign", oldFilteredAssignments);

    if (
      oldFilteredAssignments.length + newAssignments.length <
      totalStudentsNumber
    ) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  };

  const handleUnassignPassenger = (passenger: any) => {
    //  console.log("Selected unassign passenger", passenger);
    setAssignedPassengers((prevAssignments) =>
      prevAssignments.filter((a) => a.employee !== passenger._id)
    );
    let newAssignments = assignedPassengers.filter(
      (a: any) => a.employee !== passenger._id
    );

    console.log("assignedPassengers unassign", newAssignments);

    if (newAssignments.length < totalStudentsNumber) {
      setDisabledSubmit(true);
    } else {
      setDisabledSubmit(false);
    }
  };

  const isGroupFullyAssigned = (group: any) => {
    // console.log("isGroupFullyAssigned", group);
    return group.employees?.every((p: any) =>
      assignedPassengers.some((a: any) => a.employee === p._id)
    );
  };

  const filteredPassengers = selectedGroup
    ? selectedGroup.employees?.filter(
        (p: any) => !assignedPassengers.some((a) => a.employee === p._id)
      )
    : [];

  const passengerOptions = filteredPassengers.map((passenger: any) => ({
    value: passenger._id,
    label: passenger.firstName + passenger.lastName,
  }));

  const handleChange = (selectedOptions: any) => {
    // console.log("SelectedOptions", selectedOptions);
    setSelectedPassengers(selectedOptions || []);
  };

  const handleAssignClick = () => {
    // console.log("PassengerSelect js selectedPassengers", selectedPassengers);
    handleAssignPassengers(selectedPassengers);
    setSelectedPassengers([]);
  };

  // console.log("filteredPassengers", filteredPassengers);

  const filteredAssignments = selectedStop
    ? assignedPassengers.filter(
        (a) => a.stop.placeName === selectedStop.placeName
      )
    : [];

  console.log("filteredAssignments normal", filteredAssignments);

  console.log("assignedPassengers normal", assignedPassengers);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Employees successfully assigned to their stop points",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const onSubmitStudents = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      console.log("assignedPassengers api", assignedPassengers);
      let data = {
        employeeList: assignedPassengers,
      };
      updateEmployeesStops(data).then((result: any) => {
        console.log("Api result", result);

        notify();
        navigate("/programming/list-of-programs");
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <React.Fragment>
      <Row style={{ marginTop: "100px" }}>
        <Col xl={12}>
          <Card style={{ height: "70vh" }}>
            <Card.Body className="form-steps">
              <div className="vertical-navs-step">
                <Row className="gy-5">
                  <Col lg={2}>
                    <div>
                      <h5>Select a Group</h5>
                      <div style={{ maxHeight: "470px", overflowX: "auto" }}>
                        {program?.employees_groups!.map(
                          (group: any, index: any) => (
                            <div
                              style={{
                                cursor: "pointer",
                                marginTop: "20px",
                                fontWeight: "500",
                                padding: "7px",
                                borderRadius: "7px",

                                border: isGroupFullyAssigned(group)
                                  ? "none"
                                  : "1px solid #06d6a0",
                                backgroundColor:
                                  selectedGroup?.groupName === group.groupName
                                    ? "rgb(230, 230, 230)"
                                    : isGroupFullyAssigned(group)
                                    ? "#06d6a0"
                                    : "transparent",
                                color:
                                  selectedGroup?.groupName ===
                                    group.groupName &&
                                  isGroupFullyAssigned(group)
                                    ? "black"
                                    : isGroupFullyAssigned(group)
                                    ? "white"
                                    : "black",
                              }}
                              className={
                                selectedGroup?.groupName === group.groupName
                                  ? "selected_group"
                                  : "not_selected_group"
                              }
                              key={index}
                              onClick={() => handleGroupSelection(group)}
                            >
                              {isGroupFullyAssigned(group) ? (
                                <i className="bi bi-check-circle-fill fs-16 icon"></i>
                              ) : (
                                <i className="bi bi-hourglass-split text-warning fs-16 icon"></i>
                              )}
                              {group.groupName}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </Col>
                  <Col lg={10}>
                    <div className="px-lg-4">
                      <div>
                        <Row className="g-3">
                          <Col lg={6}>
                            <div style={{ height: "500px", width: "100%" }}>
                              <GoogleMap
                                mapContainerStyle={{
                                  height: "100%",
                                  width: "100%",
                                }}
                                zoom={8}
                                //center={{ lat: -34.397, lng: 150.644 }}
                                onLoad={handleMapLoad}
                              >
                                {directions && (
                                  <DirectionsRenderer
                                    directions={directions}
                                    options={{
                                      polylineOptions: {
                                        strokeColor: "red",
                                        strokeOpacity: 0.8,
                                        strokeWeight: 4,
                                      },
                                      suppressMarkers: true,
                                    }}
                                  />
                                )}
                                {clickedMarkerIndex === -1 ? (
                                  <Marker
                                    position={program.origin_point.coordinates}
                                    onClick={() =>
                                      handleStartPointMarkerClick()
                                    }
                                    icon={{
                                      url: start_clicked,
                                      scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                      ),
                                    }}
                                  />
                                ) : (
                                  <Marker
                                    position={program.origin_point.coordinates}
                                    onClick={() =>
                                      handleStartPointMarkerClick()
                                    }
                                    icon={{
                                      url: start_unclicked,
                                      scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                      ),
                                    }}
                                  />
                                )}

                                {program.stops.map((stop: any, index: any) => (
                                  <Marker
                                    key={index}
                                    position={{
                                      lat: Number(
                                        stop?.address?.coordinates?.lat
                                      ),
                                      lng: Number(
                                        stop?.address?.coordinates?.lng
                                      ),
                                    }}
                                    onClick={() =>
                                      handleStopMarkerClick(stop, index)
                                    }
                                    icon={{
                                      path: google.maps.SymbolPath.CIRCLE,
                                      fillColor:
                                        clickedMarkerIndex === index
                                          ? "#32CD32"
                                          : "#FF0000",
                                      fillOpacity: 1,
                                      strokeColor: "black",
                                      strokeWeight: 1,
                                      scale: 8,
                                    }}
                                  />
                                ))}

                                {clickedMarkerIndex === program.stops.length ? (
                                  <Marker
                                    position={
                                      program.destination_point.coordinates
                                    }
                                    onClick={() =>
                                      handleDestinationPointMarkerClick()
                                    }
                                    icon={{
                                      url: dest_clicked,
                                      scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                      ),
                                    }}
                                  />
                                ) : (
                                  <Marker
                                    position={
                                      program.destination_point.coordinates
                                    }
                                    onClick={() =>
                                      handleDestinationPointMarkerClick()
                                    }
                                    icon={{
                                      url: dest_unclicked,
                                      scaledSize: new window.google.maps.Size(
                                        40,
                                        40
                                      ),
                                    }}
                                  />
                                )}
                              </GoogleMap>
                            </div>
                          </Col>
                          <Col lg={6}>
                            <Tab.Container activeKey={activeVerticalTab}>
                              <Tab.Content>
                                <Tab.Pane eventKey={activeVerticalTab}>
                                  <div>
                                    <h5
                                      style={{
                                        textAlign: "center",
                                        marginBottom: "20px",
                                      }}
                                    >
                                      {selectedGroup?.groupName!}
                                    </h5>
                                  </div>
                                </Tab.Pane>
                              </Tab.Content>
                            </Tab.Container>
                            <div className="mb-3">
                              <Form.Label
                                htmlFor="choices-multiple-remove-button"
                                className="text-muted"
                                style={{ width: "100%" }}
                              >
                                {selectedStop && (
                                  <>
                                    <div>
                                      <div
                                        style={{
                                          marginBottom: "20px",
                                          fontSize: "1rem",
                                          color: "#000",
                                        }}
                                      >
                                        <strong>Stop point: </strong>
                                        {selectedStop.placeName}
                                      </div>
                                      <h5 style={{ marginBottom: "20px" }}>
                                        Select Passengers
                                      </h5>
                                      <Select
                                        isMulti
                                        options={passengerOptions}
                                        value={selectedPassengers}
                                        onChange={handleChange}
                                      />
                                      <Button
                                        style={{
                                          marginTop: "15px",
                                          marginBottom: "20px",
                                        }}
                                        className="btn btn-info btn-label rounded-pill"
                                        onClick={handleAssignClick}
                                      >
                                        <i className="ri-add-circle-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                        Assign to Stop
                                      </Button>
                                    </div>
                                    <div
                                      style={{
                                        maxHeight: "300px",
                                        overflowX: "auto",
                                      }}
                                    >
                                      <h5>Assigned Passengers</h5>
                                      <table width={"100%"}>
                                        {filteredAssignments.map(
                                          (assignment: any, index: any) => {
                                            const passenger =
                                              selectedGroup.employees.find(
                                                (p: any) =>
                                                  p._id === assignment.employee
                                              );
                                            if (!passenger) return null;
                                            return (
                                              <tr key={index}>
                                                <td>
                                                  {passenger.firstName +
                                                    passenger.lastName}
                                                </td>

                                                <td>
                                                  <Button
                                                    className="btn btn-danger btn-label rounded-pill"
                                                    style={{
                                                      marginBottom: "10px",
                                                    }}
                                                    onClick={() =>
                                                      handleUnassignPassenger(
                                                        passenger
                                                      )
                                                    }
                                                  >
                                                    <i className="ri-delete-bin-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                                    Unassign
                                                  </Button>
                                                </td>
                                              </tr>
                                            );
                                          }
                                        )}
                                      </table>
                                    </div>
                                  </>
                                )}
                              </Form.Label>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Form
          onSubmit={onSubmitStudents}
          className="d-flex justify-content-end"
        >
          <Button
            disabled={disabledSubmit}
            variant="success"
            type="submit"
            className="w-sm"
            style={{ marginRight: "20px" }}
          >
            Save Changes
          </Button>
        </Form>
      </Row>
    </React.Fragment>
  );
};
export default StopsManagement;
