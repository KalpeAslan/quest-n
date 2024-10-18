const nextTick = (fn, time?: number) => setTimeout(fn, time || 0);
export default nextTick;

const checkHTML = (html: string) => {
  const doc = document.createElement("div");
  doc.innerHTML = html;
  return doc.innerHTML === html && html.startsWith("<") && html.endsWith(">");
};

export function detectContentType(input: string): "html" | "md" {
  const inputWithoutAbbr = input.replace(":abbr", "");
  if (/<[a-z][\s\S]*>/i.test(inputWithoutAbbr)) {
    return "html";
  } else if (/^\s*#+\s+/m.test(inputWithoutAbbr)) {
    return "md";
  } else {
    const isValidHTML = checkHTML(inputWithoutAbbr);

    if (isValidHTML) return "html";

    return "md";
  }
}

export function extractVideoID(urlOrVideoId: string) {
  const regex =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = urlOrVideoId.match(regex);

  if (match) {
    return match[1];
  } else {
    return urlOrVideoId;
  }
}

export const scrollTo = (anchor: string) => {
  const element = document.getElementById(anchor);

  if (!element) return;

  element.scrollIntoView({ behavior: "smooth" });
};
