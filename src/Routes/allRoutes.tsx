import { Navigate } from "react-router-dom";

import Dashboard from "pages/Dashboard";


import Categories from "pages/Products/Categories";
import SubCategories from "pages/Products/SubCategories";

// Orders
import OrdersListView from "pages/Orders/ListView";
import OrdersOverview from "pages/Orders/Overview";

// Calender
import Calendar from "pages/Calendar";

// Sellers
import SellersListView from "pages/Sellers/ListView";
import SellersGridView from "pages/Sellers/GridView";
import SellersOverview from "pages/Sellers/Overview";

// Invoice
import InvoiceList from "pages/Invoices/InvoiceList";
import InvoiceDetails from "pages/Invoices/InvoiceDetails";
import CreateInvoice from "pages/Invoices/CreateInvoice";

// User List
import UsersList from "pages/UsersList";

// Shipping
import Shipments from "pages/Shipping/Shipments";
import ShippingList from "pages/Shipping/ShippingList";

// Coupons
// import Coupons from "pages/Coupons";

//Review & Rating
import ReviewRating from "pages/Reviews-Rating";

//Brands
import Brands from "pages/Brands";

//Reporting

// Localization
import Transactions from "pages/Localization/Transactions";
import CurrencyRates from "pages/Localization/CurrencyRates";

// Accounts
import MyAccount from "pages/Accounts/MyAccount";
import Settings from "pages/Accounts/Settings";
import SignIn from "pages/Accounts/AuthenticationInner/SignIn";
import PasswordReset from "pages/Accounts/AuthenticationInner/PasswordReset";
import PasswordCreate from "pages/Accounts/AuthenticationInner/PasswordCreate";
import SuccessMessage from "pages/Accounts/AuthenticationInner/SuccessMessage";
import TwoStepVerify from "pages/Accounts/AuthenticationInner/TwoStepVerify";
import BasicLogout from "pages/Accounts/AuthenticationInner/Logout";
import Error404 from "pages/Accounts/AuthenticationInner/Error404";
import Error500 from "pages/Accounts/AuthenticationInner/Error500";
import ComingSoon from "pages/Accounts/AuthenticationInner/ComingSoon";

import UserProfile from "pages/Authentication/user-profile";
// import Vehicles from "pages/Vehicles";

//? Notes
// import Notes from "pages/Notes";
import AddNewAccount from "pages/Employees/Accounts/AddNewAccount";
import Account from "pages/Employees/Accounts";
import Group from "pages/Employees/Groups";
import AddNewGroup from "pages/Employees/Groups/AddNewGroup";
import Attendances from "pages/Attendance";
import Station from "pages/Programming/Station";
import GoogleMap from "pages/Tracking/map-tracking";
import Claim from "pages/claims";
import ClaimDetails from "pages/claims/claimDetails";

import ContractDetails from "pages/Contracts/ContractDetails";
import EmployeePayment from "pages/Payment/employee";
import TripsManagement from "pages/management";
import TransactionsTable from "pages/Accounts/MyAccount/TransactionsTable";
import Offers from "pages/Programming/Offer";
import Reporting from "pages/Reporting";
import SingleProfile from "pages/Employees/Accounts/SingleAccount";
import Claims from "pages/claims";
import Groups from "pages/Employees/Groups/groups";
import Programs from "pages/Programming/Programs";
import ProgramList from "pages/Programming/programList";
import ProgramClone from "pages/Programming/programList/ProgramClone";
import ProgramDetails from "pages/Programming/programList/ProgramDetails";
import AddProgramm from "pages/Programming/Programs";
import ProgramDetail from "pages/Programming/programList/ProgramDetail";
import ArchivedComplains from "pages/claims/ArchivedComplains";
import Login from "pages/Authentication/Login";
import Contract from "pages/Contracts";
import StopsManagement from "pages/Programming/Programs/StopManagement";
import ProgramGroups from "pages/Programming/Programs/ProgramGroups";



