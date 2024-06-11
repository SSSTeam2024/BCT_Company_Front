import React, { useMemo, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Offcanvas,
  Row,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import TableContainer from "Common/TableContainer";
import { shipments } from "Common/data";
import offerbanner from "../../../../assets/images/ecommerce/offer-banner.jpg";
import { transaction } from "Common/data";
import SimpleBar from "simplebar-react";
import { productDelivery } from "Common/data";
import { useAddNoteMutation } from "features/notes/notesSlice";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";
import { RootState } from '../../app/store'; 
import { selectCurrentUser } from '../../features/account/authSlice'; 
const Status = ({ status }: any) => {
  switch (status) {
    case "Successful":
      return <span className="badge badge-soft-success"> {status}</span>;
    case "Denied":
      return <span className="badge badge-soft-danger"> {status}</span>;
    case "Pending":
      return <span className="badge badge-soft-warning"> {status}</span>;
    default:
      return <span className="badge badge-soft-success"> Successful </span>;
  }
};

const ModalNote = () => {


  const user = useSelector((state: RootState) => selectCurrentUser(state));


  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<any>({});


  const [modal_Note, setmodal_Note] = useState<boolean>(false);
  function tog_ModalNotes() {
    setmodal_Note(!modal_Note);
  }

  const [addNote] = useAddNoteMutation();

  const [formData, setFormData] = useState({
    _id: "",
    title: "",
    message: "",
    id_corporate:user?._id!,
    pdf: "",
    pdfBase64String: "",
    pdfExtension: "",
    photo: "",
    photoBase64Strings: "",
    photoExtension: "",
  });
  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addNote(formData).then(() => setFormData(formData));
    notify();
    navigate("/dashboard");
  };

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Account has been created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  function convertToBase64(
    file: File
  ): Promise<{ base64Data: string; extension: string }> {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const base64String = fileReader.result as string;
        // const base64Data = base64String.split(",")[1]; // Extract only the Base64 data
        const [, base64Data] = base64String.split(","); // Extract only the Base64 data
        const extension = file.name.split(".").pop() ?? ""; // Get the file extension
        resolve({ base64Data, extension });
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
      fileReader.readAsDataURL(file);
    });
  }
 // PDF
 const handlePDFUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = (document.getElementById("pdfBase64String") as HTMLFormElement)
    .files[0];
  if (file) {
    const { base64Data, extension } = await convertToBase64(file);
    const newPDF = base64Data + "." + extension;
    console.log("pdfExtension", extension);
    setFormData({
      ...formData,
      pdf: newPDF,
      pdfBase64String: base64Data,
      pdfExtension: extension,
    });
  }
};
// Image
const handlePhotosUpload = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = (
    document.getElementById("photosBase64Strings") as HTMLFormElement
  ).files[0];
  if (file) {
    const { base64Data, extension } = await convertToBase64(file);
    const newPhotos = base64Data + "." + extension;
    console.log("photoExtension", extension);
    setFormData({
      ...formData,
      photo: newPhotos,
      photoBase64Strings: base64Data,
      photoExtension: extension,
    });
  }
};
  return (
    <React.Fragment>
        <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_Note}
            onHide={() => {
              tog_ModalNotes();
            }}
            centered
          ></Modal>
      <Row>
        {/* <div
          id="alert-error-msg"
          className="d-none alert alert-danger py-3"
        ></div> */}
        <Form className="tablelist-form" onSubmit={onSubmitNote}>
          <input type="hidden" id="id-field" />
          <Row>
            <Col lg={12}>
              <div className="mb-3">
                <Form.Label htmlFor="title">Title</Form.Label>
                <Form.Control
                  type="text"
                  id="title"
                  placeholder="Enter note title"
                  value={formData.title}
                  onChange={onChange}
                  required
                />
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <Form.Label htmlFor="message">Body Message</Form.Label>

                <textarea
                  // type="Message"
                  className="form-control"
                  rows={3}
                 id="message"
                  placeholder="Enter Body Message"
                  value={formData.message}
                  onChange={onChange}
                  required
                />
              </div>
            </Col>
           
          </Row>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="photosBase64Strings" className="form-label">
                  Images
                </label>
                <Form.Control
                  name="photosBase64Strings"
                  onChange={handlePhotosUpload}
                  type="file"
                  id="photosBase64Strings"
                  accept=".png, .jpeg, .jpg"
                  placeholder="Choose Images"
                  className="text-muted"
                  multiple
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="pdfBase64String" className="form-label">
                  PDF
                </label>
                <Form.Control
                  name="pdfBase64String"
                  onChange={handlePDFUpload}
                  type="file"
                  id="pdfBase64String"
                  accept=".pdf"
                  placeholder="Choose File"
                  className="text-muted"

                  // required
                />
              </div>
            </Col>
          </Row>
          <Col lg={12}>
              <div className="hstack gap-2 justify-content-end">
                <Button variant="primary" id="add-btn" type="submit">
                  Add Note
                </Button>
              </div>
            </Col>
        </Form>
      </Row>
    </React.Fragment>
  );
};

export default ModalNote;
