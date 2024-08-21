/**
 * Form component with validation using Joi and React Hook Form.
 */
import Joi from "joi";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";


export default function Form() {
    /**
     * Validation Schema
     */
    const LoginValidation = Joi.object({
        email: Joi.string().email({ tlds: { allow: false } }).required().messages({
            'string.email': 'Email is invalid',
            'string.empty': 'Email is required',
            'any.required': 'Email is required',
        }),
        password: Joi.string().min(8).required().messages({
            'string.min': 'Password must be at least 8 characters long',
            'string.empty': 'Password is required',
            'any.required': 'Password is required',
        }),
    });

    const { register, handleSubmit, errors } = useForm({
        resolver: joiResolver(LoginValidation),
    });

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label htmlFor="emailInput">Email</label>
            <input type="text" id="emailInput" {...register("email")} />
            {errors.email && <p  className="text-red">{errors.email.message}</p>}

            <label htmlFor="passwordInput">Password</label>
            <input type="password" id="passwordInput" {...register("password")} />
            {errors.password && <p className="text-red">{errors.password.message}</p>}

            <button type="submit">Submit</button>
        </form>
    );
}