const authProtectedRoutes = [
  { path: "/dashboard", component: <Dashboard /> },

  //? Tracking
 
  { path: "/delays&changes", component: <Shipments /> },
  { path: "/tracking", component: <GoogleMap /> },

  //? Programming

  { path: "/extra-trips", component: <Calendar /> },
  { path: "/offers", component: <Offers /> },
  { path: "/trip-management", component: <TripsManagement /> },
  { path: "/Scheduling", component: <CurrencyRates /> },

  
  { path: "/programming/addProgram", component: < AddProgramm/> },
  { path: "/programming/list-of-programs", component: < ProgramList/> },
  { path: "/programming/list-of-programs/programDetail", component: < ProgramDetail/> },
  { path: "/program/:name", component: < ProgramClone/> },
  { path: "/program-details/:name", component: < ProgramDetails/> },
  { path: "/stopsmanagement", component: < StopsManagement/> },
  { path: "/programgroups", component: < ProgramGroups/> },

  //? Payment
  { path: "/payment-employee", component: <EmployeePayment /> },
  { path: "/payment-management", component: <SellersListView /> },
  

  //? Corporate
  { path: "/schools", component: <Categories /> },
  { path: "/companies", component: <SubCategories /> },
  //? Corporate ==> Sub-Contractor
  { path: "/new-applications", component: <OrdersListView /> },
  { path: "/all-sub-contractors", component: <OrdersOverview /> },

  //? Feedback & Claims
  { path: "/feedback&claims", component: <ReviewRating /> },


  //? Reporting Management
  { path: "/reporting", component: <Reporting /> },

  //? Email Templates
  

  //? Employee
  { path: "/employee/groups/new-group", component: <AddNewGroup /> },
  { path: "/employee/groups", component: <Group /> },
  { path: "/employees/account", component: <Account /> },
  { path: "/employees/account/new-account", component: <AddNewAccount/> },
  { path: "/emloyee-attendance", component: <Attendances /> },
  { path: "/single-account", component: <SingleProfile /> },
  { path: "/employees/myaccount", component: <MyAccount /> },

//? Corporate Transport ==> Programming
{ path: "/scheduling", component: <InvoiceDetails /> },
{ path: "/offers", component: <CreateInvoice /> },
{ path: "/programming/station", component: <Station/> },
{ path: "/trip-models", component: <SellersGridView /> },
 //? Group page
 { path: "/groups", component: <Groups /> },

   //? Claims

{ path: "/complains", component: <Claims /> },
{ path: "/claim-detail", component: <ClaimDetails/> },
{ path: "/complains/archive", component: <ArchivedComplains /> },
 //? Contract
 { path: "/contract", component: <Contract /> },
{ path: "/contract/:id", component: <ContractDetails/> },
  // this route should be at the end of all other routes
  // eslint-disable-next-line react/display-name
  { path: "/", exact: true, component: <Navigate to="/tracking" /> },
  { path: "*", component: <Navigate to="/tracking" /> },
  { path: "/user-profile", component: <UserProfile /> },
  // AuthenticationInner






];

const publicRoutes = [
  { path: "/login", component: <Login /> },
  { path: "/auth-signin-basic", component: <SignIn /> },
  { path: "/auth-pass-reset-basic", component: <PasswordReset /> },
  { path: "/auth-pass-change-basic", component: <PasswordCreate /> },
  { path: "/auth-success-msg-basic", component: <SuccessMessage /> },
  { path: "/auth-twostep-basic", component: <TwoStepVerify /> },
  { path: "/auth-logout-basic", component: <BasicLogout /> },
  { path: "/auth-404", component: <Error404 /> },
  { path: "/auth-500", component: <Error500 /> },
  { path: "/coming-soon", component: <ComingSoon /> },
];




export { publicRoutes, authProtectedRoutes };
