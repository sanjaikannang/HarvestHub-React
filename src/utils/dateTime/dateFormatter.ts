// Function to Format Time
export const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC',
    });
};


// Function to Format Date
export const formatDate = (isoString: string): string => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
};


export const adjustTimestampForIST = (utcTimestamp: string): Date => {
    const utcDate = new Date(utcTimestamp);
    // Subtract 5:30 mins to convert from "UTC treated as IST" to actual UTC
    const istOffset = 5.5 * 60 * 60 * 1000;
    return new Date(utcDate.getTime() - istOffset);
};


// Function to calculate time remaining
export const calculateTimeRemaining = (targetTime: string): string => {
    const now = new Date();
    const target = adjustTimestampForIST(targetTime);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) {
        return "00:00:00";
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};