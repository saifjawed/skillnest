export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);

  const options = { year: "numeric", month: "long", day: "numeric" };
  const formattedDate = date.toLocaleDateString("en-US", options);

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12; // converts 0 to 12 for 12 AM

  return `${formattedDate} | ${hours}:${minutes} ${period}`;
};
