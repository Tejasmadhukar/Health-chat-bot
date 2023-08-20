const msgerForm = get('.msger-inputarea');
const msgerInput = get('.msger-input');
const msgerChat = get('.msger-chat');

const BOT_IMG =
	'https://images.unsplash.com/photo-1634315556998-81c64cfab8a8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=792&q=80';
const PERSON_IMG =
	'https://images.unsplash.com/photo-1599272771314-f3ec16bda3f2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=870&q=80)';
const BOT_NAME = '  Health Bot';
const PERSON_NAME = 'You';

// below this is bot working code that connects backend by calling api

msgerForm.addEventListener('submit', (event) => {
	event.preventDefault();

	const msgText = msgerInput.value;
	if (!msgText) return;

	appendMessage(PERSON_NAME, PERSON_IMG, 'right', msgText);
	msgerInput.value = '';
	botResponse(msgText);
});

function botResponse(rawText) {
	// Bot Response
	$.ajax({
		url: 'http://127.0.0.1/response',
		method: 'POST',
		contentType: 'application/json',
		data: JSON.stringify({ message: rawText }),
		success: function (data) {
			console.log(rawText);
			console.log(data);
			const msgText = data;
			appendMessage(BOT_NAME, BOT_IMG, 'left', msgText);
		},
	});
}

function formatDate(date) {
	const h = '0' + date.getHours();
	const m = '0' + date.getMinutes();

	return `${h.slice(-2)}:${m.slice(-2)}`;
}

function get(selector, root = document) {
	return root.querySelector(selector);
}

function appendMessage(name, img, side, text) {
	//   Simple solution for small apps
	const msgHTML = `
<div class="msg ${side}-msg">
<div class="msg-img" style="background-image: url(${img})"></div>

<div class="msg-bubble">
  <div class="msg-info">
    <div class="msg-info-name">${name}</div>
    <div class="msg-info-time">${formatDate(new Date())}</div>
  </div>

  <div class="msg-text">${text}</div>
</div>
</div>
`;

	msgerChat.insertAdjacentHTML('beforeend', msgHTML);
	msgerChat.scrollTop += 500;
}
