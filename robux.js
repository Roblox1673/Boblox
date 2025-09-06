document.querySelectorAll(".buy-btn").forEach(button => {
  button.addEventListener("click", () => {
    const amount = button.dataset.amount;
    const price = button.dataset.price;
    alert(`You selected ${amount} Robux for $${price}. (Demo only)`);
  });
});
