import Select, { type MultiValue } from 'react-select';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import type { User } from '../types/user';
import type { FiltersType } from '../types/filter';

interface OptionType {
    value: string;
    label: string;
    isExclusive?: boolean;
}

interface LogSearchBarProps {
    users: User[];
    filters: FiltersType;
    onFiltersChange: (name: keyof FiltersType, value: any) => void;
    onClear: () => void;
    onSubmit: () => void;
}

function LogSearchBar({
    users = [],
    filters,
    onFiltersChange,
    onClear,
    onSubmit,
}: LogSearchBarProps) {
    const userOptions: OptionType[] = [
        { value: '', label: 'แสดงทั้งหมด', isExclusive: true },
        ...users.map(user => ({
            value: user._id,
            label: `${user.prefix} ${user.firstname} ${user.lastname}`
        }))
    ];

    const actionOptions: OptionType[] = [
        { value: '', label: 'แสดงทั้งหมด', isExclusive: true },
        { value: 'labOrder', label: 'labOrder' },
        { value: 'labResult', label: 'labResult' },
        { value: 'receive', label: 'receive' },
        { value: 'accept', label: 'accept' },
        { value: 'approve', label: 'approve' },
        { value: 'reapprove', label: 'reapprove' },
        { value: 'unapprove', label: 'unapprove' },
        { value: 'unreceive', label: 'unreceive' },
        { value: 'rerun', label: 'rerun' },
        { value: 'save', label: 'save' },
        { value: 'listTransactions', label: 'listTransactions' },
        { value: 'getTransaction', label: 'getTransaction' },
        { value: 'analyzerResult', label: 'analyzerResult' },
        { value: 'analyzerRequest', label: 'analyzerRequest' },
    ];

    // Make the "show all" option mutually exclusive
    const handleDropdown = (key: keyof FiltersType, selected: MultiValue<OptionType>) => {
        const lastSelected = selected[selected.length - 1];

        if (lastSelected && lastSelected.isExclusive) {
            onFiltersChange(key, []);
        } else {
            onFiltersChange(
                key,
                selected.filter(option => !option.isExclusive).map(option => option.value)
            );
        }
    };

    return (
        <div className="w-[88vw] mb-3 bg-white text-gray-700 rounded-xl p-4 mt-2 relative z-30">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <fieldset className="border border-gray-300 rounded px-3 py-1">
                    <legend className="text-sm font-medium px-1">User</legend>
                    <Select<OptionType, true>
                        isMulti
                        options={userOptions}
                        value={
                            filters.userIds.length === 0
                                ? [userOptions[0]]
                                : userOptions.filter(option => filters.userIds.includes(option.value))
                        }
                        onChange={selected => handleDropdown('userIds', selected)}
                        placeholder="Select users..."
                        classNamePrefix="react-select"
                        styles={{
                            control: (base) => ({
                                ...base,
                                border: 'none',
                                boxShadow: 'none'
                            })
                        }}
                    />
                </fieldset>
                
                <fieldset className="border border-gray-300 rounded px-3 py-1">
                    <legend className="text-sm font-medium px-1">Action</legend>
                    <Select<OptionType, true>
                        isMulti
                        options={actionOptions}
                        value={
                            filters.actions.length === 0
                                ? [actionOptions[0]]
                                : actionOptions.filter(option => filters.actions.includes(option.value))
                        }
                        onChange={selected => handleDropdown('actions', selected)}
                        placeholder="Select status..."
                        classNamePrefix="react-select"
                        styles={{
                            control: (base) => ({
                                ...base,
                                border: 'none',
                                boxShadow: 'none'
                            })
                        }}
                    />
                </fieldset>
                
                <fieldset className="border border-gray-300 rounded px-3 py-2">
                    <legend className="text-sm font-medium px-1">Status Code</legend>
                    <input 
                        type="text" 
                        placeholder="Enter Status Code" 
                        className="outline-none w-full"
                        value={filters.statusCode}
                        onChange={(e) => onFiltersChange('statusCode', e.target.value)}
                    />
                </fieldset>
                
                <fieldset className="border border-gray-300 rounded px-3 py-2">
                    <legend className="text-sm font-medium px-1">Lab Number</legend>
                    <input 
                        type="text" 
                        placeholder="Enter Lab Number" 
                        className="outline-none w-full"
                        value={filters.labnumber}
                        onChange={(e) => onFiltersChange('labnumber', e.target.value)}
                    />
                </fieldset>
                
                <fieldset className="border border-gray-300 rounded px-3 py-2 relative">
                    <legend className="text-sm font-medium px-1">Start Date</legend>
                    <DatePicker
                        selected={filters.startDate}
                        onChange={(date: Date | null) => onFiltersChange('startDate', date)}
                        showTimeInput
                        timeFormat="HH:mm"
                        timeIntervals={1}
                        dateFormat="MMMM d, yyyy HH:mm"
                        placeholderText="Select start date & time"
                        className="outline-none w-full"
                        maxDate={filters.endDate || undefined}
                        withPortal
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                    />
                </fieldset>

                <fieldset className="border border-gray-300 rounded px-3 py-2 relative">
                    <legend className="text-sm font-medium px-1">End Date</legend>
                    <DatePicker
                        selected={filters.endDate}
                        onChange={(date: Date | null) => onFiltersChange('endDate', date)}
                        showTimeInput
                        timeFormat="HH:mm"
                        timeIntervals={1}
                        dateFormat="MMMM d, yyyy HH:mm"
                        placeholderText="Select end date & time"
                        className="outline-none w-full"
                        minDate={filters.startDate || undefined}
                        withPortal
                        showYearDropdown
                        showMonthDropdown
                        dropdownMode="select"
                    />
                </fieldset>

                <fieldset className="border border-gray-300 rounded px-3 py-2">
                    <legend className="text-sm font-medium px-1">Min Response Time</legend>
                    <input 
                        type="number" 
                        placeholder="ms" 
                        className="outline-none w-full" 
                        min="0" 
                        value={filters.lowerResTime}
                        onChange={(e) => onFiltersChange('lowerResTime', parseInt(e.target.value) || 0)}
                    />
                </fieldset>

                <fieldset className="border border-gray-300 rounded px-3 py-2">
                    <legend className="text-sm font-medium px-1">Max Response Time</legend>
                    <input 
                        type="number" 
                        placeholder="ms" 
                        className="outline-none w-full" 
                        max="999999"
                        value={filters.upperResTime}
                        onChange={(e) => onFiltersChange('upperResTime', parseInt(e.target.value) || 999999)}
                    />
                </fieldset>
            </div>

            <div className="flex gap-2">    
                <button
                    type="button"
                    className="flex-1 py-2 bg-gray-200 text-gray-700 border border-gray-300 rounded-md 
                                   hover:bg-gray-300 hover:cursor-pointer transition-colors duration-150 font-semibold"
                    onClick={onClear}
                >
                    Clear
                </button>
                <button className="flex-1 py-2 bg-green-600 text-white rounded-md 
                                   hover:bg-green-700 hover:cursor-pointer transition-colors duration-150 font-semibold"
                    type="button"
                    onClick={onSubmit}
                >
                    Submit
                </button>
            </div>
        </div>
    )
}

export default LogSearchBar;