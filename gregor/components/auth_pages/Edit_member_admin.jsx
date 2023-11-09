import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import useStateContext from '@/context/ContextProvider';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText } from '@mui/material';
import mongoose from 'mongoose';

const Edit_user_admin = () => {
    const {
        handleUpdateUserAPI,
        cookieUser,
        handle_get_all_members_API,
        openModal,
        set_member_delete_id,
    } = useStateContext();

    const [values, setValues] = useState({
        name: "",
        email: "",
        password: "",
        showPassword: false,
    });

    // password patterns
    const lowercasePattern = /[a-z]/;
    const uppercasePattern = /[A-Z]/;
    const lengthPattern = /^.{8,55}$/;

    // passowrds visibility turn On/Off function
    const handleClickShowPassword = (prop) => {
        setValues(prev => ({
            ...prev,
            showPassword: !prev["showPassword"],
        }));
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    // form validation
    const validateForm = (fieldName, value) => {
        let error = "";
        switch (fieldName) {
            case "name":
                if (!value) {
                    error = "Please complete your full name."
                }
                break;
            case "email":
                if (!value) {
                    error = 'Please enter an email';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case "password":
                if (!value) {
                    error = 'Please enter a password';
                } else {
                    if (!lowercasePattern.test(value)) {
                        error = 'Password must contain at least 1 lowercase letter';
                    }
                    if (!uppercasePattern.test(value)) {
                        error = 'Password must contain at least 1 uppercase letter';
                    }
                    if (!lengthPattern.test(value)) {
                        error = 'Password must be between 8 and 55 characters long';
                    }
                }
                break;
            case "id":
                if (!value) {
                    error = "Please Enter the user ID"
                }
                if (value && !mongoose.Types.ObjectId.isValid(value)) {
                    error = "Please Enter a valid ID"
                }
                break;
        }
        return error;
    }

    const [updatedValues, setUpdatedValues] = useState({
        errors: {
            name: "",
            email: "",
            password: "",
        }
    });
    const [updatingStatus, setUpdatingStatus] = useState(false) // it's gonna show if user has updated smth.


    // searching user
    const [user_for_update, set_user_for_update] = useState(null);
    const [user_id, set_user_id] = useState({
        id: "",
        errors: { id: "" }
    });

    const handle_user_id_input_change = (e) => {
        const { name, value } = e.target;
        set_user_id(prev => ({ ...prev, [name]: value }));
    }

    const handle_user_id_input_blur = (event) => {
        const { name, value } = event.target;
        const error = validateForm(name, value);
        set_user_id((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                [name]: error,
            },
        }));

    }

    const fetch_user_for_update = async () => {

        let errors = {}

        Object.keys(user_id).forEach(each => {
            let error = validateForm(each, user_id[each]);
            if (error) {
                errors[each] = error;
            }
        });
        if (Object.values(errors).every(e => !e)) {
            await handle_get_all_members_API(set_user_for_update, "single_user", cookieUser.id, user_id.id, setValues);
        }
    };


    // handling input blur
    const handleBlur = (target) => (event) => {
        const { name, value } = event.target;
        const error = validateForm(name, value);
        setUpdatedValues((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                [name]: error,
            },
        }));

    }

    // handling states
    const handleChange = (target) => (e) => {
        const { value, name } = e.target;
        setUpdatingStatus(true);

        if (user_for_update[name] === value) {
            const copyUpdateValues = { ...updatedValues }
            delete copyUpdateValues[name];
            setUpdatedValues(copyUpdateValues);
        } else {
            setUpdatedValues(prev => ({ ...prev, [name]: value }));
            set_user_for_update(prev => ({ ...prev, [name]: value }));
        }
    }

    // canceling update
    const cancelUpdate = () => {
        setUpdatingStatus(false);
        set_user_for_update(prev => ({
            ...prev,
            name: values.name,
            email: values.email,
            password: values.password,
            showPassword: false,
        }));
        setUpdatedValues({
            errors: {
                name: "",
                email: "",
                password: "",
            }
        });
    }

    // submitting updated form of user
    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = {}

        Object.keys(updatedValues).forEach(each => {
            let error = validateForm(each, user_for_update[each]);
            if (error) {
                errors[each] = error;
            }
        });

        setUpdatedValues(prev => ({
            ...prev,
            errors: { ...prev.errors, ...errors }
        }));


        if (Object.values(errors).every(e => !e)) {
            const { errors, ...restUpdatedValues } = updatedValues;
            let updateObj = restUpdatedValues
            if (updatedValues.password) {
                const { password } = updatedValues
                updateObj = { ...updateObj, password }
            }
            handleUpdateUserAPI({ ...updateObj, _id: user_for_update._id }, setUpdatingStatus, "", "admin_true", "member_edit");
        }

    }
    // delete member
    const handle_delete = (id, param) => {
        set_member_delete_id(id);
        openModal(param);
    }

    return (

        <div className={`w-full bg-slate-100 h-full flex justify-center px-[20px]`} >
            {cookieUser &&
                <form onSubmit={handleSubmit} className='w-full flex flex-col items-center gap-5 md:gap-6 p-[20px] mb-6' >

                    <div className='flex flex-col w-full gap-1 justify-center' >
                        <p className='text-[20px] md:text-[30px] font-semibold text-slate-700' >
                            Edit Member
                        </p>
                        {user_for_update ?
                            <p className='text-[13px] md:text-[15px] font-semibold text-slate-500' >To edit a member, update the details.</p>
                            :
                            <p className='text-[13px] md:text-[15px] font-semibold text-slate-500' >To edit a member, search member with ID.</p>
                        }
                    </div>


                    {user_for_update ?
                        <>
                            {/* user fullname input */}
                            <div className='w-full' >
                                <label
                                    htmlFor=""
                                    className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                                >
                                    Name
                                </label>
                                <FormControl
                                    className='w-full'
                                    size="small"


                                >
                                    <TextField
                                        autoComplete='off'
                                        size='small'
                                        className='w-full mt-1 md:mt-2'
                                        name="name"
                                        value={user_for_update.name}
                                        onChange={handleChange()}
                                        onBlur={handleBlur()}
                                        error={Boolean(updatedValues.errors.name)}
                                        helperText={updatedValues.errors.name}
                                        placeholder="Name"
                                    />
                                </FormControl>
                            </div>


                            {/* user email input */}
                            <div className='w-full' >
                                <label
                                    htmlFor=""
                                    className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                                >
                                    Email
                                </label>
                                <FormControl
                                    className='w-full'
                                    size="small"


                                >
                                    <TextField
                                        autoComplete='off'
                                        size='small'
                                        className='w-full mt-1 md:mt-2'
                                        name="email"
                                        value={user_for_update.email}
                                        onChange={handleChange()}
                                        onBlur={handleBlur()}
                                        error={Boolean(updatedValues.errors.email)}
                                        helperText={updatedValues.errors.email}
                                        placeholder="Email"
                                    />
                                </FormControl>
                            </div>





                            {/* password */}
                            <div className='w-full' >
                                <label
                                    htmlFor=""
                                    className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                                >
                                    Password
                                </label>
                                <FormControl
                                    className='w-full mt-1 md:mt-2'
                                    variant="outlined"
                                    size='small'
                                >
                                    <OutlinedInput
                                        autoComplete="new-password"
                                        name="password"
                                        error={Boolean(updatedValues.errors.password)}
                                        value={user_for_update.password}
                                        onChange={handleChange("password")}
                                        onBlur={handleBlur("password")}
                                        type={values.showPassword ? 'text' : 'password'}
                                        placeholder="Password"
                                        endAdornment={
                                            <InputAdornment position="end">
                                                <IconButton
                                                    aria-label="toggle password visibility"
                                                    onClick={() => handleClickShowPassword('showPassword')}
                                                    onMouseDown={handleMouseDownPassword}
                                                    edge="end"
                                                >
                                                    {values.showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        }
                                    />
                                    {updatedValues.errors.password && <FormHelperText error>{updatedValues.errors.password}</FormHelperText>}
                                </FormControl>
                            </div>
                        </>
                        :
                        < div className='w-full' >
                            <label
                                htmlFor=""
                                className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                            >
                                Search member by ID
                            </label>
                            <FormControl
                                className='w-full'
                                size="small"
                            >
                                <TextField
                                    autoComplete='off'
                                    size='small'
                                    className='w-full mt-1 md:mt-2'
                                    name="id"
                                    value={user_id.id}
                                    onChange={handle_user_id_input_change}
                                    onBlur={handle_user_id_input_blur}
                                    error={Boolean(user_id.errors.id)}
                                    helperText={user_id.errors.id}
                                    placeholder="Search"
                                />
                            </FormControl>
                        </div>


                    }




                    {/* Footer buttons */}
                    <div className='flex justify-between w-full pb-[20px] lg:pb-[40px]' >
                        {user_for_update ?
                            <>
                                <div className='flex gap-4' >

                                    <button
                                        type='submit'
                                        disabled={!updatingStatus}
                                        className={`${updatingStatus ?
                                            "border-violet-700 bg-violet-700 hover:opacity-80"
                                            :
                                            "border-violet-300 bg-violet-300"
                                            }
                                border rounded-md px-[18px] py-[6px] text-white text-[12px] md:text-[14px] transition-all`} >
                                        Save changes
                                    </button>

                                    <button
                                        type='button'
                                        disabled={!updatingStatus}
                                        onClick={cancelUpdate}
                                        className={`border  rounded-md px-[18px] py-[6px] text-[12px] md:text-[14px]  transition-all ${updatingStatus ? "text-zinc-700 border-stone-400 hover:bg-stone-200" : "text-stone-400 border-stone-300"}`} >
                                        Cancel
                                    </button>
                                </div>
                                <button
                                    type='button'
                                    onClick={() => handle_delete(user_for_update._id, "delete_member_modal")}
                                    className='border border-red-500 bg-red-500 rounded-md px-[18px] py-[8px] text-white text-[15px] hover:opacity-80 transition-all'
                                >
                                    Delete
                                </button>

                            </>
                            :
                            <button
                                type='button'
                                onClick={fetch_user_for_update}
                                disabled={!user_id.id}
                                className={`${user_id.id ?
                                    "border-violet-700 bg-violet-700 hover:opacity-80"
                                    :
                                    "border-violet-300 bg-violet-300"
                                    }
                            border rounded-md px-[18px] py-[6px] text-white text-[12px] md:text-[14px] transition-all`} >
                                Search
                            </button>
                        }

                    </div>

                    {/* <input dir="ltr" type="text" inputmode="numeric" placeholder="MM / YY" autocomplete="billing cc-exp" />
      <input dir="ltr" type="text" inputmode="numeric" placeholder="1234 1234 1234 1234" autocomplete="billing cc-number" /> */}
                </form>
            }
        </div >
    )
}

export default Edit_user_admin