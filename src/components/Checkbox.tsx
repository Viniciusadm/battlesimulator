import { ChangeEvent, useState } from "react";

type CheckboxProps = {
    label: string;
    value: string[];
    name: string;
    onChange: (values: string[]) => void;
    values: { id: string, value: string | number, label: string }[];
}

export default function Checkbox({ label, name, onChange, values }: CheckboxProps) {
    const [selecteds, setSelecteds] = useState<string[]>([]);

    const change = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelecteds([...selecteds, e.target.value]);
        } else {
            setSelecteds(selecteds.filter((s) => s !== e.target.value));
        }

        onChange(selecteds);
    }

    return (
        <>
            <h3 className="mb-4 font-semibold text-gray-900">
                { label }
            </h3>
            <ul className="w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg mb-4">
                {values.map((item) => (
                    <li className="w-full border-b border-gray-200 rounded-t-lg" key={item.id}>
                        <div className="flex items-center pl-3 w-full">
                            <input
                                id={item.id}
                                type="checkbox"
                                value={item.value}
                                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                                onChange={(e) => change(e)}
                                name={name}
                            />
                            <label
                                htmlFor={item.id}
                                className="w-full py-3 ml-2 text-sm font-medium text-gray-900"
                            >
                                {item.label}
                            </label>
                        </div>
                    </li>
                ))}
            </ul>
        </>
    )
}