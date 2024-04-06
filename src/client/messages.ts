import { convertToDomNode } from '../utils/shortcodes';

document.addEventListener('DOMContentLoaded', () => {
  const createMessageBtn = document.querySelector('.messages__create-btn');
  createMessageBtn?.addEventListener('click', handleCreateBtn);

  const editMessageBts = document.querySelectorAll('.messages__edit-btn');
  [...editMessageBts].forEach((editBtn) => {
    editBtn.addEventListener('click', handleEditBtn);
  });
});

async function handleCreateBtn() {
  try {
    const main = document.querySelector('main') as HTMLElement;
    const formFetch = await fetch('/messages/create');
    const form = await formFetch.text();
    const formNode = convertToDomNode(form);
    const section = document.createElement('section');
    section.appendChild(formNode);
    main.appendChild(section);

    const cancelBtn = formNode.querySelector('.message__cancel-button');
    cancelBtn?.addEventListener('click', handleCancelCreateBtn);
  } catch(error) {
    console.error('Error loading create message form: ', error);
  }
}

async function handleEditBtn(e: Event) {
  const editBtn = e.currentTarget as HTMLButtonElement;

  try {
    const card = editBtn.parentElement as HTMLLIElement;
    const messageId = card.dataset.id as string;
    const formFetch = await fetch(`/messages/update?id=${messageId}`);
    const form = await formFetch.text();
    const formNode = convertToDomNode(form);
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', messageId);
    listItem.classList.add('messages__item');
    listItem.appendChild(formNode);
    editBtn.removeEventListener('click', handleEditBtn);
    card?.replaceWith(listItem);

    const cancelBtn = formNode.querySelector('.message__cancel-button');
    cancelBtn?.addEventListener('click', handleCancelUpdateBtn);
  } catch(error) {
    console.error('Error loading update message form: ', error);
  }
}

async function handleCancelUpdateBtn(e: Event) {
  const cancelBtn = e.currentTarget as HTMLButtonElement;
  const formListItem = cancelBtn.parentElement?.parentElement?.parentElement as HTMLLIElement;

  try {
    const listItemFetch = await fetch(`/messages/card?id=${formListItem.dataset.id}`);
    const listItem = await listItemFetch.text();
    const listItemNode = convertToDomNode(listItem);
    cancelBtn.removeEventListener('click', handleCancelUpdateBtn);
    formListItem.replaceWith(listItemNode);

    const editMessageBts = document.querySelectorAll('.messages__edit-btn');
    [...editMessageBts].forEach((btn) => {
      btn.addEventListener('click', handleEditBtn);
    });
  } catch(error) {
    console.error('Error loading update message form: ', error);
  }
}

async function handleCancelCreateBtn(e: Event) {
  const cancelBtn = e.currentTarget as HTMLButtonElement;
  cancelBtn.removeEventListener('click', handleCancelCreateBtn);
  const section = cancelBtn.parentElement?.parentElement?.parentElement as HTMLLIElement;

  section.remove();
}