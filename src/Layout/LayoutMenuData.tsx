import React, { useEffect, useState } from "react";

const Navdata = () => {
  //state data

  const [isTracking, setIsTracking] = useState(false);
  const [isTripsSchedules, setIsTripsSchedules] = useState(false);
  const [isPayments, setIsPayments] = useState(false);
  const [isCorporate, setIsCorporate] = useState(false);
  const [isFeedbackClaims, setIsFeedbackClaims] = useState(false);
  const [isReportingManagement, setIsReportingManagement] = useState(false);
  const [isEmailTemplates, setIsEmailTemplates] = useState(false);
  const [isEmployees, setIsEmployees] = useState(false);
  const [isHelp, setIsHelp] = useState(false);

  // Multi Level
  const [isLevel1, setIsLevel1] = useState(false);
  const [isLevel2, setIsLevel2] = useState(false);

  const [iscurrentState, setIscurrentState] = useState("Tracking");

  function updateIconSidebar(e: any) {
    if (e && e.target && e.target.getAttribute("subitems")) {
      const ul: any = document.getElementById("two-column-menu");
      const iconItems: any = ul.querySelectorAll(".nav-icon.active");
      let activeIconItems = [...iconItems];
      activeIconItems.forEach((item) => {
        item.classList.remove("active");
        // var id: any = item.getAttribute("subitems");
        // if (document.getElementById(id)){
        //     document.getElementById(id).classList.remove("show");
        // }
      });
    }
  }

  useEffect(() => {
    document.body.classList.remove("twocolumn-panel");

    // if (iscurrentState !== 'Tracking') {
    //     setIsTracking(false);
    // }
    if (iscurrentState !== "TripsSchedules") {
      setIsTripsSchedules(false);
    }
    if (iscurrentState !== "Payments") {
      setIsPayments(false);
    }
    if (iscurrentState !== "Corporate") {
      setIsCorporate(false);
    }
    if (iscurrentState !== "Feedback&Claims") {
      setIsFeedbackClaims(false);
    }
    if (iscurrentState !== "ReportingManagement") {
      setIsReportingManagement(false);
    }
    if (iscurrentState !== "EmailTemplates") {
      setIsEmailTemplates(false);
    }
    if (iscurrentState !== "Employees") {
      setIsEmployees(false);
    }
    if (iscurrentState !== "Help") {
      setIsHelp(false);
    }
  }, [
    iscurrentState,
    isEmailTemplates,
    isTracking,
    isTripsSchedules,
    isPayments,
    isCorporate,
    isFeedbackClaims,
    isReportingManagement,
    isEmployees,
    isHelp,
  ]);

  const menuItems: any = [
    {
      label: "Menu",
      isHeader: true,
    },
    {
      id: "Tracking",
      label: "Dashboard",
      icon: "bi bi-speedometer2",
      link: "/dashboard",
    },
    {
      id: "Tracking",
      label: "Live Tracking",
      icon: "bi bi-map",
      link: "/tracking",
    },
    // {
    //     id: "tracking",
    //     label: "Tracking",
    //     icon: "bi bi-map",
    //     link: "/#",
    //     click: function (e: any) {
    //         e.preventDefault();
    //         setIsTracking(!isTracking);
    //         setIscurrentState('Tracking');
    //         updateIconSidebar(e);
    //     },
    //     stateVariables: isTracking,
    //     subItems: [
    //         {
    //             id: "mapTracking",
    //             label: "Map Tracking",
    //             link: "/tracking/map-tracking",
    //             parentId: "tracking",
    //             icon: "mdi mdi-map-marker-distance",
    //         },
    //         {
    //             id: "delays&changes",
    //             label: "Delays and changes",
    //             link: "/delays&changes",
    //             parentId: "tracking",
    //             icon: "bi bi-sign-turn-right-fill",
    //         },
    //     ],
    // },
    {
      id: "Operation-management",
      label: "Trips",
      icon: "bi bi-motherboard",
      link: "/trip-management",
    },
    {
      id: "Programming",
      label: "Suggested Routes",
      icon: "bi bi-calendar-week",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsTripsSchedules(!isTripsSchedules);
        setIscurrentState("TripsSchedules");
        updateIconSidebar(e);
      },
      stateVariables: isTripsSchedules,
      subItems: [
        {
          id: "level1.1",
          label: "New Suggested Route",
          link: "/programming/addProgram",
          icon: "bi bi-truck-front",
          parentId: "Programming",
        },
        {
          id: "level1.2",
          label: "List of Programs",
          link: "/programming/list-of-programs",
          icon: "mdi mdi-bus-stop-uncovered",
          parentId: "Programming",
        },
        {
          id: "Contracts",
          label: "Contracts",
          icon: "bi bi-pencil-square",
          link: "/contract",
        },
        {
          id: "level1.5",
          label: "Offers",
          link: "/offers",
          icon: "bi bi-megaphone",
          parentId: "Programming",
        },
        // { id: "level1.3", label: "Trip & management", link: "/#",icon: "bi bi-calendar-week", parentId: "Programming" },
        // { id: "level1.4", label: "Scheduling", link: "/extra-trips", icon: "bi bi-calendar3", parentId: "Programming" },
        // { id: "level1.5", label: "Offers", link: "/offers", icon: "bi bi-megaphone", parentId: "Programming" },
        // { id: "level1.6", label: "Stations", link: "/programming/station", icon: "bi bi-sign-stop", parentId: "Programming" },
        // { id: "level1.7", label: "Trip Model", link: "/extra-trips", icon: "bi bi-truck-front", parentId: "Programming" },
      ],
    },
    // {
    //     id: "Contracts",
    //     label: "Contracts",
    //     icon: "bi bi-pencil-square",
    //     link: "/contracts",

    // },
    // {
    //     id: "Extra-Trips",
    //     label: "Extra Trips",
    //     icon: "bi bi-car-front",
    //     link: "/extra-trips",

    // },

    {
      id: "Attendance",
      label: "Attendance",
      icon: "bi bi-person-check",
      link: "/emloyee-attendance",
    },

    {
      id: "Employees",
      label: "Emloyees",
      icon: "bi bi-person-workspace",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsEmployees(!isEmployees);
        setIscurrentState("Employees");
        updateIconSidebar(e);
      },
      stateVariables: isEmployees,
      subItems: [
        {
          id: "Groups",
          label: "Groups",
          link: "/employee/groups",
          parentId: "Employees",
          icon: "bi bi-people",
        },
        {
          id: "Accounts",
          label: "Accounts",
          link: "/employees/account",
          parentId: "Employees",
          icon: "bi bi-person-vcard",
        },

        // {
        //     id: "Attendance",
        //     label: "Attendance",
        //     link: "/emloyee-attendance",
        //     parentId: "Emloyees",
        //     icon:  "bi bi-person-check"

        // }
      ],
    },
    {
      id: "Tools",
      label: "Tools",
      icon: "bi bi-gear",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsPayments(!isPayments);
        setIscurrentState("Payments");
        updateIconSidebar(e);
      },
      stateVariables: isPayments,
      subItems: [
        {
          id: "level1.3",
          label: "Finance",
          link: "/payment-employee",
          icon: "bi bi-currency-pound",
          parentId: "Payments",
        },
        {
          id: "level1.3",
          label: "Reporting",
          link: "/reporting",
          icon: "bi bi-graph-up-arrow",
          parentId: "Payments",
        },
        {
          id: "level1.3",
          label: "Extra Trips",
          icon: "bi bi-car-front",
          link: "/payment-management",
          parentId: "Payments",
        },
        {
          id: "level1.3",
          label: "Delays & Changes",
          link: "/delays&changes",
          parentId: "Payments",
          icon: "bi bi-sign-turn-right-fill",
        },
        {
          id: "level1.1",
          label: "Archived Complains",
          link: "/complains/archive",
          icon: "bi bi-chat-square-quote",
          parentId: "Payments",
        },
      ],
    },
    {
      id: "Help",
      label: "Help",
      icon: "bi bi-patch-question",
      link: "/#",
      click: function (e: any) {
        e.preventDefault();
        setIsHelp(!isHelp);
        setIscurrentState("Help");
        updateIconSidebar(e);
      },
      stateVariables: isHelp,
      subItems: [
        {
          id: "User Manual",
          label: "User Manual",
          link: "/user-manual",
          icon: "mdi mdi-book-open-page-variant",
          parentId: "Help",
        },
        {
          id: "Request Feature",
          label: "Request Feature",
          link: "/requested-features",
          icon: "mdi mdi-playlist-plus",
          parentId: "Help",
        },
        {
          id: "ReportError",
          label: "Report an Error",
          link: "/report-error",
          icon: "mdi mdi-bug",
          parentId: "Help",
        },
      ],
    },

    // {
    //     id: "Reporting",
    //     label: "Reporting",
    //     icon: "bi bi-graph-up-arrow",
    //     link: "/reporting",
    // },
    // {
    //     id: "Feedback&Claims",
    //     label: "Claims Management",
    //     icon: "bi bi-chat-square-quote",
    //     link: "/claims",
    // },
  ];
  return <React.Fragment>{menuItems}</React.Fragment>;
};
export default Navdata;
