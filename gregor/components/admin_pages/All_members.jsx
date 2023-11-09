import React, { useEffect, useState } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useStateContext from '@/context/ContextProvider';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';

const headers = [
    "Member ID",
    "User Name",
    "Email",
    "Password",
    "Status",
    "Action",
]


export default function All_users() {

    const router = useRouter();

    const { openSidebar, handle_get_all_members_API, cookieUser, set_member_delete_id, openModal, all_members, set_all_members } = useStateContext();

    useEffect(() => {
        if (cookieUser) {
            handle_get_all_members_API(set_all_members, "", cookieUser.id, "");
        }
    }, [cookieUser]);


    const handle_delete = (id, param) => {
        set_member_delete_id(id);
        openModal(param);
    }
    const toastConfig = {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
    }

    const edit_user = (id) => {
        navigator.clipboard.writeText(id);
        toast.info("Id has been copied", { ...toastConfig, toastId: "fetchingAllUsersFaliure" });
        router.push("/admin/add-new-member");
    }

    return (
        <div className={`w-full h-[calc(100vh-60px)] overflow-y-auto ${openSidebar ? "px-[20px] md:px-[40px]" : "px-[80px]"} pt-24 lg:pt-6 transition-all duration-300`}>



            <TableContainer className='w-[400px] md:w-full overflow-x-auto' component={Paper}>
                <Table size="medium" aria-label="My Booking">
                    <TableHead>
                        <TableRow>
                            <TableCell
                                className='text-stone-500 font-semibold text-[13px]'
                            >
                                Created At
                            </TableCell>
                            {headers.map((header, index) => (
                                <TableCell
                                    key={index}
                                    align="left"
                                    className='text-stone-500 font-semibold text-[13px]'
                                >
                                    {header}
                                </TableCell>
                            ))
                            }
                        </TableRow>
                    </TableHead>
                    {Boolean(all_members.length) &&
                        <TableBody>
                            {
                                all_members.map((row, index) => (
                                    <TableRow
                                        key={row._id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell className='text-stone-500 whitespace-nowrap' component="th" scope="row" align="justify">
                                            {row.createdAt.split("T")[0]}
                                        </TableCell>
                                        <TableCell className='text-stone-500 whitespace-nowrap' component="th" scope="row" align="justify">
                                            {row._id}
                                        </TableCell>
                                        <TableCell className='text-stone-500 capitalize whitespace-nowrap' component="th" scope="row" align="justify">
                                            {row.name}
                                        </TableCell>
                                        <TableCell className='text-stone-500 whitespace-nowrap' align="justify">{row.email}</TableCell>
                                        <TableCell className='text-stone-500 whitespace-nowrap' align="justify">{row.password}</TableCell>
                                        <TableCell className={`${row.isAdmin ? "text-green-500" : "text-blue-500"} whitespace-nowrap`} align="justify">{row.isAdmin ? "Admin" : "User"}</TableCell>

                                        <TableCell align="justify">

                                            <IconButton
                                                onClick={() => handle_delete(row._id, "delete_member_modal")}
                                                key={row._id} size='small'
                                                variant='outlined'
                                                color='error'
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => edit_user(row._id, "delete_booking_modal")}
                                                key={index} size='small'
                                                variant='outlined'
                                                color='primary'
                                            >
                                                <EditIcon />
                                            </IconButton>

                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    }
                </Table>
                {!Boolean(all_members.length) &&
                    <div className='w-full grid place-items-center py-[40px]' >
                        <p className='text-stone-400 text-[13px]' >No Members</p>
                    </div>
                }
            </TableContainer>



        </div>
    );
}