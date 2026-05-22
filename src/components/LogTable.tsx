// import { useState } from 'react'
import { type LogData } from '../types/log';
import LogEntry from './LogEntry';

interface LogTableProps {
    logs: LogData[];
    loading: boolean;
}

function LogTable({ logs, loading }: LogTableProps) {
    return (
        <div className="h-[60vh] w-[88vw] mb-2 overflow-x-auto bg-white rounded-xl text-gray-700 shadow-md">
            <table className="min-w-full text-sm h-full">
                <thead className="sticky top-0 bg-green-100 z-2 shadow-md">
                    <tr className="text-left text-gray-700 border-gray-200">
                        <th className="py-2 px-3">User</th>
                        <th className="py-2 px-3">Endpoint</th>
                        <th className="py-2 px-3">Method</th>
                        <th className="py-2 px-3">Timestamp</th>
                        <th className="py-2 px-3">Lab Number</th>
                        <th className="py-2 px-3">Action</th>
                        <th className="py-2 px-3">Status Code</th>
                        <th className="py-2 px-3">Message</th>
                        <th className="py-2 px-3">Resp. Time (ms)</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={9} className="py-12 text-center">
                                <div className="flex flex-col justify-center items-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-gray-600"></div>
                                    <p className="mt-2.5"><b>Loading...</b></p>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        logs.map((log) => (
                            <LogEntry key={log._id} log={log}></LogEntry>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default LogTable