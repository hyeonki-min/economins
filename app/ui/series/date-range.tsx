'use client';

import { Dispatch, SetStateAction, useEffect, useState } from "react";


interface DateRangeType {
    dateRange: string;
    setDateRange: React.Dispatch<React.SetStateAction<string>>;
  }
export default function DateRange() {
    const [startYear, setStartYear] = useState(new Date().getFullYear() -3);
    const [startMonth, setStartMonth] = useState(new Date().getMonth()+1);
    const [endYear, setEndYear] = useState(new Date().getFullYear());
    const [endMonth, setEndMonth] = useState(new Date().getMonth()+1);        
    
    return (
        <div className="flex items-center justify-center gap-1">
            <input type="number" id="startYear" aria-describedby="helper-text-explanation" className="text-gray-900 text-sm focus:ring-indigo-700 focus:border-indigo-700 block p-2.5 rounded-lg"
            min='1900' max={new Date().getFullYear()} value={startYear} onChange={(e) => setStartYear(e.target.valueAsNumber)}></input>
            <input type="number" id="startMonth" aria-describedby="helper-text-explanation" className="text-gray-900 text-sm focus:ring-indigo-700 focus:border-indigo-700 block p-2.5 rounded-lg"
            min='1' max='12' value={startMonth} onChange={(e) => setStartMonth(e.target.valueAsNumber)}></input>
            <input type="number" id="endYear" aria-describedby="helper-text-explanation" className="text-gray-900 text-sm focus:ring-indigo-700 focus:border-indigo-700 block p-2.5 rounded-lg"
            min='1900' max={new Date().getFullYear()} value={endYear} onChange={(e) => setEndYear(e.target.valueAsNumber)}></input>
            <input type="number" id="endMonth" aria-describedby="helper-text-explanation" className="text-gray-900 text-sm focus:ring-indigo-700 focus:border-indigo-700 block p-2.5 rounded-lg"
            min='1' max='12' value={endMonth} onChange={(e) => setEndMonth(e.target.valueAsNumber)}></input>
        </div>
    )
}