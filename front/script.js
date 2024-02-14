const form = document.getElementById("form");
const input = document.getElementById("input");
const a = document.getElementById("a");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
        send("message", { msg: input.value });
        input.value = "";
    }
});

receive("message", (data) => {
    a.innerHTML = data.msg;
});