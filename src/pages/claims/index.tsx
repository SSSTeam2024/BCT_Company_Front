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

const Claims = () => {
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
  const [sendResponse] = useUpdateComplainResponseMutation();
  const [addComplain] = useAddComplainMutation();
  const [deleteComplain] = useDeleteComplainMutation();
  const [pushedUpdate] = useUpdateComplainToPushedMutation();
  const [archivedUpdate] = useUpdateComplainToArchivedMutation();
  const Navigate = useNavigate();
  // display complain according to status pending or answered or all complains
  const [selectedStatus, setSelectedStatus] = useState("");
  // Function to handle status change
  const handleStatusChange = (event: any) => {
    setSelectedStatus(event.target.value);
  };
  // Function to filter data based on the selected status
  const filteredData = complains.filter((complaint) => {
    if (selectedStatus === "") {
      return complaint.archived !== "yes"; // Show complaints that are not archived
    } else {
      return (
        complaint.status === selectedStatus && complaint.archived !== "yes"
      ); // Show complaints with selected status and not archived
    }
  });
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>("");

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

  const handleOpenModal = (id: string) => {
    setSelectedComplaintId(id);
    setOpenModal(true);
  };

  // PDF
  const handlePDFUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (document.getElementById("pdfBase64String") as HTMLFormElement)
      .files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPDF = base64Data + "." + extension;
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
      setFormData({
        ...formData,
        photo: newPhotos,
        photoBase64Strings: base64Data,
        photoExtension: extension,
      });
    }
  };
  // handle response photo upload
  const handleResPhotosUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("resPhotoBase64Strings") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPhotos = base64Data + "." + extension;
      setResData({
        ...resData,
        resPhoto: newPhotos,
        resPhotoBase64Strings: base64Data,
        ResPhotoExtension: extension,
      });
    }
  };
  // video upload
  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("videoBase64Strings") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPhotos = base64Data + "." + extension;
      setFormData({
        ...formData,
        video: newPhotos,
        videoBase64Strings: base64Data,
        videoExtension: extension,
      });
    }
  };
  // handle response video upload
  const handleResVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = (
      document.getElementById("resVideoBase64Strings") as HTMLFormElement
    ).files[0];
    if (file) {
      const { base64Data, extension } = await convertToBase64(file);
      const newPhotos = base64Data + "." + extension;
      setResData({
        ...resData,
        resVideo: newPhotos,
        resVideoBase64Strings: base64Data,
        ResVideoExtension: extension,
      });
    }
  };

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

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitComplain = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    formData["complainDate"] = selectedDate!.toDateString();
    formData["id_corporate"] = user?._id!;
    addComplain(formData).then(() => setFormData(formData));
    notify();
    tog_AddComplainModals();
  };

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
  const onResChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setResData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };

  const onSubmitResponse = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    resData["_id"] = selectedComplaintId;

    sendResponse(resData).then(() => {
      notify();
      Navigate("/claims");
      setOpenModal(false);
    });
  };
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
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, archive it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then((result: any) => {
        if (result.isConfirmed) {
          deleteComplain(_id);
          swalWithBootstrapButtons.fire({
            title: "Archived!",
            text: "Your file has been archived.",
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

  const handlePushButtonClick = async (complaintId: string) => {
    try {
      await pushedUpdate({
        _id: complaintId,
        id_corporate: "",
        id_student: "",
        id_parent: "",
        subject: "",
        description: "",
        complainDate: "",
        responseMessage: "",
        responseAuthor: "",
        responseDate: "",
        status: "",
        archived: "",
        pdf: "",
        pdfBase64String: "",
        pdfExtension: "",
        createdAt: "",
        updatedAt: "",
        photo: "",
        photoBase64Strings: "",
        photoExtension: "",
        video: "",
        videoBase64Strings: "",
        videoExtension: "",
        resPhoto: "",
        resVideo: "",
        resPhotoBase64Strings: "",
        resVideoBase64Strings: "",
        ResPhotoExtension: "",
        ResVideoExtension: "",
      });
    } catch (error) {
      console.error("Error updating complain status:", error);
      // Handle error
    }
  };

  const handleArchiveButtonClick = async (complaintId: string) => {
    try {
      // Show SweetAlert confirmation dialog with OK and Cancel buttons
      const result = await Swal.fire({
        icon: "question",
        title: "Are you sure you want to archive this complaint?",
        showCancelButton: true,
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
      });

      // If user clicked OK, proceed with the archive operation
      if (result.isConfirmed) {
        await archivedUpdate({
          _id: complaintId,
          id_corporate: "",
          id_student: "",
          id_parent: "",
          subject: "",
          description: "",
          complainDate: "",
          responseMessage: "",
          responseAuthor: "",
          responseDate: "",
          status: "",
          archived: "",
          pdf: "",
          pdfBase64String: "",
          pdfExtension: "",
          createdAt: "",
          updatedAt: "",
          photo: "",
          photoBase64Strings: "",
          photoExtension: "",
          video: "",
          videoBase64Strings: "",
          videoExtension: "",
          resPhoto: "",
          resVideo: "",
          resPhotoBase64Strings: "",
          resVideoBase64Strings: "",
          ResPhotoExtension: "",
          ResVideoExtension: "",
        });

        // Show success message after archiving
        Swal.fire({
          icon: "success",
          title: "Complaint archived successfully!",
          showConfirmButton: false,
          timer: 1500,
        });
      } else {
        // User clicked Cancel or closed the dialog
        console.log("Archive operation cancelled");
      }
    } catch (error) {
      console.error("Error updating complain status:", error);
      // Handle error
    }
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
    setPdfUrl(`${process.env.REACT_APP_BASE_URL}/complainFiles/pdf/${PDF}`);
  };
  const openPhotoInNewTab = (PHOTO: string) => {
    setSelectedPhoto(PHOTO);
    setPhotoUrl(
      `${process.env.REACT_APP_BASE_URL}/complainFiles/photos/${PHOTO}`
    );
  };
  const openVideoInNewTab = (VIDEO: string) => {
    setSelectedVideo(VIDEO);
    setVideoUrl(
      `${process.env.REACT_APP_BASE_URL}/complainFiles/videos/${VIDEO}`
    );
  };
  const openResVideoInNewTab = (resVIDEO: string) => {
    setSelectedResVideo(resVIDEO);
    setResVideoUrl(
      `${process.env.REACT_APP_BASE_URL}/complainFiles/resVideos/${resVIDEO}`
    );
  };
  const openResPhotoInNewTab = (resPHOTO: string) => {
    setSelectedResPhoto(resPHOTO);
    setResPhotoUrl(
      `${process.env.REACT_APP_BASE_URL}/complainFiles/resPhotos/${resPHOTO}`
    );
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid={true}>
          <Breadcrumb title="Complains" pageTitle="Feedback&Complains" />
          <Row>
            <Card>
              <Card.Body>
                <Row className="g-lg-2 g-4">
                  <Col xxl={2} lg={6}>
                    <select
                      className="form-select text-muted"
                      data-choices
                      data-choices-search-false
                      name="choices-single-default"
                      id="idStatus"
                      onChange={handleStatusChange}
                      value={selectedStatus}
                    >
                      <option value="">All Complains</option>
                      <option value="answered">Answered</option>
                      <option value="pending">Pending</option>
                      <option value="pushed">Pushed</option>
                    </select>
                  </Col>

                  <Col xxl={3}></Col>
                  <Col>
                    <div
                      className="d-flex gap-2"
                      role="group"
                      aria-label="Basic example"
                    >
                      <Button
                        variant="light"
                        className="add-btn text-dark ms-auto"
                        onClick={() => tog_AddComplainModals()}
                      >
                        <i className="ph ph-export me-1 align-middle"></i> Write
                        a Complain
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Row>
          <Row>
            <div className="col-12">
              <Row>
                {filteredData.map((complaint: Complain) => (
                  <Col xxl={4} key={complaint._id}>
                    <Card>
                      <Card.Header>
                        {complaint.status && complaint.status === "pending" ? (
                          <>
                            <Button
                              type="button"
                              onClick={() => handleOpenModal(complaint._id)}
                              className="btn btn-soft-secondary fw-medium float-end m-1"
                            >
                              <i className="bi bi-envelope-arrow-up label-icon align-middle fs-16 me-2"></i>
                              Answer
                            </Button>
                            <Button
                              type="button"
                              onClick={() =>
                                handlePushButtonClick(complaint._id)
                              }
                              className="btn btn-soft-info fw-medium float-end m-1"
                            >
                              Push
                            </Button>
                          </>
                        ) : (
                          <Link
                            to="#"
                            className="link-danger fw-medium float-end"
                            onClick={() =>
                              handleArchiveButtonClick(complaint._id)
                            }
                          >
                            {complaint.archived === "yes" ? (
                              <>
                                Archived
                                {complaint.status === "pushed" ? (
                                  <span className="badge badge-gradient-danger m-1">
                                    Pushed
                                  </span>
                                ) : (
                                  <span className="badge badge-gradient-primary m-1">
                                    Answered
                                  </span>
                                )}
                              </>
                            ) : (
                              <>
                                Archive
                                {complaint.status === "pushed" && (
                                  <span className="badge badge-gradient-danger m-1">
                                    Pushed
                                  </span>
                                )}
                                {complaint.status === "answered" && (
                                  <span className="badge badge-gradient-primary m-1">
                                    Answered
                                  </span>
                                )}
                              </>
                            )}
                          </Link>
                        )}

                        {complaint.id_corporate === "" ? (
                          <>
                            <h5 className="card-title mb-0">
                              <img
                                src={`${
                                  process.env.REACT_APP_BASE_URL
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
                                src={`${process.env.REACT_APP_BASE_URL}/CompanyFiles/logoFiles/${user.logo_file}`}
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
                                      {complaint?.resPhoto!.slice(44) === "" ? (
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
                                      {complaint?.resVideo!.slice(44) === "" ? (
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
                  </Col>
                ))}
              </Row>
            </div>
          </Row>
          {/* modal response */}
          <Modal
            show={openModal}
            onHide={() => {
              setOpenModal(false);
              setSelectedComplaintId("");
            }}
            id="createModal"
            className="zoomIn border-0"
            centered
            selectedcomplaintid={selectedComplaintId}
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18"></h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <Form className="create-form" onSubmit={onSubmitResponse}>
                <input type="hidden" name="_id" id="_id" value={formData._id} />
                <input type="hidden" id="id-field" />
                <div
                  id="alert-error-msg"
                  className="d-none alert alert-danger py-2"
                ></div>

                <Row>
                  <Col lg={12}>
                    <div className="mb-3">
                      <label htmlFor="responseMessage" className="form-label">
                        Write your response here
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="responseMessage"
                        name="responseMessage"
                        value={resData.responseMessage}
                        onChange={onResChange}
                      />
                    </div>
                  </Col>
                  <Row>
                    <Col lg={10}>
                      <div className="mb-3">
                        <label
                          htmlFor="resPhotoBase64Strings"
                          className="form-label"
                        >
                          Images
                        </label>
                        <Form.Control
                          name="resPhotoBase64Strings"
                          onChange={handleResPhotosUpload}
                          type="file"
                          id="resPhotoBase64Strings"
                          accept=".png, .jpeg, .jpg"
                          placeholder="Choose Images"
                          className="text-muted"
                          multiple
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col lg={10}>
                      <div className="mb-3">
                        <label
                          htmlFor="resVideoBase64Strings"
                          className="form-label"
                        >
                          Video
                        </label>
                        <Form.Control
                          name="resVideoBase64Strings"
                          onChange={handleResVideoUpload}
                          type="file"
                          id="resVideoBase64Strings"
                          accept=".MKV, .WEBM, .M4V, .MP4, .AVI, .MOV, .MPG, .MPA, .ASF, .WMA, .MP2, M2P, MP3, DIF.Rare, .VOB"
                          placeholder="Choose Video"
                          className="text-muted"
                          multiple
                        />
                      </div>
                    </Col>
                  </Row>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        variant="ghost-danger"
                        className="btn btn-ghost-danger"
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Close
                      </Button>
                      <Button
                        variant="primary"
                        id="addNew"
                        className="btn btn-primary"
                        type="submit"
                      >
                        Send
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
          {/* modal new complain */}
          <Modal
            className="fade zoomIn"
            size="lg"
            show={modal_AddComplainModals}
            onHide={() => {
              tog_AddComplainModals();
            }}
            centered
          >
            <Modal.Header className="px-4 pt-4" closeButton>
              <h5 className="modal-title fs-18" id="exampleModalLabel">
                write your complaint
              </h5>
            </Modal.Header>
            <Modal.Body className="p-4">
              <div
                id="alert-error-msg"
                className="d-none alert alert-danger py-2"
              ></div>
              <Form className="tablelist-form" onSubmit={onSubmitComplain}>
                <input type="hidden" id="id-field" />
                <Row>
                  <Col lg={6}>
                    <div className="mb-3">
                      <Form.Label htmlFor="subject"> Subject</Form.Label>
                      <Form.Control
                        type="text"
                        id="subject"
                        placeholder="Enter complaint subject"
                        required
                        value={formData.subject}
                        onChange={onChange}
                      />
                    </div>
                  </Col>
                  <Col lg={3}>
                    <div className="mb-3">
                      <Form.Label htmlFor="complainDate">
                        Complain Date
                      </Form.Label>
                      <Flatpickr
                        value={selectedDate!}
                        onChange={handleDateChange}
                        className="form-control flatpickr-input"
                        placeholder="Select Date"
                        options={{
                          dateFormat: "d M, Y",
                        }}
                        id="complainDate"
                      />
                      {/* <p>{selectedDate?.toDateString()}</p> */}
                    </div>
                  </Col>

                  <div className="col-lg-10">
                    <div className="mb-3">
                      <Form.Label htmlFor="description">
                        {" "}
                        Description
                      </Form.Label>
                      <textarea
                        // type="Message"
                        className="form-control"
                        rows={3}
                        id="description"
                        placeholder="Enter Body Message"
                        value={formData.description}
                        onChange={onChange}
                        required
                      />
                    </div>
                  </div>
                  <Col lg={10}>
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
                <Row>
                  <Col lg={10}>
                    <div className="mb-3">
                      <label
                        htmlFor="photosBase64Strings"
                        className="form-label"
                      >
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
                </Row>
                <Row>
                  <Col lg={10}>
                    <div className="mb-3">
                      <label
                        htmlFor="photosBase64Strings"
                        className="form-label"
                      >
                        Video
                      </label>
                      <Form.Control
                        name="videoBase64Strings"
                        onChange={handleVideoUpload}
                        type="file"
                        id="videoBase64Strings"
                        accept=".MKV, .WEBM, .M4V, .MP4, .AVI, .MOV, .MPG, .MPA, .ASF, .WMA, .MP2, M2P, MP3, DIF.Rare, .VOB"
                        placeholder="Choose Video"
                        className="text-muted"
                        multiple
                      />
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col lg={12}>
                    <div className="hstack gap-2 justify-content-end">
                      <Button
                        className="btn-ghost-danger"
                        onClick={() => {
                          tog_AddComplainModals();
                        }}
                        data-bs-dismiss="modal"
                      >
                        <i className="ri-close-line align-bottom me-1"></i>{" "}
                        Close
                      </Button>
                      <Button variant="primary" id="add-btn" type="submit">
                        Send
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Form>
            </Modal.Body>
          </Modal>
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

export default Claims;
