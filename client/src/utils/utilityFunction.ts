export const allowOnlyAlphabets = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.key;

  // Allow control keys
  if (
    key === "Backspace" ||
    key === "Tab" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Delete" ||
    key === " " ||
    key === "Enter"
  ) {
    return;
  }

  if (!/^[A-Za-z]$/.test(key)) {
    e.preventDefault();
  }
};

export const allowOnlyNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.key;

  // Allow control keys
  if (
    key === "Backspace" ||
    key === "Tab" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Delete" ||
    key === "Enter"
  ) {
    return;
  }

  // Block non-numeric keys
  if (!/^\d$/.test(key)) {
    e.preventDefault();
  }
};

export const allowOnlyAlphabetsAndNumbers = (e: React.KeyboardEvent<HTMLInputElement>) => {
  const key = e.key;

  // Allow control keys
  if (
    key === "Backspace" ||
    key === "Tab" ||
    key === "ArrowLeft" ||
    key === "ArrowRight" ||
    key === "Delete" ||
    key === "Enter"
  ) {
    return;
  }

  // Block non-numeric  & non-alphabetic keys
  if (!/^\d$/.test(key) && !/^[A-Za-z]$/.test(key)) {
    e.preventDefault();
  }
};

export const createInitials = (name: string) => {
  if (!name) return "";
  const words = name.split(" ");
  let initials = "";
  if (words.length > 1) {
    initials = words[0].charAt(0).toUpperCase() + words[words.length - 1].charAt(0).toUpperCase();
  } else {
    initials = words[0].charAt(0).toUpperCase() + words[0].charAt(1).toUpperCase();
  }

  return initials;
};