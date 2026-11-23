let toastTimer;

function showToast(message) {
    const toast = document.getElementById("toast");
    const toastMessage = document.getElementById("toastMessage");

    clearTimeout(toastTimer);

    toastMessage.textContent = message;

    toast.classList.remove("show");

    // Restart progress animation
    void toast.offsetWidth;

    toast.classList.add("show");

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 4000);
}