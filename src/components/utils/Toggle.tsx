export default function Toggle({ state, label, onChange }: { state: boolean, label: string, onChange: (value: boolean) => void }) {
    return (
        <label className="relative inline-flex items-center mb-5 cursor-pointer">
            <input type="checkbox" value="" className="sr-only peer" checked={state} onChange={(e) => onChange(e.target.checked)} />
            <div
                className="w-11 h-6 bg-gray-300 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500"
            >
            </div>
            <span className="ml-3 text-sm font-medium text-gray-400 dark:text-gray-500">{ label }</span>
        </label>
    );
}