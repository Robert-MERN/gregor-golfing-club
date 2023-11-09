import React, { useState } from 'react'
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormControl from '@mui/material/FormControl';
import { FormHelperText } from '@mui/material';
import { useRouter } from 'next/router';
import useStateContext from '@/context/ContextProvider';
import { Fade } from 'react-reveal';


const adding_member_form_admin = () => {
    const { cookieUser, handle_add_member_API } = useStateContext()


    const default_form_state = {
        email: '',
        name: '',
        password: '',
        confirmPassword: '',
        showPassword: false,
        showConfirmPassword: false,
        errors: {
            email: '',
            name: '',
            password: '',
            confirmPassword: '',
        },
    }
    const [formState, setFormState] = useState(default_form_state);


    const handleClickShowPassword = (prop) => {
        setFormState({
            ...formState,
            [prop]: !formState[prop],
        });
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };


    // password patterns
    const lowercasePattern = /[a-z]/;
    const uppercasePattern = /[A-Z]/;
    const lengthPattern = /^.{8,55}$/;

    const validateField = (fieldName, value) => {
        let error = '';
        switch (fieldName) {
            case 'email':
                if (!value) {
                    error = 'Please enter an email';
                } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
                    error = 'Invalid email address';
                }
                break;
            case 'name':
                if (!value) {
                    error = 'Please enter member name';
                } else if (value.length > 55) {
                    error = 'Is too long (maximum is 55 characters).'
                }
                break;
            case 'password':
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
            case 'confirmPassword':
                if (!value) {
                    error = 'Please enter a confirm password';
                } else if (value && value !== formState.password) {
                    error = 'Confirmed password is wrong'
                }
                break;
                if (!value) {
                    error = 'Please select member gender';
                }
                break;
            default:
                break;
        }
        return error;
    }

    const handleBlur = (event) => {
        const { name, value } = event.target;
        const error = validateField(name, value);
        setFormState((prevState) => ({
            ...prevState,
            errors: {
                ...prevState.errors,
                [name]: error,
            },
        }));
    }

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    }


    const default_state_func = () => {
        setFormState(default_form_state);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const errors = {};
        Object.keys(formState).forEach((fieldName) => {
            const error = validateField(fieldName, formState[fieldName]);
            if (error) {
                errors[fieldName] = error;
            }
        });
        setFormState((prevState) => ({
            ...prevState,
            errors,
        }));
        if (Object.values(errors).every((error) => !error)) {
            // Form is valid, submit it
            // ...
            const { confirmPassword, showPassword, showConfirmPassword, errors, ...other } = formState;
            handle_add_member_API(other, cookieUser.id, default_state_func);
        }
    }










    return (
        <Fade>
            <div className='flex flex-col gap-8 md:p-[10px] bg-transparent'>
                <div className='flex flex-col w-full gap-1 justify-center' >
                    <p className='text-[20px] md:text-[30px] font-semibold text-slate-700' >
                        Add New Member
                    </p>
                    <p className='text-[13px] md:text-[15px] font-semibold text-slate-500' >To add new member, please enter the details.</p>
                </div>
                <form onSubmit={handleSubmit} className='flex flex-col items-center gap-3' >

                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-semibold text-[13px] md:text-[15px]`}
                        >
                            Name
                        </label>
                        <FormControl
                            className='w-full md:mt-1 mt-2'
                        >
                            <TextField
                                size='small'
                                error={Boolean(formState.errors.name)}
                                helperText={formState.errors.name}
                                name="name"
                                placeholder="Enter member Name"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={formState.name}
                            />

                        </FormControl>
                    </div>

                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-semibold text-[13px] md:text-[15px]`}
                        >
                            Email
                        </label>
                        <FormControl
                            className='w-full mt-1 md:mt-2'
                        >
                            <TextField
                                size='small'
                                autoComplete='off'
                                placeholder="Enter member Email"
                                error={Boolean(formState.errors.email)}
                                helperText={formState.errors.email}
                                name="email"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={formState.email}
                            />
                        </FormControl>
                    </div>

                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-semibold text-[13px] md:text-[15px]`}
                        >
                            Password
                        </label>
                        <FormControl
                            className='w-full mt-1 md:mt-2'
                            variant="outlined"
                            size='small'
                        >
                            <OutlinedInput
                                name="password"
                                autoComplete='new-password'
                                error={Boolean(formState.errors.password)}
                                onChange={handleChange}
                                value={formState.password}
                                onBlur={handleBlur}
                                placeholder="Enter member Password"
                                type={formState.showPassword ? 'text' : 'password'}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('showPassword')}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {formState.showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formState.errors.password && <FormHelperText error>{formState.errors.password}</FormHelperText>}
                        </FormControl>
                    </div>

                    <div className='w-full' >
                        <label
                            htmlFor=""
                            className={`text-stone-800 font-semibold text-[13px] md:text-[15px]`}
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
                                error={Boolean(formState.errors.confirmPassword)}
                                onChange={handleChange}
                                value={formState.confirmPassword}
                                onBlur={handleBlur}
                                type={formState.showConfirmPassword ? 'text' : 'password'}
                                placeholder="Enter member Password again"
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => handleClickShowPassword('showConfirmPassword')}
                                            onMouseDown={handleMouseDownPassword}
                                            edge="end"
                                        >
                                            {formState.showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            {formState.errors.confirmPassword && <FormHelperText error>{formState.errors.confirmPassword}</FormHelperText>}
                        </FormControl>
                    </div>

                    <button type="submit" className='bg-blue-500 text-slate-100 text-[15px] md:text-[17px] w-full py-[8px] rounded-md my-6 hover:opacity-80 transition-all' > Add Member </button>



                </form>
            </div>
        </Fade>
    )
}

export default adding_member_form_admin