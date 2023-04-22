import { ChangeEvent } from "react";

type InputProps = {
    label: string;
    value: string | number;
    name: string;
    onChange: (value: string | number) => void;
    type?: string;
    placeholder?: string;
    error?: string;
}

export default function Input({ label, name, value, onChange, type = 'text', placeholder = '', error = '' }: InputProps) {
    const id = `input-${name}`;
    const sendValue = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    }

    return (
        <div className="w-full mb-4">
            <label
                htmlFor={id}
                className="mb-2 block"
            >
                { label }
            </label>
            <input
                className="h-9 w-full rounded border border-solid border-black py-[0.32rem] px-3 leading-[1.6] outline-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id={id}
                placeholder={placeholder}
                type={type}
                value={value}
                onChange={sendValue}
            />
            <small
                id={id + '-helper'}
                className="w-full text-red-default mt-1"
            >
                { error }
            </small>
        </div>
    )
}