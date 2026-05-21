import React from 'react';
import { format, formatDistanceStrict } from 'date-fns';
import { AlertTriangle, CheckCircle } from 'lucide-react';

export const IncidentHistory = ({ incidents }) => {
    if (!incidents || incidents.length === 0) {
        return (
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center mt-8">
                <CheckCircle size={48} className="mx-auto mb-4 text-[#FF847C]" stroke="black" strokeWidth={2} />
                <h3 className="text-3xl font-black uppercase">No Incidents Recorded</h3>
                <p className="text-xl font-bold text-gray-600">This monitor has a completely clean record.</p>
            </div>
        );
    }

    return (
        <div className="mt-12">
            <h3 className="text-4xl font-black uppercase mb-6 tracking-tighter">Incident History</h3>
            <div className="flex flex-col gap-4">
                {incidents.map((incident) => {
                    const isActive = !incident.endTime;
                    const durationStr = isActive 
                        ? formatDistanceStrict(new Date(incident.startTime), new Date())
                        : formatDistanceStrict(new Date(incident.startTime), new Date(incident.endTime));
                    
                    return (
                        <div 
                            key={incident.id} 
                            className={`border-4 border-black p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4 ${isActive ? 'bg-red-400' : 'bg-green-400'}`}
                        >
                            <div className="flex items-start md:items-center gap-4">
                                <div className="mt-1 md:mt-0">
                                    {isActive ? <AlertTriangle size={32} className="text-black" strokeWidth={3} /> : <CheckCircle size={32} className="text-black" strokeWidth={3} />}
                                </div>
                                <div>
                                    <div className="font-black text-xl md:text-2xl uppercase">
                                        {isActive ? 'Ongoing Incident' : 'Resolved Incident'}
                                    </div>
                                    <div className="font-bold text-black/80 text-sm md:text-base">
                                        {format(new Date(incident.startTime), 'MMM d, yyyy HH:mm:ss')} 
                                        {!isActive && ` - ${format(new Date(incident.endTime), 'HH:mm:ss')}`}
                                    </div>
                                    <div className="mt-2 font-bold text-sm bg-white border-2 border-black px-2 py-1 inline-block truncate max-w-[250px] md:max-w-md" title={incident.cause}>
                                        Cause: {incident.cause || 'Unknown'}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col items-start md:items-end mt-4 md:mt-0 border-t-4 border-black pt-4 md:border-t-0 md:pt-0">
                                <div className={`font-black text-2xl uppercase px-4 py-1 mb-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${isActive ? 'bg-black text-white' : 'bg-white text-black'}`}>
                                    {isActive ? 'ONGOING' : 'RESOLVED'}
                                </div>
                                <div className="font-bold text-black border-2 border-black px-2 py-1 bg-white">
                                    Down for {durationStr}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
