export function convertToDomNode(htmlTemplate: string ) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlTemplate, 'text/html');
  const content = doc.body.firstChild as HTMLElement;
  return content;
}