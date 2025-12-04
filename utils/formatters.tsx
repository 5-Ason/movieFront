import React from 'react';
import { CheckCircle, Download, Ban, List, AlertCircle, Check } from 'lucide-react';
import { MovieStatus } from '../types';

export const getStatusBadge = (status: MovieStatus) => {
    switch (status) {
        case MovieStatus.IN_LIBRARY:
            return { icon: <CheckCircle size={14} />, label: '已入库', color: 'bg-emerald-600 text-white', border: 'border-emerald-500' };
        case MovieStatus.TO_DOWNLOAD:
            return { icon: <Download size={14} />, label: '待下载', color: 'bg-blue-600 text-white', border: 'border-blue-500' };
        case MovieStatus.EXCLUDED:
            return { icon: <Ban size={14} />, label: '已排除', color: 'bg-slate-600 text-slate-200', border: 'border-slate-500' };
        default:
            return { icon: <List size={14} />, label: '待处理', color: 'bg-amber-600 text-white', border: 'border-amber-500' };
    }
};

export const getIgnoreStatusInfo = (status: number) => {
    switch (status) {
        case 1: return { label: '存在无码资源', color: 'bg-yellow-600 border-yellow-500' };
        case 2: return { label: '存在字幕资源', color: 'bg-green-600 border-green-500' };
        default: return null;
    }
};