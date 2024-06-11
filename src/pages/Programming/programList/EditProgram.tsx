import React, { useState } from "react";
import {
  Container,
  Row,
  Card,
  Col,
  Modal
} from "react-bootstrap";
import DataTable from "react-data-table-component";
import Breadcrumb from "Common/BreadCrumb";
import Flatpickr from "react-flatpickr";
import { Link, useLocation } from "react-router-dom";
import { GoogleApiWrapper, Map, Marker } from "google-maps-react";

const LoadingContainer = () => <div>Loading...</div>;
const EditProgram = () => {
  document.title = "Edit Program | Bouden Coach Travel";
  const [modal_Pickup, setmodal_Pickup] = useState<boolean>(false);
  function tog_Pickup() {
    setmodal_Pickup(!modal_Pickup);
  }
  const [modal_Destination, setmodal_Destination] = useState<boolean>(false);
  function tog_Destination() {
    setmodal_Destination(!modal_Destination);
  }
  const editLocation = useLocation()

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Col lg={12}>
            <Card>
              <Card.Body>
               <h1>{editLocation.state.Name}</h1>
              </Card.Body>
            </Card>
          </Col>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default EditProgram;