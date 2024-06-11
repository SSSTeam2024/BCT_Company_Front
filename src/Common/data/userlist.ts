import avatar2 from "../../assets/images/users/avatar-2.jpg";
import avatar3 from "../../assets/images/users/avatar-3.jpg";
import avatar4 from "../../assets/images/users/avatar-4.jpg";
import avatar5 from "../../assets/images/users/avatar-5.jpg";
import avatar6 from "../../assets/images/users/avatar-6.jpg";
import avatar7 from "../../assets/images/users/avatar-7.jpg";
import avatar8 from "../../assets/images/users/avatar-8.jpg";
import avatar9 from "../../assets/images/users/avatar-9.jpg";
import avatar10 from "../../assets/images/users/avatar-10.jpg";

import dummyuser from "../../assets/images/users/user-dummy-img.jpg"

const userList = [
    {
        id: 1,
        user_name: "Alfred Hurst",
        user_img: avatar2,
        trip_ref: "2302FE09",
        pickup_station:"Adderley St",
        Pickup_time:"Mon Jan 28 07:15",
        dropdown_station:"Birmingham Coach Station",
        dropdown_time:"Mon Jan 28 08:15",
        status: "Inactive",
        address:"Adderley St",
        station:"High Street (Stop MS20)",
        group:"group 1",
        email:"Alfred@gmail.com",
        mobile:"+44 7911 123456"

    },
    {
        id: 2,
        user_name: "Tommy Carey",
        user_img: avatar3,
        trip_ref: "2302FE20",
        pickup_station:"Adderley St",
        Pickup_time:"Mon Jan 28 08:15",
        dropdown_station:"Birmingham Coach Station",
        dropdown_time:"Mon Jan 28 10:00",
        status: "Active",
        address:"Adderley St",
        station:"High Street (Stop MS20)",
        group:"group 1",
        email:"tommy@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 3,
        user_name: "Cassius Brock",
        user_img: avatar4,
        trip_ref: "2302FE78",
        pickup_station:"Adderley St",
        Pickup_time:"Wed Jan 30 10:00",
        dropdown_station:"Colmore Row (Stop SH2)",
        dropdown_time:"Wed Jan 28 11:00",
        status: "Active",
        address:"Adderley St",
        station:"High Street (Stop MS20)",
        group:"group 1",
        email:"cassius@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 4,
        user_name: "Camilla Winters",
        user_img: avatar5,
        trip_ref: "2302FE54",
        pickup_station:"Colmore Row (Stop SH2)",
        Pickup_time:"Thu Jan 31 11:00",
        dropdown_station:"Birmingham Brunel Street",
        dropdown_time:"Thu Jan 31 12:20",
        status: "Inactive",
        address:"Colmore Row (Stop SH2)",
        station:"High Street (Stop MS20)",
        group:"group 3",
        email:"camilla@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 5,
        user_name: "Gabrielle Holden",
        user_img: avatar6,
        trip_ref: "2302FE76",
        pickup_station:"Colmore Row (Stop SH2)",
        Pickup_time:"Thu Jan 31 12:20",
        dropdown_station:"Spring Hill Island",
        dropdown_time:"Thu Jan 31 14:00",
        status: "Active",
        address:"Colmore Row (Stop SH2)",
        station:"High Street (Stop MS20)",
        group:"group 3",
        email:"gabrielle@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 6,
        user_name: "Kristina Hooper",
        user_img: avatar7,
        trip_ref: "2302FA89",
        pickup_station:"Allison St (Stop DS2)",
        Pickup_time:"Fri Feb 01 06:00",
        dropdown_station:"Dudley Street",
        dropdown_time:"Fri Feb 01 07:30",
        status: "Inactive",
        address:"Allison St (Stop DS2)",
        station:"High Street (Stop MS20)",
        group:"group 2",
        email:"gabrielle@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 7,
        user_name: "Jacques Leon",
        user_img: dummyuser,
        trip_ref: "2302FA89",
        pickup_station:"Granville St",
        Pickup_time:"Fri Feb 01 08:30",
        dropdown_station:"Birmingham Coach Station",
        dropdown_time:"Fri Feb 01 09:30",
        status: "Active",
        address:"Granville St",
        station:"High Street (Stop MS20)",
        group:"group 2",
        email:"leon@gmail.com",
        mobile:"+44 7911 123456"
        
    },
    {
        id: 8,
        user_name: "Theresa Crawford",
        user_img: avatar8,
        trip_ref: "2302FA76",
        pickup_station:"Birmingham Brunel Street",
        Pickup_time:"Fri Feb 01 09:30",
        dropdown_station:"Colmore Row (Stop SH1)",
        dropdown_time:"Fri Feb 01 09:30",
        status: "Active",
        address:"Birmingham Brunel Street",
        station:"High Street (Stop MS20)",
        group:"group 2",
        email:"theresa@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 9,
        user_name: "Alina Holland",
        user_img: avatar9,
        trip_ref: "2302JA76",
        pickup_station:"Digbeth Coach Station",
        Pickup_time:"Sat Feb 02 09:30",
        dropdown_station:"Livery Street (Stop SH4)",
        dropdown_time:"Sat Feb 02 10:30",
        status: "Active",
        address:"Birmingham Brunel Street",
        station:"High Street (Stop MS20)",
        group:"group 4",
        email:"theresa@gmail.com",
        mobile:"+44 7911 123456"
    },
    {
        id: 10,
        user_name: "Edward Rogers",
        user_img: avatar10,
        trip_ref: "2317JA76",
        pickup_station:"Bull Street (Stop BS2)",
        Pickup_time:"Sat Feb 02 11:30",
        dropdown_station:"High Street (Stop MS20)",
        dropdown_time:"Sat Feb 02 12:30",
        status: "Inactive",
        address:"Birmingham Brunel Street",
        station:"High Street (Stop MS20)",
        group:"group 4",
        email:"edward@gmail.com",
        mobile:"+44 7911 123456"

    }
]

export { userList }