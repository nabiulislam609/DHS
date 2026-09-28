import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

interface Forbidden403Props {
  requiredRoles?: string[];
  currentRole?: string;
  onGoBack?: () => void;
  onSwitchRole?: (role: 'ADMIN' | 'TEACHER' | 'STUDENT') => void;
}

export const Forbidden403: React.FC<Forbidden403Props> = ({
  requiredRoles = ['ADMIN'],
  currentRole,
  onGoBack,
  onSwitchRole,
}) => {
  const { user } = useAuthStore();
  const effectiveRole = currentRole || user?.role || 'GUEST';

  return (
    <div className="min-h-[500px] flex items-center justify-center p-6 bg-slate-50 border border-slate-200 rounded-3xl my-6">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-red-100 text-center space-y-5">
        <div className="w-16 h-16 mx-auto bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-inner">
          <ShieldAlert className="w-10 h-10 stroke-[2.2]" />
        </div>

        <div className="space-y-2">
          <span className="inline-block px-3 py-1 bg-red-50 text-red-700 text-xs font-bold rounded-full uppercase tracking-wider border border-red-200">
            HTTP 403 • Forbidden
          </span>
          <h2 className="text-2xl font-black text-slate-900">অ্যাক্সেস সংরক্ষিত / Access Denied</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            আপনার বর্তমান রোল (<span className="font-semibold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{effectiveRole}</span>) এর এই সেকশনে প্রবেশের অনুমতি নেই।
          </p>
        </div>

        <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl text-left text-xs space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-amber-900">
            <Lock className="w-3.5 h-3.5" />
            <span>প্রয়োজনীয় রোল (Required Role):</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {requiredRoles.map((r) => (
              <span key={r} className="bg-amber-200/80 text-amber-900 font-bold px-2 py-0.5 rounded text-[11px]">
                {r}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
          {onGoBack && (
            <button
              onClick={onGoBack}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>পূর্বের পাতায় ফিরে যান</span>
            </button>
          )}

          {onSwitchRole && (
            <button
              onClick={() => onSwitchRole(requiredRoles[0] as any || 'ADMIN')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{requiredRoles[0]} হিসেবে লগইন করুন</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
