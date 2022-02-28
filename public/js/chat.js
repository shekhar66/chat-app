const $messageButton = document.querySelector("#send_message");
const $messageInput = document.querySelector("#message");
const $locationButton = document.querySelector("#send_location");
const $messages = document.querySelector("#messages");

const socket = io();
const { user, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });
socket.on("message", (data) => {
  const html = Mustache.render(
    document.querySelector("#message-template").innerHTML,
    {
      message: data.message,
      createdAt: moment(data.createdAt).format("h:mm a"),
    }
  );
  $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (data) => {
  const html = Mustache.render(
    document.querySelector("#location-message-template").innerHTML,
    { url: data.url, createdAt: moment(data.createdAt).format("h:mm a") }
  );
  $messages.insertAdjacentHTML("beforeend", html);
});

document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  $messageButton.setAttribute("disabled", "disabled");
  socket.emit("sendMessage", event.target.message.value, (err) => {
    $messageButton.removeAttribute("disabled");
    $messageInput.value = "";
    $messageInput.focus();
    console.log(err);
  });
});

document.querySelector("#send_location").addEventListener("click", () => {
  $locationButton.setAttribute("disabled", "disabled");
  if (!navigator.geolocation) {
    return alert("Not supported..!!");
  }
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit(
      "sendLocation",
      {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      },
      () => {
        $locationButton.removeAttribute("disabled");
        console.log("Location shared....!!!");
      }
    );
  });
});
