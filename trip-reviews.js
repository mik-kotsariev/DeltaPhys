function addReview() {
  const username = document.getElementById("username").value;
  const reviewText = document.getElementById("review").value;
  const photoInput = document.getElementById("photo");

  if (!username || !reviewText) {
    alert("Заповніть всі поля");
    return;
  }

  const reviewBlock = document.createElement("div");
  reviewBlock.classList.add("review");

  const name = document.createElement("h3");
  name.textContent = username;

  const text = document.createElement("p");
  text.textContent = reviewText;

  reviewBlock.appendChild(name);
  reviewBlock.appendChild(text);

  if (photoInput.files.length > 0) {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(photoInput.files[0]);
    img.style.width = "200px";

    reviewBlock.appendChild(img);
  }

  document.getElementById("reviews").appendChild(reviewBlock);

  document.getElementById("username").value = "";
  document.getElementById("review").value = "";
  document.getElementById("photo").value = "";
}