import React from 'react'
import Dialog from '@mui/material/Dialog';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import useStateContext from '@/context/ContextProvider';


const Delete_member_modal = ({ open, close }) => {
    const { member_delete_id, cookieUser, handle_delete_member, set_all_members } = useStateContext()
    const handleDelete = () => {
        handle_delete_member(set_all_members, member_delete_id, cookieUser.id);
        close();
    }

    return (
        <Dialog
            open={open.delete_member_modal}
            onClose={close}
        >
            <div className=' md:w-[500px] p-6 md:p-7 relative flex flex-col gap-8 md:gap-10' >
                <div onClick={close} className='absolute hidden md:block right-0 md:right-3 top-2 md:top-2 cursor-pointer select-none' >
                    <IconButton >
                        <CloseIcon className='scale-[.9] md:scale-[1.1] text-stone-500' />
                    </IconButton>
                </div>
                <p className='text-[13px] md:text-[16px] text-stone-600 font-medium' >Are you sure, you want to delete this Member?</p>
                <div className='w-full flex justify-end gap-4' >
                    <button onClick={close} className='text-[12px] md:text-[15px] text-stone-600 px-4 py-[6px] rounded-md hover:bg-stone-300 transition-all' >Cancel</button>
                    <button onClick={handleDelete} className='bg-red-500 hover:bg-red-400 px-4 py-[6px] rounded-md text-white text-[12px] md:text-[15px] transition-all' >Delete</button>
                </div>
            </div>
        </Dialog>
    )
}

export default Delete_member_modal