import { convertToDomNode } from '../utils/shortcodes';

document.addEventListener('DOMContentLoaded', () => {
  const createMessageBtn = document.querySelector('.messages__create-btn');
  createMessageBtn?.addEventListener('click', handleCreateBtn);

  const editMessageBtns = document.querySelectorAll('.messages__edit-btn');
  [...editMessageBtns].forEach((editBtn) => {
    editBtn.addEventListener('click', handleEditBtn);
  });

  const deleteMessageBtns = document.querySelectorAll('.messages__delete-btn');
  [...deleteMessageBtns].forEach((deleteBtn) => {
    (deleteBtn as any).prop = { btn: deleteBtn, error: undefined }
    deleteBtn.addEventListener('click', handleDeleteBtn);
  });
});

function formsExist() {
  const forms = document.querySelectorAll('form') as NodeListOf<HTMLFormElement>;
  return forms.length > 0 ? true : false;
}

function getFetchHeaders() {
  return {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    },
  }
}

async function handleCancelCreateBtn(e: Event) {
  const cancelBtn = e.currentTarget as HTMLButtonElement;
  cancelBtn.removeEventListener('click', handleCancelCreateBtn);
  const section = cancelBtn.parentElement?.parentElement?.parentElement?.parentElement as HTMLLIElement;
  const main = document.querySelector('main') as HTMLElement;

  [...main.children].forEach((child, i, arr) => {
    if (arr.indexOf(child) !== arr.length - 1) {
      child.removeAttribute('style');
    }
  });

  section.remove();
}

async function handleCreateBtn() {
  try {
    const main = document.querySelector('main') as HTMLElement;
    const formFetch = await fetch('/messages/create', getFetchHeaders());
    const form = await formFetch.text();
    const formNode = convertToDomNode(form);
    const section = document.createElement('section');
    section.appendChild(formNode);
    main.appendChild(section);

    [...main.children].forEach((child, i, arr) => {
      if (arr.indexOf(child) !== arr.length - 1) {
        child.setAttribute('style', 'filter: blur(6px); pointer-events: none');
      }
    });

    const textarea = formNode.querySelector("textarea") as HTMLTextAreaElement;
    textarea.addEventListener('input', handleTextArea);
    const cancelBtn = formNode.querySelector('.messages__cancel-btn');
    cancelBtn?.addEventListener('click', handleCancelCreateBtn);
  } catch(error) {
    console.error('Error loading create message form: ', error);
  }
}

async function handleEditBtn(e: Event) {
  const editBtn = e.currentTarget as HTMLButtonElement;

  try {
    const card = editBtn.parentElement?.parentElement as HTMLLIElement;
    const messageId = card.id as string;
    const formFetch = await fetch(`/messages/update?id=${messageId}`, getFetchHeaders());
    const form = await formFetch.text();
    const formNode = convertToDomNode(form);
    const listItem = document.createElement('li');
    listItem.setAttribute('data-id', messageId);
    listItem.classList.add('messages__item');
    listItem.appendChild(formNode);
    editBtn.removeEventListener('click', handleEditBtn);
    card.replaceWith(listItem);

    const cancelBtn = formNode.querySelector('.messages__cancel-btn');
    cancelBtn?.addEventListener('click', handleCancelEditBtn);
  } catch(error) {
    console.error('Error loading update message form: ', error);
  }
}

async function handleCancelEditBtn(e: Event) {
  const cancelBtn = e.currentTarget as HTMLButtonElement;
  const formListItem = cancelBtn.parentElement?.parentElement?.parentElement?.parentElement as HTMLLIElement;

  try {
    const listItemFetch = await fetch(`/messages/message?id=${formListItem.dataset.id}`, getFetchHeaders());
    const listItem = await listItemFetch.text();
    const listItemNode = convertToDomNode(listItem);
    cancelBtn.removeEventListener('click', handleCancelEditBtn);
    formListItem.replaceWith(listItemNode);

    const deleteMessageBtn = document.querySelector('.messages__delete-btn');
    (deleteMessageBtn as any).prop = { btn: deleteMessageBtn, error: undefined };
    deleteMessageBtn?.addEventListener('click', handleDeleteBtn);
    const editMessageBtn = listItemNode.querySelector('.messages__edit-btn');
    editMessageBtn?.addEventListener('click', handleEditBtn);
  } catch(error) {
    console.error('Error loading update message form: ', error);
  }
}

async function handleCancelDeleteBtn(e: Event) {
  const cancelBtn = e.currentTarget as HTMLButtonElement;
  cancelBtn.removeEventListener('click', handleCancelCreateBtn);
  const section = cancelBtn.parentElement?.parentElement as HTMLDivElement;

  section.remove();
}

async function handleDeleteMessageBtn(e: Event) {
  const deleteBtn = e.currentTarget as HTMLButtonElement;
  const section = deleteBtn.parentElement?.parentElement as HTMLDivElement;
  const messageId = section.dataset.id as string;
  const data = JSON.stringify({ id: messageId });

  try {
    const deleteItemFetch = await fetch('/messages/delete', {
      method: 'POST',
      body: data,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    });

    const result = await deleteItemFetch.json();
    const listItem = document.querySelector(`li#${messageId}`) as HTMLLIElement;
    const deleteMessageBtn = listItem.querySelector('.messages__delete-btn') as HTMLButtonElement;
    const prop = { btn: deleteMessageBtn, error: result.message };

    if (result.success) {
      listItem.remove();
    } else {
      handleDeleteBtn.call({ prop });
    }

  } catch (error) {
    console.error('Error deleting message.', error);
  }

  section.remove();
  deleteBtn.removeEventListener('click', handleDeleteMessageBtn);
}

async function handleDeleteBtn(this: { prop: { btn: HTMLButtonElement, error: string } }) {
  const { btn: deleteBtn, error } = this.prop;

  try {
    const main = document.querySelector('main') as HTMLElement;
    const card = deleteBtn.parentElement?.parentElement as HTMLLIElement;
    const messageId = card.id as string;
    const deleteItemFetch = await fetch(`/messages/delete?error=${error}`, getFetchHeaders());
    const deleteItem = await deleteItemFetch.text();
    const deleteItemNode = convertToDomNode(deleteItem);
    deleteItemNode.setAttribute('data-id', messageId);
    main.appendChild(deleteItemNode);

    const cancelMessageBtn = deleteItemNode.querySelector('.messages__cancel-verify-btn');
    cancelMessageBtn?.addEventListener('click', handleCancelDeleteBtn);

    const deleteMessageBtn = deleteItemNode.querySelector('.messages__delete-verify-btn');
    deleteMessageBtn?.addEventListener('click', (e) => { 
      handleDeleteMessageBtn(e);
      deleteBtn.removeEventListener('click', handleDeleteBtn);
    });

  } catch(error) {
    console.error('Error loading delete message.', error);
  }
}

function handleTextArea(e: Event) {
  const textarea = e.currentTarget as HTMLTextAreaElement;
  const counter = textarea.nextElementSibling as HTMLSpanElement;
  counter.textContent = `${textarea.value.length} / 500 Characters`;
}