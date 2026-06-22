// import { AlertCircle, X } from 'lucide-react';
// import { useState } from 'react';

// export function DemoModeBanner() {
//   const [isVisible, setIsVisible] = useState(true);

//   if (!isVisible) return null;

//   return (
//     <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 relative">
//       <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
//         <div className="flex items-center gap-3">
//           <AlertCircle size={20} />
//           <div className="text-sm">
//             <span className="font-semibold">Demo Mode:</span> Backend not connected. Using sample data. 
//             <span className="hidden sm:inline"> Set up your MongoDB backend to enable full functionality.</span>
//           </div>
//         </div>
//         <button
//           onClick={() => setIsVisible(false)}
//           className="hover:bg-white/20 p-1 rounded transition-colors"
//           aria-label="Close banner"
//         >
//           <X size={18} />
//         </button>
//       </div>
//     </div>
//   );
// }
