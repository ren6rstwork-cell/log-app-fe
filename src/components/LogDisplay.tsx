import LogSearchBar from "./LogSearchBar";
import LogTable from "./LogTable";
import { api, type ParamValue } from '../services/api.service';
import type { LogData } from "../types/log";
import { useEffect, useState } from "react";
import Pagination from "./Pagination";
import type { User } from "../types/user";
import { getDefaultEndDate, getDefaultStartDate } from "../services/date.service";
import type { FiltersType } from "../types/filter";

function LogDisplay() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [logs, setLogs] = useState<LogData[]>([]);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [page, setPage] = useState<number>(1);
    const [users, setUsers] = useState<User[]>([]);
    const [submitCount, setSubmitCount] = useState(0); // Dummy useState for submit button

    const defaultFilters: FiltersType = {
        actions: [] as string[],
        startDate: getDefaultStartDate(),
        endDate: getDefaultEndDate(),
        userIds: [] as string[],
        statusCode: '',
        labnumber: '',
        lowerResTime: 0,
        upperResTime: 999999,
    }

    const FILTERS_KEY = "logAppFilters";
    const getInitialFilters = (): FiltersType => {
        const stored = localStorage.getItem(FILTERS_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                return {
                    ...parsed,
                    startDate: new Date(parsed.startDate),
                    endDate: new Date(parsed.endDate),
                };
            } catch {
                return defaultFilters;
            }
        }
        return defaultFilters;
    };

    const [filters, setFilters] = useState<FiltersType>(getInitialFilters);

    // Fetch users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get<User[]>("/user/get-all-existing-users");
                if (response.data) {
                    setUsers(response.data);
                }
            } catch (err) {
                setError('Failed to fetch logs');
            }
        }
        fetchUsers();
    }, [])

    // Fetch log data
    useEffect(() => {
        const fetchLogs = async () => {
            try {
                setLoading(true);
                const params: Record<string, ParamValue> = {
                    page: page,
                };

                if (filters.actions.length > 0)
                    params.actions = filters.actions;

                if (filters.userIds.length > 0)
                    params.userIds = filters.userIds;

                if (filters.startDate)
                    params.startDate = filters.startDate.toISOString();

                if (filters.endDate)
                    params.endDate = filters.endDate.toISOString();

                if (filters.statusCode)
                    params.statusCodes = filters.statusCode;

                if (filters.labnumber)
                    params.labnumbers = filters.labnumber;

                if (filters.lowerResTime !== undefined)
                    params.lowerResTime = filters.lowerResTime;

                if (filters.upperResTime !== undefined)
                    params.upperResTime = filters.upperResTime;
                
                const response = await api.get<LogData[]>('/log/get-paginated-logs', params);
                if (response.data) {
                    setLogs(response.data);
                    setTotalPages(response.pagination?.totalPages ?? 1);
                } else if (response.error) {
                    setError(response.error.message);
                }
            } catch (err) {
                setError('Failed to fetch logs');
            } finally {
                setLoading(false);
            }
        };
        fetchLogs();
    }, [page, filters, submitCount]);

    useEffect(() => {
        setPage(1);
        localStorage.setItem(FILTERS_KEY, JSON.stringify(filters));
    }, [filters]);

    if (error) return <div>Error: {error}</div>;

    const handleFilterChange = (name: string, value: any) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        setPage(1);
        setSubmitCount(c => c + 1);
    };

    return (
        <div className="flex flex-col items-center justify-center min-w-screen min-h-screen">
            <LogSearchBar
                users={users}
                filters={filters}
                onFiltersChange={handleFilterChange}
                onClear={() => setFilters(defaultFilters)}
                onSubmit={handleSubmit}
            />
            <LogTable logs={logs} loading={loading} />
            <Pagination page={page} totalPages={totalPages} span={5} onPageChange={setPage} />
        </div>
    );
}

export default LogDisplay;