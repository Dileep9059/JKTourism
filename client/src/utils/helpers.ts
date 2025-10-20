
export function formatDate(dateStr: string) {
  const date = new Date(dateStr);

  // Format the date as dd-mm-yyyy
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // getMonth() is zero-based
  const year = date.getFullYear();

  const formattedDate = `${day}-${month}-${year}`;
  return formattedDate;
}

export function formatArrayTimeTOStringTime(startTime: number[]): string {
  const [hour = 0, minute = 0] = startTime;
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 === 0 ? 12 : hour % 12;
  const minuteStr = minute.toString().padStart(2, '0');
  const hourStr = hour12.toString().padStart(2, '0');
  return `${hourStr}:${minuteStr} ${ampm}`;
}

export function getGoogleMapsEmbedURL(lat: number, lng: number): string {
  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
}