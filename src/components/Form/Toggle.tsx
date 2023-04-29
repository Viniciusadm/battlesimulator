import { InputHTMLAttributes } from "react";
import { useFormContext } from 'react-hook-form'

interface ToggleProps extends InputHTMLAttributes<HTMLInputElement> {
    name: string
}

export function Toggle(props: ToggleProps) {
    const { register } = useFormContext()

    return (
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                    type="checkbox"
                    className="sr-only peer"
                    id={props.id || props.name}
                    {...register(props.name)}
                    {...props}
                />
                <div
                    className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-violet-500"
                >
                </div>
        </label>
    )
}