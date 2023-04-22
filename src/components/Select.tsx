import { ChangeEvent, ReactNode } from "react";

type SelectProps = {
    label: string;
    value: string | number;
    name: string;
    onChange: (value: string | number) => void;
    children: ReactNode;
    placeholder?: string;
    error?: string;
}

export default function Select({ label, name, value, onChange, children, placeholder = '', error = '' }: SelectProps) {
    const id = `input-${name}`;
    const sendValue = (e: ChangeEvent<HTMLSelectElement>) => {
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
            <select
                className="bg-white h-9 w-full rounded border border-solid border-black py-[0.32rem] px-3 leading-[1.6] outline-none [&:not([data-te-input-placeholder-active])]:placeholder:opacity-0"
                id={id}
                value={value}
                onChange={sendValue}
            >
                <option value="">{placeholder}</option>
                {children}
            </select>
            <small
                id={id + '-helper'}
                className="w-full text-red-default mt-1"
            >
                { error }
            </small>
        </div>
    )
}
