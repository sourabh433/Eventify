export const card = (extra = "") =>
  `bg-white p-4 rounded-xl border shadow-sm ${extra}`;

export const sectionCard = (extra = "") =>
  `bg-white rounded-2xl border shadow-sm p-6 ${extra}`;

export const button = (variant = "dark") => {
  const styles = {
    dark: "bg-gray-900 text-white hover:bg-black",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-green-500 text-white hover:bg-green-600",
    gray: "bg-gray-200 text-gray-800",
  };

  return `${styles[variant]} px-4 py-2 rounded-lg font-semibold transition`;
};