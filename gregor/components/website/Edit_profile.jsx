import React, { useState, useEffect } from 'react'
import Image from "next/image";
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import unknown from "@/public/images/unknown.jpg"
import useStateContext from '@/context/ContextProvider';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { FormHelperText } from '@mui/material';
import styles from "@/styles/Home.module.css";

const Edit_profile = () => {
    const {
        handleUpdateUserAPI,
        cookieUser,
    } = useStateContext();

    const [values, setValues] = useState({
        name: "",
        email: "",
    });

    const defaultPasswordState = {
        changePassword: false,
        oldPassword: "",
        password: "",
        confirmPassword: "",
        showOldPassword: false,
        showPassword: false,
        showConfirmPassword: false,
        errors: {
            password: "",
            confirmPassword: "",
            oldPassword: "",
        }
    }
    const [passwordState, setPasswordState] = useState(defaultPasswordState);

    const passwordStateRevert = () => {
        setPasswordState(defaultPasswordState);
    }
    // password patterns
    const lowercasePattern = /[a-z]/;
    const uppercasePattern = /[A-Z]/;
    const lengthPattern = /^.{8,55}$/;

    // passowrds visibility turn On/Off function
    const handleClickShowPassword = (prop) => {
        setPasswordState(prev => ({
            ...prev,
            [prop]: !prev[prop],
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
            case "confirmPassword":
                if (!value) {
                    error = 'Please enter a confirm password';
                } else if (value && value !== passwordState.password) {
                    error = 'Confirmed password is wrong'
                }
                break;
            case "oldPassword":
                if (!value) {
                    error = 'Please enter your old password';
                }
                break;
        }
        return error;
    }

    const [updatedValues, setUpdatedValues] = useState({
        errors: {
            name: "",
            email: "",
        }
    })
    useEffect(() => {
        if (cookieUser) {
            setValues({
                name: cookieUser.name,
                email: cookieUser.email,
            })
        }
    }, [cookieUser])
    const [updatingStatus, setUpdatingStatus] = useState(false) // it's gonna show if user has updated smth.

    // handling input blur
    const handleBlur = (target) => (event) => {
        const { name, value } = event.target;
        const error = validateForm(name, value);
        if (target === "password") {
            setPasswordState((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    [name]: error,
                },
            }));
        } else {
            setUpdatedValues((prevState) => ({
                ...prevState,
                errors: {
                    ...prevState.errors,
                    [name]: error,
                },
            }));
        }
    }

    // handling states
    const handleChange = (target) => (e) => {
        const { value, name } = e.target;
        setUpdatingStatus(true);
        if (target === "password") {
            setPasswordState(prev => ({ ...prev, [name]: value }));
        } else {
            if (cookieUser[name] === value) {
                const copyUpdateValues = { ...updatedValues }
                delete copyUpdateValues[name];
                setUpdatedValues(copyUpdateValues);
            } else {
                setUpdatedValues(prev => ({ ...prev, [name]: value }));
            }
            setValues(prev => ({ ...prev, [name]: value }));
        }
    }

    // canceling update
    const cancelUpdate = () => {
        setUpdatingStatus(false);
        setValues({
            name: cookieUser.name,
            email: cookieUser.email,
        });
        setPasswordState({
            oldPassword: "",
            password: "",
            confirmPassword: "",
            showOldPassword: false,
            showPassword: false,
            showConfirmPassword: false,
            errors: {
                password: "",
                confirmPassword: "",
                oldPassword: "",
            }
        });
        setUpdatedValues({
            errors: {
                name: "",
                email: "",
            }
        });
    }

    // submitting updated form of user
    const handleSubmit = (e) => {
        e.preventDefault();

        let errors = {}
        let errors2 = {}

        Object.keys(updatedValues).forEach(each => {
            let error = validateForm(each, values[each]);
            if (error) {
                errors[each] = error;
            }
        });
        Object.keys(passwordState).forEach(each => {
            let error = validateForm(each, passwordState[each]);
            if (error && passwordState.oldPassword && passwordState.password) {
                errors2[each] = error;
            }
        });

        setUpdatedValues(prev => ({
            ...prev,
            errors: { ...prev.errors, ...errors }
        }));


        if (Object.values({ ...errors, ...errors2 }).every(e => !e)) {
            const { errors, ...restUpdatedValues } = updatedValues;
            let updateObj = restUpdatedValues
            if (passwordState.oldPassword && passwordState.password) {
                const { password, oldPassword } = passwordState
                updateObj = { ...updateObj, password, oldPassword }
            }
            handleUpdateUserAPI({ ...updateObj, _id: cookieUser.id, }, setUpdatingStatus, passwordStateRevert, "", "");
        }

    }


    return (

        <div className={`w-full h-[calc(100vh-60px)] flex justify-center overflow-y-auto px-[20px] ${styles.scrollBar}`} >
            {cookieUser &&
                <form onSubmit={handleSubmit} className='w-full lg:w-[450px] flex flex-col items-center gap-5 md:gap-6 pt-24 lg:pt-6 mb-6' >
                    <Image src={unknown} alt="user" className='object-cover rounded-full w-[100px] border-4 border-stone-300' />

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
                                value={values.name}
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
                                value={values.email}
                                onChange={handleChange()}
                                onBlur={handleBlur()}
                                error={Boolean(updatedValues.errors.email)}
                                helperText={updatedValues.errors.email}
                                placeholder="Email"
                            />
                        </FormControl>
                    </div>





                    {/* Old password */}
                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                        >
                            Old password
                        </label>
                        <FormControl
                            className='w-full mt-1 md:mt-2'
                            variant="outlined"
                            size='small'
                        >
                            <OutlinedInput
                                autoComplete="new-password"
                                name="oldPassword"
                                error={Boolean(passwordState.errors.oldPassword)}
                                value={passwordState.oldPassword}
                                onChange={handleChange("password")}
                                onBlur={handleBlur("password")}
                                type={passwordState.showOldPassword ? 'text' : 'password'}
                                placeholder="Old password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('showOldPassword')}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {passwordState.showOldPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {passwordState.errors.oldPassword && <FormHelperText error>{passwordState.errors.oldPassword}</FormHelperText>}
                        </FormControl>
                    </div>
                    {/* New Password */}
                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                        >
                            New Password
                        </label>
                        <FormControl
                            className='w-full mt-1 md:mt-2'
                            variant="outlined"
                            size='small'
                        >
                            <OutlinedInput
                                name="password"
                                error={Boolean(passwordState.errors.password)}
                                value={passwordState.password}
                                onChange={handleChange("password")}
                                onBlur={handleBlur("password")}
                                type={passwordState.showPassword ? 'text' : 'password'}
                                placeholder="New password"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('showPassword')}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {passwordState.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {passwordState.errors.password && <FormHelperText error>{passwordState.errors.password}</FormHelperText>}
                        </FormControl>
                    </div>
                    {/* confirm Passwords */}
                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-bold text-[13px] md:text-[14px]`}
                        >
                            Confirm Password
                        </label>
                        <FormControl
                            className='w-full mt-1 md:mt-2'
                            variant="outlined"
                            size='small'
                        >
                            <OutlinedInput
                                name="confirmPassword"
                                error={Boolean(passwordState.errors.confirmPassword)}
                                value={passwordState.confirmPassword}
                                onChange={handleChange("password")}
                                onBlur={handleBlur("password")}
                                type={passwordState.showConfirmPassword ? 'text' : 'password'}
                                placeholder="Confirm Password"


                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('showConfirmPassword')}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {passwordState.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {passwordState.errors.confirmPassword && <FormHelperText error>{passwordState.errors.confirmPassword}</FormHelperText>}
                        </FormControl>
                    </div>



                    {/* Footer buttons */}
                    <div className='flex justify-between w-full pb-[20px] lg:pb-[40px]' >

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

                    {/* <input dir="ltr" type="text" inputmode="numeric" placeholder="MM / YY" autocomplete="billing cc-exp" />
      <input dir="ltr" type="text" inputmode="numeric" placeholder="1234 1234 1234 1234" autocomplete="billing cc-number" /> */}
                </form>
            }
        </div>
    )
}

export default Edit_profile