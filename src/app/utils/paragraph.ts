export const findFirst = (content: string): string =>  {
  return findBeginning(content);
}

export const findRest = (content: string): string =>  {
  return content.substring(findBeginning(content).length);
}

const findBeginning = (content: string): string => {
  const temp = document.createElement("div");
  temp.innerHTML = content;

  const topLevelParagraphs = Array.from(temp.children)
    .filter(el => el.tagName.toLowerCase() === "p");

  const firstThree = topLevelParagraphs.slice(0, 5);

  return firstThree.map(p => p.outerHTML).join('');
}

export const findHeaders = (content: string): string[] => {
  const temp = document.createElement("div");
  temp.innerHTML = content;

  const headers = Array.from(temp.children)
    .filter(el => el.tagName.toLowerCase() === "strong" || el.tagName.toLowerCase() === "h1" || el.tagName.toLowerCase() === "h2" || el.tagName.toLowerCase() === "h3");

  return headers.map(el => el.outerHTML);
}
