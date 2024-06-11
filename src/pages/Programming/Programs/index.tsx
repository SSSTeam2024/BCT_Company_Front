import React, { useState, useRef, useEffect } from "react";
import {
  Container,
  Card,
  Row,
  Col,
  Form,
  Tab,
  Button,
  InputGroup,
  Dropdown,
} from "react-bootstrap";
import Breadcrumb from "Common/BreadCrumb";
import { Link, useNavigate } from "react-router-dom";
import Flatpickr from "react-flatpickr";
import DualListBox from "react-dual-listbox";
import "react-dual-listbox/lib/react-dual-listbox.css";
import { useSelector } from "react-redux";
import { RootState } from "../../../app/store"; // Import your RootState interface
import { selectCurrentUser } from "../../../features/account/authSlice";
import {
  DirectionsRenderer,
  GoogleMap,
  Marker,
  Autocomplete,
  useJsApiLoader,
} from "@react-google-maps/api";
import Swal from "sweetalert2";
import "./AddProgram.css";
import { useAddProgrammMutation } from "features/program/programSlice";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  useFetchVehicleTypeByIdQuery,
  useGetAllVehicleTypesQuery,
} from "features/vehicleType/vehicleTypeSlice";
import {
  useFetchLuggageByIdQuery,
  useGetAllLuggageQuery,
} from "features/luggage/luggageSlice";
import {
  useFetchJourneyByIdQuery,
  useGetAllJourneyQuery,
} from "features/journey/journeySlice";
import { useGetAllPassengerAndLuggagesQuery } from "features/PassengerAndLuggageLimits/passerngerAndLuggageSlice";

interface Option {
  value: string;
  label: string;
}
const options = [
  { value: "ForHandicap", label: "For Handicap" },
  { value: "Wifi", label: "Wifi" },
  { value: "WC", label: "WC" },
  { value: "AC", label: "AC" },
];

const options1: Option[] = [
  { value: "Monday", label: "Monday" },
  { value: "Tuesday", label: "Tuesday" },
  { value: "Wednesday", label: "Wednesday" },
  { value: "Thursday", label: "Thursday" },
  { value: "Friday", label: "Friday" },
  { value: "Saturday", label: "Saturday" },
  { value: "Sunday", label: "Sunday" },
];
const center = { lat: 52.4862, lng: -1.8904 };

interface Recap {
  programName: string;
  capacityRecommanded: string;
  selected: string[];
  selected1: string[];
  stops: google.maps.LatLng[];
  originRef: string;
  destinationRef: string;
  dropOff_date: string;
  dropOff_time: string;
  free_date: string[];
  pickUp_date: string;
  pickUp_time: string;
}

interface Stop {
  id: number;
  address: string;
}

interface GroupCompany {
  groupName: string;
  passenger_number: string;
  id_company: string;
  vehicle_type: string;
  luggage_details: string;
  passenger_limit: any[];
  program: string;
}

interface GroupSchool {
  groupName: string;
  student_number: string;
  id_school: string;
  vehicle_type: string;
  luggage_details: string;
  passenger_limit: any[];
  program: string;
}

interface RouteSegment {
  segment: number;
  startAddress: string;
  endAddress: string;
  distance: string;
  duration: string;
}
interface stopTime {
  hours: number;
  minutes: number;
}

