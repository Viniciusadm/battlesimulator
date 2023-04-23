export type Log = {
    message: string;
    type: 'info' | 'success' | 'warning' | 'error';
}

export default function Logs({logs}: {logs: Log[]}) {
    const getBackground = (type: Log['type']) => {
        switch (type) {
            case 'info':
                return 'bg-blue-200';
            case 'success':
                return 'bg-green-200';
            case 'warning':
                return 'bg-yellow-200';
            case 'error':
                return 'bg-red-200';
            default:
                return 'bg-gray-200';
        }
    }

    return (
        <>
            {logs.reverse().map((log, index) => (
                <p
                    key={index}
                    className={`mb-2 p-2 rounded text-center text-sm lg:text-base w-full lg:w-1/2 ${getBackground(log.type)}`}
                >
                    {log.message}
                </p>
            ))}
        </>
    );
}