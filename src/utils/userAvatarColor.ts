export const getUserAvatarColor = (name: string) => {

    if (!name || typeof name !== 'string') {
        return 'bg-gray-500'; // Default fallback
    }

    const colors = [
        'bg-red-500',      // A
        'bg-blue-500',     // B
        'bg-green-500',    // C
        'bg-yellow-500',   // D
        'bg-purple-500',   // E
        'bg-pink-500',     // F
        'bg-indigo-500',   // G
        'bg-orange-500',   // H
        'bg-teal-500',     // I
        'bg-cyan-500',     // J
        'bg-lime-500',     // K
        'bg-emerald-500',  // L
        'bg-violet-500',   // M
        'bg-fuchsia-500',  // N
        'bg-rose-500',     // O
        'bg-sky-500',      // P
        'bg-amber-500',    // Q
        'bg-red-400',      // R
        'bg-blue-400',     // S
        'bg-green-400',    // T
        'bg-yellow-400',   // U
        'bg-purple-400',   // V
        'bg-pink-400',     // W
        'bg-indigo-400',   // X
        'bg-orange-400',   // Y
        'bg-teal-400'      // Z
    ];
    
    const firstLetter = name.charAt(0).toUpperCase();
    const index = firstLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
    
    // If not A-Z, default to first color
    if (index < 0 || index >= 26) {
        return colors[0];
    }
    
    return colors[index];
};