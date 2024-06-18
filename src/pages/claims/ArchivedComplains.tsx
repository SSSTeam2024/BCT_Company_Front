import React, { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Table,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import Swal from "sweetalert2";
import {
  useAddComplainMutation,
  useDeleteComplainMutation,
  useFetchComplainQuery,
  useUpdateComplainResponseMutation,
  Complain,
  useUpdateComplainToPushedMutation,
  useUpdateComplainToArchivedMutation,
  useFetchComplainByCompanyQuery,
} from "features/complains/complainSlice";
import { pdfjs } from "react-pdf";
import { Document, Page } from "react-pdf";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { selectCurrentUser } from "../../features/account/authSlice";

const paragraphStyles = {
  WebkitLineClamp: 2,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
  display: "-webkit-box",
};

const ArchivedComplains = () => {
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
  document.title = "Complains | Bouden Coach Travel";
  const user = useSelector((state: RootState) => selectCurrentUser(state));
  const { data } = useFetchComplainByCompanyQuery({ id_corporate: user?._id! });

  // Type assertion to inform TypeScript about the shape of `data`
  const complains: Complain[] = (data as any)?.getComplainByIdCompany || [];
  console.log(complains);

  // const { data = [] } = useFetchComplainQuery();
  // console.log(data);
  const [sendResponse] = useUpdateComplainResponseMutation();
  const [addComplain] = useAddComplainMutation();
  const [deleteComplain] = useDeleteComplainMutation();

  const Navigate = useNavigate();

  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>("");
  console.log(selectedComplaintId);
  // const [selectedFiles, setselectedFiles] = useState([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const handleDateChange = (selectedDates: Date[]) => {
    // Assuming you only need the first selected date
    setSelectedDate(selectedDates[0]);
  };
  // Add New Complain
  const [modal_AddComplainModals, setmodal_AddComplainModals] =
    useState<boolean>(false);
  function tog_AddComplainModals() {
    setmodal_AddComplainModals(!modal_AddComplainModals);
  }

  const [formData, setFormData] = useState({
    _id: "",
    responseMessage: "",
    id_corporate: "",
    id_student: "",
    id_parent: "",
    subject: "",
    description: "",
    complainDate: "",
    responseAuthor: "",
    responseDate: "",
    status: "",
    archived: "",
    pdf: "",
    pdfBase64String: "",
    pdfExtension: "",
    photo: "",
    photoBase64Strings: "",
    photoExtension: "",
    video: "",
    videoBase64Strings: "",
    videoExtension: "",
    createdAt: "",
    updatedAt: "",
    resPhoto: "",
    resVideo: "",
    resPhotoBase64Strings: "",
    resVideoBase64Strings: "",
    ResPhotoExtension: "",
    ResVideoExtension: "",
  });

  useEffect(() => {
    if (selectedComplaintId) {
      // Find the complaint object with the selected _id from the data array
      const selectedComplaint = complains.find(
        (complaint) => complaint._id === selectedComplaintId
      );

      // Update the formData state with the selected _id
      setFormData((prevState) => ({
        ...prevState,
        _id: selectedComplaint ? selectedComplaint._id : "",
      }));
    }
  }, [selectedComplaintId, data]);
  const initialResState = {
    _id: "",
    responseMessage: "",
    id_corporate: "",
    id_student: "",
    id_parent: "",
    subject: "",
    description: "",
    complainDate: "",
    responseAuthor: "",
    responseDate: "",
    status: "",
    archived: "",
    pdf: "",
    pdfBase64String: "",
    pdfExtension: "",
    photo: "",
    photoBase64Strings: "",
    photoExtension: "",
    video: "",
    videoBase64Strings: "",
    videoExtension: "",
    createdAt: "",
    updatedAt: "",
    resPhoto: "",
    resVideo: "",
    resPhotoBase64Strings: "",
    resVideoBase64Strings: "",
    ResPhotoExtension: "",
    ResVideoExtension: "",
  };
  const [resData, setResData] = useState(initialResState);

  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Your response has been sent",
      showConfirmButton: false,
      timer: 2000,
    });
  };
  const swalWithBootstrapButtons = Swal.mixin({
    customClass: {
      confirmButton: "btn btn-success",
      cancelButton: "btn btn-danger",
    },
    buttonsStyling: false,
  });

  const deleteClaim = async (_id: any) => {
    swalWithBootstrapButtons
      .fire({
        title: "Are you sure?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "cancel",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteComplain(_id);
          swalWithBootstrapButtons.fire({
            title: "Deleted",
            icon: "success",
          });
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            text: "Your complain is safe :)",
            icon: "error",
          });
        }
      });
  };

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showReadMoreButton, setShowReadMoreButton] = useState<boolean>(false);

  const ref = useRef<HTMLParagraphElement | null>(null);

  const [openPdfModal, setOpenPdfModal] = useState<boolean>(false);
  const [selectedPdf, setSelectedPdf] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [selectedVideo, setSelectedVideo] = useState<string>("");
  const [selectedResPhoto, setSelectedResPhoto] = useState<string>("");
  const [selectedResVideo, setSelectedResVideo] = useState<string>("");

  const [modal_AddPdfModals, setmodal_AddPdfModals] = useState<boolean>(false);
  function tog_AddPdfModals() {
    setmodal_AddPdfModals(!modal_AddPdfModals);
  }

  if (pdfjs.GlobalWorkerOptions) {
    pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;
  }

  //pdf viewer

  const [numPages, setNumPages] = useState<number | null>(null);

  const [showPdf, setShowPdf] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [resPhotoUrl, setResPhotoUrl] = useState<string>("");
  const [resVideoUrl, setResVideoUrl] = useState<string>("");
  useEffect(() => {
    if (pdfUrl !== "") {
      window.open(pdfUrl);
    }
  }, [pdfUrl]);

  useEffect(() => {
    if (photoUrl !== "") {
      window.open(photoUrl);
    }
  }, [photoUrl]);

  useEffect(() => {
    if (videoUrl !== "") {
      window.open(videoUrl);
    }
  }, [videoUrl]);

  useEffect(() => {
    if (resVideoUrl !== "") {
      window.open(resVideoUrl);
    }
  }, [resVideoUrl]);
  useEffect(() => {
    if (resPhotoUrl !== "") {
      window.open(resPhotoUrl);
    }
  }, [resPhotoUrl]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const openPdfInNewTab = (PDF: string) => {
    setSelectedPdf(PDF);
    setPdfUrl(`${process.env.REACT_APP_FILE_URL}/complainFiles/pdf/${PDF}`);
  };
  const openPhotoInNewTab = (PHOTO: string) => {
    setSelectedPhoto(PHOTO);
    setPhotoUrl(
      `${process.env.REACT_APP_FILE_URL}/complainFiles/photos/${PHOTO}`
    );
  };
  const openVideoInNewTab = (VIDEO: string) => {
    setSelectedVideo(VIDEO);
    setVideoUrl(
      `${process.env.REACT_APP_FILE_URL}/complainFiles/videos/${VIDEO}`
    );
  };
  const openResVideoInNewTab = (resVIDEO: string) => {
    setSelectedResVideo(resVIDEO);
    setResVideoUrl(
      `${process.env.REACT_APP_FILE_URL}/complainFiles/resVideos/${resVIDEO}`
    );
  };
  const openResPhotoInNewTab = (resPHOTO: string) => {
    setSelectedResPhoto(resPHOTO);
    setResPhotoUrl(
      `${process.env.REACT_APP_FILE_URL}/complainFiles/resPhotos/${resPHOTO}`
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Archived Complains" pageTitle="Feedback&Claims" />

          <Row>
            <div className="col-12">
              <Row>
                {complains.map((complaint: Complain) => (
                  <Col xxl={4} key={complaint._id}>
                    {complaint.archived === "yes" ? (
                      <Card>
                        <Card.Header>
                          <>
                            <Button
                              type="button"
                              className="btn btn-danger btn-icon float-end m-1"
                              onClick={() => deleteClaim(complaint._id)}
                            >
                              <i className="ri-delete-bin-5-line"></i>
                            </Button>
                          </>
                          {complaint.id_corporate === "" ? (
                            <>
                              <h5 className="card-title mb-0">
                                <img
                                  src={`${
                                    process.env.REACT_APP_FILE_URL
                                  }/employeeFiles/${complaint?.id_employee
                                    ?.photos!}`}
                                  alt=""
                                  className="rounded-5 avatar-sm"
                                />{" "}
                                {complaint?.id_employee?.firstName!}{" "}
                                {complaint?.id_employee?.lastName!}
                              </h5>
                              <h6 className="text-muted mt-1">
                                {complaint?.id_employee?.email!}
                              </h6>
                              <h6 className="text-muted mt-1">
                                {complaint?.id_employee?.mobile!}
                              </h6>
                            </>
                          ) : (
                            <>
                              <h5 className="card-title mb-0">
                                <img
                                  src={`${process.env.REACT_APP_FILE_URL}/companyFiles/logoFiles/${user.logo_file}`}
                                  alt=""
                                  className="rounded-5 avatar-sm"
                                />{" "}
                                {user.account_name}
                              </h5>
                              <h6 className="text-muted mt-1">{user.email}</h6>
                              <h6 className="text-muted mt-1">{user.phone}</h6>
                            </>
                          )}
                        </Card.Header>
                        <Card.Body key={complaint._id}>
                          <div
                            className="card-text d-flex"
                            style={isOpen ? undefined : paragraphStyles}
                            ref={ref}
                          >
                            <div className="table-responsive">
                              <Table className="table-borderless table-sm mb-0">
                                <tbody>
                                  <tr>
                                    <td className="fw-bold">Subject</td>
                                    <td className="fw-medium">
                                      {complaint.subject}
                                    </td>
                                  </tr>
                                  <tr>
                                    <td className="fw-bold">Description</td>
                                    <td className="fw-medium">
                                      {complaint.description}
                                    </td>
                                  </tr>
                                  <tr className="fw-bold">
                                    <td> Date:</td>
                                    <td className="fw-medium">
                                      {complaint.complainDate}
                                    </td>
                                  </tr>
                                  {complaint.status === "answered" ? (
                                    <tr className="fw-bold">
                                      <td> Response Message:</td>
                                      <td className="fw-medium">
                                        {complaint.responseMessage}
                                      </td>
                                      <td>
                                        {complaint?.resPhoto!.slice(44) ===
                                        "" ? (
                                          ""
                                        ) : (
                                          <button
                                            type="button"
                                            className="btn btn-primary position-relative p-1 avatar-xs rounded"
                                            onClick={() =>
                                              openResPhotoInNewTab(
                                                complaint?.resPhoto
                                              )
                                            }
                                          >
                                            <span className="avatar-title bg-transparent">
                                              <i className="bi bi-file-earmark-image"></i>
                                            </span>
                                            <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1"></span>
                                          </button>
                                        )}
                                        {complaint?.resVideo!.slice(44) ===
                                        "" ? (
                                          ""
                                        ) : (
                                          <button
                                            type="button"
                                            className="btn btn-success position-relative p-1 m-1 avatar-xs rounded"
                                            onClick={() =>
                                              openResVideoInNewTab(
                                                complaint?.resVideo
                                              )
                                            }
                                          >
                                            <span className="avatar-title bg-transparent">
                                              <i className="bi bi-file-earmark-play"></i>
                                            </span>
                                            <span className="position-absolute top-0 start-100 translate-middle badge border border-light rounded-circle bg-danger p-1"></span>
                                          </button>
                                        )}
                                      </td>
                                    </tr>
                                  ) : (
                                    ""
                                  )}
                                </tbody>
                              </Table>
                            </div>
                          </div>
                        </Card.Body>
                        <Card.Footer className="p-0">
                          <Row className="m-1">
                            <Col
                              lg={8}
                              className="hstack flex-wrap gap-2 ml-1 mb-0 mb-lg-0"
                            >
                              {complaint?.photo[0]!.slice(41) === "" ? (
                                ""
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-soft-primary btn-icon btn-border"
                                  onClick={() =>
                                    openPhotoInNewTab(complaint?.photo)
                                  }
                                >
                                  <i className="bi bi-file-earmark-image"></i>
                                </button>
                              )}
                              {complaint?.video!.slice(41) === "" ? (
                                ""
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-soft-success btn-icon btn-border"
                                  onClick={() =>
                                    openVideoInNewTab(complaint.video)
                                  }
                                >
                                  <i className="bi bi-file-earmark-play"></i>
                                </button>
                              )}
                              {complaint?.pdf!.slice(41) === "" ? (
                                ""
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-soft-danger btn-icon btn-border"
                                  onClick={() => openPdfInNewTab(complaint.pdf)}
                                >
                                  <i className="bi bi-file-pdf"></i>
                                </button>
                              )}
                            </Col>
                            <Col lg={4}>
                              <p className="justify-content-end">
                                {complaint.createdAt}
                              </p>
                            </Col>
                          </Row>
                        </Card.Footer>
                      </Card>
                    ) : (
                      <></>
                    )}
                  </Col>
                ))}
              </Row>
            </div>
          </Row>

          {/* modal open pdf  */}
          <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_AddPdfModals}
            onHide={() => {
              tog_AddPdfModals();
            }}
            centered
            // selectedPdf={selectedPdf}
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                PDF files
              </h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              {selectedPdf && selectedPdf !== "" ? (
                <div>
                  <Document
                    file={`${selectedPdf}`}
                    onLoadSuccess={onDocumentLoadSuccess}
                  >
                    <Page pageNumber={1} />
                  </Document>
                </div>
              ) : (
                <div className="text-center p-3">
                  No PDF file is available to display.
                </div>
              )}
            </Modal.Body>
          </Modal>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default ArchivedComplains;
