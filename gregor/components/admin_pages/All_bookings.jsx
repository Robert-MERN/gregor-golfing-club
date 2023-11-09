import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useStateContext from '@/context/ContextProvider';
import { Button } from '@mui/material';

const headers = [
    "User Name",
    "Bay (field No.)",
    "Session",
    "Start Time",
    "End Time",
    "Player(s)",
    "Member",
    "Guest(s)",
    "Action",
]

const headers_2 = [
    "Bay (field No.)",
    "Total Time",
    "Start Time",
    "End Time",
    "Action",
]

export default function All_bookings() {

    const { openSidebar, handle_get_all_user_bookings, all_users_booking_admin_view, cookieUser, set_booking_delete_id, openModal } = useStateContext();

    const [page_content, set_page_content] = useState("all_users_bookings");
    useEffect(() => {
        if (cookieUser && page_content === "all_users_bookings") {
            handle_get_all_user_bookings(cookieUser.id);
        } else {
            if (cookieUser && page_content === "all_restricted_slots") {
                handle_get_all_user_bookings(cookieUser.id, true);
            }
        }
    }, [cookieUser, page_content]);


    function calculateTotalHours(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime.split("T")[1]}`);
        const end = new Date(`1970-01-01T${endTime.split("T")[1]}`);
        const timeDifference = end - start;

        // Convert milliseconds to hours
        const totalHours = timeDifference / (1000 * 60 * 60);

        return totalHours + " Hour(s)";
    }

    function countMembers(statement) {
        const regex = /Member/g;
        const match = statement.match(regex);
        return match ? match.length : 0;
    }

    function countGuests(statement) {
        const regex = /\b(\d+)\s*Guests?\b/g;
        const matches = statement.match(regex);
        if (matches) {
            return matches.reduce((total, match) => total + parseInt(match), 0);
        }
        return 0;
    }

    const handle_delete = (id, param) => {
        set_booking_delete_id(id);
        openModal(param);
    }

    return (
        <div className={`w-full h-[calc(100vh-60px)] overflow-y-auto ${openSidebar ? "px-[20px] md:px-[40px]" : "px-[80px]"} pt-24 lg:pt-6 transition-all duration-300`}>


            <div className='w-full rounded-t-md border flex items-center mb-4 md:mb-8 overflow-hidden'>
                <button
                    onClick={() => set_page_content("all_users_bookings")}
                    className={`flex-1 border-r hover:opacity-75 border-stone-200 py-[10px] md:text-[14px] text-[12px] font-semibold w-full ${page_content === "all_users_bookings" ? "bg-violet-600 text-white" : "bg-stone-300 text-stone-600"} transition-all`}
                >
                    Users's Bookings
                </button>
                <button
                    onClick={() => set_page_content("all_restricted_slots")}
                    className={`flex-1 py-[10px] hover:opacity-75 md:text-[14px] text-[12px]  font-semibold w-full ${page_content === "all_restricted_slots" ? "bg-violet-600 text-white" : "bg-stone-300 text-stone-600"} transition-all select-none`}
                >
                    Restricted Slots
                </button>

            </div>
            {page_content === "all_users_bookings" ?

                <TableContainer className='w-[400px] md:w-full overflow-x-auto' component={Paper}>
                    <Table size="medium" aria-label="My Booking">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className='text-stone-500 font-semibold text-[13px]'
                                >
                                    Date
                                </TableCell>
                                {headers.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        align="center"
                                        className='text-stone-500 font-semibold text-[13px]'
                                    >
                                        {header}
                                    </TableCell>
                                ))
                                }
                            </TableRow>
                        </TableHead>
                        {Boolean(all_users_booking_admin_view.length) &&
                            <TableBody>
                                {
                                    all_users_booking_admin_view.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                        >
                                            <TableCell className='text-stone-500 whitespace-nowrap' component="th" scope="row" align="center">
                                                {row.start.split("T")[0]}
                                            </TableCell>
                                            <TableCell className='text-stone-500 capitalize whitespace-nowrap' component="th" scope="row" align="center">
                                                {row.username}
                                            </TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.bay_field}</TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{calculateTotalHours(row.start, row.end)}</TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.start.split("T")[1]}</TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.end.split("T")[1]}</TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.players}</TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{countMembers(row.title)}</TableCell>
                                            <TableCell className='text-stone-500 whitespace-nowrap' align="center">{countGuests(row.title)}</TableCell>
                                            <TableCell align="center">
                                                <Button
                                                    onClick={() => handle_delete(row._id, "delete_booking_modal")}
                                                    key={index} size='small'
                                                    variant='outlined'
                                                    color='error'
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        }
                    </Table>
                    {!Boolean(all_users_booking_admin_view.length) &&
                        <div className='w-full grid place-items-center py-[40px]' >
                            <p className='text-stone-400 text-[13px]' >No Bookings</p>
                        </div>
                    }
                </TableContainer>

                :

                <TableContainer className='w-[400px] md:w-full overflow-x-auto' component={Paper}>
                    <Table size="medium" aria-label="My Booking">
                        <TableHead>
                            <TableRow>
                                <TableCell
                                    className='text-stone-500 font-semibold text-[13px]'
                                >
                                    Date
                                </TableCell>
                                {headers_2.map((header, index) => (
                                    <TableCell
                                        key={index}
                                        align="center"
                                        className='text-stone-500 font-semibold text-[13px]'
                                    >
                                        {header}
                                    </TableCell>
                                ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Boolean(all_users_booking_admin_view.length) &&
                                all_users_booking_admin_view.map((row, index) => (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell className='text-stone-500 whitespace-nowrap' component="th" scope="row" align="left">
                                            {row.start.split("T")[0]}
                                        </TableCell>

                                        <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.bay_field}</TableCell>
                                        <TableCell className='text-stone-500 whitespace-nowrap' align="center">{calculateTotalHours(row.start, row.end)}</TableCell>
                                        <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.start.split("T")[1]}</TableCell>
                                        <TableCell className='text-stone-500 whitespace-nowrap' align="center">{row.end.split("T")[1]}</TableCell>
                                        <TableCell align="center">
                                            <Button
                                                onClick={() => handle_delete(row._id, "unrestrict_slot_modal")}
                                                key={index} size='small'
                                                variant='outlined'
                                                color='error'
                                            >
                                                Un-restrict
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>

                    {!Boolean(all_users_booking_admin_view.length) &&
                        <div className='w-full grid place-items-center py-[40px]' >
                            <p className='text-stone-400 text-[13px]' >No Restricted Slots</p>
                        </div>
                    }
                </TableContainer>
            }

        </div>
    );
}