const AddProgramm = (props: any) => {
  document.title = "Program | Bouden Coach Travel";

  const user = useSelector((state: RootState) => selectCurrentUser(state));

  const { data: AllPassengersLimit = [] } =
    useGetAllPassengerAndLuggagesQuery();

  const navigate = useNavigate();
  const [affectedCounter, setAffectedCounter] = useState<string>("0");

  const [recommandedCapacityState, setRecommandedCapacityState] =
    useState<string>("");
  const onChangeRecommandedCapacityState = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRecommandedCapacityState(event.target.value);
  };
  const onChangeSchoolGroupName = (
    event: React.ChangeEvent<any>,
    index: any
  ) => {
    const name = event.target.value;
    const tempArray = [...schoolGroups];
    tempArray[index].groupName = name;
    setSchoolGroups(tempArray);
  };

  const onChangeSchoolGroupPax = (
    event: React.ChangeEvent<any>,
    index: any
  ) => {
    if (recommandedCapacityState === "") {
      alert("Fill the total passengers number first");
    } else {
      const pax = event.target.value;
      const tempArray = [...schoolGroups];
      let prevNumber = tempArray[index].student_number;
      let prevAffectedCounter = Number(affectedCounter) - Number(prevNumber);
      if (prevAffectedCounter !== 0) {
        if (
          prevAffectedCounter + Number(pax) >
          Number(recommandedCapacityState)
        ) {
          alert(
            "The number of group(s) passengers exceed the estimated total number"
          );
          tempArray[index].student_number = "";
          setAffectedCounter(prevAffectedCounter.toString());
        } else {
          setAffectedCounter((prevAffectedCounter + Number(pax)).toString());
          tempArray[index].student_number = pax;
          const customFilteredLimit = AllPassengersLimit.filter(
            (vehcileType) => Number(pax) <= Number(vehcileType.max_passengers)
          );
          tempArray[index].passenger_limit = customFilteredLimit;
        }
      } else {
        if (
          prevAffectedCounter + Number(pax) >
          Number(recommandedCapacityState)
        ) {
          alert(
            "The number of group passengers exceed the estimated total number"
          );
          tempArray[index].student_number = "";
          prevAffectedCounter = Number(affectedCounter) - Number(prevNumber);
          setAffectedCounter(prevAffectedCounter.toString());
        } else {
          setAffectedCounter((prevAffectedCounter + Number(pax)).toString());
          tempArray[index].student_number = pax;
          const customFilteredVehicleType = AllPassengersLimit.filter(
            (vehcileType) => Number(pax) <= Number(vehcileType.max_passengers)
          );
          tempArray[index].passenger_limit = customFilteredVehicleType;
        }
      }

      setSchoolGroups(tempArray);
    }
  };

  const onChangeCompanyGroupName = (
    event: React.ChangeEvent<any>,
    index: any
  ) => {
    const name = event.target.value;
    const tempArray = [...companyGroups];
    tempArray[index].groupName = name;
    setCompanyGroups(tempArray);
  };

  const onChangeCompanyGroupPax = (
    event: React.ChangeEvent<any>,
    index: any
  ) => {
    if (recommandedCapacityState === "") {
      alert("Fill the total passengers number first");
    } else {
      const pax = event.target.value;
      const tempArray = [...companyGroups];
      let prevNumber = tempArray[index].passenger_number;

      let prevAffectedCounter = Number(affectedCounter) - Number(prevNumber);
      if (prevAffectedCounter !== 0) {
        if (
          prevAffectedCounter + Number(pax) >
          Number(recommandedCapacityState)
        ) {
          alert(
            "The number of group(s) passengers exceed the estimated total number"
          );
          tempArray[index].passenger_number = "";
          setDisabledNext(true);
          setAffectedCounter(prevAffectedCounter.toString());
        } else {
          setAffectedCounter((prevAffectedCounter + Number(pax)).toString());
          tempArray[index].passenger_number = pax;
          const customFilteredLimit = AllPassengersLimit.filter(
            (vehcileType) => Number(pax) <= Number(vehcileType.max_passengers)
          );
          tempArray[index].passenger_limit = customFilteredLimit;
          if (Number(affectedCounter) < Number(recommandedCapacityState)) {
            console.log("Affected counter < rc");
            setDisabledNext(true);
          } else if (
            Number(affectedCounter) === Number(recommandedCapacityState)
          ) {
            console.log("Affected counter === rc");
            setDisabledNext(false);
          }
        }
      } else {
        if (
          prevAffectedCounter + Number(pax) >
          Number(recommandedCapacityState)
        ) {
          alert(
            "The number of group passengers exceed the estimated total number"
          );
          setDisabledNext(true);
          tempArray[index].passenger_number = "";
          prevAffectedCounter = Number(affectedCounter) - Number(prevNumber);
          setAffectedCounter(prevAffectedCounter.toString());
        } else {
          setAffectedCounter((prevAffectedCounter + Number(pax)).toString());
          tempArray[index].passenger_number = pax;
          const customFilteredVehicleType = AllPassengersLimit.filter(
            (vehcileType) => Number(pax) <= Number(vehcileType.max_passengers)
          );
          tempArray[index].passenger_limit = customFilteredVehicleType;
          if (Number(affectedCounter) < Number(recommandedCapacityState)) {
            console.log("af < rc");
            setDisabledNext(true);
          } else if (
            Number(affectedCounter) === Number(recommandedCapacityState)
          ) {
            console.log("af === rc");
            setDisabledNext(false);
          }
        }
      }

      setCompanyGroups(tempArray);
    }
  };

  const filteredVehicleType = AllPassengersLimit.filter(
    (vehcileType) =>
      Number(recommandedCapacityState) <= Number(vehcileType.max_passengers)
  );
  const filteredLuggageDetails = AllPassengersLimit.filter(
    (vehcileType) => vehcileType.max_passengers === recommandedCapacityState
  );
  // The selected Client Type
  const [selectedClientType, setSelectedClientType] = useState<string>("");

  // This function will be triggered when a radio button is selected
  const radioHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedClientType(event.target.value);
  };

  // The selected Group Creation Mode
  const [selectedGroupCreationMode, setSelectedGroupCreationMode] =
    useState<string>("");

  // This function will be triggered when a radio button is selected
  const radioHandlerGroupCreationMode = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedGroupCreationMode(event.target.value);
    setRecommandedCapacityState("");
    setSchoolGroups([]);
    setCompanyGroups([]);
    setRows([]);
  };

  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [activeVerticalTab, setactiveVerticalTab] = useState<number>(1);
  const [programName, setProgramName] = useState("");
  const [capacityRecommanded, setCapacityRecommanded] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [selected1, setSelected1] = useState<string[]>([]);
  const [searchResult, setSearchResult] = useState("");
  const [searchDestination, setSearchDestination] = useState("");
  const [searchStop, setSearchStop] = useState("");
  const [fatma, setFatma] = useState<any>();
  const [stop, setStop] = useState<any>();
  const [nom, setNom] = useState<any>();
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedStop, setSelectedStop] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [directionsResponse, setDirectionsResponse] =
    useState<google.maps.DirectionsResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [routeDirections, setRouteDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const [stopNames, setStopNames] = useState<string[]>([]);
  const [isMapFullScreen, setIsMapFullScreen] = useState(false);

  const originRef = useRef<any>(null);
  const destinationRef = useRef<any>(null);
  const stopRef = useRef<any>(null);

  const flatpickrRef = useRef<Flatpickr>(null);

  const [destSwitchRef, setDestSwitchRef] = useState<google.maps.LatLng[]>([]);
  const [originSwitchRef, setOriginSwitchRef] = useState<google.maps.LatLng[]>(
    []
  );
  const [pickUp_time, setPickUp_time] = useState<Date>();
  const [dropOff_time, setDropOff_time] = useState<Date | null>(null);

  const [dropOff_date, setDropOff_date] = useState<Date | null>(null);
  const [free_date, setFree_date] = useState<Date[]>([]);

  const [pickUp_date, setPickUp_date] = useState<Date | null>(null);

  const [stops2, setStops2] = useState<Stop[]>([]);
  const [schoolGroups, setSchoolGroups] = useState<GroupSchool[]>([]);
  const [companyGroups, setCompanyGroups] = useState<GroupCompany[]>([]);
  const [recap, setRecap] = useState<Recap>({
    programName: "",
    capacityRecommanded: "",
    selected: [],
    selected1: [],
    stops: [],
    originRef: "",
    destinationRef: "",
    dropOff_date: "",
    dropOff_time: "",
    free_date: [],
    pickUp_date: "",
    pickUp_time: "",
  });

  const [test, setTest] = useState("");
  const [test2, setTest2] = useState("");

  const [date, setDate] = useState(new Date());

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyBbORSZJBXcqDnY6BbMx_JSP0l_9HLQSkw",
    libraries: ["places"],
  });

  const [stops, setStops] = useState<google.maps.LatLng[]>([]);

  const [waypts, setWaypts] = useState<any[]>([]);

  const [stopTimes, setStopTimes] = useState<stopTime[]>([]);

  const [routeSegments, setRouteSegments] = useState<RouteSegment[]>([]);

  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const [createProgram] = useAddProgrammMutation();

  const { data: AllVehicleTypes = [] } = useGetAllVehicleTypesQuery();
  const { data: AllLuggages = [] } = useGetAllLuggageQuery();
  const { data: AllJourneys = [] } = useGetAllJourneyQuery();
  const [selectedVehicleType, setSelectedVehicletype] = useState<string>("");
  const [selectedLuggage, setSelectedLuggage] = useState<string>("");
  const [disabledNext, setDisabledNext] = useState<boolean>(true);

  // This function is triggered when the select Vehicle Type
  const handleSelectVehicleType = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedVehicletype(value);
    setDisabledNext(true);
  };
  console.log("selectedVehicleType", selectedVehicleType);
  const generateGroups = () => {
    const filteredVehicleTypeID = AllPassengersLimit.filter(
      (vehcileType) => selectedVehicleType === vehcileType.vehicle_type.type
    );
    let prevRows = [];
    let divisionResult = Math.floor(
      Number(
        Number(recommandedCapacityState) /
          Number(filteredVehicleTypeID[0]?.max_passengers!)
      )
    );
    let restResult = Number(
      Number(recommandedCapacityState) %
        Number(filteredVehicleTypeID[0]?.max_passengers!)
    );
    let totalGroupNumber = 0;
    if (restResult !== 0) {
      totalGroupNumber = divisionResult + 1;
    } else {
      totalGroupNumber = divisionResult;
    }
    let prevCompanyGroups = [...companyGroups];
    for (let index = 0; index < totalGroupNumber; index++) {
      prevCompanyGroups.push({
        groupName: programm_name + "_" + "group" + [index + 1],
        id_company: selectCompanyID,
        luggage_details: selectedLuggage,
        vehicle_type: selectedVehicleType,
        passenger_number: totalGroupNumber.toString(),
        passenger_limit: AllPassengersLimit,
        program: "",
      });
      // }
      prevRows.push(<h5>{programm_name + "_" + "group" + [index + 1]}</h5>);
    }
    setCompanyGroups(prevCompanyGroups);
    setRows(prevRows);
    setDisabledNext(false);
  };

  const handleCustomSelectCompanyVehicleType = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: any
  ) => {
    const value = event.target.value;
    let prevCompanyGroups = [...companyGroups];
    prevCompanyGroups[index].vehicle_type = value;
  };

  const handleCustomSelectCompanyLuggageDetails = (
    event: React.ChangeEvent<HTMLSelectElement>,
    index: any
  ) => {
    const value = event.target.value;

    let prevCompanyGroups = [...companyGroups];
    prevCompanyGroups[index].luggage_details = value;
  };

  const [rows, setRows] = useState<any[]>([]);

  // This function is triggered when the select Luggage
  const handleSelectLuggage = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedLuggage(value);
    setDisabledNext(true);
  };

  const [selectedJourney, setSelectedJourney] = useState<string>("");
  // This function is triggered when the select Journey
  const handleSelectJourney = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    setSelectedJourney(value);
  };
  const [programmData, setProgrammData] = useState({
    programDetails: {
      programName: "",
      origin_point: {
        placeName: "",
        coordinates: {
          lat: 1,
          lng: 1,
        },
      },
      stops: [
        {
          id: "",
          address: {
            placeName: "",
            coordinates: {
              lat: 0,
              lng: 0,
            },
          },
          time: "",
        },
      ],
      destination_point: {
        placeName: "",
        coordinates: {
          lat: 1,
          lng: 1,
        },
      },
      pickUp_date: "",
      droppOff_date: "",
      freeDays_date: [""],
      exceptDays: [""],
      recommanded_capacity: "",
      extra: [""],
      notes: "",
      journeyType: "",
      dropOff_time: "",
      pickUp_Time: "",
      workDates: [""],
      company_id: user._id,
      school_id: "",
      invoiceFrequency: "",
      within_payment_days: "",
      total_price: "",
      unit_price: "",
      program_status: [
        {
          status: "",
          date_status: "",
        },
      ],
    },
    groups: {
      type: "",
      groupCollection: [
        {
          groupName: "",
          program: "",
          vehicle_type: "",
          luggage_details: "",
        },
      ],
    },
  });
  const notify = () => {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Program created successfully",
      showConfirmButton: false,
      timer: 2000,
    });
  };

  const [selectCompanyID, setSelectedCompanyID] = useState<string>("");
  // This function is triggered when the select CompanyID
  const handleSelectCompanyID = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCompanyID(value);
  };
  const [programm_name, setProgrammName] = useState<string>("");
  const onChangeProgramName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProgrammName(event.target.value);
  };

  const [programm_notes, setProgrammNotes] = useState<string>("");
  const onChangeProgramNotes = (
    event: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setProgrammNotes(event.target.value);
  };

  const [programm_paymentDays, setProgrammPaymentDays] = useState<string>("");
  const onChangeProgramPaymentDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProgrammPaymentDays(event.target.value);
  };

  const onChangeProgramms = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProgrammData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value,
    }));
  };
  const onSubmitProgramm = (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      createProgram(programmData)
        .then(() => notify())
        .then(() => navigate("/programming/list-of-programs"));
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddStopClick = (address: string) => {
    setStops2((prevStops) => [
      ...prevStops,
      { id: prevStops.length + 1, address },
    ]);
  };

  const handleAddGroupClick = () => {
    let prevG = [...companyGroups];
    let name = programm_name + "_" + "group" + (prevG.length + 1);
    setCompanyGroups((prevGroups) => [
      ...prevGroups,
      {
        groupName: name,
        passenger_number: "",
        id_company: user?._id!,
        vehicle_type: "",
        luggage_details: "",
        passenger_limit: [],
        program: "",
      },
    ]);
  };

  const handleRemoveStopClick = (idToRemove: any) => {
    setStops2((prevStops) => {
      const updatedStops = prevStops.filter((stop) => stop.id !== idToRemove);
      return updatedStops;
    });

    const newWaypts = [...waypts];
    newWaypts.splice(idToRemove - 1, 1);
    setWaypts(newWaypts);
    calculateRoute();
  };

  const handleRemoveStudentGroupClick = (index: any) => {
    let prevGroups = [...schoolGroups];

    let prevAffectedNumber = Number(affectedCounter);
    prevAffectedNumber -= Number(prevGroups[index]?.student_number!);
    setAffectedCounter(String(prevAffectedNumber));

    if (prevGroups.length === 0) {
      prevGroups = [];
    } else {
      prevGroups.splice(index, 1);
    }
    setSchoolGroups(prevGroups);
  };

  const handleRemoveCompanyGroupClick = (index: any) => {
    let prevGroups = [...companyGroups];

    let prevAffectedNumber = Number(affectedCounter);
    prevAffectedNumber -= Number(prevGroups[index]?.passenger_number!);
    setAffectedCounter(String(prevAffectedNumber));

    if (prevGroups.length === 0) {
      prevGroups = [];
    } else {
      prevGroups.splice(index, 1);
    }
    setCompanyGroups(prevGroups);
  };

  const handleAddStopClickWrapper = (address: string) => {
    return () => handleAddStopClick(address);
  };

  useEffect(() => {
    if (originRef.current && destinationRef.current) {
      setRecap((prevRecap) => ({
        ...prevRecap,
        programName,
        capacityRecommanded,
        selected,
        selected1,
        stops,
        originRef: originRef.current.value,
        destinationRef: destinationRef.current.value,
        dropOff_date: dropOff_date ? dropOff_date.toString() : "",
        dropOff_time: dropOff_time ? dropOff_time.toString() : "",
        free_date:
          free_date.length > 0 ? free_date.map((date) => date.toString()) : [],
        pickUp_date: pickUp_date ? pickUp_date.toString() : "",
        pickUp_time: pickUp_time ? pickUp_time.toString() : "",
      }));
    }
  }, [
    programName,
    capacityRecommanded,
    selected,
    selected1,
    stops,
    originRef,
    destinationRef,
    dropOff_date,
    dropOff_time,
    free_date,
    pickUp_date,
    pickUp_time,
  ]);
  const handlePickupTime = (selectedDates: any) => {
    const formattedTime = selectedDates[0];
    setPickUp_time(formattedTime);
  };

  const handleStopTime = (selectedTime: any, index: number) => {
    const formattedTime = selectedTime[0];
    let hour = formattedTime?.getHours();
    let minute = formattedTime?.getMinutes();
    let tempStopTimes = [...stopTimes];
    let newSelectedTime =
      String(hour).padStart(2, "0") + ":" + String(minute).padStart(2, "0");

    tempStopTimes[index] = {
      hours: hour,
      minutes: minute,
    };

    let apiTime =
      String(stopTimes[index].hours).padStart(2, "0") +
      ":" +
      String(stopTimes[index].minutes).padStart(2, "0");

    let comparisonTime = compareTimes(apiTime, newSelectedTime);

    let duration = {
      hours: 0,
      minutes: 0,
    };

    if (comparisonTime === 2) {
      duration = calculateDuration(apiTime, newSelectedTime);
    }
    if (comparisonTime === 1) {
      duration = calculateDuration(newSelectedTime, apiTime);
    }
    for (let i = index + 1; i < stopTimes.length; i++) {
      let oldTime =
        String(stopTimes[i].hours).padStart(2, "0") +
        ":" +
        String(stopTimes[i].minutes).padStart(2, "0");

      let newTime = {
        hours: 0,
        minutes: 0,
      };
      if (comparisonTime === 2) {
        newTime = addDurationToTime(oldTime, duration.hours, duration.minutes);
      }

      if (comparisonTime === 1) {
        newTime = subtractTime(oldTime, duration.hours, duration.minutes);
      }

      tempStopTimes[i].hours = newTime.hours;
      tempStopTimes[i].minutes = newTime.minutes;
    }

    setStopTimes(tempStopTimes);
  };

  const handleDateClose = (selectedDates: any) => {
    let tempStopTimes = stopTimes;
    for (let i = 0; i < tempStopTimes.length; i++) {
      tempStopTimes[i].hours = 0;
      tempStopTimes[i].minutes = 0;
    }
    setStopTimes(tempStopTimes);
  };

  const handleDateChange1 = (selectedDates: Date[]) => {
    setPickUp_date(selectedDates[0]);
  };
  const handleDateChange2 = (selectedDates: Date[]) => {
    setDropOff_date(selectedDates[0]);
  };

  const handleDateChange3 = (selectedDates: Date[]) => {
    setFree_date(selectedDates);
  };

  const getWorkDates = () => {
    let workDates = [];

    let startDate = pickUp_date;
    let endDate = dropOff_date;

    if (startDate && endDate && endDate >= startDate) {
      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        if (
          !free_date.find(
            (freeDay) => freeDay.toDateString() === currentDate.toDateString()
          )
        ) {
          if (
            !selected1.includes(
              currentDate.toLocaleString("en-us", { weekday: "long" })
            )
          ) {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;
            const day = currentDate.getDate().toLocaleString();

            let date =
              String(year) +
              "-" +
              String(month).padStart(2, "0") +
              "-" +
              String(day).padStart(2, "0");
            workDates.push(date);
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
    return workDates;
  };

  const tileClassName = ({ date }: any) => {
    const formattedDate = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`;
    const dayOfWeek = date.getDay();
    if (date < pickUp_date! || date > dropOff_date!) {
      return null;
    }

    let testDays = [];
    for (let freeDay of programmData.programDetails.freeDays_date) {
      let day = createDateFromStrings(freeDay, "00:00:00");

      let year = day.getFullYear();
      let month = day.getMonth() + 1;
      let d = day.getDate().toLocaleString();

      let free_day = String(year) + "-" + String(month) + "-" + String(d);
      testDays.push(free_day);
    }

    if (testDays.includes(formattedDate)) {
      return "free-day";
    }
    const adjustedIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    if (
      selectedDays.includes(options1[adjustedIndex].value) ||
      selected1.includes(options1[adjustedIndex].value)
    ) {
      return "selected-day";
    }

    return null;
  };

  const OneVehicleType = useFetchVehicleTypeByIdQuery(selectedVehicleType);
  const OneLuggage = useFetchLuggageByIdQuery(selectedLuggage);
  const OneJourney = useFetchJourneyByIdQuery(selectedJourney);

  const handleDayClick = (value: Date) => {
    const dayOfWeek = value.getDay();
    const selectedDayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const selectedDay = options1[selectedDayIndex].value;

    if (selectedDays.includes(selectedDay) || selected1.includes(selectedDay)) {
      setSelectedDays(selectedDays.filter((day) => day !== selectedDay));
      setSelected1(selected1.filter((day) => day !== selectedDay));
    } else {
      setSelectedDays([...selectedDays, selectedDay]);
      setSelected1([...selected1, selectedDay]);
    }
  };

  const [quoteUnitPrice, setQuoteUnitPrice] = useState<number>();
  const [contractTotalPrice, setContractTotalPrice] = useState<number>();

  const onChangeUnitPrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuoteUnitPrice(parseInt(event.target.value));
    setContractTotalPrice(parseInt(event.target.value) * getWorkDates().length);
  };

  const [selectedInvoiceFrequency, setSelectedInvoiceFrequency] =
    useState<string>("");
  // This function is triggered when the select Invoice Frequency
  const handleSelectInvoiceFrequency = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedInvoiceFrequency(value);
  };

  const tileDisabled = ({ date }: any) => {
    return date < pickUp_date! || date > dropOff_date!;
  };

  const renderRecapPage = () => {
    return (
      <>
        <Row className="d-flex resume-title">
          <span className="title"> Journey Name: </span>{" "}
          <span className="title-value">
            {programmData.programDetails.programName}
          </span>
        </Row>
        <Row className="d-flex">
          <Col>
            <div className="table-responsive">
              <table className="table table-sm table-borderless align-middle description-table">
                <tbody>
                  {/* <tr>
                    <td>
                      <b>Client </b>
                      {oneCompany === undefined ? (
                        <p>{oneSchool?.name!}</p>
                      ) : (
                        <p>{oneCompany?.name!}</p>
                      )}
                    </td>
                  </tr> */}
                  <tr>
                    <td>
                      <b>Start Date </b>
                      <p>{programmData.programDetails.pickUp_date}</p>
                    </td>
                    <td>
                      <b>End Date </b>
                      <p>{programmData.programDetails.droppOff_date}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Origin Address</b>
                      <p>
                        {programmData.programDetails.origin_point.placeName}
                      </p>
                    </td>
                    <td>
                      <b>Pick Up Time </b>{" "}
                      <p> {programmData.programDetails.pickUp_Time}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b> Destination Address: </b>
                      <p>
                        {" "}
                        {
                          programmData.programDetails.destination_point
                            .placeName
                        }
                      </p>
                    </td>
                    <td>
                      <b>Drop Off Time </b>{" "}
                      <p> {programmData.programDetails.dropOff_time}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
          <Col>
            <div className="table-responsive">
              <table className="table table-sm table-borderless align-middle description-table">
                <tbody>
                  <tr>
                    <td>
                      <b>List of Stops</b>
                    </td>
                    <td>
                      <b>Stop Time</b>
                    </td>
                  </tr>
                  {waypts.map((value, index) => (
                    <tr key={index}>
                      <td>{value.location?.toString()}</td>
                      <td>
                        {String(stopTimes[index]?.hours).padStart(2, "0") +
                          ":" +
                          String(stopTimes[index]?.minutes).padStart(2, "0")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Col>
          <Col>
            <div className="table-responsive">
              <table className="table table-sm table-borderless align-middle description-table">
                <tbody>
                  <tr>
                    <td>
                      <b>Capacity Recommended</b>{" "}
                      <p> {programmData.programDetails.recommanded_capacity}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Vehicle Type</b>{" "}
                      <p>{OneVehicleType.currentData?.type}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Luggage Details</b>{" "}
                      <p>{OneLuggage.currentData?.description}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b>Journey Type</b> <p>{OneJourney.currentData?.type}</p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <b> Selected Options </b>{" "}
                      <p>{programmData.programDetails.extra.join(", ")}</p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
          <Col>
            <div className="table-responsive">
              <table className="table table-sm table-borderless align-middle description-table">
                <tbody>
                  <tr>
                    <td>
                      <p className="legend-container">
                        <span className="legend working_days_bg"></span>
                        Working days{" "}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="legend-container">
                        <span className="legend bg-now-day"></span>Current day
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p className="legend-container">
                        <span className="legend bg-except-day"></span>Excepted
                        days{" "}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td>
                      <p className="legend-container">
                        <span className="legend bg-free-day"></span>Free days
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Col>
        </Row>
        <Row>
          <Col lg={3}>
            <b>Work Dates: </b>
          </Col>
          <Col lg={9}>
            <div className="calender-container">
              <Calendar
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
              />
            </div>
          </Col>
        </Row>
      </>
    );
  };

  const isJourneyStepValid = () => {
    return programm_name.trim() !== "";
  };
  const isTripTimesStepValid = () => {
    const pickupTimeInput = document.getElementById(
      "pickUp_time"
    ) as HTMLInputElement | null;
    const dropoffTimeInput = document.getElementById(
      "dropOff_time"
    ) as HTMLInputElement | null;
    const pickupTime = pickupTimeInput?.value ?? "";
    const dropoffTime = dropoffTimeInput?.value ?? "";

    return pickupTime.trim() !== "" && dropoffTime.trim() !== "";
  };

  const isRunDatesStepValid = () => {
    const startDateInput = document.getElementById(
      "pickUp_date"
    ) as HTMLInputElement | null;
    const endDateInput = document.getElementById(
      "dropOff_date"
    ) as HTMLInputElement | null;

    const startDate = startDateInput?.value ?? "";
    const endDate = endDateInput?.value ?? "";
    return startDate.trim() !== "" && endDate.trim() !== "";
  };
  const isOptionsStepValid = () => {
    return selected1.length > 0;
  };

  const isFreeDaysStepValid = () => {
    const freeDateInput = document.getElementById(
      "free_date"
    ) as HTMLInputElement | null;
    const freeDate = freeDateInput?.value ?? "";
    return freeDate.trim() !== "";
  };

  const isRecommandedCapacityStepValid = () => {
    return recommandedCapacityState.trim() !== "";
  };

  const isNextButtonDisabled = () => {
    switch (activeVerticalTab) {
      case 1:
        return !isJourneyStepValid();
      case 2:
        return (
          !isRunDatesStepValid() ||
          !isOptionsStepValid() ||
          !isFreeDaysStepValid()
        );
      // case 3:
      //   return disabledNext === false;
      default:
        return false;
    }
  };
  const handleNextStep = (isResume: boolean) => {
    if (isResume === true) {
      programmData["programDetails"]["programName"] = programm_name;
      programmData["programDetails"]["extra"] = selected;
      programmData["programDetails"]["company_id"] = user?._id!;
      programmData["programDetails"]["exceptDays"] = selected1;
      programmData["programDetails"]["recommanded_capacity"] =
        recommandedCapacityState;
      // programmData["programDetails"]["unit_price"] = quoteUnitPrice!.toFixed(2);
      // programmData["programDetails"]["total_price"] =
      //   contractTotalPrice!.toFixed(2);
      // programmData["programDetails"]["invoiceFrequency"] =
      //   selectedInvoiceFrequency;
      programmData["programDetails"]["workDates"] = getWorkDates();
      programmData["programDetails"]["program_status"] = [
        {
          status: "Pending",
          date_status: "",
        },
      ];

      programmData["programDetails"]["notes"] = programm_notes;

      programmData["programDetails"]["within_payment_days"] =
        programm_paymentDays;

      let freeDates = [];

      for (let freeDay of free_date) {
        const year = freeDay.getFullYear();
        const month = freeDay.getMonth() + 1;
        const day = freeDay.getDate().toLocaleString();

        let date =
          String(year) +
          "-" +
          String(month).padStart(2, "0") +
          "-" +
          String(day).padStart(2, "0");

        freeDates.push(date);
      }

      programmData["programDetails"]["freeDays_date"] = freeDates;
      programmData["programDetails"]["journeyType"] = selectedJourney;
      ////////////////////////////////////////////////////////////////////

      // if (selectedClientType === "School") {
      //   let validSchoolGroups = [];
      //   for (let index = 0; index < schoolGroups.length; index++) {
      //     const group = {
      //       groupName: schoolGroups[index].groupName,
      //       student_number: schoolGroups[index].student_number,
      //       id_school: schoolGroups[index].id_school,
      //       vehicle_type: schoolGroups[index].vehicle_type,
      //       luggage_details: schoolGroups[index].luggage_details,
      //       program: schoolGroups[index].program,
      //     };
      //     validSchoolGroups.push(group);
      //   }
      //   programmData["groups"]["type"] = selectedClientType;
      //   programmData["groups"]["groupCollection"] = validSchoolGroups;
      // }

      // if (selectedClientType === "Company") {
      let validCompanyGroups = [];
      for (let index = 0; index < companyGroups.length; index++) {
        const group = {
          groupName: companyGroups[index].groupName,
          passenger_number: companyGroups[index].passenger_number,
          id_company: companyGroups[index].id_company,
          vehicle_type: companyGroups[index].vehicle_type,
          luggage_details: companyGroups[index].luggage_details,
          program: companyGroups[index].program,
        };
        validCompanyGroups.push(group);
      }
      console.log("validCompanyGroups", validCompanyGroups);
      programmData["groups"]["type"] = "Company";
      programmData["groups"]["groupCollection"] = validCompanyGroups;
      // }
      ////////////////////////////////////////////////////////////////////
      const dropYear = dropOff_date!.getFullYear();
      const dropMonth = dropOff_date!.getMonth() + 1;
      const dropDay = dropOff_date!.getDate().toLocaleString();

      let dropOffDate =
        String(dropYear) +
        "-" +
        String(dropMonth).padStart(2, "0") +
        "-" +
        String(dropDay).padStart(2, "0");
      programmData["programDetails"]["droppOff_date"] = dropOffDate;

      const pickYear = pickUp_date!.getFullYear();
      const pickMonth = pickUp_date!.getMonth() + 1;
      const pickDay = pickUp_date!.getDate().toLocaleString();

      let pickUpDate =
        String(pickYear) +
        "-" +
        String(pickMonth).padStart(2, "0") +
        "-" +
        String(pickDay).padStart(2, "0");
      programmData["programDetails"]["pickUp_date"] = pickUpDate;

      let pickUpHour = String(pickUp_time?.getHours()).padStart(2, "0");
      let pickUpMinute = String(pickUp_time?.getMinutes()).padStart(2, "0");

      let pickTime = pickUpHour + ":" + pickUpMinute;

      programmData["programDetails"]["pickUp_Time"] = pickTime;

      let destTime =
        String(stopTimes[stopTimes.length - 1]?.hours).padStart(2, "0") +
        ":" +
        String(stopTimes[stopTimes.length - 1]?.minutes).padStart(2, "0");
      programmData["programDetails"]["dropOff_time"] = destTime;

      const destinationPoint = destinationRef.current;

      if (
        destinationPoint &&
        destinationPoint.placeName &&
        destinationPoint.coordinates
      ) {
        programmData["programDetails"]["destination_point"] = {
          placeName: destinationPoint.placeName,
          coordinates: destinationPoint.coordinates,
        };
      } else {
        console.error("destinationRef does not have the expected properties.");
      }

      const originPoint = originRef.current;

      if (originPoint && originPoint.placeName && originPoint.coordinates) {
        setProgrammData((prevData) => ({
          ...prevData,
          origin_point: {
            placeName: originPoint.placeName,
            coordinates: originPoint.coordinates,
          },
        }));
      } else {
        console.error("originPoint does not have the expected properties.");
      }

      let stops = [];

      for (let i = 0; i < waypts.length; i++) {
        stops.push({
          id: "",
          address: {
            placeName: waypts[i].location,
            coordinates: waypts[i].coordinates,
          },

          time:
            String(stopTimes[i].hours).padStart(2, "0") +
            ":" +
            String(stopTimes[i].minutes).padStart(2, "0"),
        });
      }

      programmData["programDetails"]["stops"] = stops;
      console.log(programmData);
    }
    if (!isNextButtonDisabled()) {
      setactiveVerticalTab(activeVerticalTab + 1);
    } else {
      alert("Please fill all required fields before proceeding.");
    }
  };

  if (!isLoaded) {
    return <p>Loading!!!!!</p>;
  }

  function onLoad(autocomplete: any) {
    setSearchResult(autocomplete);
  }

  function onLoadStop(autocomplete: any) {
    setSearchStop(autocomplete);
  }

  function onLoadDest(autocomplete: any) {
    setSearchDestination(autocomplete);
  }

  function onPlaceChanged() {
    if (searchResult != null) {
      const place = (
        searchResult as unknown as google.maps.places.Autocomplete
      ).getPlace();
      const name = place.name;
      const location = place.geometry?.location;

      if (location) {
        const coordinates = { lat: location.lat(), lng: location.lng() };

        setRecap((prevRecap) => ({
          ...prevRecap,
          originRef: name!,
        }));

        // setProgrammData((prevData) => ({
        //   ...prevData,
        //   origin_point: {
        //     placeName: name!,
        //     coordinates: coordinates,
        //   },
        // }));
        programmData["programDetails"]["origin_point"].placeName = name!;
        programmData["programDetails"]["origin_point"].coordinates =
          coordinates!;
        const status = place.business_status;
        const formattedAddress = place.formatted_address;
      } else {
        console.error("Location not found in place object");
      }
    } else {
      alert("Please enter text");
    }
  }

  function onPlaceChangedStop() {
    if (searchStop != null) {
      const place = (
        searchStop as unknown as google.maps.places.Autocomplete
      ).getPlace();
      const name = place.name;
      const location = place.geometry?.location;
      if (location) {
        const nom = { lat: location.lat(), lng: location.lng() };
        setStop(nom);

        const status = place.business_status;
        const formattedAddress = place.formatted_address;
        const wayPoint = {
          location: formattedAddress,
          coordinates: {
            lat: nom.lat,
            lng: nom.lng,
          },
          stopover: true,
        };
        setWaypts((waypts) => [...waypts, wayPoint]);
      } else {
        console.error("Location not found in place object");
      }
    } else {
      alert("Please enter text");
    }
  }

  function onPlaceChangedDest() {
    if (searchDestination != null) {
      const place = (
        searchDestination as unknown as google.maps.places.Autocomplete
      ).getPlace();
      const name = place.name;
      const location = place.geometry?.location;

      if (location) {
        const coordinates = { lat: location.lat(), lng: location.lng() };

        setRecap((prevRecap) => ({
          ...prevRecap,
          destinationRef: name!,
        }));

        // setProgrammData((prevData) => ({
        //   ...prevData,
        //   destination_point: {
        //     placeName: name!,
        //     coordinates: coordinates,
        //   },
        // }));
        programmData["programDetails"]["destination_point"].placeName = name!;
        programmData["programDetails"]["destination_point"].coordinates =
          coordinates!;
        const status = place.business_status;
        const formattedAddress = place.formatted_address;
      } else {
        console.error("Location not found in place object");
      }
    } else {
      alert("Please enter text");
    }
  }

  const handleLocationButtonClick = () => {
    setSelectedLocation(nom);
  };
  const handleLocationButtonClickStop = () => {
    setSelectedStop(stop);
  };

  const handleLocationButtonClickDest = () => {
    setSelectedDestination(fatma);
  };

  function clearRoute() {
    setDirectionsResponse(null);
    setLoading(false);
    setDistance("");
    setDuration("");
    originRef.current.value = "";
    destinationRef.current.value = "";
  }

  async function calculateRoute(): Promise<void> {
    //stopTimes = [];
    setOriginSwitchRef(originRef?.current!.value);
    setDestSwitchRef(destinationRef?.current!.value);

    if (
      originRef?.current!.value === "" ||
      destinationRef?.current!.value === "" ||
      !map
    ) {
      console.error("Invalid inputs or map not loaded.");
      return;
    }

    setLoading(true);

    const directionsService = new google.maps.DirectionsService();
    let waypoints = [];
    for (let point of waypts) {
      waypoints.push({
        location: point.location,
        stopover: true,
      });
    }
    directionsService.route(
      {
        origin: originRef.current.value,
        destination: destinationRef.current.value,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints,
      },
      (result, status) => {
        setLoading(false);

        if (status === google.maps.DirectionsStatus.OK) {
          setDirectionsResponse(result);
          setRouteDirections(result);

          const selectedRoute = result?.routes!.find((route) => {
            const segments = route.legs.map((leg, index) => ({
              segment: index + 1,
              startAddress: leg.start_address,
              endAddress: leg.end_address,
              distance: leg?.distance!.text!,
              duration: leg?.duration!.text!,
            }));
            setRouteSegments(segments);

            let durations = route.legs.map((leg, index) => ({
              duration: leg?.duration!.value!,
            }));
            const hours_first = Math.floor(durations[0].duration / 3600);
            const minutes_first = Math.floor(
              (durations[0].duration % 3600) / 60
            );

            let pickUpHour = String(pickUp_time?.getHours()).padStart(2, "0");
            let pickUpMinute = String(pickUp_time?.getMinutes()).padStart(
              2,
              "0"
            );

            const time_first = addDurationToTime(
              pickUpHour + ":" + pickUpMinute,
              hours_first,
              minutes_first
            );
            let temporarryTimes = [time_first];
            for (let i = 1; i < durations.length; i++) {
              const hours = Math.floor(durations[i].duration / 3600);
              const minutes = Math.floor((durations[i].duration % 3600) / 60);

              const time = addDurationToTime(
                String(temporarryTimes[i - 1]?.hours) +
                  ":" +
                  String(temporarryTimes[i - 1]?.minutes),
                hours,
                minutes
              );
              temporarryTimes.push(time);
            }
            setStopTimes(temporarryTimes);
          });

          if (!selectedRoute) {
            return;
          }

          if (map && directionsResponse) {
            const directionsRenderer = new google.maps.DirectionsRenderer();
            directionsRenderer.setMap(map);
            directionsRenderer.setDirections(directionsResponse);
          }
        } else {
          console.error("Error fetching directions:", status);
        }
      }
    );
  }

  const createDateFromStrings = (YyyyMmDd: string, HhMmSs: string) => {
    let date = new Date(YyyyMmDd + ", " + HhMmSs);
    return date;
  };

  const addDurationToTime = (
    time: string,
    hoursToAdd: number,
    minutesToAdd: number
  ) => {
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    totalMinutes += hoursToAdd * 60 + minutesToAdd;

    const newHours = Math.floor(totalMinutes / 60) % 24;
    const newMinutes = totalMinutes % 60;

    return {
      hours: newHours,
      minutes: newMinutes,
    };
  };
  const subtractTime = (
    time: string,
    hoursToSubtract: number,
    minutesToSubtract: number
  ) => {
    const [hours, minutes] = time.split(":").map(Number);
    let totalMinutes = hours * 60 + minutes;
    totalMinutes -= hoursToSubtract * 60 + minutesToSubtract;

    if (totalMinutes < 0) {
      totalMinutes += 24 * 60; // Add 24 hours if the result is negative
    }

    const newHours = Math.floor(totalMinutes / 60);
    const newMinutes = totalMinutes % 60;

    return {
      hours: newHours,
      minutes: newMinutes,
    };
  };
  const calculateDuration = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    let totalStartMinutes = startHours * 60 + startMinutes;
    let totalEndMinutes = endHours * 60 + endMinutes;

    let durationInMinutes = totalEndMinutes - totalStartMinutes;

    if (durationInMinutes < 0) {
      durationInMinutes += 24 * 60;
    }

    const durationHours = Math.floor(durationInMinutes / 60);
    const durationMinutes = durationInMinutes % 60;

    let duration = {
      hours: durationHours,
      minutes: durationMinutes,
    };

    return duration;
  };
  const compareTimes = (time1: string, time2: string) => {
    let ref = 0;
    if (time1 > time2) {
      ref = 1;
    } else if (time1 < time2) {
      ref = 2;
    }
    return ref;
  };

  const accumulateDurations = (durations: any) => {
    let totalDuration = {
      hours: 0,
      minutes: 0,
    };
    for (let duration of durations) {
      const hours = Math.floor(duration.duration / 3600);
      const minutes = Math.floor((duration.duration % 3600) / 60);
      totalDuration.hours += hours;
      totalDuration.minutes += minutes;
    }

    let totalMinutes = totalDuration.hours * 60 + totalDuration.minutes;

    let validHours = Math.floor(totalMinutes / 60) % 24;
    let valdMinutes = totalMinutes % 60;

    let total = {
      hours: validHours,
      minutes: valdMinutes,
    };

    return total;
  };
  const getPreviousDay = (date: string) => {
    let t = createDateFromStrings(date, "00:00:00");
    t.setDate(t.getDate() - 1);
    const year = t.getFullYear();
    const month = t.getMonth() + 1;
    const day = t.getDate().toLocaleString();

    let prevDate =
      String(year) +
      "-" +
      String(month).padStart(2, "0") +
      "-" +
      String(day).padStart(2, "0");

    return prevDate;
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumb title="Program" pageTitle="Management" />
          <Card className="overflow-hidden">
            <Card.Body className="form-steps">
              <Card>
                <Card.Body className="form-steps" style={{ height: "70vh" }}>
                  <Form
                    className="vertical-navs-step"
                    onSubmit={onSubmitProgramm}
                  >
                    <Tab.Container activeKey={activeVerticalTab}>
                      <Tab.Content>
                        <Tab.Pane eventKey="1">
                          <Row>
                            <Col lg={4}>
                              <Row>
                                <Col lg={10}>
                                  <Form.Label htmlFor="programDetails.programName">
                                    Program Name
                                  </Form.Label>
                                  <Form.Control
                                    type="text"
                                    id="programDetails.programName"
                                    required
                                    className="mb-2"
                                    placeholder="Add Program Name"
                                    name="programDetails.programName"
                                    value={programm_name}
                                    onChange={onChangeProgramName}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col>
                                  <Form.Label htmlFor="customerName-field">
                                    Locations
                                  </Form.Label>
                                </Col>
                              </Row>
                              <Row className="mb-2">
                                <Col lg={2}>
                                  {/* <div className="d-flex gap-1"> */}
                                  <InputGroup.Text
                                    id="basic-addon1"
                                    style={{ width: "100px" }}
                                  >
                                    From
                                  </InputGroup.Text>
                                </Col>
                                <Col lg={5}>
                                  <Autocomplete
                                    onPlaceChanged={onPlaceChanged}
                                    onLoad={onLoad}
                                    options={{
                                      componentRestrictions: { country: "uk" },
                                    }}
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder="Origin"
                                      ref={originRef}
                                      id="origin"
                                      onClick={() => {
                                        handleLocationButtonClick();
                                        if (nom) {
                                          map?.panTo(nom);
                                          map?.setZoom(15);
                                        }
                                      }}
                                      onChange={onChangeProgramms}
                                      required
                                    />
                                  </Autocomplete>
                                  {/* </div> */}
                                </Col>
                                <Col lg={3}>
                                  {/* <div className="d-flex justify-content-center"> */}
                                  <Flatpickr
                                    className="form-control text-center"
                                    id="pickUp_time"
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "H:i",
                                      time_24hr: true,
                                      onChange: handlePickupTime,
                                    }}
                                  />
                                </Col>
                              </Row>
                              <Row>
                                <Col lg={1}>
                                  <InputGroup.Text
                                    id="basic-addon1"
                                    style={{ width: "100px" }}
                                  >
                                    To
                                  </InputGroup.Text>
                                </Col>
                                <Col lg={6}>
                                  <Autocomplete
                                    onPlaceChanged={onPlaceChangedDest}
                                    onLoad={onLoadDest}
                                    options={{
                                      componentRestrictions: { country: "uk" },
                                    }}
                                  >
                                    <Form.Control
                                      type="text"
                                      // style={{ width: "300px" }}
                                      placeholder="Destination"
                                      ref={destinationRef}
                                      id="dest"
                                      onClick={() => {
                                        handleLocationButtonClickDest();
                                        if (fatma) {
                                          map?.panTo(fatma);
                                          map?.setZoom(15);
                                        }
                                      }}
                                      onChange={onChangeProgramms}
                                    />
                                  </Autocomplete>
                                </Col>
                                <Col lg={3}>
                                  <Flatpickr
                                    placeholder="HH:MM"
                                    className="form-control text-center"
                                    id="pickUp_time"
                                    value={createDateFromStrings(
                                      String(new Date().getFullYear()).padStart(
                                        2,
                                        "0"
                                      ) +
                                        "-" +
                                        String(
                                          new Date().getMonth() + 1
                                        ).padStart(2, "0") +
                                        "-" +
                                        String(
                                          new Date().getDate().toLocaleString()
                                        ).padStart(2, "0"),
                                      stopTimes[stopTimes.length - 1]?.hours +
                                        ":" +
                                        stopTimes[stopTimes.length - 1]
                                          ?.minutes +
                                        ":00"
                                    ).getTime()}
                                    disabled={true}
                                    options={{
                                      enableTime: true,
                                      noCalendar: true,
                                      dateFormat: "H:i",
                                      time_24hr: true,
                                    }}
                                  />
                                </Col>
                              </Row>
                              {loading ? (
                                <p>Calculating route...</p>
                              ) : (
                                <Row>
                                  <Col lg={10}>
                                    <Button
                                      type="submit"
                                      onClick={calculateRoute}
                                      className="custom-button"
                                    >
                                      Plan Route
                                    </Button>
                                  </Col>
                                </Row>
                              )}
                              <div
                                style={{
                                  marginTop: "20px",
                                  maxHeight: "300px",
                                  overflowX: "auto",
                                }}
                              >
                                {stops2.map((stop, index) => (
                                  <Row>
                                    <Col lg={7} key={index}>
                                      <Form.Label htmlFor="customerName-field">
                                        Stop {index + 1}
                                      </Form.Label>
                                      <div className="mb-3 d-flex">
                                        <Autocomplete
                                          onPlaceChanged={onPlaceChangedStop}
                                          onLoad={onLoadStop}
                                          options={{
                                            componentRestrictions: {
                                              country: "uk",
                                            },
                                          }}
                                        >
                                          <Form.Control
                                            type="text"
                                            style={{ width: "280px" }}
                                            placeholder="Stop"
                                            ref={stopRef}
                                            id="stop"
                                            onClick={() => {
                                              handleLocationButtonClickStop();
                                            }}
                                          />
                                        </Autocomplete>
                                        {
                                          <Flatpickr
                                            className="form-control"
                                            style={{ width: "100px" }}
                                            id="pickUp_time"
                                            value={createDateFromStrings(
                                              String(
                                                new Date().getFullYear()
                                              ).padStart(2, "0") +
                                                "-" +
                                                String(
                                                  new Date().getMonth() + 1
                                                ).padStart(2, "0") +
                                                "-" +
                                                String(
                                                  new Date()
                                                    .getDate()
                                                    .toLocaleString()
                                                ).padStart(2, "0"),
                                              stopTimes[index]?.hours +
                                                ":" +
                                                stopTimes[index]?.minutes +
                                                ":00"
                                            ).getTime()}
                                            options={{
                                              enableTime: true,
                                              noCalendar: true,
                                              dateFormat: "H:i",
                                              time_24hr: true,
                                            }}
                                            onChange={(selectedDates) =>
                                              handleStopTime(
                                                selectedDates,
                                                index
                                              )
                                            }
                                          />
                                        }
                                      </div>
                                    </Col>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-icon"
                                      onClick={() =>
                                        handleRemoveStopClick(stop.id)
                                      }
                                      style={{
                                        marginTop: "29px",
                                        marginLeft: "152px",
                                      }}
                                    >
                                      <i className="ri-delete-bin-5-line"></i>
                                    </button>
                                  </Row>
                                ))}
                                <div className="d-flex flex-btn-via">
                                  <Link
                                    to="#"
                                    id="add-item"
                                    className="btn btn-soft-info fw-medium"
                                    onClick={handleAddStopClickWrapper(
                                      "New Stop Address"
                                    )}
                                    style={{ width: "150px" }}
                                  >
                                    <i className="ri-add-line label-icon align-middle rounded-pill fs-16 me-2">
                                      {" "}
                                      Via
                                    </i>
                                  </Link>
                                </div>
                              </div>
                            </Col>
                            <Col lg={8}>
                              <div
                                style={{
                                  position: "absolute",
                                  left: "0",
                                  height: "100%",
                                  width: "100%",
                                }}
                              >
                                <GoogleMap
                                  center={center}
                                  zoom={15}
                                  mapContainerStyle={{
                                    width: "100%",
                                    height: "80%",
                                  }}
                                  options={{
                                    zoomControl: false,
                                    streetViewControl: false,
                                    mapTypeControl: false,
                                    fullscreenControl: true,

                                    fullscreenControlOptions: {
                                      position:
                                        google.maps.ControlPosition.TOP_RIGHT,
                                    },
                                  }}
                                  onLoad={(map) => setMap(map)}
                                >
                                  {selectedLocation && (
                                    <Marker position={nom} />
                                  )}
                                  {selectedDestination && (
                                    <Marker position={fatma} />
                                  )}
                                  {directionsResponse && (
                                    <DirectionsRenderer
                                      directions={directionsResponse}
                                    />
                                  )}
                                </GoogleMap>
                                <Button
                                  aria-label="center back"
                                  onClick={clearRoute}
                                  variant="danger"
                                  style={{
                                    position: "absolute",
                                    top: "10px",
                                    left: "10px",
                                    zIndex: 1000,
                                    marginLeft: "15px",
                                  }}
                                >
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    width="20"
                                    height="20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.146 14.146a.5.5 0 0 1-.708 0L8.5 7.207l-3.938 3.937a.5.5 0 0 1-.707-.707l4.146-4.146a1.5 1.5 0 0 1 2.121 0l6 6a.5.5 0 0 1 0 .708zM6.646 9.354a.5.5 0 0 1 .708 0L8 10.293l2.646-2.647a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 0-.708z"
                                    />
                                  </svg>
                                  Clear Route
                                </Button>
                              </div>
                              <div
                                className="d-flex align-items-end"
                                style={{ marginTop: "570px" }}
                              >
                                <Dropdown style={{ marginLeft: "0" }}>
                                  <Dropdown.Toggle
                                    variant="light"
                                    id="dropdown-basic"
                                  >
                                    Route Information
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {routeSegments.map((segment, index) => (
                                      <Dropdown.Item key={index}>
                                        <div>
                                          <p>
                                            Route Segment: {segment.segment}
                                          </p>
                                          <p>
                                            {segment.startAddress} To{" "}
                                            {segment.endAddress}
                                          </p>
                                          <p>{segment.distance}</p>
                                          <p>{segment.duration}</p>
                                        </div>
                                      </Dropdown.Item>
                                    ))}
                                  </Dropdown.Menu>
                                </Dropdown>
                                <Button
                                  type="button"
                                  className="btn btn-success btn-label right ms-auto nexttab "
                                  onClick={() => handleNextStep(false)}
                                  disabled={isNextButtonDisabled()}
                                >
                                  <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                                  Set Run dates
                                </Button>
                              </div>
                            </Col>
                          </Row>
                        </Tab.Pane>
                        <Tab.Pane eventKey="2">
                          <Row>
                            <div className="mt-2">
                              <h5>Run Dates</h5>
                            </div>
                            <Col lg={5}>
                              <InputGroup>Start Date</InputGroup>
                              <div className="mb-3">
                                <Flatpickr
                                  value={pickUp_date!}
                                  onChange={handleDateChange1}
                                  className="form-control flatpickr-input"
                                  id="pickUp_date"
                                  placeholder="Select Date"
                                  options={{
                                    dateFormat: "d M, Y",
                                    onChange: (selectedDates: Date[]) => {
                                      setPickUp_date(selectedDates[0]);
                                    },
                                  }}
                                />
                              </div>
                            </Col>
                            <Col className="d-flex justify-content-center align-items-center">
                              <h5>to</h5>
                            </Col>
                            <Col lg={5}>
                              <InputGroup>End Date</InputGroup>

                              <Flatpickr
                                value={dropOff_date!}
                                onChange={handleDateChange2}
                                className="form-control flatpickr-input"
                                id="dropOff_date"
                                placeholder="Select Date"
                                options={{
                                  dateFormat: "d M, Y",
                                  onChange: (selectedDates: Date[]) => {
                                    setDropOff_date(selectedDates[0]);
                                  },
                                }}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <div className="mt-2">
                              <h5>Free Days</h5>
                            </div>
                            <Col lg={5}>
                              <Flatpickr
                                value={free_date!}
                                onChange={handleDateChange3}
                                className="form-control flatpickr-input"
                                id="free_date"
                                placeholder="Select Date"
                                options={{
                                  dateFormat: "d M, Y",
                                  mode: "multiple",
                                  onChange: (selectedDates: Date[]) => {
                                    setFree_date(selectedDates);
                                  },
                                }}
                              />
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={6}>
                              <div className="mt-2">
                                <h5 className="fs-14 mb-1">
                                  Days of week not running
                                </h5>
                                <p className="text-muted">
                                  Slide the selected excepted days to the right
                                </p>
                                <DualListBox
                                  options={options1}
                                  selected={selected1}
                                  onChange={(e: any) => {
                                    setSelected1(e);
                                  }}
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
                                        className="bi bi-chevron-right"
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
                          <div className="d-flex align-items-start gap-3 mt-3">
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
                              onClick={() => handleNextStep(false)}
                              disabled={isNextButtonDisabled()}
                            >
                              <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                              Add Options
                            </Button>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="3">
                          <Row>
                            <Col lg={2}>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault"
                                  id="flexRadioDefault1"
                                  onChange={radioHandlerGroupCreationMode}
                                  value="AutoGroup"
                                />
                                <Form.Label
                                  className="form-check-label fs-17"
                                  htmlFor="flexRadioDefault1"
                                >
                                  Auto Groups
                                </Form.Label>
                              </div>
                            </Col>
                            <Col lg={2}>
                              <div className="form-check mb-2">
                                <input
                                  className="form-check-input"
                                  type="radio"
                                  name="flexRadioDefault"
                                  id="flexRadioDefault1"
                                  onChange={radioHandlerGroupCreationMode}
                                  value="Custom"
                                />
                                <Form.Label
                                  className="form-check-label fs-17"
                                  htmlFor="flexRadioDefault1"
                                >
                                  Custom Groups
                                </Form.Label>
                              </div>
                            </Col>
                          </Row>
                          {selectedGroupCreationMode === "AutoGroup" ? (
                            <>
                              <Row>
                                <Col lg={3}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="recommanded_capacity">
                                      Recommanded Capacity
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="recommanded_capacity"
                                      required
                                      className="mb-2"
                                      name="recommanded_capacity"
                                      value={recommandedCapacityState}
                                      onChange={
                                        onChangeRecommandedCapacityState
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col lg={3}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="vehicleType">
                                      Vehicle Type
                                    </Form.Label>
                                    <div>
                                      <select
                                        className="form-select text-muted"
                                        name="vehicleType"
                                        id="vehicleType"
                                        onChange={handleSelectVehicleType}
                                      >
                                        <option value="">
                                          Select Vehicle Type
                                        </option>
                                        {filteredVehicleType.map(
                                          (vehicleType) => (
                                            <option
                                              value={
                                                vehicleType.vehicle_type.type
                                              }
                                              key={vehicleType.vehicle_type._id}
                                            >
                                              {vehicleType.vehicle_type.type}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </div>
                                  </div>
                                </Col>
                                <Col lg={3}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="luggageDetails">
                                      Luggage Details
                                    </Form.Label>
                                    <select
                                      className="form-select text-muted"
                                      name="luggageDetails"
                                      id="luggageDetails"
                                      onChange={handleSelectLuggage}
                                    >
                                      <option value="">Select Luggage</option>
                                      {filteredVehicleType.map((Luggage) => (
                                        <option
                                          value={Luggage.max_luggage._id}
                                          key={Luggage.max_luggage._id}
                                        >
                                          {Luggage.max_luggage.description}
                                        </option>
                                      ))}
                                    </select>
                                  </div>
                                </Col>
                                <Col lg={3}>
                                  <button
                                    type="button"
                                    className="btn btn-info"
                                    onClick={() => generateGroups()}
                                    disabled={
                                      selectedVehicleType === "" ||
                                      selectedLuggage === ""
                                        ? true
                                        : false
                                    }
                                    style={{ marginTop: "28px" }}
                                  >
                                    <span className="mdi mdi-cog"></span>{" "}
                                    Generate
                                  </button>
                                </Col>
                              </Row>
                              <Row>{rows}</Row>
                              <hr className="text-muted" />
                            </>
                          ) : selectedGroupCreationMode === "Custom" ? (
                            <>
                              <Row>
                                <Col lg={4}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="recommanded_capacity">
                                      Recommanded Capacity
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="recommanded_capacity"
                                      required
                                      className="mb-2"
                                      name="recommanded_capacity"
                                      value={recommandedCapacityState}
                                      onChange={
                                        onChangeRecommandedCapacityState
                                      }
                                    />
                                  </div>
                                </Col>
                                <Col lg={4}>
                                  <div className="mb-3">
                                    <Form.Label htmlFor="recommanded_capacity">
                                      Affected / Total
                                    </Form.Label>
                                    <Form.Control
                                      type="text"
                                      id="recommanded_capacity"
                                      disabled
                                      // defaultValue="0/15"
                                      className="bg-light mb-2"
                                      name="recommanded_capacity"
                                      value={
                                        affectedCounter +
                                        "/" +
                                        recommandedCapacityState
                                      }
                                    />
                                  </div>
                                </Col>
                              </Row>
                              <hr className="text-muted" />
                              <Row
                                className="mb-3"
                                style={{
                                  maxHeight: "calc(50vh - 50px)",
                                  overflowX: "auto",
                                }}
                              >
                                {companyGroups.map((group, index) => (
                                  <Row key={index}>
                                    <Col lg={3}>
                                      <Form.Label htmlFor="customerName-field">
                                        Group Name
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        id="customerName-field"
                                        className="mb-2"
                                        name="customerName-field"
                                        value={group.groupName}
                                        onChange={(e) =>
                                          onChangeCompanyGroupName(e, index)
                                        }
                                      />
                                    </Col>
                                    <Col lg={2}>
                                      <Form.Label htmlFor="pax">
                                        Passengers
                                      </Form.Label>
                                      <Form.Control
                                        type="text"
                                        id="pax"
                                        className="mb-2"
                                        name="pax"
                                        placeholder={`1 - ${recommandedCapacityState}`}
                                        value={group.passenger_number}
                                        onChange={(e) =>
                                          onChangeCompanyGroupPax(e, index)
                                        }
                                      />
                                    </Col>
                                    <Col lg={3}>
                                      <div>
                                        <Form.Label htmlFor="customerName-field">
                                          Vehicle
                                        </Form.Label>
                                        <select
                                          className="form-select text-muted"
                                          name="vehicleType"
                                          id="vehicleType"
                                          onChange={(e) =>
                                            handleCustomSelectCompanyVehicleType(
                                              e,
                                              index
                                            )
                                          }
                                        >
                                          <option value="">
                                            Select Vehicle Type
                                          </option>
                                          {group.passenger_limit.map(
                                            (vehicleType) => (
                                              <option
                                                value={
                                                  vehicleType.vehicle_type.type
                                                }
                                                key={
                                                  vehicleType.vehicle_type._id
                                                }
                                              >
                                                {vehicleType.vehicle_type.type}
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    </Col>
                                    <Col lg={3}>
                                      <div className="mb-3">
                                        <Form.Label htmlFor="luggageDetails">
                                          Luggage Details
                                        </Form.Label>
                                        <select
                                          className="form-select text-muted"
                                          name="luggageDetails"
                                          id="luggageDetails"
                                          onChange={(e) =>
                                            handleCustomSelectCompanyLuggageDetails(
                                              e,
                                              index
                                            )
                                          }
                                        >
                                          <option value="">
                                            Select Luggage
                                          </option>
                                          {group.passenger_limit.map(
                                            (Luggage) => (
                                              <option
                                                value={Luggage.max_luggage._id}
                                                key={Luggage.max_luggage._id}
                                              >
                                                {
                                                  Luggage.max_luggage
                                                    .description
                                                }
                                              </option>
                                            )
                                          )}
                                        </select>
                                      </div>
                                    </Col>
                                    <Col lg={1}>
                                      <button
                                        type="button"
                                        className="btn btn-danger btn-icon"
                                        onClick={() =>
                                          handleRemoveCompanyGroupClick(index)
                                        }
                                        style={{
                                          marginTop: "29px",
                                          marginBottom: "15px",
                                          // marginLeft: "152px",
                                        }}
                                      >
                                        <i className="ri-delete-bin-5-line"></i>
                                      </button>
                                    </Col>
                                  </Row>
                                ))}

                                <div className="d-flex">
                                  <Link
                                    to="#"
                                    id="add-item"
                                    className="btn btn-soft-info fw-medium"
                                    onClick={handleAddGroupClick}
                                  >
                                    <i className="ri-add-line label-icon align-middle rounded-pill fs-16 me-2"></i>
                                  </Link>
                                </div>
                              </Row>
                            </>
                          ) : (
                            ""
                          )}
                          <div className="d-flex align-items-start gap-3">
                            <Button
                              type="button"
                              className="btn btn-light btn-label previestab"
                              onClick={() => setactiveVerticalTab(2)}
                            >
                              <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                              Back to Run Dates
                            </Button>
                            <Button
                              type="button"
                              className="btn btn-success btn-label right ms-auto nexttab nexttab"
                              onClick={() => setactiveVerticalTab(4)}
                              // disabled={disabledNext}
                            >
                              <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                              Go To Extra
                            </Button>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="4">
                          <Row>
                            <Col lg={6}>
                              <div className="mb-3">
                                <Form.Label htmlFor="journeyType">
                                  Journey Type
                                </Form.Label>
                                <select
                                  className="form-select text-muted"
                                  name="journeyType"
                                  id="journeyType"
                                  onChange={handleSelectJourney}
                                >
                                  <option value="">Select Journey Type</option>
                                  {AllJourneys.map((journeys) => (
                                    <option
                                      value={journeys._id}
                                      key={journeys._id}
                                    >
                                      {journeys.type}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </Col>
                          </Row>
                          <Row>
                            <Col lg={6}>
                              <div>
                                <Form.Label htmlFor="VertiExtraInput">
                                  Extra
                                </Form.Label>
                                <p className="text-muted">
                                  Slide the selected option to the right
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
                                        className="bi bi-chevron-right"
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
                            <Col lg={6}>
                              <div>
                                <Form.Label htmlFor="notes" className="mb-5">
                                  Notes
                                </Form.Label>
                                <textarea
                                  className="form-control"
                                  id="notes"
                                  name="notes"
                                  rows={5}
                                  placeholder="Enter your notes"
                                  value={programm_notes}
                                  onChange={onChangeProgramNotes}
                                ></textarea>
                              </div>
                            </Col>
                          </Row>
                          <div className="d-flex align-items-start gap-3">
                            <Button
                              type="button"
                              className="btn btn-light btn-label previestab"
                              onClick={() => setactiveVerticalTab(3)}
                            >
                              <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                              Back to Options
                            </Button>

                            <Button
                              type="button"
                              className="btn btn-success btn-label right ms-auto nexttab nexttab"
                              onClick={() => handleNextStep(true)}
                              disabled={isNextButtonDisabled()}
                            >
                              <i className="ri-arrow-right-line label-icon align-middle fs-16 ms-2"></i>
                              Go To Resume
                            </Button>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="5">
                          <div
                            style={{
                              maxHeight: "calc(80vh - 80px)",
                              overflowY: "auto",
                            }}
                          >
                            {renderRecapPage()}
                          </div>
                          <div
                            className="d-flex justify-content-between"
                            style={{ marginTop: "10px", marginBottom: "15px" }}
                          >
                            <Button
                              type="button"
                              className="btn btn-light btn-label previestab"
                              onClick={() => setactiveVerticalTab(4)}
                            >
                              <i className="ri-arrow-left-line label-icon align-middle fs-16 me-2"></i>{" "}
                              Back to Extra
                            </Button>

                            <Button
                              variant="success"
                              type="submit"
                              className="w-sm"
                            >
                              Submit
                            </Button>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </Tab.Container>
                  </Form>
                </Card.Body>
              </Card>
            </Card.Body>
          </Card>
        </Container>
      </div>
    </React.Fragment>
  );
};
export default AddProgramm;
