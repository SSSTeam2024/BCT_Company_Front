import React, { useEffect, useState } from "react";
import {
  Card,
  Col,
  Container,
  Row,
  Tab,
  Nav,
  Dropdown,
  Table,
} from "react-bootstrap";
import {
  GoogleApiWrapper,
  Map,
  Marker,
  InfoWindow,
  Polyline,
} from "google-maps-react";
import { Link } from "react-router-dom";
import DataTable from "react-data-table-component";
import { io } from "socket.io-client";
import coach from "../../../assets/images/coach.png";
import chauffeur from "../../../assets/images/chauffeur.png";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store";
import { selectCurrentUser } from "../../../features/account/authSlice";
import Swal from "sweetalert2";
import axios from "axios";

const LoadingContainer = () => <div>Loading...</div>;
const Maptracking = (props: any) => {
  document.title = "Live Tracking | Company Administration";
  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const notify = (msg: string) => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: msg,
      showConfirmButton: true,
      //timer: 2000,
    });
  };

  const [markers, setMarkers] = useState<any[]>([]);
  const [routeCoordinates, setRouteCoordinates] = useState<any[]>([]);
  const URL = "http://57.128.184.217:3000"; // localhost  //57.128.184.217
  const socket = io(URL);

  useEffect(() => {
    //socket.emit("join", user.name);
    socket.on("live-tracking-companies-listening", (socketData: any) => {
      let tripExists = false;
      let counter = 0;
      let temparkers = [...markers];
      for (let element of temparkers) {
        counter++;
        if (element.details.details.id === socketData.details.id) {
          if (socketData.details.progress === "Completed") {
            notify(
              "Driver " + socketData.details.driver + " has completed this job"
            );
          } else {
            element.details.position = socketData.position;
            element.positions.push(socketData.position);
          }
          setMarkers(temparkers);
          tripExists = true;
          break;
        }
      }

      if (counter === markers.length && tripExists === false) {
        if (user._id === socketData.details.companyId._id) {
          temparkers.push({
            details: socketData,
            positions: [socketData.position],
          });
          setMarkers(temparkers);
        }
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [markers]);

  let trips_with_delays = markers.filter(
    (quote) => quote.details.details.withDelay !== undefined
  );

  const drawPolyline = async (positions?: any) => {
    let array = positions
      .map((position: any) => `${position.lat},${position.lng}`)
      .join("|");

    try {
      const requestUrl = `https://roads.googleapis.com/v1/snapToRoads?path=${array}&key=${"AIzaSyBbORSZJBXcqDnY6BbMx_JSP0l_9HLQSkw"}&interpolate=true`;

      const response: any = await axios.get(requestUrl);

      if (response) {
        const snappedPoints = response.snappedPoints.map((point: any) => ({
          lat: point.location.latitude,
          lng: point.location.longitude,
        }));
        setRouteCoordinates(snappedPoints);
      }
    } catch (error) {
      console.error("Error snapping to road:", error);
    }
  };

  const drawRoute = (fromPosition: any, toPosition: any, waypts: any) => {
    const directionsService = new google.maps.DirectionsService();

    directionsService.route(
      {
        origin: fromPosition,
        destination: toPosition,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypts,
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Card>
            <Row className="p-1">
              <Col lg={3} className="hstack gap-1">
                <span className="fw-medium">{markers.length}</span>
                <span className="fw-bold">Current Trips</span>
              </Col>
              <Col lg={3} className="hstack gap-1">
                <span className="fw-medium">{trips_with_delays.length}</span>
                <span className="fw-bold">With Delay</span>
              </Col>
            </Row>
          </Card>
          <Row>
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
                        style={{ height: "200%", width: `150%` }}
                        initialCenter={{ lat: 52.5244734, lng: -1.9857876 }}
                      >
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
                              <span> {marker.details.details.driver}</span>
                              <br />

                              <span>
                                {
                                  marker.details.details.vehicle
                                    .registration_number
                                }
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
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
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
