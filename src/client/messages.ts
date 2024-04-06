import { convertToDomNode } from '../utils/shortcodes';

document.addEventListener('DOMContentLoaded', () => {
  const createMessageBtn = document.querySelector('.messages__create-btn');
  createMessageBtn?.addEventListener('click', async () => {
    try {
      const sectionFetch = await fetch('/messages/create');
      const section = await sectionFetch.text();
      console.log(convertToDomNode(section));
    } catch(error) {
      console.error('Error loading create message form: ', error);
    }
  });
});