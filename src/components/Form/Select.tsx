import {InputHTMLAttributes, ReactNode} from "react";
import { useFormContext } from 'react-hook-form'

interface SelectProps extends InputHTMLAttributes<HTMLSelectElement> {
    name: string
    children: ReactNode
}

export function Select(props: SelectProps) {
    const { register } = useFormContext()

    return (
        <select
            id={props.name}
            className="flex-1 rounded border border-zinc-300 shadow-sm px-3 py-2 text-zinc-800 focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            {...register(props.name)}
            {...props}
        >
            {props.children}
        </select>
    )
}